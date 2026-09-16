import React from 'react';
import { 
  Radio, Trophy, Shield, Users, Camera, Layers, Calendar, 
  Sparkles, Lock, Database, ArrowRight, CheckCircle2, ChevronRight,
  ExternalLink, Zap, Activity
} from 'lucide-react';

export interface DeporversoSegment {
  id: string;
  tabKey: string;
  title: string;
  categoryBadge: string;
  shortDesc: string;
  icon: React.ReactNode;
  accentColor: string;
  highlightSpecs: string[];
}

export const DEPORVERSO_SEGMENTS: DeporversoSegment[] = [
  {
    id: 'seg-matches',
    tabKey: 'vocalia',
    title: 'Vocalía Digital & Partidos en Vivo',
    categoryBadge: 'OPERACIÓN EN CANCHA',
    shortDesc: 'Planilla digital en tiempo real con cronómetro oficial, goles, tarjetas, cambios y actas con firma digital.',
    icon: <Radio className="w-5 h-5" />,
    accentColor: '#06b6d4', // Cyan
    highlightSpecs: ['Cronómetro en vivo', 'Firma electrónica', 'Modo offline PWA']
  },
  {
    id: 'seg-league',
    tabKey: 'league',
    title: 'Administración de Liga & Tablas',
    categoryBadge: 'GOBERNANZA & FIXTURE',
    shortDesc: 'Generación automática de tablas de posiciones, cruces de fixture, cómputo de gol diferencia y sanciones.',
    icon: <Trophy className="w-5 h-5" />,
    accentColor: '#f59e0b', // Amber
    highlightSpecs: ['Fixture automatizado', 'Tablas en tiempo real', 'Tribunal de penas']
  },
  {
    id: 'seg-calendar',
    tabKey: 'calendar',
    title: 'Calendario Multideporte Integral',
    categoryBadge: 'PROGRAMACIÓN DE CANCHAS',
    shortDesc: 'Planificación de jornadas, asignación de escenarios deportivos y prevención de solapamientos horarios.',
    icon: <Calendar className="w-5 h-5" />,
    accentColor: '#eab308', // Yellow
    highlightSpecs: ['Control de escenarios', 'Notificaciones a delegados', 'Filtro por categoría']
  },
  {
    id: 'seg-players',
    tabKey: 'scouting',
    title: 'Scouting de Jugadores & Ficha Técnica',
    categoryBadge: 'TALENTO DE BASE',
    shortDesc: 'Tarjetas biométricas 3D, radar de habilidades, estadísticas de goleo y vitrina de proyección internacional.',
    icon: <Users className="w-5 h-5" />,
    accentColor: '#8b5cf6', // Purple
    highlightSpecs: ['Radar 3D de atributos', 'Historial de goles', 'Perfil scouting']
  },
  {
    id: 'seg-var',
    tabKey: 'var',
    title: 'Módulo VAR a la Carta & Hawk-Eye',
    categoryBadge: 'JUSTICIA DEPORTIVA',
    shortDesc: 'Videoarbitraje móvil para ligas formativas y barriales con revisión multicámara sincronizada en pantalla.',
    icon: <Camera className="w-5 h-5" />,
    accentColor: '#ef4444', // Red
    highlightSpecs: ['Multi-ángulo HD', 'Decisión en pantalla', 'Cero controversias']
  },
  {
    id: 'seg-tactics',
    tabKey: 'tactics',
    title: 'Pizarra Táctica Interactiva 3D/2D',
    categoryBadge: 'DIRECCIÓN TÉCNICA',
    shortDesc: 'Simulador táctico adaptable para Fútbol 11, 7, Fútsal, Baloncesto y Pádel con animación de jugadas.',
    icon: <Layers className="w-5 h-5" />,
    accentColor: '#38bdf8', // Light blue
    highlightSpecs: ['Multi-disciplina', 'Exportación de tácticas', 'Animación de pases']
  },
  {
    id: 'seg-vision-ai',
    tabKey: 'vision-ai',
    title: 'Visión Artificial Edge AI',
    categoryBadge: 'INTELIGENCIA DE CÁMARA',
    shortDesc: 'Detección automática de jugadas, mapa de calor y telemetría de jugadores con procesamiento local.',
    icon: <Zap className="w-5 h-5" />,
    accentColor: '#10b981', // Emerald
    highlightSpecs: ['Inferencia WebAssembly', 'Mapa de calor', 'Estadísticas de posesión']
  },
  {
    id: 'seg-heroes',
    tabKey: 'heroes-vr',
    title: 'Héroes VR: Inmersión & Realidad Virtual',
    categoryBadge: 'METAVERSO & XR',
    shortDesc: 'Entorno de estadio cósmico holográfico para visualización inmersiva en cascos de Realidad Virtual y 3D.',
    icon: <Sparkles className="w-5 h-5" />,
    accentColor: '#6366f1', // Indigo
    highlightSpecs: ['Cámara libre 360°', 'Tarjetas holográficas', 'Experiencia XR']
  },
  {
    id: 'seg-governance',
    tabKey: 'governance',
    title: 'Asambleas Virtuales & Notificaciones',
    categoryBadge: 'DEMOCRACIA DIGITAL',
    shortDesc: 'Votaciones telemáticas seguras, videoasambleas Jitsi y alertas masivas por WhatsApp a delegados.',
    icon: <Activity className="w-5 h-5" />,
    accentColor: '#14b8a6', // Teal
    highlightSpecs: ['Votación auditada', 'Alertas WhatsApp', 'Actas automáticas']
  },
  {
    id: 'seg-admin',
    tabKey: 'master-admin',
    title: 'Super Admin CRM & Clave 1326',
    categoryBadge: 'PANEL MAESTRO CONFIDENCIAL',
    shortDesc: 'Control de cobros anuales ($180 USD), activación de nuevas ligas en 60 segundos y atención al 0958610578.',
    icon: <Lock className="w-5 h-5" />,
    accentColor: '#f97316', // Orange
    highlightSpecs: ['Clave secreta 1326', 'CRM de ligas afiliadas', 'WhatsApp directo']
  }
];

