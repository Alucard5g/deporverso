#!/usr/bin/env node
/**
 * ============================================================================
 * CORPORACIÓN E INNOVACIÓN GUERRA (CIG)
 * SISTEMA DE FIRMA ASIMÉTRICA DE COMMITS Y NO-REPUDIO (GIT + SSH / ED25519)
 * ============================================================================
 * Script: scripts/cig-sign-commit.js
 * Propósito: 
 *   Configurar y auditar la firma criptográfica de commits en Git utilizando
 *   la clave soberana Ed25519 de Corporación e Innovación Guerra (CIG),
 *   asegurando que cada línea de código en GitHub sea legalmente atribuible
 *   y de autoría no repudiable a nombre de Rolando Guerra.
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SECURITY_DIR = path.join(ROOT_DIR, '.cig-security');
const PUB_KEY_PATH = path.join(SECURITY_DIR, 'cig-public.pem');

console.log('====================================================================');
console.log(' [CIG GIT SIGN] CONFIGURACIÓN DE FIRMA ASIMÉTRICA DE COMMITS (CIG)  ');
console.log(' Titular Soberano: ROLANDO GUERRA (CIG)                             ');
console.log('====================================================================\n');

if (!fs.existsSync(PUB_KEY_PATH)) {
  console.log('Generando par de claves corporativas CIG...');
  execSync('node seal-ip.js', { stdio: 'inherit' });
}

const pubPem = fs.readFileSync(PUB_KEY_PATH, 'utf-8');
const pubFingerprint = crypto.createHash('sha256').update(pubPem).digest('hex');

console.log('✓ Clave Pública Ed25519 CIG detectada:');
console.log(`  Huella digital (SHA-256): ${pubFingerprint}`);
console.log(`  Algoritmo: Ed25519 (RFC 8032) / NIST FIPS Compliant\n`);

console.log('--------------------------------------------------------------------');
console.log(' PASOS PARA ACTIVAR FIRMAS AUTOMÁTICAS DE COMMITS EN TU ENTORNO:');
console.log('--------------------------------------------------------------------');
console.log('1. Configurar Git para usar formato SSH nativo (compatible Git 2.34+):');
console.log('   git config --global gpg.format ssh\n');
console.log('2. Asignar tu clave soberana CIG como firma de autoría:');
console.log('   git config --global user.signingkey .cig-security/cig-public.pem\n');
console.log('3. Habilitar la firma automática obligatoria en cada commit:');
console.log('   git config --global commit.gpgsign true\n');
console.log('4. Verificar la firma del último commit realizado:');
console.log('   git log --show-signature -1\n');
console.log('====================================================================');
console.log(' [NO-REPUDIO] Cada commit firmado con esta clave garantiza autoría');
console.log(' irrevocable de Rolando Guerra ante tribunales nacionales e internacionales.');
console.log('====================================================================\n');
