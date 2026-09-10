import React, { useState } from 'react';
import { SportCode } from '../../types';
import { SPORT_VISUAL_THEMES, SportVisualTheme } from '../../data/sportThemesData';
import { Trophy, ChevronRight, Sparkles, ArrowRight, Shield, Zap, CheckCircle2, Play, Eye, X, Maximize2 } from 'lucide-react';

interface ThematicSportsGalleryProps {
  onSelectSport: (sportCode: SportCode) => void;
  onNavigateTab: (tab: string) => void;
}

export const ThematicSportsGallery: React.FC<ThematicSportsGalleryProps> = ({
  onSelectSport,
  onNavigateTab
}) => {
  const [selectedSport, setSelectedSport] = useState<SportCode>('FUTBOL');
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; title: string; tag: string; description: string } | null>(null);
  const activeTheme: SportVisualTheme = SPORT_VISUAL_THEMES[selectedSport] || SPORT_VISUAL_THEMES.FUTBOL;

  const handleSportClick = (code: SportCode) => {
    setSelectedSport(code);
    onSelectSport(code);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Multideporte de Clase Mundial</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Imágenes & Atmósfera por Disciplina
        </h2>
        <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
          Cada deporte adapta su identidad visual, reglas de tiempo, puntuación y cobertura periodística con IA.
        </p>
      </div>

      {/* Sport Selector Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-[#0a0a0a]/90 backdrop-blur-md rounded-2xl border border-white/10 max-w-4xl mx-auto">
        {(Object.keys(SPORT_VISUAL_THEMES) as SportCode[]).map((code) => {
          const theme = SPORT_VISUAL_THEMES[code];
          const isSelected = selectedSport === code;

          return (
            <button
              key={code}
              type="button"
              onClick={() => handleSportClick(code)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? `bg-gradient-to-r ${theme.color.gradient} text-black shadow-lg scale-105 font-extrabold`
                  : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
              }`}
            >
              <span>{theme.badge.split(' ')[0]}</span>
              <span>{theme.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Sport Hero Card with High-Res Thematic Image */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0c0e12] shadow-2xl">
        {/* Background High-Res Image with Dark Dramatic Vignette */}
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          <img
            src={activeTheme.heroImage}
            alt={activeTheme.name}
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 opacity-70"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e12] via-[#0c0e12]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0e12] via-[#0c0e12]/40 to-transparent"></div>

          {/* Floating Category Badge */}
          <div className="absolute top-6 left-6 z-10">
            <span className="px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {activeTheme.badge}
            </span>
          </div>

          {/* Content Over Hero Banner */}
          <div className="absolute bottom-6 left-6 right-6 z-10 space-y-3">
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {activeTheme.name}
            </h3>
            <p className="text-sm sm:text-base text-white/80 max-w-2xl font-medium">
              {activeTheme.tagline}
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activeTheme.metrics.map((m, idx) => (
                <div key={idx} className="bg-black/70 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <span className="block text-[10px] text-white/50 uppercase font-bold tracking-wider">{m.label}</span>
                  <span className="text-xs sm:text-sm font-extrabold text-white">{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3 High-Res Photographic Action Panels for this Sport */}
        <div className="p-6 sm:p-8 bg-[#0a0c10] border-t border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-extrabold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Galería Visual de Cobertura en Tiempo Real</span>
            </h4>
            <span className="text-xs text-white/40 font-mono">Haz clic en una imagen para ampliar</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {activeTheme.actionImages.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedPhoto(img)}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#12161f] shadow-lg hover:border-emerald-500/50 hover:shadow-emerald-500/10 transition-all cursor-pointer"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-85"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                  <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    {img.tag}
                  </span>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 p-1.5 rounded-lg border border-white/20 text-white">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <h5 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                    {img.title}
                  </h5>
                  <p className="text-xs text-white/60 leading-relaxed">
                    {img.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Direct Navigation Links for this sport */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-white/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Reglamento adaptado con esquema JSONB compatible con actas arbitrales.</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigateTab('vocalia')}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <span>Abrir Mesa de Vocalía</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('tactics')}
                className="px-4 py-2.5 rounded-xl bg-[#181d24] hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-all cursor-pointer"
              >
                <span>Pizarra Táctica</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* High-Resolution Photo Viewer Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="bg-[#0a0c10] border border-white/15 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full bg-black">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 border border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-400 border border-emerald-500/30">
                {selectedPhoto.tag}
              </span>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white">
                  {selectedPhoto.title}
                </h3>
                <span className="text-xs font-mono text-white/50">
                  {activeTheme.name} • Cobertura Deporverso 4K
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                {selectedPhoto.description}
              </p>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/40">
                  Resolución nativa optimizada para transmisión en vivo y redes sociales.
                </span>
                <button
                  onClick={() => {
                    setSelectedPhoto(null);
                    onNavigateTab('vocalia');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Iniciar Partido de este Deporte</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
