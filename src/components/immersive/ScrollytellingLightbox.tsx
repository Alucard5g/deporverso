import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, MapPin } from 'lucide-react';
import canchaTierraImg from '../../assets/images/acto1_cancha_tierra_1789418204541.jpg';
import despertarDigitalImg from '../../assets/images/acto2_despertar_digital_1789418217850.jpg';
import estadioVarImg from '../../assets/images/acto3_estadio_var_1789418234243.jpg';
import multiverseCosmicoImg from '../../assets/images/acto4_multiverso_cosmico_1789418246887.jpg';

export interface LightboxItem {
  actNumber: '01' | '02' | '03' | '04';
  title: string;
  subtitle: string;
  location: string;
  description: string;
  imageSrc: string;
  accent: string;
}

export const SCROLLYTELLING_GALLERY: LightboxItem[] = [
  {
    actNumber: '01',
    title: 'El Origen Barrial: La Cancha de Tierra',
    subtitle: 'Acto I — La génesis sobre la tierra y el barro',
    location: 'Cancha El Trébol • Archivo Fotográfico Barrial',
    description: 'Polvo suspendido bajo la luz del atardecer. Zapatos gastados, líneas de cal trazadas a mano y pasión sin filtros. En este suelo humilde nació la identidad que hoy impulsa al deporte hacia la era digital.',
    imageSrc: canchaTierraImg,
    accent: '#f59e0b',
  },
  {
    actNumber: '02',
    title: 'El Despertar Digital: De la Hoja a la Nube',
    subtitle: 'Acto II — Desmaterialización y telemetría en tiempo real',
    location: 'Matriz Cloud Multi-Tenant • Latencia 12ms',
    description: 'La transición histórica de la planilla de papel manchada por la lluvia a un sistema de datos estructurado en la nube. Cada jugada, sanción y gol queda registrado con inmediatez institucional.',
    imageSrc: despertarDigitalImg,
    accent: '#06b6d4',
  },
  {
    actNumber: '03',
    title: 'El Ecosistema Pro: Estadio y VAR a la Carta',
    subtitle: 'Acto III — Tecnología de élite al alcance de cada liga',
    location: 'Estadio Metropolitano • Sistema Hawk-Eye 3D',
    description: 'Reflectores de transmisión internacional, pantallas gigantes con telemetría en tiempo real y revisión de videoarbitraje. La democratización de la justicia deportiva en el fútbol formativo y barrial.',
    imageSrc: estadioVarImg,
    accent: '#10b981',
  },
  {
    actNumber: '04',
    title: 'El Multiverso Deportivo: Trascendencia y VR',
    subtitle: 'Acto IV — Convergencia cósmica del deporte global',
    location: 'Convergencia Multiversal • Ecosistema Héroes VR',
    description: 'La unión definitiva entre el atleta físico, su tarjeta biométrica 3D y el scouting global. Donde el talento de barrio se conecta con clubes de todo el mundo mediante realidad inmersiva.',
    imageSrc: multiverseCosmicoImg,
    accent: '#6366f1',
  },
];

interface ScrollytellingLightboxProps {
  currentIndex: number | null;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export const ScrollytellingLightbox: React.FC<ScrollytellingLightboxProps> = ({
  currentIndex,
  onClose,
  onSelectIndex,
}) => {
  useEffect(() => {
    if (currentIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        onSelectIndex((currentIndex + 1) % SCROLLYTELLING_GALLERY.length);
      }
      if (e.key === 'ArrowLeft') {
        onSelectIndex((currentIndex - 1 + SCROLLYTELLING_GALLERY.length) % SCROLLYTELLING_GALLERY.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, onClose, onSelectIndex]);

  if (currentIndex === null) return null;
  const current = SCROLLYTELLING_GALLERY[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectIndex((currentIndex - 1 + SCROLLYTELLING_GALLERY.length) % SCROLLYTELLING_GALLERY.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectIndex((currentIndex + 1) % SCROLLYTELLING_GALLERY.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 select-none"
      onClick={onClose}
    >
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between z-10" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          {SCROLLYTELLING_GALLERY.map((item, idx) => (
            <button
              key={item.actNumber}
              onClick={() => onSelectIndex(idx)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all cursor-pointer border ${
                idx === currentIndex
                  ? 'bg-white/10 text-white border-white/30 font-bold shadow-lg'
                  : 'text-white/40 border-transparent hover:text-white/80 hover:bg-white/5'
              }`}
            >
              Acto {item.actNumber}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          aria-label="Cerrar vista completa"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Center Image with Side Arrows */}
      <div
        className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handlePrev}
          aria-label="Imagen anterior"
          className="absolute left-2 sm:left-4 z-20 p-3 rounded-2xl bg-black/50 hover:bg-black/80 text-white/70 hover:text-white border border-white/10 backdrop-blur-md transition-all cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="relative max-h-[70vh] max-w-5xl w-full h-full flex items-center justify-center">
          <img
            src={current.imageSrc}
            alt={current.title}
            referrerPolicy="no-referrer"
            className="max-h-[70vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
          />
        </div>

        <button
          onClick={handleNext}
          aria-label="Imagen siguiente"
          className="absolute right-2 sm:right-4 z-20 p-3 rounded-2xl bg-black/50 hover:bg-black/80 text-white/70 hover:text-white border border-white/10 backdrop-blur-md transition-all cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Editorial Caption */}
      <div
        className="max-w-3xl mx-auto w-full text-center space-y-1 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-white/50 uppercase tracking-widest">
          <MapPin className="w-3 h-3" style={{ color: current.accent }} />
          <span>{current.location}</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          {current.title}
        </h3>
        <p className="text-xs sm:text-sm text-white/60 font-light leading-relaxed max-w-2xl mx-auto">
          {current.description}
        </p>
      </div>
    </div>
  );
};
