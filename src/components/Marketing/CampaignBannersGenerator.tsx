import React, { useState, useRef } from 'react';
import { 
  Download, Copy, Check, Sparkles, Tag, Smartphone, Monitor, Square, 
  ChevronRight, Trophy, Video, ShieldCheck, Flame, ArrowRight, Share2 
} from 'lucide-react';

interface CampaignBannersGeneratorProps {
  onOpenCheckout?: () => void;
}

type AspectRatio = '1:1' | '9:16' | '16:9';

interface CampaignTemplate {
  id: string;
  name: string;
  badge: string;
  headline: string;
  subheadline: string;
  accentColor: string;
  priceTag: string;
  sportIcon: string;
  adCopy: string;
}

const TEMPLATES: CampaignTemplate[] = [
  {
    id: 'oferta-50',
    name: '🔥 Oferta 50% OFF (10 Primeras Ligas)',
    badge: 'SUPER PROMOCIÓN LIMITADA • 10 PRIMERAS LIGAS',
    headline: 'TU LIGA DE ÉLITE CON 50% DE DESCUENTO',
    subheadline: 'Precio regular $70/equipo. ¡Solo $35 por equipo para las primeras 10 ligas en unirse!',
    accentColor: '#00F0FF',
    priceTag: '$35 / EQUIPO (ANTES $70)',
    sportIcon: '⚽',
    adCopy: `🔥 ¡ATENCIÓN DIRIGENTES Y PRESIDENTES DE LIGAS! 🔥\n\n¿Cansado de planillas en papel mojadas de barro y polémicas en cada partido?\n\nLlegó DEPORVERSO: La plataforma multideporte en la nube con Sistema VAR 4K, carnets QR antifraude y vocalía digital en vivo.\n\n⚡ OFERTA EXCLUSIVA DE LANZAMIENTO:\nPrecio regular: $70 por equipo.\n👉 ¡50% DE DESCUENTO para las 10 PRIMERAS LIGAS!\nSolo pagas: $35 por equipo.\n\n✅ Sistema VAR a la carta\n✅ Subdominio oficial tuliga.deporverso.app\n✅ Carnets QR biométricos\n✅ Tablas de posiciones al instante\n\nQuedan solo 4 cupos con descuento. Reclama tu cupo hoy mismo en:\n👉 https://deporverso.com`
  },
  {
    id: 'basta-papel',
    name: '📝 Basta de Planillas en Papel',
    badge: 'TRANSFORMACIÓN DIGITAL BARRIAL',
    headline: 'EL ORDEN DE LAS GRANDES LIGAS EN TU BARRIO',
    subheadline: 'De la planilla mojada a la matriz en la nube. Cero pérdidas de datos ni polémicas arbitrales.',
    accentColor: '#0066FF',
    priceTag: '$35 / EQUIPO • 50% OFF',
    sportIcon: '🏆',
    adCopy: `¿Sigues perdiendo horas y reputación administrando tus torneos en hojas de papel arrugadas?\n\nDigitaliza tu liga en 24 horas con DEPORVERSO:\n• Planilla digital remota sin papeles.\n• Carnets digitales con código QR inmutable.\n• Fixtures y estadísticas al segundo.\n\n¡Aprovecha el 50% de descuento ($35/equipo)! Solicita tu demo en https://deporverso.com`
  },
  {
    id: 'var-4k',
    name: '📺 Sistema VAR a la Carta',
    badge: 'JUSTICIA DEPORTIVA EN CANCHA',
    headline: 'VAR 4K Y REPETICIÓN MULTICÁMARA',
    subheadline: 'Líneas de fuera de juego, vectores de velocidad y actas arbitrales selladas con hash de seguridad.',
    accentColor: '#ef4444',
    priceTag: 'TECNOLOGÍA VAR INCLUIDA',
    sportIcon: '🎥',
    adCopy: `⚽ ¡CERO PELEAS NI DUDAS EN LA CANCHA!\n\nLleva el VAR profesional a tu torneo barrial o formativo.\nCon DEPORVERSO tienes:\n✓ Repetición multicámara a la carta desde teléfonos comunes.\n✓ Trazado de líneas de offside en segundos.\n✓ Video arbitraje con máxima transparencia.\n\nÚnete a las primeras 10 ligas con 50% OFF ($35/equipo) en https://deporverso.com`
  },
  {
    id: 'multideporte',
    name: '🏀 Ecosistema Multideporte Total',
    badge: '10+ DISCIPLINAS UNIFICADAS',
    headline: 'FÚTBOL, BÁSQUET, PÁDEL Y MÁS',
    subheadline: 'Reglamentos adaptables para ligas de cualquier deporte en una sola cuenta administrativa.',
    accentColor: '#10b981',
    priceTag: 'MULTIDEPORTE • 50% OFF',
    sportIcon: '🏀',
    adCopy: `Un solo sistema para TODOS tus torneos:\n⚽ Fútbol 11, Indor y Fútsal\n🏀 Baloncesto con reloj de tiro reglamentario\n🎾 Pádel y Tenis\n🏐 Voleibol y Ecuavoley\n\nPrueba DEPORVERSO hoy mismo con 50% de descuento ($35/equipo) en https://deporverso.com`
  }
];

