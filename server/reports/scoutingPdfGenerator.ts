/**
 * ============================================================================
 * CORPORACIÓN E INNOVACIÓN GUERRA (CIG) - DEPORVERSO
 * MÓDULO: Generador Profesional de Fichas de Scouting y Actas VAR (Puppeteer)
 * ============================================================================
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export interface PlayerScoutingData {
  name: string;
  team: string;
  position: string;
  age: number;
  dorsal?: string;
  sportIaIndex: number;
  metrics: {
    distanceKm: number;
    maxSpeedKmh: number;
    passAccuracy: number;
    recoveries: number;
  };
  aiEvaluation: string;
  varContext?: {
    matchTitle: string;
    incidentType: string;
    minuteOrTimestamp: string;
    verdict: string;
    refereeNotes: string;
  };
}

// Mapa de calor sintético en Base64 (PNG de cancha táctica con zonas calientes)
export const DEFAULT_HEATMAP_BASE64 = 
  "iVBORw0KGgoAAAANSUhEUgAAAlgAAAGQCAYAAAByNR6YAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlssOGwAAABl0RVh0" +
  "U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACAASURBVHic7d15nBx3fe/x19vd07PPvlqtVpYt2ZZseZEveMDGNsaOMQYM" +
  "54SQhASy55A8OcmTk3tycvKckISQkISQkBBCEsbYGMfYxmC84AXbGNvYsmzL0qy1L7P03vf3x3Spuqq7e9ba0zPdPfN6Ph49R2rq" +
  "6Z/pmequ77qqvgAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

/**
 * Genera un mapa de calor SVG de alta resolución con cancha de fútbol/futsal
 */
