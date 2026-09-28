#!/usr/bin/env node
/**
 * ============================================================================
 * CORPORACIÓN E INNOVACIÓN GUERRA (CIG)
 * CLI SCRIPT: DESPACHO DE NOTIFICACIÓN NOTARIAL Y AUDITORÍA
 * ============================================================================
 * Script: scripts/cig-notify.js
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const ROOT_DIR = process.cwd();
const MANIFEST_PATH = path.join(ROOT_DIR, 'CIG-SECURITY-MANIFEST.json');
const LOG_FILE = path.join(ROOT_DIR, '.cig-security', 'audit-log.jsonl');

async function runNotify() {
  console.log('\n============================================================');
  console.log(' [CIG NOTIFIER] DESPACHO DE ALERTA DE AUDITORÍA CRIPTOGRÁFICA');
  console.log(' Entidad: CORPORACIÓN E INNOVACIÓN GUERRA (CIG)             ');
  console.log('============================================================\n');

  let manifest = null;
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    } catch (e) {
      console.warn('Advertencia: No se pudo parsear el manifiesto.');
    }
  }

  const webhookUrl = process.env.CIG_AUDIT_WEBHOOK_URL?.trim();
  const eventType = process.argv[2] || 'SEAL_GENERATED';

  const payload = {
    eventType,
    project: manifest?.project || 'DeporVerso Global Multi-Sport SaaS Platform',
    merkleRootHash: manifest?.merkle_master_root_hash || 'PENDIENTE',
    totalFiles: manifest?.total_audited_files || 0,
    timestamp: manifest?.timestamp_utc || new Date().toISOString(),
    publicKeyFingerprint: manifest?.public_key_fingerprint || '778ff94867bf0a69',
    otsProvider: manifest?.opentimestamps?.provider || 'OpenTimestamps Bitcoin Calendar',
    environment: process.env.NODE_ENV || 'production'
  };

  // Guardar log local
  try {
    const dir = path.dirname(LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(LOG_FILE, JSON.stringify({ logged_at: new Date().toISOString(), ...payload }) + '\n');
  } catch (err) {
    // ignore
  }

  if (!webhookUrl) {
    console.log('ℹ [CIG NOTIFIER] CIG_AUDIT_WEBHOOK_URL no está configurada.');
    console.log('  El evento quedó registrado en .cig-security/audit-log.jsonl.');
    console.log(`  Master Root Hash: ${payload.merkleRootHash}\n`);
    process.exit(0);
  }

  console.log(`[CIG NOTIFIER] Transmitiendo alerta notarial a: ${webhookUrl.replace(/(discord\.com\/api\/webhooks\/\d+\/)[^/]+/, '$1****')}`);

  let formattedBody = null;
  if (webhookUrl.includes('discord.com')) {
    formattedBody = {
      username: 'CIG Security Notary',
      avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      embeds: [
        {
          title: `🛡️ [CIG NOTARIAL] Sello Criptográfico Inmutable (${payload.eventType})`,
          description: `**CORPORACIÓN E INNOVACIÓN GUERRA (CIG)**\n**Proyecto:** ${payload.project}`,
          color: 0x059669,
          fields: [
            { name: 'Master Root Hash (SHA-256)', value: `\`${payload.merkleRootHash}\``, inline: false },
            { name: 'Huella Clave Pública Ed25519', value: `\`${payload.publicKeyFingerprint}\``, inline: true },
            { name: 'Archivos Auditados', value: `${payload.totalFiles}`, inline: true },
            { name: 'Marca Temporal UTC', value: `${payload.timestamp}`, inline: false }
          ],
          footer: { text: 'Protección de Secreto Industrial y Anterioridad CIG' }
        }
      ]
    };
  } else {
    formattedBody = { entity: 'CORPORACION E INNOVACION GUERRA (CIG)', ...payload };
  }

  const parsedUrl = new URL(webhookUrl);
  const postData = JSON.stringify(formattedBody);
  const client = parsedUrl.protocol === 'https:' ? https : http;

  const req = client.request({
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
    path: parsedUrl.pathname + parsedUrl.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'User-Agent': 'CIG-Security-Agent/2.0'
    },
    timeout: 5000
  }, (res) => {
    console.log(`✓ [CIG NOTIFIER] Alerta notarial despachada con código HTTP ${res.statusCode}.\n`);
    process.exit(0);
  });

  req.on('error', (err) => {
    console.warn(`⚠️ [CIG NOTIFIER] Aviso: No se pudo conectar al webhook: ${err.message}\n`);
    process.exit(0);
  });

  req.write(postData);
  req.end();
}

runNotify().catch(e => {
  console.warn('[CIG NOTIFIER] Error:', e.message);
  process.exit(0);
});
