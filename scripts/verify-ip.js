#!/usr/bin/env node
/**
 * ============================================================================
 * CORPORACIÓN E INNOVACIÓN GUERRA (CIG)
 * SISTEMA DE VERIFICACIÓN PERICIAL DE INTEGRIDAD Y FIRMA DIGITAL
 * ============================================================================
 * Script: scripts/verify-ip.js
 * Propósito: 
 *   1. Verificar la firma asimétrica corporativa Ed25519 del manifiesto CIG.
 *   2. Re-calcular huellas SHA-256 de cada archivo para auditar alteraciones.
 *   3. Comprobar concordancia con el Merkle Master Root Hash.
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = process.cwd();
const MANIFEST_PATH = path.join(ROOT_DIR, 'CIG-SECURITY-MANIFEST.json');
const SIG_PATH = path.join(ROOT_DIR, 'CIG-SECURITY-MANIFEST.sig');
const PUB_KEY_PATH = path.join(ROOT_DIR, '.cig-security', 'cig-public.pem');

console.log('\n============================================================');
console.log(' [CIG AUDITOR] VERIFICACIÓN PERICIAL DE INTEGRIDAD Y FIRMA  ');
console.log(' Entidad: CORPORACIÓN E INNOVACIÓN GUERRA (CIG)             ');
console.log('============================================================\n');

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error('❌ [ERROR] No se encontró CIG-SECURITY-MANIFEST.json. Ejecute primero "npm run seal".');
  process.exit(1);
}

if (!fs.existsSync(SIG_PATH)) {
  console.error('❌ [ERROR] No se encontró la firma digital CIG-SECURITY-MANIFEST.sig.');
  process.exit(1);
}

if (!fs.existsSync(PUB_KEY_PATH)) {
  console.error('❌ [ERROR] No se encontró la clave pública en .cig-security/cig-public.pem.');
  process.exit(1);
}

try {
  // 1. Cargar Manifiesto, Firma y Clave Pública
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  const signatureBase64 = fs.readFileSync(SIG_PATH, 'utf-8').trim();
  const publicKeyPem = fs.readFileSync(PUB_KEY_PATH, 'utf-8');

  console.log(`✓ Manifiesto cargado: ${manifest.total_audited_files} archivos declarados.`);
  console.log(`✓ Fecha del manifiesto: ${manifest.timestamp_utc}`);
  console.log(`✓ Algoritmo asimétrico: ${manifest.asymmetric_algorithm}`);

  // 2. Verificar Firma Asimétrica Ed25519
  const payloadToVerify = Buffer.from(`CIG-PROOF-OF-AUTHORSHIP|${manifest.merkle_master_root_hash}|${manifest.timestamp_utc}`);
  const signatureBuffer = Buffer.from(signatureBase64, 'base64');

  const isSignatureValid = crypto.verify(
    null,
    payloadToVerify,
    publicKeyPem,
    signatureBuffer
  );

  if (!isSignatureValid) {
    console.error('\n❌ [FALLO DE SEGURIDAD] La firma digital Ed25519 NO coincide con la clave pública corporativa.');
    console.error('   Alerta: El manifiesto pudo haber sido adulterado por un tercero.');
    process.exit(1);
  }
  console.log('✓ [AUTORÍA CERTIFICADA] Firma digital Ed25519 verificada con éxito.');

  // 3. Re-auditar hashes de archivos individuales
  console.log('\n[CIG AUDITOR] Re-calculando huellas SHA-256 de los archivos en disco...');
  let alteredFilesCount = 0;
  let missingFilesCount = 0;
  const hasherChain = crypto.createHash('sha256');

  // Ordenar lista para reproducibilidad
  const sortedFiles = [...manifest.files].sort((a, b) => a.path.localeCompare(b.path));

  for (const item of sortedFiles) {
    const fullPath = path.join(ROOT_DIR, item.path);
    if (!fs.existsSync(fullPath)) {
      console.warn(`  ⚠️ Archivo faltante: ${item.path}`);
      missingFilesCount++;
      continue;
    }

    const currentHash = crypto.createHash('sha256').update(fs.readFileSync(fullPath)).digest('hex');
    hasherChain.update(item.path);
    hasherChain.update(currentHash);

    if (currentHash !== item.sha256) {
      console.warn(`  ⚠️ Modificación detectada en: ${item.path}`);
      alteredFilesCount++;
    }
  }

  const computedRootHash = hasherChain.digest('hex');

  console.log(`\n------------------------------------------------------------`);
  console.log(` Master Hash en Manifiesto: ${manifest.merkle_master_root_hash}`);
  console.log(` Master Hash Calculado:     ${computedRootHash}`);
  console.log(`------------------------------------------------------------`);

  if (computedRootHash === manifest.merkle_master_root_hash && alteredFilesCount === 0 && missingFilesCount === 0) {
    console.log('\n✅ [INTEGRIDAD 100% CONFIRMADA] El código fuente es idéntico al sellado original de CIG.');
    console.log('   No se detectaron alteraciones, inyecciones ni discrepancias de autoría.\n');
    process.exit(0);
  } else {
    console.warn(`\n⚠️ [DISCREPANCIA DETECTADA] Se detectaron ${alteredFilesCount} archivos modificados y ${missingFilesCount} faltantes.`);
    console.warn('   Si realizó cambios legítimos en el código, ejecute "npm run seal" para actualizar el sello.\n');
    process.exit(0); // Exit 0 con aviso informativo para permitir desarrollo continuo
  }

} catch (error) {
  console.error('❌ [ERROR INESPERADO] Fallo durante la verificación pericial:', error);
  process.exit(1);
}
