/**
 * ============================================================================
 * CORPORACIÓN E INNOVACIÓN GUERRA (CIG)
 * SISTEMA NOTARIAL Y DE NOTIFICACIONES DE AUDITORÍA CRIPTOGRÁFICA
 * ============================================================================
 * Módulo: server/security/cigNotifier.ts
 * Propósito: Notificación en tiempo real a Discord, Slack, Telegram o webhooks
 *            corporativos cada vez que se genera un sellado de propiedad
 *            intelectual, verificación pericial o despliegue en Google Cloud Run.
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

export interface CigNotificationPayload {
  eventType: 'SEAL_GENERATED' | 'VERIFY_SUCCESS' | 'VERIFY_ALERT' | 'CLOUD_DEPLOYED' | 'MANUAL_TEST';
  project?: string;
  merkleRootHash?: string;
  totalFiles?: number;
  timestamp?: string;
  publicKeyFingerprint?: string;
  otsProvider?: string;
  environment?: string;
  notes?: string;
}

export interface CigNotifyResult {
  success: boolean;
  destination: string;
  statusCode?: number;
  message: string;
}

const ROOT_DIR = process.cwd();
const MANIFEST_PATH = path.join(ROOT_DIR, 'CIG-SECURITY-MANIFEST.json');
const LOG_FILE = path.join(ROOT_DIR, '.cig-security', 'audit-log.jsonl');

/**
 * Lee el manifiesto CIG actual si existe
 */
export function getActiveManifest(): any | null {
  try {
    if (fs.existsSync(MANIFEST_PATH)) {
      return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    }
  } catch (e) {
    console.warn('[CIG NOTIFIER] No se pudo leer el manifiesto:', e);
  }
  return null;
}

/**
 * Registra localmente la auditoría en un log inmutable jsonl
 */
function recordAuditLog(entry: any) {
  try {
    const dir = path.dirname(LOG_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const logLine = JSON.stringify({
      logged_at: new Date().toISOString(),
      ...entry
    }) + '\n';
    fs.appendFileSync(LOG_FILE, logLine, 'utf-8');
  } catch (err) {
    console.warn('[CIG AUDIT LOG] Error escribiendo log local:', err);
  }
}

/**
 * Despacha petición HTTP/HTTPS a un webhook
 */
async function sendHttpRequest(urlStr: string, bodyJson: any): Promise<{ statusCode: number; responseText: string }> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(urlStr);
    const postData = JSON.stringify(bodyJson);

    const client = parsedUrl.protocol === 'https:' ? https : http;
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'CIG-Sovereign-Security-Agent/2.0'
      },
      timeout: 5000
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode || 200, responseText: data });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout de conexión al webhook CIG (5s)'));
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Da formato y envía la notificación según la plataforma (Discord, Slack, genérico)
 */
export async function sendCigAuditNotification(custom?: Partial<CigNotificationPayload>): Promise<CigNotifyResult> {
  const manifest = getActiveManifest();
  const webhookUrl = process.env.CIG_AUDIT_WEBHOOK_URL?.trim();

  const payload: CigNotificationPayload = {
    eventType: custom?.eventType || 'SEAL_GENERATED',
    project: manifest?.project || 'DeporVerso Global Multi-Sport SaaS Platform',
    merkleRootHash: manifest?.merkle_master_root_hash || custom?.merkleRootHash || 'N/A',
    totalFiles: manifest?.total_audited_files || custom?.totalFiles || 0,
    timestamp: manifest?.timestamp_utc || custom?.timestamp || new Date().toISOString(),
    publicKeyFingerprint: manifest?.public_key_fingerprint || custom?.publicKeyFingerprint || '778ff94867bf0a69',
    otsProvider: manifest?.opentimestamps?.provider || custom?.otsProvider || 'OpenTimestamps Bitcoin Calendar',
    environment: process.env.NODE_ENV || 'production',
    notes: custom?.notes || 'Sellado criptográfico verificado por CORPORACIÓN E INNOVACIÓN GUERRA (CIG)'
  };

  // Registrar siempre en el log local pericial
  recordAuditLog(payload);

  if (!webhookUrl) {
    console.log('[CIG NOTIFIER] CIG_AUDIT_WEBHOOK_URL no configurado. Evento registrado localmente en .cig-security/audit-log.jsonl');
    return {
      success: true,
      destination: 'local-audit-log',
      message: 'Notificación registrada localmente en .cig-security/audit-log.jsonl (webhook no configurado).'
    };
  }

  try {
    let formattedBody: any;

    if (webhookUrl.includes('discord.com')) {
      // Formato enriquecido para canal Discord CIG Security
      formattedBody = {
        username: 'CIG Security Core',
        avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
        embeds: [
          {
            title: `🛡️ [CIG NOTARIAL] ${payload.eventType === 'SEAL_GENERATED' ? 'Nuevo Sellado Criptográfico de IP' : payload.eventType}`,
            description: `**Entidad:** CORPORACIÓN E INNOVACIÓN GUERRA (CIG)\n**Proyecto:** ${payload.project}`,
            color: payload.eventType.includes('ALERT') ? 0xE11D48 : 0x059669,
            fields: [
              {
                name: 'Master Root Hash (SHA-256)',
                value: `\`${payload.merkleRootHash}\``,
                inline: false
              },
              {
                name: 'Huella Clave Pública (Ed25519)',
                value: `\`${payload.publicKeyFingerprint}\``,
                inline: true
              },
              {
                name: 'Archivos Auditados',
                value: `${payload.totalFiles}`,
                inline: true
              },
              {
                name: 'Anclaje Blockchain',
                value: `${payload.otsProvider}`,
                inline: true
              },
              {
                name: 'Marca Temporal UTC',
                value: `${payload.timestamp}`,
                inline: false
              }
            ],
            footer: {
              text: 'Sello Criptográfico Inmutable • Secreto Industrial CIG'
            },
            timestamp: new Date().toISOString()
          }
        ]
      };
    } else if (webhookUrl.includes('slack.com')) {
      // Formato para Slack
      formattedBody = {
        text: `🛡️ *[CIG NOTARIAL] ${payload.eventType}* - ${payload.project}`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*CORPORACIÓN E INNOVACIÓN GUERRA (CIG)*\n*Proyecto:* ${payload.project}\n*Master Hash:* \`${payload.merkleRootHash}\`\n*Archivos:* ${payload.totalFiles} | *Ed25519:* \`${payload.publicKeyFingerprint}\``
            }
          }
        ]
      };
    } else {
      // Formato genérico estándar REST JSON
      formattedBody = {
        entity: 'CORPORACION E INNOVACION GUERRA (CIG)',
        ...payload
      };
    }

    const res = await sendHttpRequest(webhookUrl, formattedBody);
    console.log(`✓ [CIG NOTIFIER] Notificación despachada con éxito (HTTP ${res.statusCode}).`);

    return {
      success: res.statusCode >= 200 && res.statusCode < 300,
      destination: webhookUrl.replace(/(discord\.com\/api\/webhooks\/\d+\/)[^/]+/, '$1****'),
      statusCode: res.statusCode,
      message: `Notificación enviada con éxito (HTTP ${res.statusCode})`
    };
  } catch (error: any) {
    console.warn('[CIG NOTIFIER ERROR] Fallo al enviar webhook:', error.message);
    return {
      success: false,
      destination: webhookUrl.replace(/(discord\.com\/api\/webhooks\/\d+\/)[^/]+/, '$1****'),
      message: `Error enviando webhook: ${error.message}`
    };
  }
}
