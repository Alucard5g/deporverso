/**
 * ============================================================================
 * CORPORACIÓN E INNOVACIÓN GUERRA (CIG) - DEPORVERSO
 * RUTAS DE API: WORKER SERVERLESS DE VISIÓN ARTIFICIAL (YOLOv8 + EasyOCR)
 * ============================================================================
 */

import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const workerRoutes = Router();

const DOCKERFILE_WORKER_PATH = path.join(process.cwd(), 'Dockerfile.worker');
const REQUIREMENTS_PATH = path.join(process.cwd(), 'requirements.txt');

/**
 * 1. Consultar estado, configuración y Dockerfile del Worker Serverless
 */
workerRoutes.get('/config', (req: Request, res: Response) => {
  try {
    const dockerfileContent = fs.existsSync(DOCKERFILE_WORKER_PATH) 
      ? fs.readFileSync(DOCKERFILE_WORKER_PATH, 'utf-8')
      : '';
    
    const requirementsContent = fs.existsSync(REQUIREMENTS_PATH)
      ? fs.readFileSync(REQUIREMENTS_PATH, 'utf-8')
      : '';

    res.json({
      success: true,
      workerName: "CIG Serverless Vision & VAR Worker",
      runtime: "Python 3.10-slim (Multi-Stage Docker)",
      port: 8080,
      baseImages: {
        builder: "python:3.10-slim",
        runner: "python:3.10-slim"
      },
      packages: [
        "ultralytics (YOLOv8 Object Detection)",
        "opencv-python-headless (Computer Vision)",
        "torch & torchvision (PyTorch CPU Inference)",
        "easyocr (Jersey & Dorsal Number OCR)",
        "numpy (Matrix Computations)",
        "ffmpeg (Hardware/CPU Accelerated 9:16 Video Slicing)"
      ],
      dockerfile: dockerfileContent,
      requirements: requirementsContent,
      deployCommand: "gcloud run deploy cig-vision-worker --image gcr.io/sportia-plataform/cig-vision-worker:latest --port 8080 --memory 4Gi --cpu 2"
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 2. Simular o despachar inferencia directa hacia el pipeline del worker
 */
workerRoutes.post('/simulate-inference', (req: Request, res: Response) => {
  try {
    const { dorsal = '10', action = 'Detección en Área de Meta' } = req.body || {};
    
    res.json({
      success: true,
      worker: "CIG Serverless Vision Worker (YOLOv8 + EasyOCR)",
      status: "OPTIMAL",
      latencyMs: 14.2,
      inferenceResult: {
        detectedDorsal: dorsal,
        confidence: 98.6,
        model: "YOLOv8n-pose + EasyOCR v1.7",
        ballCoordinates: { x: 410, y: 280, speedKmh: 84.2 },
        tacticalZone: "Zona 14 / Área Chica",
        decisionAssistance: `Dorsal #${dorsal} validado pericialmente sin oclusión.`
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
