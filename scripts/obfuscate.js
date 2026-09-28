#!/usr/bin/env node
/**
 * ============================================================================
 * CORPORACIÓN E INNOVACIÓN GUERRA (CIG)
 * SISTEMA DE OFUSCACIÓN DE CÓDIGO FUENTE Y PROTECCIÓN DE SECRETO INDUSTRIAL
 * ============================================================================
 * Script: scripts/obfuscate.js
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import JavaScriptObfuscator from 'javascript-obfuscator';

const ROOT_DIR = process.cwd();
const SERVER_BUNDLE = path.join(ROOT_DIR, 'dist', 'server.cjs');

console.log('\n[CIG OBFUSCATION] Iniciando ofuscación de binarios para producción...');

if (!fs.existsSync(SERVER_BUNDLE)) {
  console.warn(`[CIG OBFUSCATION] Advertencia: No se encontró ${SERVER_BUNDLE}. Ejecute primero el empaquetado.`);
  process.exit(0);
}

try {
  const originalCode = fs.readFileSync(SERVER_BUNDLE, 'utf-8');
  console.log(`[CIG OBFUSCATION] Procesando servidor backend (${(originalCode.length / 1024).toFixed(1)} KB)...`);

  const obfuscatedResult = JavaScriptObfuscator.obfuscate(originalCode, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    numbersToExpressions: true,
    simplify: true,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.8,
    splitStrings: true,
    splitStringsChunkLength: 10,
    target: 'node',
    identifierNamesGenerator: 'hexadecimal',
    reservedNames: ['startServer', 'express', 'PORT', 'app', 'listen']
  });

  fs.writeFileSync(SERVER_BUNDLE, obfuscatedResult.getObfuscatedCode(), 'utf-8');
  console.log('✓ [CIG OBFUSCATION] Servidor backend ofuscado y protegido con éxito.');
} catch (error) {
  console.error('[CIG OBFUSCATION ERROR] Error al ofuscar el código:', error);
  process.exit(1);
}
