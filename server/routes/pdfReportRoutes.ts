/**
 * ============================================================================
 * CORPORACIÓN E INNOVACIÓN GUERRA (CIG) - DEPORVERSO
 * RUTAS: Generación de PDFs de Scouting y VAR (Puppeteer)
 * ============================================================================
 */

import { Router, Request, Response } from 'express';
import { generateScoutingPDF, PlayerScoutingData } from '../reports/scoutingPdfGenerator';
import path from 'path';
import fs from 'fs';

export const pdfReportRouter = Router();

const ROOT_DIR = process.cwd();
const PUBLIC_REPORTS_DIR = path.join(ROOT_DIR, 'public', 'generated-reports');

function ensureReportsDirectory() {
  if (!fs.existsSync(PUBLIC_REPORTS_DIR)) {
    fs.mkdirSync(PUBLIC_REPORTS_DIR, { recursive: true });
  }
}

/**
 * 1. Generar Ficha Oficial de Scouting PDF (Puppeteer)
 * Puede invocarse desde la Visión Artificial Edge o el Módulo de Scouting
 */
pdfReportRouter.post('/scouting-pdf', async (req: Request, res: Response) => {
  try {
    const { playerData, heatmapBase64, saveFile = true } = req.body || {};

    const defaultData: PlayerScoutingData = {
      name: playerData?.name || 'Mateo Benítez',
      team: playerData?.team || 'Club Atlético DeporVerso',
      position: playerData?.position || 'Extremo Izquierdo / Delantero',
      age: playerData?.age || 22,
      dorsal: playerData?.dorsal || '10',
      sportIaIndex: playerData?.sportIaIndex || 9.4,
      metrics: {
        distanceKm: playerData?.metrics?.distanceKm || 10.4,
        maxSpeedKmh: playerData?.metrics?.maxSpeedKmh || 32.8,
        passAccuracy: playerData?.metrics?.passAccuracy || 89.2,
        recoveries: playerData?.metrics?.recoveries || 7
      },
      aiEvaluation: playerData?.aiEvaluation || 
        'Jugador de alto despliegue por banda izquierda con aceleración explosiva en el último tercio. Visión periférica superior y toma de decisiones tácticas clave en transiciones ofensivas.'
    };

    const pdfBuffer = await generateScoutingPDF(defaultData, heatmapBase64);

    ensureReportsDirectory();
    const fileName = `scouting_${defaultData.dorsal || '10'}_${Date.now()}.pdf`;
    const filePath = path.join(PUBLIC_REPORTS_DIR, fileName);
    fs.writeFileSync(filePath, pdfBuffer);

    // Si el cliente pide descarga directa (por ejemplo vía fetch binario o iframe)
    if (req.query.download === 'true') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      return res.send(pdfBuffer);
    }

    // Respuesta JSON con URL pública para descarga o visualización
    res.json({
      success: true,
      message: 'Ficha de Scouting PDF generada con éxito (Puppeteer A4)',
      pdfUrl: `/generated-reports/${fileName}`,
      fileName,
      player: defaultData.name,
      dorsal: defaultData.dorsal,
      sportIaIndex: defaultData.sportIaIndex
    });
  } catch (error: any) {
    console.error('[pdfReportRouter Error]:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al generar el documento PDF con Puppeteer'
    });
  }
});

/**
 * 2. Generar Acta Oficial de Revisión VAR con Datos de Scouting (Puppeteer)
 * Invocada directamente desde el Monitor VAR A la Carta
 */
pdfReportRouter.post('/var-pdf', async (req: Request, res: Response) => {
  try {
    const { 
      matchTitle = 'Deportivo Central vs Alianza Sport',
      incidentType = 'Revisión de Gol / Fuera de Juego',
      minuteOrTimestamp = 'Minuto 74:20 (Segundo 850.5)',
      verdict = 'GOL VÁLIDO - Sin infracción en ataque',
      refereeNotes = 'Posición legal del atacante #10 en el momento exacto del pase filtrado. Verificado con líneas ortogonales VAR.',
      playerData,
      heatmapBase64
    } = req.body || {};

    const varScoutingData: PlayerScoutingData = {
      name: playerData?.name || 'Carlos Mendoza',
      team: playerData?.team || 'Deportivo Central',
      position: playerData?.position || 'Delantero Centro',
      age: playerData?.age || 25,
      dorsal: playerData?.dorsal || '9',
      sportIaIndex: playerData?.sportIaIndex || 9.1,
      metrics: {
        distanceKm: playerData?.metrics?.distanceKm || 8.6,
        maxSpeedKmh: playerData?.metrics?.maxSpeedKmh || 31.4,
        passAccuracy: playerData?.metrics?.passAccuracy || 84.5,
        recoveries: playerData?.metrics?.recoveries || 4
      },
      aiEvaluation: 'Incidencia arbitral analizada con cámaras multiseñal y calibración de campo. Intervención decisiva en jugada de gol con validación cinemática.',
      varContext: {
        matchTitle,
        incidentType,
        minuteOrTimestamp,
        verdict,
        refereeNotes
      }
    };

    const pdfBuffer = await generateScoutingPDF(varScoutingData, heatmapBase64);

    ensureReportsDirectory();
    const fileName = `acta_var_${Date.now()}.pdf`;
    const filePath = path.join(PUBLIC_REPORTS_DIR, fileName);
    fs.writeFileSync(filePath, pdfBuffer);

    if (req.query.download === 'true') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      return res.send(pdfBuffer);
    }

    res.json({
      success: true,
      message: 'Acta Oficial VAR & Scouting generada exitosamente con Puppeteer',
      pdfUrl: `/generated-reports/${fileName}`,
      fileName,
      matchTitle,
      verdict
    });
  } catch (error: any) {
    console.error('[pdfReportRouter VAR Error]:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al generar el acta VAR con Puppeteer'
    });
  }
});
