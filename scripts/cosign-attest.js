#!/usr/bin/env node
/**
 * ============================================================================
 * CORPORACIÓN E INNOVACIÓN GUERRA (CIG)
 * SISTEMA DE ATESTACIÓN Y VERIFICACIÓN DE CONTENEDORES CON SIGSTORE / COSIGN
 * ============================================================================
 * Script: scripts/cosign-attest.js
 * Propósito: Guía de comandos periciales y validación de proveniencia de imágenes.
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const MANIFEST_PATH = path.join(ROOT_DIR, 'CIG-SECURITY-MANIFEST.json');

console.log('\n============================================================');
console.log(' [CIG SIGSTORE / COSIGN] GUÍA Y HERRAMIENTA DE ATESTACIÓN   ');
console.log(' Entidad: CORPORACIÓN E INNOVACIÓN GUERRA (CIG)             ');
console.log('============================================================\n');

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error('❌ No se encontró CIG-SECURITY-MANIFEST.json. Ejecute primero "npm run seal".');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
console.log(`✓ Manifiesto activo detectado: ${manifest.merkle_master_root_hash}`);
console.log(`✓ Archivos auditados: ${manifest.total_audited_files}`);
console.log(`✓ Algoritmo asimétrico: ${manifest.asymmetric_algorithm}`);

console.log('\n------------------------------------------------------------');
console.log(' COMANDOS PARA FIRMAR Y VERIFICAR EL CONTENEDOR EN TU ENTORNO:');
console.log('------------------------------------------------------------');
console.log(`1. Firmar imagen publicada (Modo OIDC Keyless Sigstore):`);
console.log(`   cosign sign --yes gcr.io/TU_PROJECT_ID/deporverso-app:latest\n`);
console.log(`2. Adjuntar atestación del manifiesto CIG a la imagen:`);
console.log(`   cosign attest --yes --predicate CIG-SECURITY-MANIFEST.json --type https://cig.lat/security/manifest/v1 gcr.io/TU_PROJECT_ID/deporverso-app:latest\n`);
console.log(`3. Verificar firma y procedencia:`);
console.log(`   cosign verify gcr.io/TU_PROJECT_ID/deporverso-app:latest --certificate-identity-regexp "https://github.com/.*" --certificate-oidc-issuer "https://token.actions.githubusercontent.com"\n`);
console.log(`4. Inspeccionar la atestación CIG adjunta a la imagen:`);
console.log(`   cosign verify-attestation --type https://cig.lat/security/manifest/v1 gcr.io/TU_PROJECT_ID/deporverso-app:latest\n`);
console.log('============================================================\n');
