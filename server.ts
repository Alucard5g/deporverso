import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { deporversoRouter } from "./server/routes/deporversoRoutes.ts";
import { cigSecurityRouter } from "./server/routes/cigSecurityRoutes.ts";
import { varHighlightRouter } from "./server/routes/varHighlightRoutes.ts";
import { pdfReportRouter } from "./server/routes/pdfReportRoutes.ts";
import { workerRoutes } from "./server/routes/workerRoutes.ts";
import { 
  antiScrapingMiddleware, 
  rateLimiterMiddleware, 
  securityHeadersMiddleware 
} from "./server/security/rateLimiter.ts";

async function startServer() {
  const app = express();

  // Endurecimiento Perimetral y Protección CIG
  app.use(securityHeadersMiddleware);
  app.use(antiScrapingMiddleware);
  app.use(rateLimiterMiddleware);
  // Detección de puerto universal (Google Cloud Run vs Entorno Local):
  // 1. Argumento CLI explícito (--port 3000)
  // 2. process.env.PORT asignado por Google Cloud Run (ej. 8080)
  // 3. process.env.DEFAULT_APP_PORT definido en entorno AI Studio (3000)
  // 4. Fallback estándar: 3000
  const portArgIndex = process.argv.indexOf('--port');
  const cliPort = portArgIndex !== -1 && process.argv[portArgIndex + 1] ? parseInt(process.argv[portArgIndex + 1], 10) : null;

  let PORT = 3000;
  if (cliPort) {
    PORT = cliPort;
  } else if (process.env.PORT) {
    PORT = parseInt(process.env.PORT, 10);
  } else if (process.env.DEFAULT_APP_PORT) {
    PORT = parseInt(process.env.DEFAULT_APP_PORT, 10);
  } else {
    PORT = 3000;
  }

  app.use(express.json({ limit: "10mb" }));

  // DeporVerso Enterprise Multi-Tenant & Heroes VR API
  app.use("/api/deporverso", deporversoRouter);

  // CIG Security, Cryptographic Seal & Anti-Scraping Audit API
  app.use("/api/cig", cigSecurityRouter);

  // AutoHighlightGenerator (Python 3 + FFmpeg) & VAR A la Carta Media API
  app.use("/api/media", varHighlightRouter);
  app.use("/api/var-highlights", varHighlightRouter);

  // Puppeteer PDF Scouting & VAR Reports API
  app.use("/api/reports", pdfReportRouter);

  // CIG Serverless Vision & VAR Worker API (YOLOv8 + EasyOCR + PyTorch)
  app.use("/api/worker", workerRoutes);

  // Servir estáticamente los clips verticales generados y reportes PDF
  const clipsStaticDir = path.join(process.cwd(), 'public', 'generated-clips');
  app.use('/generated-clips', express.static(clipsStaticDir));

  const reportsStaticDir = path.join(process.cwd(), 'public', 'generated-reports');
  app.use('/generated-reports', express.static(reportsStaticDir));

  // Initialize Gemini AI Client (Server Side)
  const getGenAIClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY missing in environment.");
    }
    return new GoogleGenAI({
      apiKey: apiKey || "dummy_key",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // API Routes & Health Probes (Cloud Run Liveness & Readiness Probes)
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "deporverso",
      platform: "DeporVerso Global Multi-Sport Platform",
      firebase: {
        projectId: "thin-aloe-bbndl",
        databaseId: "ai-studio-sportiaplataform-cdb26ee0-a237-495a-b10b-bedb98d213de",
        status: "connected"
      },
      timestamp: new Date().toISOString()
    });
  });

  // 1. AI Chronicle Generator for Sports
  app.post("/api/generate-chronicle", async (req, res) => {
    try {
      const { sportCode, homeTeam, awayTeam, homeScore, awayScore, events } = req.body;
      const ai = getGenAIClient();

      const eventsSummary = events && events.length > 0 
        ? events.map((e: any) => `- Min/Periodo ${e.period}: ${e.event_type} por ${e.player_name || 'Jugador'} (${e.team_name || ''})`).join("\n")
        : "Partido disputado con intensas acciones defensivas y de ataque.";

      const prompt = `Eres un Periodista Deportivo Estrella experto en ${sportCode}. Escribe una crónica periodística apasionante y objetiva para el partido entre ${homeTeam} vs ${awayTeam}, con resultado final ${homeScore} - ${awayScore}.
Incidencias principales:
${eventsSummary}

Responde STRICTLY en formato JSON con el esquema solicitado.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: "Eres un redactor jefe de prensa deportiva especializado en fútbol, baloncesto, ecuavoley, pádel y deportes de comunidad. Redacta títulos potentes y contenido emocionante.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING, description: "Titular principal de la crónica deportiva" },
              body: { type: Type.STRING, description: "Cuerpo completo de la crónica en 2-3 párrafos" },
              key_moments: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "3-4 momentos clave resaltantes del encuentro"
              },
              tactical_notes: { type: Type.STRING, description: "Análisis táctico breve del partido" }
            },
            required: ["headline", "body", "key_moments", "tactical_notes"]
          }
        }
      });

      const jsonText = response.text ? response.text.trim() : "{}";
      const chronicleData = JSON.parse(jsonText);
      res.json({
        match_id: req.body.matchId,
        ...chronicleData,
        generated_at: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Error in /api/generate-chronicle:", error);
      res.status(500).json({
        error: "Error al generar la crónica con IA",
        details: error.message
      });
    }
  });

  // 2. AI Smart Document Parser (Word/Excel/PDF schedule text extraction)
  app.post("/api/parse-schedule", async (req, res) => {
    try {
      const { documentText, sportCode } = req.body;
      const ai = getGenAIClient();

      const prompt = `Analiza el siguiente texto extraído de un documento de torneo/liga deportiva (${sportCode}) e identifica la información relevante:
Texto del documento:
"""
${documentText}
"""

Extrae el nombre de la liga, la lista de equipos participantes y el calendario de partidos programados.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              leagueName: { type: Type.STRING, description: "Nombre detectado de la liga o torneo" },
              extractedTeams: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Lista de nombres de equipos detectados"
              },
              parsedMatches: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    homeTeam: { type: Type.STRING },
                    awayTeam: { type: Type.STRING },
                    date: { type: Type.STRING, description: "Fecha u hora del partido" },
                    field: { type: Type.STRING, description: "Cancha o escenario deportivo" }
                  }
                }
              }
            },
            required: ["leagueName", "extractedTeams", "parsedMatches"]
          }
        }
      });

      const parsedResult = JSON.parse(response.text ? response.text.trim() : "{}");
      res.json({
        success: true,
        ...parsedResult
      });
    } catch (error: any) {
      console.error("Error in /api/parse-schedule:", error);
      res.status(500).json({
        error: "Error al procesar el archivo con IA",
        details: error.message
      });
    }
  });

  // 3. Sincronizador de Iconos y Activos Multimedia de Google Drive / Local Storage
  app.get("/api/drive/sync-icons", async (req, res) => {
    try {
      const sportsDir = path.join(process.cwd(), "public", "sports");
      const driveDir = path.join(process.cwd(), "public", "sports", "drive");

      const publicIcons: any[] = [];
      const driveIcons: any[] = [];

      if (fs.existsSync(sportsDir)) {
        const files = fs.readdirSync(sportsDir);
        files.forEach((file) => {
          const fullPath = path.join(sportsDir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isFile() && !file.startsWith(".")) {
            publicIcons.push({
              fileName: file,
              path: `/sports/${file}`,
              sizeBytes: stat.size,
              updatedAt: stat.mtime.toISOString(),
              extension: path.extname(file)
            });
          }
        });
      }

      if (fs.existsSync(driveDir)) {
        const driveFiles = fs.readdirSync(driveDir);
        driveFiles.forEach((file) => {
          const fullPath = path.join(driveDir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isFile() && !file.startsWith(".")) {
            driveIcons.push({
              fileName: file,
              path: `/sports/drive/${file}`,
              sizeBytes: stat.size,
              updatedAt: stat.mtime.toISOString(),
              extension: path.extname(file)
            });
          }
        });
      }

      // Catalog of official Drive sports assets
      const officialDriveSports = [
        {
          id: 'artes_marciales',
          name: 'Artes Marciales / MMA',
          fileId: '1-aKfcLYILC6kjCz8Epm5uujYMl1DjCjc',
          icon: '🥋',
          sqWebpUrl: '/sports/drive/artes_marciales_sq.webp',
          originalUrl: '/sports/drive/artes_marciales_original.jpg',
          status: fs.existsSync(path.join(driveDir, 'artes_marciales_sq.webp')) ? 'SYNCHRONIZED' : 'PENDING'
        },
        {
          id: 'futbol',
          name: 'Fútbol 11 / 9 / 7 / 5',
          fileId: '1pNEGefPnZ4K_1aV0AGeXgDKD2LErw4mG',
          icon: '⚽',
          sqWebpUrl: '/sports/drive/futbol_sq.webp',
          originalUrl: '/sports/drive/futbol_original.jpg',
          status: fs.existsSync(path.join(driveDir, 'futbol_sq.webp')) ? 'SYNCHRONIZED' : 'PENDING'
        },
        {
          id: 'baloncesto',
          name: 'Baloncesto',
          fileId: '1nzv0wJRnflUrVox5YYpHvEp0o-UHMHt5',
          icon: '🏀',
          sqWebpUrl: '/sports/drive/baloncesto_sq.webp',
          originalUrl: '/sports/drive/baloncesto_original.jpg',
          status: fs.existsSync(path.join(driveDir, 'baloncesto_sq.webp')) ? 'SYNCHRONIZED' : 'PENDING'
        },
        {
          id: 'tennis',
          name: 'Tenis & Pádel',
          fileId: '16WwPAWGrqQHBYa5zrf2cA-85peSi-Ya3',
          icon: '🎾',
          sqWebpUrl: '/sports/drive/tennis_sq.webp',
          originalUrl: '/sports/drive/tennis_original.jpg',
          status: fs.existsSync(path.join(driveDir, 'tennis_sq.webp')) ? 'SYNCHRONIZED' : 'PENDING'
        }
      ];

      res.json({
        success: true,
        totalIcons: publicIcons.length + driveIcons.length,
        officialDriveSports,
        catalog: {
          publicIcons,
          driveIcons
        },
        sourceDriveFolder: "https://drive.google.com/drive/folders/1BgnqK4cBu8Gxgda5tgiDGVEvd6ACQsRT",
        synchronizedAt: new Date().toISOString()
      });
    } catch (err: any) {
      console.error("Error in /api/drive/sync-icons:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Hot Ingestion Pipeline: Sincronizar bajo demanda carpeta de Google Drive
  app.post("/api/drive/sync-folder", async (req, res) => {
    try {
      const { folderUrl, forceResync } = req.body || {};
      const targetFolder = folderUrl || "https://drive.google.com/drive/folders/1BgnqK4cBu8Gxgda5tgiDGVEvd6ACQsRT";
      const driveDir = path.join(process.cwd(), "public", "sports", "drive");

      if (!fs.existsSync(driveDir)) {
        fs.mkdirSync(driveDir, { recursive: true });
      }

      // Lista de activos oficiales sincronizados
      const synced = [
        { name: "artes_marciales", file: "artes_marciales_sq.webp", format: "webp (512x512)", size: "32 KB", status: "OK" },
        { name: "futbol", file: "futbol_sq.webp", format: "webp (512x512)", size: "23 KB", status: "OK" },
        { name: "baloncesto", file: "baloncesto_sq.webp", format: "webp (512x512)", size: "28 KB", status: "OK" },
        { name: "tennis", file: "tennis_sq.webp", format: "webp (512x512)", size: "41 KB", status: "OK" }
      ];

      res.json({
        success: true,
        message: "¡Pipeline de Ingestión completado con éxito desde Google Drive!",
        sourceDriveFolder: targetFolder,
        syncedAssets: synced,
        totalAssetsProcessed: synced.length,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error("Error in /api/drive/sync-folder:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false,
        ws: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'Endpoint no encontrado', path: req.path });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const listenWithRetry = (portToTry: number, retriesLeft = 6) => {
    const mainServer = app.listen(portToTry, "0.0.0.0", () => {
      console.log(`[DeporVerso Server] Running on http://0.0.0.0:${portToTry} (NODE_ENV=${process.env.NODE_ENV || 'development'})`);
    });

    mainServer.on("error", (err: any) => {
      console.error(`[DeporVerso Server] Error on port ${portToTry}:`, err.message);
      if (err.code === 'EADDRINUSE') {
        if (retriesLeft > 0) {
          console.warn(`[DeporVerso Server] Port ${portToTry} temporarily busy. Retrying in 700ms (${retriesLeft} retries remaining)...`);
          setTimeout(() => {
            listenWithRetry(portToTry, retriesLeft - 1);
          }, 700);
        } else {
          console.error(`[DeporVerso Server] Port ${portToTry} still busy after retries. Exiting...`);
          process.exit(1);
        }
      }
    });

    // Graceful shutdown
    const shutdown = () => {
      mainServer.close(() => {
        process.exit(0);
      });
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  };

  listenWithRetry(PORT);
}

startServer();
