/**
 * ============================================================================
 * CORPORACIÓN E INNOVACIÓN GUERRA (CIG) - DEPORVERSO
 * RUTAS DE API: VAR & AUTO-HIGHLIGHT GENERATOR 9:16 (FFmpeg)
 * ============================================================================
 */

import { Router, Request, Response } from 'express';
import { executeAutoHighlightGenerator, getRecentClips } from '../media/highlightService';

export const varHighlightRouter = Router();

// Clip de video de muestra de alta fidelidad para pruebas si no se envía uno específico
const SAMPLE_MATCH_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

/**
 * 1. Generar Clip 9:16 Vertical para Gol o Incidencia VAR usando Python AutoHighlightGenerator
 */
varHighlightRouter.post('/generate-highlight-916', async (req: Request, res: Response) => {
  try {
    const {
      inputVideoUrl = SAMPLE_MATCH_VIDEO,
      eventTimestampSec = 850.5,
      eventTitle = 'Golazo Jugador #10',
      playerDorsal = '10',
      actionType = 'GOL',
      matchTitle = 'Partido Oficial DeporVerso',
      preSec = 10.0,
      postSec = 5.0
    } = req.body || {};

    const clipResult = await executeAutoHighlightGenerator({
      inputVideoUrl,
      eventTimestampSec: Number(eventTimestampSec),
      eventTitle,
      playerDorsal,
      actionType,
      matchTitle,
      preSec: Number(preSec),
      postSec: Number(postSec)
    });

    res.json({
      success: true,
      engine: 'AutoHighlightGenerator (Python 3 + FFmpeg)',
      filter: 'crop=ih*(9/16):ih:(iw-ow)/2:0,scale=1080:1920:flags=bicubic',
      clip: clipResult,
      message: 'Clip vertical 9:16 generado y optimizado para Reels / Shorts / TikTok.'
    });
  } catch (error: any) {
    console.error('[varHighlightRouter Error]:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error procesando el clip con FFmpeg'
    });
  }
});

/**
 * 2. Listar clips recientes generados por la Visión Artificial Edge y el VAR
 */
varHighlightRouter.get('/recent-clips', (req: Request, res: Response) => {
  try {
    const clips = getRecentClips();
    res.json({
      success: true,
      total: clips.length,
      clips
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
