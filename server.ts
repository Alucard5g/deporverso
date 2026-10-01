import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { deporversoRouter } from "./server/routes/deporversoRoutes";
import { cigSecurityRouter } from "./server/routes/cigSecurityRoutes";
import { varHighlightRouter } from "./server/routes/varHighlightRoutes";
import { pdfReportRouter } from "./server/routes/pdfReportRoutes";
import { workerRoutes } from "./server/routes/workerRoutes";
import { 
  antiScrapingMiddleware, 
  rateLimiterMiddleware, 
  securityHeadersMiddleware 
} from "./server/security/rateLimiter";

async function startServer() {
  const app = express();

  // Endurecimiento Perimetral y Protección CIG
  app.use(securityHeadersMiddleware);
  app.use(antiScrapingMiddleware);
  app.use(rateLimiterMiddleware);
  // Detección de puerto estricta para AI Studio (debe escuchar en 3000):
  // NGINX escucha en 8080 y hace proxy interno al puerto 3000 (DEFAULT_APP_PORT)
  const portArgIndex = process.argv.indexOf('--port');
  const cliPort = portArgIndex !== -1 && process.argv[portArgIndex + 1] ? parseInt(process.argv[portArgIndex + 1], 10) : null;
  const PORT = cliPort || (process.env.DEFAULT_APP_PORT ? parseInt(process.env.DEFAULT_APP_PORT, 10) : 3000);

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

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const mainServer = app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DeporVerso Server] Running on http://0.0.0.0:${PORT} (NODE_ENV=${process.env.NODE_ENV || 'development'})`);
  });

  mainServer.on("error", (err: any) => {
    console.error(`[DeporVerso Server] Error on port ${PORT}:`, err.message);
    if (err.code === 'EADDRINUSE') {
      console.warn(`[DeporVerso Server] Port ${PORT} already in use. Exiting to allow clean restart...`);
      process.exit(1);
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
}

startServer();