interface DeporversoSegmentsDirectoryProps {
  onSelectTab: (tabKey: string) => void;
  onEnterFullPlatform: () => void;
  onOpenOnboarding?: () => void;
}

export const DeporversoSegmentsDirectory: React.FC<DeporversoSegmentsDirectoryProps> = ({
  onSelectTab,
  onEnterFullPlatform,
  onOpenOnboarding
}) => {
  return (
    <section 
      id="deporverso-segments-directory" 
      className="relative z-10 w-full max-w-6xl mx-auto my-16 px-4 text-left"
    >
      {/* Decorative Container Header */}
      <div className="bg-slate-950/80 border border-cyan-500/30 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 shadow-2xl shadow-cyan-950/40 relative overflow-hidden">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Header content */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wider">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>ARQUITECTURA INTEGRAL DEPORVERSO</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Todos los Segmentos y Pestañas de la Plataforma
            </h2>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              Al culminar la experiencia Scrollytelling, accede a la suite tecnológica más completa del deporte organizado. 
              Selecciona cualquier segmento para interactuar directamente o ingresa a la plataforma completa.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              id="btn-directory-enter-platform-top"
              onClick={onEnterFullPlatform}
              className="px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider bg-gradient-to-r from-[#00e676] via-[#00d2b4] to-[#00e5ff] hover:brightness-110 active:scale-95 text-slate-950 flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-500/25 transition-all cursor-pointer border border-emerald-300/40"
            >
              <span>ENTRA AL DEPORVERSO COMPLETO</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 stroke-[2.5]" />
            </button>

            {onOpenOnboarding && (
              <button
                onClick={onOpenOnboarding}
                className="px-5 py-3.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Afiliar mi Liga</span>
              </button>
            )}
          </div>
        </div>

        {/* 10 SEGMENTS BENTO GRID */}
        <div className="relative z-10 mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEPORVERSO_SEGMENTS.map((seg) => (
            <div
              key={seg.id}
              onClick={() => onSelectTab(seg.tabKey)}
              className="group relative p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-cyan-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Card Top Pill & Icon */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span 
                    className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full border"
                    style={{ 
                      borderColor: `${seg.accentColor}40`, 
                      color: seg.accentColor,
                      backgroundColor: `${seg.accentColor}10`
                    }}
                  >
                    {seg.categoryBadge}
                  </span>

                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110"
                    style={{ 
                      borderColor: `${seg.accentColor}40`,
                      backgroundColor: `${seg.accentColor}15`,
                      color: seg.accentColor
                    }}
                  >
                    {seg.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {seg.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-xs text-slate-400 leading-relaxed font-light line-clamp-2">
                  {seg.shortDesc}
                </p>

                {/* Mini specs chips */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {seg.highlightSpecs.map((spec, i) => (
                    <span 
                      key={i} 
                      className="text-[10px] font-mono text-slate-300 bg-black/40 px-2 py-0.5 rounded-md border border-white/5"
                    >
                      • {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action link */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-cyan-400 transition-colors">
                <span>Pestaña [{seg.tabKey}]</span>
                <span className="inline-flex items-center gap-1 font-bold">
                  Abrir Módulo
                  <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/40 p-5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Soporte y Asignación de Subdominios 24/7
              </h4>
              <p className="text-xs text-slate-400 font-light">
                Comunícate directamente con la administración oficial de DeporVerso al WhatsApp{' '}
                <strong className="text-emerald-400 font-mono font-bold">0958610578</strong>
              </p>
            </div>
          </div>

          <button
            id="btn-directory-enter-platform-bottom"
            onClick={onEnterFullPlatform}
            className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider bg-gradient-to-r from-[#00e676] via-[#00d2b4] to-[#00e5ff] hover:brightness-110 active:scale-95 text-slate-950 flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-500/25 transition-all cursor-pointer shrink-0 border border-emerald-300/40"
          >
            <span>ENTRA AL DEPORVERSO COMPLETO</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </section>
  );
};
