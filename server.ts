import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { deporversoRouter } from "./server/routes/deporversoRoutes";

async function startServer() {
  const app = express();
  const isDev = process.env.NODE_ENV !== "production";
  // En desarrollo (AI Studio) se requiere obligatoriamente el puerto 3000 por el proxy nginx.
  // En producción (Cloud Run), se utiliza la variable de entorno inyectada PORT (por defecto 8080).
  const PORT = isDev ? 3000 : (process.env.PORT ? parseInt(process.env.PORT, 10) : 8080);

  app.use(express.json({ limit: "10mb" }));

  // DeporVerso Enterprise Multi-Tenant & Heroes VR API
  app.use("/api/deporverso", deporversoRouter);

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
      server: { middlewareMode: true },
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
    console.error(`[DeporVerso Server] Fatal error on primary port ${PORT}:`, err.message);
  });

  // En producción (Cloud Run): si PORT es 8080 pero alguna configuración prueba el 3000,
  // escuchamos también de forma no bloqueante en el puerto 3000.
  if (!isDev && PORT !== 3000) {
    try {
      const secondaryServer = app.listen(3000, "0.0.0.0", () => {
        console.log(`[DeporVerso Server] Resilient secondary listener active on http://0.0.0.0:3000`);
      });
      secondaryServer.on("error", (err: any) => {
        // Si el puerto 3000 ya está tomado o no se permite doble bind, continuar con el principal
        console.log(`[DeporVerso Server] Secondary port 3000 notice: ${err.message}`);
      });
    } catch (e: any) {
      console.log(`[DeporVerso Server] Secondary bind bypassed: ${e.message}`);
    }
  }
}

startServer();
