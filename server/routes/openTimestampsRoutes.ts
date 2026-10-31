/**
 * ============================================================================
 * CORPORACIÓN E INNOVACIÓN GUERRA (CIG) & DEPORVERSO
 * CONTROLADOR REST API DE SELLADO CRIPTOGRÁFICO OPENTIMESTAMPS (BITCOIN)
 * ============================================================================
 * Archivo: server/routes/openTimestampsRoutes.ts
 * Endpoints:
 *   POST /api/timestamps/stamp        - Calcula SHA-256 y sella en OpenTimestamps
 *   POST /api/timestamps/verify       - Verifica validez matemática del .ots vs hash
 *   POST /api/timestamps/upgrade      - Actualiza prueba pendiente a bloque minado
 *   GET  /api/timestamps/download/:id - Descarga binaria del archivo .ots
 * ============================================================================
 */

import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { OpenTimestampsService } from '../services/openTimestampsService.ts';

export const openTimestampsRouter = Router();

const STORAGE_DIR = path.join(process.cwd(), 'storage', 'timestamps');

/**
 * 1. Sellado Automático de Registros o Archivos
 * POST /api/timestamps/stamp
 * Body: { recordId?: string, payload?: any, hashHex?: string, entityType?: string }
 */
openTimestampsRouter.post('/stamp', async (req: Request, res: Response) => {
  try {
    const { recordId, payload, hashHex: inputHash, entityType = 'general_record' } = req.body;

    let targetHashHex: string;

    if (inputHash && typeof inputHash === 'string' && inputHash.length === 64) {
      targetHashHex = inputHash.toLowerCase();
    } else if (payload) {
      const { hashHex } = OpenTimestampsService.calculateSha256(payload);
      targetHashHex = hashHex;
    } else {
      return res.status(400).json({
        success: false,
        error: 'Debe proporcionar "hashHex" (64 caracteres hex) o "payload" (objeto o texto a hashear).'
      });
    }

    const stampResult = await OpenTimestampsService.stampHash(targetHashHex);

    if (!stampResult.success) {
      return res.status(502).json({
        success: false,
        sha256: targetHashHex,
        error: stampResult.errorMessage || 'No se pudo obtener el sello de los calendarios públicos.',
        suggestion: 'Los calendarios públicos pueden estar experimentando congestión de red. Se recomienda reintentar con una cola asíncrona.'
      });
    }

    // Identificador para persistencia
    const finalId = recordId || `doc_${Date.now()}_${targetHashHex.slice(0, 10)}`;
    const savedFilePath = await OpenTimestampsService.saveOtsFile(finalId, stampResult.otsBuffer);

    res.json({
      success: true,
      recordId: finalId,
      entityType,
      sha256: targetHashHex,
      otsBase64: stampResult.otsBase64,
      otsSizeBytes: stampResult.otsSizeBytes,
      otsFilePath: savedFilePath,
      downloadUrl: `/api/timestamps/download/${finalId}`,
      provider: stampResult.providerDetails,
      calendars: stampResult.calendarsSubmitted,
      status: 'CALENDAR_COMMITTED_PENDING_BITCOIN',
      timestampUtc: stampResult.timestampIso,
      blockchain: 'Bitcoin',
      standard: 'OpenTimestamps (RFC compliance / SHA-256)'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error interno durante el sellado OpenTimestamps'
    });
  }
});

/**
 * 2. Verificación de Prueba .ots frente al Hash Original
 * POST /api/timestamps/verify
 * Body: { originalHash: string, otsBase64?: string, recordId?: string }
 */
openTimestampsRouter.post('/verify', async (req: Request, res: Response) => {
  try {
    const { originalHash, otsBase64, recordId } = req.body;

    if (!originalHash || originalHash.length !== 64) {
      return res.status(400).json({
        success: false,
        error: 'Debe proporcionar un "originalHash" SHA-256 válido (64 caracteres hex).'
      });
    }

    let otsInput: Buffer | string;

    if (otsBase64) {
      otsInput = otsBase64;
    } else if (recordId) {
      const sanitized = recordId.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filePath = path.join(STORAGE_DIR, `${sanitized}.ots`);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          error: `No se encontró archivo de prueba .ots para el registro: ${recordId}`
        });
      }
      otsInput = filePath;
    } else {
      return res.status(400).json({
        success: false,
        error: 'Debe proporcionar "otsBase64" o el "recordId" correspondiente.'
      });
    }

    const verificationResult = await OpenTimestampsService.verifyTimestampProof(originalHash, otsInput);

    res.json({
      success: true,
      ...verificationResult
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error interno durante la verificación'
    });
  }
});

/**
 * 3. Actualizar / Upgrade de Prueba .ots
 * POST /api/timestamps/upgrade
 * Body: { otsBase64?: string, recordId?: string }
 */
openTimestampsRouter.post('/upgrade', async (req: Request, res: Response) => {
  try {
    const { otsBase64, recordId } = req.body;

    let otsInput: Buffer | string;
    let targetPath: string | null = null;

    if (otsBase64) {
      otsInput = otsBase64;
    } else if (recordId) {
      const sanitized = recordId.replace(/[^a-zA-Z0-9_-]/g, '_');
      targetPath = path.join(STORAGE_DIR, `${sanitized}.ots`);
      if (!fs.existsSync(targetPath)) {
        return res.status(404).json({
          success: false,
          error: `No se encontró archivo .ots para el registro: ${recordId}`
        });
      }
      otsInput = await fs.promises.readFile(targetPath);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Debe proporcionar "otsBase64" o "recordId".'
      });
    }

    const upgradeResult = await OpenTimestampsService.upgradeTimestamp(otsInput);

    // Si se actualizó y teníamos un archivo en disco, lo persistimos con la nueva data
    if (upgradeResult.upgraded && targetPath) {
      await fs.promises.writeFile(targetPath, upgradeResult.otsBuffer);
    }

    res.json({
      success: true,
      ...upgradeResult
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error interno durante la actualización'
    });
  }
});

/**
 * 4. Descarga del archivo .ots
 * GET /api/timestamps/download/:id
 */
openTimestampsRouter.get('/download/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sanitized = id.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filePath = path.join(STORAGE_DIR, `${sanitized}.ots`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('Archivo de prueba criptográfica .ots no encontrado.');
    }

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${sanitized}.ots"`);
    res.sendFile(filePath);
  } catch (error: any) {
    res.status(500).send(`Error al descargar archivo .ots: ${error.message}`);
  }
});
