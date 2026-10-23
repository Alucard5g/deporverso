/**
 * ============================================================================
 * CORPORACIÓN E INNOVACIÓN GUERRA (CIG)
 * CONTROLADOR DE AUDITORÍA Y SEGURIDAD PERICIAL DE LA API
 * ============================================================================
 * Módulo: server/routes/cigSecurityRoutes.ts
 * ============================================================================
 */

import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getActiveManifest, sendCigAuditNotification } from '../security/cigNotifier';
import { getSecurityMetrics } from '../security/rateLimiter';

export const cigSecurityRouter = Router();

const ROOT_DIR = process.cwd();
const MANIFEST_PATH = path.join(ROOT_DIR, 'CIG-SECURITY-MANIFEST.json');
const SIG_PATH = path.join(ROOT_DIR, 'CIG-SECURITY-MANIFEST.sig');
const OTS_PATH = path.join(ROOT_DIR, 'CIG-SECURITY-MANIFEST.ots');
const PUBKEY_PATH = path.join(ROOT_DIR, '.cig-security', 'cig-public.pem');

/**
 * 1. Consultar Estado de Seguridad y Sellado Criptográfico
 */
cigSecurityRouter.get('/security-status', (req: Request, res: Response) => {
  try {
    const manifest = getActiveManifest();
    const hasSig = fs.existsSync(SIG_PATH);
    const hasOts = fs.existsSync(OTS_PATH);
    const hasPubKey = fs.existsSync(PUBKEY_PATH);

    let pubKeyFingerprint = 'N/A';
    if (hasPubKey) {
      const pubPem = fs.readFileSync(PUBKEY_PATH, 'utf-8');
      pubKeyFingerprint = crypto.createHash('sha256').update(pubPem).digest('hex').slice(0, 16);
    }

    const metrics = getSecurityMetrics();

    res.json({
      entity: 'CORPORACIÓN E INNOVACIÓN GUERRA (CIG)',
      project: 'DeporVerso Global Multi-Sport SaaS Platform',
      security_shield_active: true,
      anti_scraping_enabled: true,
      rate_limiting_active: true,
      manifest: manifest || null,
      verification: {
        hasManifest: Boolean(manifest),
        hasSignatureEd25519: hasSig,
        hasOpenTimestampsProof: hasOts,
        hasCorporatePublicKey: hasPubKey,
        corporatePublicKeyFingerprint: pubKeyFingerprint
      },
      metrics,
      webhookConfigured: Boolean(process.env.CIG_AUDIT_WEBHOOK_URL)
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 2. Ejecutar Verificación Pericial en Tiempo Real
 */
cigSecurityRouter.post('/verify', (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(MANIFEST_PATH) || !fs.existsSync(SIG_PATH) || !fs.existsSync(PUBKEY_PATH)) {
      return res.status(400).json({
        success: false,
        message: 'Archivos periciales incompletos. Ejecute primero el sellado (npm run seal).'
      });
    }

    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    const sigBase64 = fs.readFileSync(SIG_PATH, 'utf-8').trim();
    const pubKeyPem = fs.readFileSync(PUBKEY_PATH, 'utf-8');

    // Verificar firma asimétrica Ed25519
    const payloadToVerify = Buffer.from(`CIG-PROOF-OF-AUTHORSHIP|${manifest.merkle_master_root_hash}|${manifest.timestamp_utc}`);
    const isSignatureValid = crypto.verify(
      null,
      payloadToVerify,
      pubKeyPem,
      Buffer.from(sigBase64, 'base64')
    );

    res.json({
      success: true,
      signatureVerified: isSignatureValid,
      algorithm: manifest.asymmetric_algorithm || 'Ed25519',
      masterRootHash: manifest.merkle_master_root_hash,
      totalAuditedFiles: manifest.total_audited_files,
      timestamp: manifest.timestamp_utc,
      message: isSignatureValid 
        ? 'Firma digital Ed25519 y anterioridad de CIG verificadas con éxito.' 
        : 'Alerta: La firma digital no coincide con la clave pública corporativa.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 3. Disparar Notificación de Prueba a Webhook Corporativo
 */
cigSecurityRouter.post('/dispatch-notification', async (req: Request, res: Response) => {
  try {
    const result = await sendCigAuditNotification({
      eventType: 'MANUAL_TEST',
      notes: req.body?.notes || 'Prueba manual de conectividad notarial ejecutada desde la consola CIG'
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 4. Generar Dictamen Pericial Notariado CIG en PDF (Tarea 1)
 * Exclusivo para Rolando Guerra y defensa legal de CIG
 */
cigSecurityRouter.post('/generate-legal-certificate-pdf', async (req: Request, res: Response) => {
  try {
    const { generateLegalIpCertificatePdf } = await import('../../scripts/export-legal-ip-certificate.js');
    const result = await generateLegalIpCertificatePdf();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 5. Consultar Estado de Anclaje de Bitcoin y OpenTimestamps (Tarea 2)
 */
cigSecurityRouter.get('/ots-status', (req: Request, res: Response) => {
  try {
    const masterHashPath = path.join(ROOT_DIR, 'master-hash.txt');
    const otsPath = path.join(ROOT_DIR, 'master-hash.txt.ots');
    const manifestShaPath = path.join(ROOT_DIR, 'manifest.sha256');

    const hasMasterHash = fs.existsSync(masterHashPath);
    const hasOts = fs.existsSync(otsPath);
    const hasManifest = fs.existsSync(manifestShaPath);

    let masterHash = '';
    if (hasMasterHash) {
      masterHash = fs.readFileSync(masterHashPath, 'utf-8').trim();
    }

    let otsSizeBytes = 0;
    if (hasOts) {
      otsSizeBytes = fs.statSync(otsPath).size;
    }

    res.json({
      success: true,
      masterHash,
      hasOtsReceipt: hasOts,
      otsSizeBytes,
      hasManifest,
      blockchain: 'Bitcoin',
      standard: 'OpenTimestamps (RFC compliance / SHA-256)',
      owner: 'Rolando Guerra (Corporación e Innovación Guerra - CIG)',
      lastAuditedUtc: hasMasterHash ? fs.statSync(masterHashPath).mtime.toISOString() : null
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 6. Descarga Privada del Manifiesto de Código (manifest.sha256)
 * Oculto al público general; exclusivo para el Administrador
 */
cigSecurityRouter.get('/download-manifest', (req: Request, res: Response) => {
  const manifestPath = path.join(ROOT_DIR, 'manifest.sha256');
  if (!fs.existsSync(manifestPath)) {
    return res.status(404).send('Manifiesto no encontrado. Ejecute primero npm run ip:shield.');
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="manifest.sha256"');
  res.sendFile(manifestPath);
});