export const CampaignBannersGenerator: React.FC<CampaignBannersGeneratorProps> = ({
  onOpenCheckout
}) => {
  const [selectedFormat, setSelectedFormat] = useState<AspectRatio>('1:1');
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate>(TEMPLATES[0]);
  const [leagueCustomName, setLeagueCustomName] = useState<string>('Liga Deportiva San Francisco');
  const [copied, setCopied] = useState<boolean>(false);
  const bannerCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleCopyAdCopy = () => {
    navigator.clipboard.writeText(selectedTemplate.adCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadBanner = () => {
    const canvas = document.createElement('canvas');
    let width = 1080;
    let height = 1080;

    if (selectedFormat === '9:16') {
      width = 1080;
      height = 1920;
    } else if (selectedFormat === '16:9') {
      width = 1920;
      height = 1080;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#030712');
    bgGrad.addColorStop(0.5, '#050D24');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Cosmic neon glow
    const radialGlow = ctx.createRadialGradient(width / 2, height * 0.35, 50, width / 2, height * 0.35, width * 0.6);
    radialGlow.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
    radialGlow.addColorStop(0.5, 'rgba(0, 102, 255, 0.15)');
    radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, width, height);

    // 3. Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const step = width / 18;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 4. Logo & Brand
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(width * 0.038)}px system-ui, sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText('DEPORVERSO', width * 0.08, height * 0.09);

    ctx.fillStyle = '#00F0FF';
    ctx.font = `${Math.round(width * 0.02)}px monospace`;
    ctx.fillText('GLOBAL MULTI-SPORT SAAS', width * 0.08, height * 0.12);

    // 5. Badge
    const badgeY = height * 0.22;
    ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 2;
    const badgeWidth = width * 0.7;
    const badgeHeight = height * 0.045;
    ctx.beginPath();
    ctx.roundRect(width * 0.08, badgeY, badgeWidth, badgeHeight, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#00F0FF';
    ctx.font = `bold ${Math.round(width * 0.022)}px monospace`;
    ctx.fillText(selectedTemplate.badge, width * 0.11, badgeY + badgeHeight * 0.68);

    // 6. Headline
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `900 ${Math.round(width * 0.055)}px system-ui, sans-serif`;
    const headlineLines = selectedTemplate.headline.split(' CON ');
    ctx.fillText(headlineLines[0], width * 0.08, height * 0.35);
    if (headlineLines[1]) {
      ctx.fillStyle = '#00F0FF';
      ctx.fillText('CON ' + headlineLines[1], width * 0.08, height * 0.42);
    }

    // 7. Subheadline
    ctx.fillStyle = '#CBD5E1';
    ctx.font = `${Math.round(width * 0.028)}px system-ui, sans-serif`;
    ctx.fillText(selectedTemplate.subheadline.slice(0, 65), width * 0.08, height * 0.50);
    ctx.fillText(selectedTemplate.subheadline.slice(65), width * 0.08, height * 0.54);

    // 8. League Name Highlight Box
    const boxY = height * 0.60;
    ctx.fillStyle = 'rgba(8, 15, 36, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(width * 0.08, boxY, width * 0.84, height * 0.14, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#94A3B8';
    ctx.font = `${Math.round(width * 0.02)}px monospace`;
    ctx.fillText('TORNEO OFICIAL EN CURSO:', width * 0.12, boxY + height * 0.045);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(width * 0.038)}px system-ui, sans-serif`;
    ctx.fillText(leagueCustomName, width * 0.12, boxY + height * 0.095);

    // 9. Price Tag & CTA Box
    const ctaY = height * 0.78;
    ctx.fillStyle = '#0066FF';
    ctx.beginPath();
    ctx.roundRect(width * 0.08, ctaY, width * 0.84, height * 0.12, 28);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `900 ${Math.round(width * 0.038)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(selectedTemplate.priceTag, width * 0.5, ctaY + height * 0.05);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = `bold ${Math.round(width * 0.024)}px system-ui, sans-serif`;
    ctx.fillText('👉 RECLAMA TU CUPO EN: DEPORVERSO.COM', width * 0.5, ctaY + height * 0.09);

    // Download trigger
    const link = document.createElement('a');
    link.download = `deporverso-banner-${selectedTemplate.id}-${selectedFormat.replace(':', 'x')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in text-white">
      
      {/* HEADER SECCIÓN */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#080F24] border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MARKETING B2B & GENERADOR DE PIEZAS GRÁFICAS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Generador de Banners Publicitarios Oficiales
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Genera piezas gráficas de alta conversión para Facebook, Instagram, TikTok y YouTube. Incluye la super oferta del 50% de descuento ($35 por equipo para las primeras 10 ligas).
          </p>
        </div>

        {onOpenCheckout && (
          <button
            onClick={onOpenCheckout}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#0066FF] hover:bg-[#0052cc] shadow-[0_0_20px_rgba(0,102,255,0.6)] flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Tag className="w-4 h-4 text-[#00F0FF]" />
            <span>Ver Embudo de Oferta ($35/Eq)</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PANEL IZQUIERDO: CONTROLES DE EDICIÓN (5 COLUMNAS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Selector de Plantilla */}
          <div className="p-5 rounded-2xl bg-[#080F24]/80 border border-white/10 space-y-3">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              1. Selecciona la Campaña
            </label>
            <div className="space-y-2">
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                    selectedTemplate.id === tmpl.id
                      ? 'bg-[#0066FF]/20 border-[#00F0FF] text-white font-bold shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span>{tmpl.name}</span>
                  {selectedTemplate.id === tmpl.id && <Check className="w-4 h-4 text-[#00F0FF]" />}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Selector de Formato de Pantalla */}
          <div className="p-5 rounded-2xl bg-[#080F24]/80 border border-white/10 space-y-3">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              2. Formato de Publicación
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedFormat('1:1')}
                className={`p-3 rounded-xl border text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  selectedFormat === '1:1'
                    ? 'bg-[#0066FF] border-[#00F0FF] text-white font-bold'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Square className="w-5 h-5" />
                <span>1:1 Post</span>
                <span className="text-[10px] text-slate-300">Feed IG/FB</span>
              </button>

              <button
                onClick={() => setSelectedFormat('9:16')}
                className={`p-3 rounded-xl border text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  selectedFormat === '9:16'
                    ? 'bg-[#0066FF] border-[#00F0FF] text-white font-bold'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span>9:16 Story</span>
                <span className="text-[10px] text-slate-300">TikTok/Reels</span>
              </button>

              <button
                onClick={() => setSelectedFormat('16:9')}
                className={`p-3 rounded-xl border text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  selectedFormat === '16:9'
                    ? 'bg-[#0066FF] border-[#00F0FF] text-white font-bold'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-5 h-5" />
                <span>16:9 Banner</span>
                <span className="text-[10px] text-slate-300">YouTube/Web</span>
              </button>
            </div>
          </div>

          {/* 3. Personalización de Nombre de Liga */}
          <div className="p-5 rounded-2xl bg-[#080F24]/80 border border-white/10 space-y-3">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              3. Nombre de tu Liga o Torneo (En Vivo)
            </label>
            <input
              type="text"
              value={leagueCustomName}
              onChange={(e) => setLeagueCustomName(e.target.value)}
              placeholder="Ej. Liga Deportiva Barrial Pichincha"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-[#00F0FF]"
            />
          </div>

          {/* 4. Copy Publicitario para Pauta */}
          <div className="p-5 rounded-2xl bg-[#080F24]/80 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Copy para Anuncios (Ads Copy)
              </label>
              <button
                onClick={handleCopyAdCopy}
                className="inline-flex items-center gap-1 text-xs text-[#00F0FF] hover:underline cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={4}
              value={selectedTemplate.adCopy}
              className="w-full p-3 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 text-[11px] font-mono leading-relaxed resize-none focus:outline-none"
            />
          </div>

        </div>

        {/* PANEL DERECHO: VISTA PREVIA DEL BANNER EN VIVO (7 COLUMNAS) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          <div className="w-full flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-mono text-slate-400">
              VISTA PREVIA EN VIVO ({selectedFormat})
            </span>
            <button
              onClick={handleDownloadBanner}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0066FF] hover:bg-[#0052cc] shadow-[0_0_20px_rgba(0,102,255,0.5)] flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-[#00F0FF]" />
              <span>Descargar Banner PNG</span>
            </button>
          </div>

          {/* Preview Canvas Container */}
          <div className="w-full max-w-md flex items-center justify-center p-4 rounded-3xl bg-[#020617] border border-white/10 shadow-2xl">
            
            <div 
              className={`relative w-full rounded-2xl overflow-hidden border border-[#00F0FF]/30 p-6 flex flex-col justify-between shadow-[0_0_40px_rgba(0,102,255,0.3)] transition-all ${
                selectedFormat === '1:1'
                  ? 'aspect-square'
                  : selectedFormat === '9:16'
                  ? 'aspect-[9/16]'
                  : 'aspect-video'
              }`}
              style={{
                background: 'radial-gradient(circle at 50% 30%, #051438 0%, #020617 100%)'
              }}
            >
              {/* Grid Lines */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{
                  backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
                  backgroundSize: '30px 30px'
                }}
              />

              {/* Header inside banner */}
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#0066FF] flex items-center justify-center text-xs font-black">
                      DV
                    </div>
                    <span className="font-extrabold text-sm tracking-wider text-white">DEPORVERSO</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#00F0FF]/15 text-[#00F0FF] text-[10px] font-mono border border-[#00F0FF]/30">
                    SaaS 2026
                  </span>
                </div>

                {/* Badge */}
                <div className="inline-block px-3 py-1 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF]/40 text-[#00F0FF] text-[10px] font-mono font-bold tracking-wide">
                  {selectedTemplate.badge}
                </div>

                {/* Headline */}
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {selectedTemplate.headline}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {selectedTemplate.subheadline}
                </p>
              </div>

              {/* Dynamic Content Box */}
              <div className="relative z-10 my-3 p-3.5 rounded-xl bg-[#080F24]/90 border border-white/10 space-y-1">
                <p className="text-[10px] font-mono text-[#00F0FF] uppercase">TORNEO CONFIGURADO:</p>
                <p className="text-sm font-bold text-white truncate">{leagueCustomName}</p>
                <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-300">
                  <span>✓ VAR 4K</span>
                  <span>✓ Vocalía Digital</span>
                  <span>✓ Carnets QR</span>
                </div>
              </div>

              {/* CTA Box */}
              <div className="relative z-10 p-3.5 rounded-2xl bg-[#0066FF] text-center space-y-1 shadow-[0_0_25px_rgba(0,102,255,0.7)]">
                <div className="text-xs font-black tracking-wide text-white uppercase">
                  {selectedTemplate.priceTag}
                </div>
                <div className="text-[10px] text-cyan-200 font-bold">
                  👉 Reclama tu cupo en: deporverso.com
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
