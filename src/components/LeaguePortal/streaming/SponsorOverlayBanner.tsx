import React, { useState, useEffect } from 'react';
import { Sparkles, Eye, Megaphone, Plus, X, ExternalLink, ChevronRight, BarChart3, Settings2 } from 'lucide-react';

export interface Sponsor {
  id: string;
  name: string;
  slogan: string;
  badge: string;
  color: string;
  logoEmoji: string;
  url?: string;
  impressions: number;
}

const DEFAULT_SPONSORS: Sponsor[] = [
  {
    id: 'sp-1',
    name: 'Banco Pichincha',
    slogan: 'En confianza siempre • Impulsando el Deporte Barrial',
    badge: 'Auspiciante Diamante',
    color: '#fbbf24',
    logoEmoji: '🏦',
    url: 'https://www.pichincha.com',
    impressions: 1420
  },
  {
    id: 'sp-2',
    name: 'Pilsener',
    slogan: 'La cerveza de los verdaderos campeones barriales',
    badge: 'Sponsor Oficial',
    color: '#ef4444',
    logoEmoji: '🍺',
    url: 'https://www.pilsener.ec',
    impressions: 2190
  },
  {
    id: 'sp-3',
    name: 'Electrolit Ecuador',
    slogan: 'Hidratación clínica para el máximo rendimiento en cancha',
    badge: 'Hidratador Oficial',
    color: '#06b6d4',
    logoEmoji: '⚡',
    url: 'https://electrolit.com',
    impressions: 980
  },
  {
    id: 'sp-4',
    name: 'Claro 5G',
    slogan: 'La red más rápida conectando cada gol al instante',
    badge: 'Conectividad Oficial',
    color: '#dc2626',
    logoEmoji: '📶',
    url: 'https://www.claro.com.ec',
    impressions: 1750
  }
];

interface SponsorOverlayBannerProps {
  isVisible: boolean;
  onToggleVisibility?: () => void;
}

export const SponsorOverlayBanner: React.FC<SponsorOverlayBannerProps> = ({
  isVisible,
  onToggleVisibility
}) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>(DEFAULT_SPONSORS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // New Sponsor Form State
  const [newSponsorName, setNewSponsorName] = useState<string>('');
  const [newSponsorSlogan, setNewSponsorSlogan] = useState<string>('');
  const [newSponsorEmoji, setNewSponsorEmoji] = useState<string>('⭐');
  const [newSponsorBadge, setNewSponsorBadge] = useState<string>('Auspiciante Local');

  // Rotate sponsors every 10 seconds
  useEffect(() => {
    if (!isVisible || !isRotating || sponsors.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const next = (prev + 1) % sponsors.length;
        // Increment impression count for this sponsor
        setSponsors(list =>
          list.map((sp, idx) => (idx === next ? { ...sp, impressions: sp.impressions + 1 } : sp))
        );
        return next;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [isVisible, isRotating, sponsors.length]);

  const currentSponsor = sponsors[currentIndex] || sponsors[0];

  const handleAddSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSponsorName.trim() || !newSponsorSlogan.trim()) return;

    const newSp: Sponsor = {
      id: `sp-${Date.now()}`,
      name: newSponsorName.trim(),
      slogan: newSponsorSlogan.trim(),
      badge: newSponsorBadge,
      color: '#38bdf8',
      logoEmoji: newSponsorEmoji || '⚽',
      impressions: 1
    };

    setSponsors(prev => [...prev, newSp]);
    setNewSponsorName('');
    setNewSponsorSlogan('');
    setShowConfigModal(false);
  };

  if (!isVisible || !currentSponsor) return null;

  return (
    <>
      {/* Lower-Third Broadcast TV Sponsor Overlay */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-auto flex items-end justify-between z-30 transition-all">
        <div className="flex items-center gap-3 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-2.5 sm:p-3 shadow-2xl max-w-lg animate-in slide-in-from-bottom duration-300">
          {/* Sponsor Logo / Emoji Badge */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-lg border border-white/20"
            style={{ backgroundColor: `${currentSponsor.color}25` }}
          >
            {currentSponsor.logoEmoji}
          </div>

          {/* Slogan and details */}
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-white font-mono">
                {currentSponsor.badge}
              </span>
              <span className="text-xs font-black text-white truncate">{currentSponsor.name}</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
              {currentSponsor.slogan}
            </p>
          </div>

          {/* Controls button for config & metrics */}
          <div className="flex items-center gap-1 shrink-0 border-l border-white/10 pl-2">
            <button
              onClick={() => setShowConfigModal(true)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Administrar Patrocinadores (Tarea 3)"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
            {currentSponsor.url && (
              <a
                href={currentSponsor.url}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-colors"
                title="Visitar Patrocinador"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Small live metrics badge on the bottom-right */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-black/85 backdrop-blur-md rounded-xl border border-white/10 text-[10px] text-slate-300 font-mono shadow-md">
          <Eye className="w-3 h-3 text-cyan-400" />
          <span>{currentSponsor.impressions.toLocaleString()} impactos en vivo</span>
        </div>
      </div>

      {/* Sponsor Manager & Metrics Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#090e1a] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl text-white space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Gestión de Auspiciantes (Tarea 3)</h4>
                  <p className="text-[11px] text-slate-400">Publicidad en vivo durante la transmisión</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of current sponsors */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">Auspiciantes en Rotación Activa:</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {sponsors.map((sp, idx) => (
                  <div
                    key={sp.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${
                      idx === currentIndex
                        ? 'bg-cyan-500/15 border-cyan-500/40 text-white'
                        : 'bg-white/5 border-white/5 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{sp.logoEmoji}</span>
                      <div>
                        <span className="font-bold block">{sp.name}</span>
                        <span className="text-[10px] text-slate-400">{sp.slogan}</span>
                      </div>
                    </div>
                    <div className="text-right font-mono text-[10px] text-cyan-400 shrink-0">
                      {sp.impressions} vistas
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Sponsor Form */}
            <form onSubmit={handleAddSponsor} className="bg-black/40 p-3.5 rounded-2xl border border-white/10 space-y-2.5 text-xs">
              <span className="font-bold text-slate-200 block">Añadir Nuevo Patrocinador a la Transmisión:</span>
              <div className="grid grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Empresa/Marca"
                  value={newSponsorName}
                  onChange={e => setNewSponsorName(e.target.value)}
                  className="col-span-3 bg-slate-950 border border-white/15 rounded-xl px-3 py-1.5 text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Emoji"
                  value={newSponsorEmoji}
                  onChange={e => setNewSponsorEmoji(e.target.value)}
                  className="col-span-1 text-center bg-slate-950 border border-white/15 rounded-xl px-2 py-1.5 text-white"
                />
              </div>
              <input
                type="text"
                placeholder="Eslogan o Mensaje Corto (ej: 'El mejor pollo asado del barrio')"
                value={newSponsorSlogan}
                onChange={e => setNewSponsorSlogan(e.target.value)}
                className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-1.5 text-white"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Patrocinador</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