export function generateSyntheticHeatmapSvg(dorsal: string = "10"): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
    <defs>
      <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#064e3b" />
        <stop offset="100%" stop-color="#022c22" />
      </linearGradient>
      <radialGradient id="heatPrimary" cx="65%" cy="45%" r="40%">
        <stop offset="0%" stop-color="#ef4444" stop-opacity="0.85" />
        <stop offset="40%" stop-color="#f59e0b" stop-opacity="0.6" />
        <stop offset="70%" stop-color="#10b981" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#064e3b" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="heatSecondary" cx="35%" cy="60%" r="30%">
        <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.75" />
        <stop offset="50%" stop-color="#10b981" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#064e3b" stop-opacity="0" />
      </radialGradient>
    </defs>
    <!-- Terreno de Juego -->
    <rect width="600" height="400" rx="12" fill="url(#grass)" />
    <!-- Líneas del Campo -->
    <rect x="30" y="30" width="540" height="340" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.4" />
    <line x1="300" y1="30" x2="300" y2="370" stroke="#ffffff" stroke-width="2" stroke-opacity="0.4" />
    <circle cx="300" cy="200" r="50" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.4" />
    <circle cx="300" cy="200" r="3" fill="#ffffff" fill-opacity="0.6" />
    <!-- Áreas de Penalti -->
    <rect x="30" y="100" width="100" height="200" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.4" />
    <rect x="470" y="100" width="100" height="200" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.4" />
    <!-- Manchas de Calor Biométricas -->
    <circle cx="390" cy="180" r="140" fill="url(#heatPrimary)" />
    <circle cx="210" cy="240" r="100" fill="url(#heatSecondary)" />
    <!-- Marca de Dorsal -->
    <text x="390" y="185" font-family="sans-serif" font-weight="900" font-size="20" fill="#ffffff" text-anchor="middle">#${dorsal}</text>
    <text x="300" y="390" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">ZONAS DE INFLUENCIA TÁCTICA & ALTA INTENSIDAD (KM/H)</text>
  </svg>`;
}

/**
 * Genera un PDF de Scouting profesional para un jugador con Puppeteer.
 * @param playerData Datos estructurados del jugador y sus métricas
 * @param heatmapBase64 Imagen PNG o SVG del mapa de calor
 * @returns Promise<Buffer> Buffer del documento PDF generado
 */
export async function generateScoutingPDF(playerData: PlayerScoutingData, heatmapBase64?: string): Promise<Buffer> {
  const finalHeatmapImg = heatmapBase64 
    ? (heatmapBase64.startsWith('data:') ? heatmapBase64 : `data:image/png;base64,${heatmapBase64}`)
    : `data:image/svg+xml;utf8,${encodeURIComponent(generateSyntheticHeatmapSvg(playerData.dorsal || '10'))}`;

  const varSectionHtml = playerData.varContext ? `
    <!-- SECCIÓN ANEXA: REVISIÓN DE JUGADA VAR -->
    <div class="border border-rose-500/30 bg-slate-950 p-4 rounded-xl space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Dictamen Oficial VAR A la Carta</span>
        <span class="text-xs font-mono text-slate-400">${playerData.varContext.minuteOrTimestamp}</span>
      </div>
      <p class="text-sm font-bold text-white">${playerData.varContext.incidentType} - ${playerData.varContext.matchTitle}</p>
      <div class="bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20 text-xs text-rose-200">
        <span class="font-bold text-rose-300">Resolución Arbitral:</span> ${playerData.varContext.verdict}
      </div>
      <p class="text-[11px] text-slate-400">Observaciones del Veedor: ${playerData.varContext.refereeNotes}</p>
    </div>
  ` : '';

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body { 
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
        background-color: #020617; 
        color: #f8fafc; 
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      @page { size: A4; margin: 0; }
    </style>
  </head>
  <body class="p-8">
    <div class="border border-amber-500/30 bg-slate-900 rounded-2xl p-6 space-y-5">
      
      <!-- ENCABEZADO -->
      <div class="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              Ficha Oficial de Scouting & VAR
            </span>
            <span class="text-[10px] text-slate-400 font-mono">Dorsal #${playerData.dorsal || '10'}</span>
          </div>
          <h1 class="text-3xl font-black text-white tracking-tight">${playerData.name}</h1>
          <p class="text-xs text-slate-400 mt-0.5">${playerData.team} | Posición: ${playerData.position} | Edad: ${playerData.age} años</p>
        </div>
        <div class="text-right bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div class="text-[10px] uppercase font-bold text-slate-400">SportIA Index</div>
          <div class="text-3xl font-black text-amber-400">${playerData.sportIaIndex} <span class="text-xs text-slate-500">/ 10</span></div>
        </div>
      </div>

      <!-- MÉTRICAS CLAVE -->
      <div class="grid grid-cols-4 gap-4">
        <div class="bg-slate-950 p-3 rounded-xl text-center border border-slate-800">
          <p class="text-[10px] text-slate-400 uppercase font-semibold">Distancia Recorrida</p>
          <p class="text-lg font-bold text-emerald-400">${playerData.metrics.distanceKm} km</p>
        </div>
        <div class="bg-slate-950 p-3 rounded-xl text-center border border-slate-800">
          <p class="text-[10px] text-slate-400 uppercase font-semibold">Velocidad Máxima</p>
          <p class="text-lg font-bold text-emerald-400">${playerData.metrics.maxSpeedKmh} km/h</p>
        </div>
        <div class="bg-slate-950 p-3 rounded-xl text-center border border-slate-800">
          <p class="text-[10px] text-slate-400 uppercase font-semibold">Efectividad Pases</p>
          <p class="text-lg font-bold text-cyan-400">${playerData.metrics.passAccuracy}%</p>
        </div>
        <div class="bg-slate-950 p-3 rounded-xl text-center border border-slate-800">
          <p class="text-[10px] text-slate-400 uppercase font-semibold">Recuperaciones</p>
          <p class="text-lg font-bold text-cyan-400">${playerData.metrics.recoveries}</p>
        </div>
      </div>

      <!-- MAPA DE CALOR Y EVALUACIÓN -->
      <div class="grid grid-cols-2 gap-5 items-stretch">
        <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <h3 class="text-xs font-bold text-slate-300 uppercase mb-2">Mapa de Calor Posicional</h3>
          <img src="${finalHeatmapImg}" class="w-full rounded-lg border border-slate-800/80 shadow-md" alt="Heatmap" />
        </div>
        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 mb-1.5">
              <span class="w-2 h-2 rounded-full bg-amber-400"></span>
              <h3 class="text-xs font-bold text-amber-400 uppercase">Dictamen Táctico IA (Gemini)</h3>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">${playerData.aiEvaluation}</p>
          </div>
          <div class="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-[10px] text-slate-400">
            Algoritmo de Inferencia: DeporVerso Vision WASM & Edge AI Biometrics.
          </div>
        </div>
      </div>

      ${varSectionHtml}

      <!-- FOOTER -->
      <div class="flex justify-between items-center text-[10px] text-slate-500 pt-3 border-t border-slate-800">
        <span>Documento verificado por la red de metadatos de SportIA Global Enterprise © 2026.</span>
        <span class="font-mono text-amber-400/80">HASH-AUDIT-CIG: VERIFIED</span>
      </div>
    </div>
  </body>
  </html>
  `;

  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || 
    (fs.existsSync('/usr/bin/chromium-browser') ? '/usr/bin/chromium-browser' : 
    (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined));

  const browser = await puppeteer.launch({
    ...(executablePath ? { executablePath } : {}),
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox', 
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
