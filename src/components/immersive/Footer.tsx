import React from 'react';
import { Globe, ExternalLink, Shield, Heart } from 'lucide-react';

interface FooterProps {
  onNavigateAct: (actNumber: 1 | 2 | 3 | 4) => void;
  onEnterPlatform: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateAct, onEnterPlatform }) => {
  return (
    <footer className="relative z-10 bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800/80">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-amber-300 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-white text-xs font-mono">
                  DV
                </div>
              </div>
              <span className="text-base font-black text-white tracking-wider font-sans">
                DEPORVERSO
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              "El universo digital donde cada club, jugador y aficionado tiene su lugar."
            </p>
            <div className="pt-1 text-[11px] font-mono text-cyan-400">
              Dominio principal: <strong>deporverso.com</strong>
            </div>
          </div>

          {/* Col 2: Los 4 Actos */}
          <div className="space-y-3">
            <h4 className="text-white font-mono font-bold text-xs uppercase tracking-wider">
              Experiencia Scrollytelling
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigateAct(1)}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Acto I: El Origen (Cancha de Tierra)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateAct(2)}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Acto II: El Despertar Digital
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateAct(3)}
                  className="hover:text-emerald-300 transition-colors text-left cursor-pointer"
                >
                  Acto III: El Ecosistema Profesional & VAR
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateAct(4)}
                  className="hover:text-indigo-300 transition-colors text-left cursor-pointer"
                >
                  Acto IV: El Multiverso & VR
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Ecosistema Deportivo */}
          <div className="space-y-3">
            <h4 className="text-white font-mono font-bold text-xs uppercase tracking-wider">
              Ecosistema
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onEnterPlatform}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Vocalía Digital en Cancha
                </button>
              </li>
              <li>
                <button
                  onClick={onEnterPlatform}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  VAR a la Carta & Hawk-Eye Edge
                </button>
              </li>
              <li>
                <button
                  onClick={onEnterPlatform}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Fan Zone & Crónicas con IA
                </button>
              </li>
              <li>
                <a
                  href="https://heroesdeldeporte.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>Héroes del Deporte</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Arquitectura y Certificación */}
          <div className="space-y-3">
            <h4 className="text-white font-mono font-bold text-xs uppercase tracking-wider">
              Arquitectura Digital
            </h4>
            <p className="text-slate-400 text-xs">
              Subdominios dedicados por liga y club con aislamiento multi-tenant y base de datos distribuida en Firebase Firestore.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Multi-tenant Cloud Ready</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 <strong>DeporVerso</strong> (deporverso.com). Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacidad</span>
            <span>Términos de Servicio</span>
            <span>Seguridad Biométrica</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
