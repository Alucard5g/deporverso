import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Shield, 
  Video, 
  Zap, 
  Trophy, 
  Activity, 
  QrCode, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Sparkles, 
  Flame, 
  Eye, 
  Layers, 
  TrendingUp, 
  ChevronRight,
  ExternalLink,
  RotateCcw,
  Maximize2,
  Minimize2,
  Volume2,
  Tv,
  Radio,
  Sliders,
  Award,
  Camera,
  Crosshair,
  Play,
  Pause,
  FastForward,
  Rewind,
  Calculator,
  DollarSign,
  Users,
  Clock,
  Printer,
  Copy,
  Check,
  Tv2
} from 'lucide-react';
import { SportCode } from '../../types';
import { SPORTS_WEBP_CATALOG, SportWebpCard } from '../../data/sportsWebp';

export type CameraAngle = 'CAM_MAIN' | 'CAM_GOAL' | 'CAM_VAR';

const GOOGLE_DRIVE_VIDEO_PREVIEW_URL = "https://drive.google.com/file/d/1iuuXLfwDlk56MnlzZLTfMzqjsRmy3r374VT7LeiXLLw/preview";
const GOOGLE_DRIVE_DIRECT_URL = "https://drive.google.com/uc?id=1iuuXLfwDlk56MnlzZLTfMzqjsRmy3r374VT7LeiXLLw";
const GOOGLE_DRIVE_VIEW_URL = "https://drive.google.com/file/d/1iuuXLfwDlk56MnlzZLTfMzqjsRmy3r374VT7LeiXLLw/view";

export interface SportEcosystemModule {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  category: 'CANCHA' | 'OLIMPICO';
  sportCode: SportCode;
  iconSymbol: string;
  iconImage: string;
  bannerImage?: string;
  accentColor: string;
  secondaryColor: string;
  borderColor: string;
  hoverGlow: string;
  stats: {
    highlight: string;
    sublabel: string;
    uptime: string;
    precision: string;
  };
  features: Array<{
    title: string;
    description: string;
    badge: string;
  }>;
  tacticalTools: string[];
  pricingText: string;
  simulationData: {
    metricTitle: string;
    metricValue: string;
    telemetryLabel: string;
    telemetryStatus: string;
  };
}

export const ALL_SPORT_MODULES: SportEcosystemModule[] = [
  // 1. FÚTBOL PRO
  {
    id: 'futbol-pro',
    name: 'Fútbol Pro',
    subtitle: '11v11, Indor 7 & 9 • Reglamentario & Rápido',
    tag: 'REGLAMENTARIO CIG & BARRIAL',
    category: 'CANCHA',
    sportCode: 'FUTBOL',
    iconSymbol: '⚽',
    iconImage: '/sports/drive/futbol_sq.webp',
    bannerImage: '/sports/drive/futbol_original.jpg',
    accentColor: '#00F0FF',
    secondaryColor: '#10B981',
    borderColor: 'border-cyan-400/40 hover:border-cyan-400',
    hoverGlow: 'hover:shadow-[0_0_25px_rgba(0,240,255,0.4)]',
    stats: {
      highlight: '2,450+ Partidos',
      sublabel: 'Arbitrados en Vivo',
      uptime: '99.98%',
      precision: '0.4s Latencia VAR'
    },
    features: [
      {
        title: 'Sistema VAR Cuántico Multicámara',
        description: 'Repeticiones cuadro a cuadro de ultra baja latencia con líneas vectoriales para jugadas polémicas.',
        badge: 'CIG VAR 4K'
      },
      {
        title: 'Vocalía Digital & Acta Cero Papel',
        description: 'Acreditación de alineaciones por QR, control de cronómetro y actas firmadas criptográficamente.',
        badge: 'ANTIFRAUDE'
      },
      {
        title: 'Carnetización Holográfica QR',
        description: 'Verificación biométrica y pasaporte digital del deportista para erradicar la suplantación.',
        badge: 'TOKEN ÚNICO'
      },
      {
        title: 'Cronista Periodístico IA',
        description: 'Redacción periodística instantánea del partido con goles clave y estadísticas de posesión.',
        badge: 'IA GENERATIVA'
      }
    ],
    tacticalTools: [
      'Pizarra Táctica 2D Dinámica',
      'Detector de Fueras de Juego',
      'Tabla de Goleadores en Vivo',
      'Algoritmo Fair Play Automático'
    ],
    pricingText: 'Activar este módulo • Desde $25/mes',
    simulationData: {
      metricTitle: 'Velocidad de Disparo',
      metricValue: '118.4 km/h',
      telemetryLabel: 'VAR CHECK',
      telemetryStatus: 'GOL CONFIRMADO'
    }
  },

  // 2. BALONCESTO
  {
    id: 'baloncesto-oficial',
    name: 'Baloncesto',
    subtitle: 'Reglamento Oficial, Shot Clock 24s • Tablero Digital',
    tag: 'SHOT CLOCK OFICIAL',
    category: 'CANCHA',
    sportCode: 'BALONCESTO',
    iconSymbol: '🏀',
    iconImage: '/sports/drive/baloncesto_sq.webp',
    bannerImage: '/sports/drive/baloncesto_original.jpg',
    accentColor: '#F59E0B',
    secondaryColor: '#EF4444',
    borderColor: 'border-amber-400/40 hover:border-amber-400',
    hoverGlow: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]',
    stats: {
      highlight: '88.4 PPG Promedio',
      sublabel: 'Conferencia Oro',
      uptime: '100% Sincronizado',
      precision: '24s / 14s Reloj Oficial'
    },
    features: [
      {
        title: 'Shot Clock 24s & 14s Automatizado',
        description: 'Sincronización en milisegundos con bocina inalámbrica de posesión y tablero acrílico LED.',
        badge: 'RELOJ DE POSESIÓN'
      },
      {
        title: 'Control de Faltas Colectivas e Individuales',
        description: 'Marcador automático de bonus de equipo y límite de 5 faltas con alerta luminosa inmediata al DT.',
        badge: 'BONUS TRACK'
      },
      {
        title: 'Mapa de Calor de Tiros (Shot Chart)',
        description: 'Estadísticas de efectividad en tiros libres, dobles en la pintura y triples desde el perímetro.',
        badge: 'SHOT CHART'
      },
      {
        title: 'Planilla Oficial Digital CIG',
        description: 'Exportación a PDF con firmas digitales de comisario técnico y árbitros principales sin tachones.',
        badge: 'PLANILLA CERT'
      }
    ],
    tacticalTools: [
      'Rotaciones y Minutos por Jugador',
      'Box Score Avanzado (+/-)',
      'Gestión de Tiempos Fuertes (Timeouts)',
      'Carnet Digital Oficial Barrial'
    ],
    pricingText: 'Activar este módulo • Desde $25/mes',
    simulationData: {
      metricTitle: 'Efectividad en Triples',
      metricValue: '48.2% (12/25)',
      telemetryLabel: 'POSESIÓN CLOCK',
      telemetryStatus: '03.8s RESTANTES'
    }
  },

  // 3. TENIS & PÁDEL
  {
    id: 'tenis-padel',
    name: 'Tenis & Pádel',
    subtitle: 'Sets, Tiebreak • Ojo de Halcón VAR',
    tag: 'PÁDEL PRO CIG',
    category: 'CANCHA',
    sportCode: 'PADEL',
    iconSymbol: '🎾',
    iconImage: '/sports/drive/tennis_sq.webp',
    bannerImage: '/sports/drive/tennis_original.jpg',
    accentColor: '#10B981',
    secondaryColor: '#00F0FF',
    borderColor: 'border-emerald-400/40 hover:border-emerald-400',
    hoverGlow: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]',
    stats: {
      highlight: 'Punto de Oro Activo',
      sublabel: 'Reglamento Oficial CIG',
      uptime: '99.99%',
      precision: 'Milimétrico en Línea'
    },
    features: [
      {
        title: 'Ojo de Halcón Óptico para Líneas',
        description: 'Confirmación instantánea de pelotas dudosas (In/Out) en el alambre, cristal o fleje de fondo.',
        badge: 'HAWK-EYE'
      },
      {
        title: 'Punto de Oro & Tie-break Automático',
        description: 'Marcador interactivo con reglas oficiales de ventaja o muerte súbita a 7 o 10 puntos super tiebreak.',
        badge: 'GOLD POINT'
      },
      {
        title: 'Radar de Velocidad de Saque & Smash',
        description: 'Telemetría de servicio con medición balística en km/h y porcentaje de primeros servicios logrados.',
        badge: 'SMASH SPEED'
      },
      {
        title: 'Rankings por Parejas & Torneos Americanos',
        description: 'Cuadros de eliminación directa, consolación y cruces dinámicos para clubes y complejos privados.',
        badge: 'BRACKETS PRO'
      }
    ],
    tacticalTools: [
      'Contador de Errores No Forzados',
      'Mapeo de Globos y Remates por 3/por 4',
      'Reserva Automatizada de Pistas',
      'Carnet Digital de Pareja'
    ],
    pricingText: 'Activar este módulo • Desde $25/mes',
    simulationData: {
      metricTitle: 'Velocidad de Smash',
      metricValue: '142.0 km/h',
      telemetryLabel: 'LÍNEA DE FLEJE',
      telemetryStatus: 'PELOTA BUENA (IN)'
    }
  },

  // 4. C.I.G DEPORVERSO GAME
  {
    id: 'cig-deporverso-game',
    name: 'C.I.G Deporverso game',
    subtitle: 'Simulación Deportiva, Carreras & VR • Telemetría',
    tag: 'C.I.G GAME ARENA',
    category: 'CANCHA',
    sportCode: 'OTROS',
    iconSymbol: '🎮',
    iconImage: '/sports/cig_game.webp',
    accentColor: '#8B5CF6',
    secondaryColor: '#EC4899',
    borderColor: 'border-purple-400/40 hover:border-purple-400',
    hoverGlow: 'hover:shadow-[0_0_25px_rgba(139,92,246,0.4)]',
    stats: {
      highlight: '0.02s Delta Vuelta',
      sublabel: 'Simulación Competitiva CIG',
      uptime: '100% Cloud API',
      precision: 'Telemetría en Vivo'
    },
    features: [
      {
        title: 'Integración Telemétrica por WebSockets',
        description: 'Captura directa de tiempos de vuelta, rendimiento y telemetría de servidores en tiempo real.',
        badge: 'LIVE TELEMETRY'
      },
      {
        title: 'Comisariado Deportivo Virtual (Anti-Cut)',
        description: 'Sanciones automáticas por límites de pista, colisiones antirreglamentarias y penalizaciones digitales.',
        badge: 'RACE CONTROL'
      },
      {
        title: 'Overlays Dinámicos para Streaming',
        description: 'Gráficos broadcast profesionales en HTML5 con tabla de posiciones y clasificaciones actualizadas al segundo.',
        badge: 'STREAM HUD'
      },
      {
        title: 'Torneos Multiplataforma Integrados',
        description: 'Llaves suizas, fase de grupos y doble eliminación con comprobación de ID de jugador.',
        badge: 'COMPETITIVE ARENA'
      }
    ],
    tacticalTools: [
      'Comparador de Telemetría y Rendimiento',
      'Tablas de Clasificación Oficial en Vivo',
      'Gestión de Penalizaciones en Segundos',
      'Carnet Gamer Anti-Smurf'
    ],
    pricingText: 'Activar este módulo • Desde $25/mes',
    simulationData: {
      metricTitle: 'Tiempo de Vuelta Rápida',
      metricValue: '1:14.289 min',
      telemetryLabel: 'LÍMITES DE PISTA',
      telemetryStatus: 'VUELTA VÁLIDA (DELTA -0.18s)'
    }
  },

  // 5. ARTES MARCIALES
  {
    id: 'artes-marciales',
    name: 'Artes Marciales & MMA',
    subtitle: 'Taekwondo, Judo, Boxeo • Petos Electrónicos',
    tag: 'COMBAT CIG PRO',
    category: 'OLIMPICO',
    sportCode: 'OTROS',
    iconSymbol: '🥋',
    iconImage: '/sports/taekwondo.webp',
    accentColor: '#EF4444',
    secondaryColor: '#F59E0B',
    borderColor: 'border-red-400/40 hover:border-red-400',
    hoverGlow: 'hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]',
    stats: {
      highlight: '320 Julios Impacto',
      sublabel: 'Sensor Electrónico',
      uptime: '99.99%',
      precision: 'Milisegundo de Golpe'
    },
    features: [
      {
        title: 'Receptor Inalámbrico de Petos y Cascos',
        description: 'Puntuación instantánea por presión y proximidad magnética con validación según reglamento oficial.',
        badge: 'SENSOR PSS'
      },
      {
        title: 'Tarjeta de Apelación en Video (IVR)',
        description: 'Repetición multicámara en mesa central para revisión de técnicas al rostro pedidas por el coach.',
        badge: 'IVR REPLAY'
      },
      {
        title: 'Control de Penalizaciones (Gam-jeom)',
        description: 'Contador de salidas del tatami, agarres ilegales y acumulación de amonestaciones automáticas.',
        badge: 'GAM-JEOM'
      },
      {
        title: 'Cronómetro Oficial con Golden Round',
        description: 'Rounds de 2 minutos con muerte súbita computarizada por mayor volumen de toques técnicos.',
        badge: 'ROUND CLOCK'
      }
    ],
    tacticalTools: [
      'Radar de Frecuencia de Patadas y Puños',
      'Gestor de Pesaje Oficial y Categorías',
      'Árbol de Combates por División de Peso',
      'Pasaporte de Grado y Cinturón Marcial'
    ],
    pricingText: 'Activar este módulo • Desde $25/mes',
    simulationData: {
      metricTitle: 'Fuerza de Contacto',
      metricValue: '348 Joules',
      telemetryLabel: 'IVR VERDICT',
      telemetryStatus: 'PUNTO VÁLIDO CABEZA (+3)'
    }
  },

  // 6. NATACIÓN
  {
    id: 'natacion',
    name: 'Natación Olímpica',
    subtitle: 'Cronometraje Touch-Pad • Centésimas de Segundo',
    tag: 'NATACIÓN CIG PRO',
    category: 'OLIMPICO',
    sportCode: 'OTROS',
    iconSymbol: '🏊',
    iconImage: '/sports/natacion.webp',
    accentColor: '#06B6D4',
    secondaryColor: '#3B82F6',
    borderColor: 'border-cyan-400/40 hover:border-cyan-400',
    hoverGlow: 'hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]',
    stats: {
      highlight: '0.01s Desempate',
      sublabel: 'Placa de Toque Oficial',
      uptime: '100% Precisión',
      precision: '50m Carril Óptico'
    },
    features: [
      {
        title: 'Placas de Toque Digitales de Pared',
        description: 'Detección de llegada por contacto de presión electrónica sin error de paralaje humano a la centésima.',
        badge: 'TOUCH PAD'
      },
      {
        title: 'Frecuencia de Brazada & Hidrodinámica',
        description: 'Cálculo de brazadas por minuto (SPM), tiempo de viraje subacuático y eficiencia de patada.',
        badge: 'STROKE RATE'
      },
      {
        title: 'Splits Parciales en Vivo por Cada 50m',
        description: 'Tiempos divididos para estilos Libre, Espalda, Pecho y Mariposa transmitidos a pantallas LED del coliseo.',
        badge: 'SPLIT SPLASH'
      },
      {
        title: 'Semáforo de Salida Antifalsas Salidas',
        description: 'Sensor de reacción en el partidor con tolerancia de 0.100s reglamentaria oficial.',
        badge: 'START BLOCK'
      }
    ],
    tacticalTools: [
      'Analizador de Virajes y Fases de Nado',
      'Calculadora de Ritmo Cardíaco Acuático',
      'Asignación de Carriles por Tiempos Semilla',
      'Carnet del Nadador Federado'
    ],
    pricingText: 'Activar este módulo • Desde $25/mes',
    simulationData: {
      metricTitle: 'Tiempo Split 50m',
      metricValue: '21.84 seg',
      telemetryLabel: 'PLACA DE TOQUE',
      telemetryStatus: 'RÉCORD DE PISCINA'
    }
  },

  // 7. ATLETISMO
  {
    id: 'atletismo',
    name: 'Atletismo & Pista',
    subtitle: 'Sprint 100m, Relevos • Fotofinish Cuántico',
    tag: 'ATLETISMO CIG PRO',
    category: 'OLIMPICO',
    sportCode: 'OTROS',
    iconSymbol: '🏃',
    iconImage: '/sports/atletismo.webp',
    accentColor: '#EAB308',
    secondaryColor: '#F97316',
    borderColor: 'border-yellow-400/40 hover:border-yellow-400',
    hoverGlow: 'hover:shadow-[0_0_25px_rgba(234,179,8,0.4)]',
    stats: {
      highlight: '43.8 km/h',
      sublabel: 'Velocidad Punta Sprint',
      uptime: '10,000 FPS',
      precision: 'Cámara Fotofinish'
    },
    features: [
      {
        title: 'Cámara de Fotofinish de 10,000 Líneas/Seg',
        description: 'Desempate fotográfico al milímetro en la línea de meta para carreras de 100m, 200m y 400m vallas.',
        badge: 'PHOTO FINISH'
      },
      {
        title: 'Tacos de Salida con Sensor de Presión',
        description: 'Detección inmediata de salidas nulas con tiempo de reacción computarizado en milisegundos.',
        badge: 'FALSE START'
      },
      {
        title: 'Velocímetro Radar de Tramo (V-Max)',
        description: 'Curva de aceleración continua registrando el pico de velocidad entre los 60m y los 80m de la pista.',
        badge: 'ACCELERATION'
      },
      {
        title: 'Medición de Viento Digital (Anemómetro)',
        description: 'Lectura automatizada de viento a favor (+m/s) sincronizada con la validez de los récords.',
        badge: 'WIND SENSOR'
      }
    ],
    tacticalTools: [
      'Comparativa de Zancada y Cadencia',
      'Pizarra de Asignación de Carriles 1-8',
      'Calculadora de Relevos 4x100m (Zona de Testigo)',
      'Pasaporte del Atleta de Alto Rendimiento'
    ],
    pricingText: 'Activar este módulo • Desde $25/mes',
    simulationData: {
      metricTitle: 'Cronómetro Centesimal',
      metricValue: '09.84 seg',
      telemetryLabel: 'FOTOFINISH CIG',
      telemetryStatus: 'VICTORIA OFICIAL (+1.2 m/s)'
    }
  },

  // 8. VOLEIBOL & ECUAVOLEY
  {
    id: 'voleibol',
    name: 'Voleibol & Ecuavoley',
    subtitle: 'Red Alta 2.43m, 6v6 & 3v3 • Remate Cuántico',
    tag: 'VOLEIBOL CIG & TRADICIÓN',
    category: 'OLIMPICO',
    sportCode: 'VOLEIBOL',
    iconSymbol: '🏐',
    iconImage: '/sports/voleibol.webp',
    accentColor: '#3B82F6',
    secondaryColor: '#00F0FF',
    borderColor: 'border-blue-400/40 hover:border-blue-400',
    hoverGlow: 'hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]',
    stats: {
      highlight: '3.38m Altura Salto',
      sublabel: 'Bloqueo & Remate',
      uptime: '100% Sincronizado',
      precision: 'Cámara Retén en Red'
    },
    features: [
      {
        title: 'Detección de Toque de Red & Antena por Cámara',
        description: 'Sensor óptico lateral que alerta toques antirreglamentarios en la malla o invasión de campo contrario.',
        badge: 'NET TOUCH'
      },
      {
        title: 'Adaptabilidad para Ecuavoley (3 vs 3)',
        description: 'Reglamento flexible con batida, puesta de balón, bola alzada y control de ganchador, volador y servidor.',
        badge: 'ECUAVOLEY 3V3'
      },
      {
        title: 'Radar de Velocidad de Saque & Remate',
        description: 'Medición balística del remate superando los 100 km/h y análisis del ángulo de impacto en la madera.',
        badge: 'SPIKE SPEED'
      },
      {
        title: 'Rotación de Posiciones y Libero Tracker',
        description: 'Alineación de 6 jugadores con verificación de faltas de posición antes del saque oficial.',
        badge: 'ROTACIÓN 1-6'
      }
    ],
    tacticalTools: [
      'Mapeo de Zonas de Ataque y Recepción',
      'Planilla de Set y Puntos con Tie-break 15 pts',
      'Evaluación de Eficiencia de Bloqueos',
      'Carnet Oficial del Jugador de Vóley'
    ],
    pricingText: 'Activar este módulo • Desde $25/mes',
    simulationData: {
      metricTitle: 'Velocidad de Remate',
      metricValue: '108.6 km/h',
      telemetryLabel: 'ZONA DE IMPACTO',
      telemetryStatus: 'PUNTO DIRECTO (EN LÍNEA)'
    }
  }
];

interface CyberSportEcosystemStageProps {
  onSelectSport?: (sport: SportCode) => void;
  onNavigateTab?: (tab: string) => void;
  onOpenCheckout?: () => void;
}

export const CyberSportEcosystemStage: React.FC<CyberSportEcosystemStageProps> = ({
  onSelectSport,
  onNavigateTab,
  onOpenCheckout
}) => {
  const [selectedSportIndex, setSelectedSportIndex] = useState<number>(0);
  const [activeModalModule, setActiveModalModule] = useState<SportEcosystemModule | null>(null);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'core' | 'catalog'>('core');
  const [catalogFilter, setCatalogFilter] = useState<string>('ALL');
  const [activeCamera, setActiveCamera] = useState<CameraAngle>('CAM_MAIN');
  const [varFrameOffset, setVarFrameOffset] = useState<number>(0);
  const [isPlayingVar, setIsPlayingVar] = useState<boolean>(true);
  const [isSlowMo, setIsSlowMo] = useState<boolean>(false);
  const [cameraTransitioning, setCameraTransitioning] = useState<boolean>(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const handleSwitchCamera = (cam: CameraAngle) => {
    if (cam === activeCamera) return;
    setCameraTransitioning(true);
    setTimeout(() => {
      setActiveCamera(cam);
      setCameraTransitioning(false);
    }, 120);
  };

  // Selected sport module
  const currentSport = useMemo(() => {
    return ALL_SPORT_MODULES[selectedSportIndex] || ALL_SPORT_MODULES[0];
  }, [selectedSportIndex]);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalModule(null);
        if (isFullscreen) {
          setIsFullscreen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const handleSelectSport = (index: number) => {
    setSelectedSportIndex(index);
    if (onSelectSport) {
      onSelectSport(ALL_SPORT_MODULES[index].sportCode);
    }
  };

  const handleReloadVideo = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleToggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(() => {
        setIsFullscreen(!isFullscreen);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleActivateFromModal = (module: SportEcosystemModule) => {
    if (onSelectSport) {
      onSelectSport(module.sportCode);
    }
    setActiveModalModule(null);
    if (onOpenCheckout) {
      onOpenCheckout();
    } else if (onNavigateTab) {
      onNavigateTab('league');
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto my-6 select-none font-sans space-y-6">
      
      {/* ======================================================== */}
      {/* ENCABEZADO SUPERIOR MODERNO - TRANSMISIÓN DEPORTIVA CIG */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-3 h-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </div>
          <div>
            <span className="text-xs font-mono font-black tracking-wider text-cyan-400 uppercase">
              DEPORVERSO BROADCAST CENTER
            </span>
            <span className="text-slate-500 mx-2 text-xs">|</span>
            <span className="text-xs font-mono text-slate-300">
              Transmisión Oficial en Vivo CIG 4K
            </span>
          </div>
        </div>

        {/* Acciones directas y estado */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-[11px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">SEÑAL ULTRA HD</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ESCENARIO PRINCIPAL: VIDEO CENTRADO Y DE ALTO IMPACTO    */}
      {/* ======================================================== */}
      <div 
        ref={videoContainerRef}
        className={`relative w-full rounded-3xl overflow-hidden border border-cyan-500/30 bg-[#030712] shadow-[0_0_60px_rgba(0,102,255,0.25)] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 transition-all ${
          isFullscreen ? 'p-0 h-screen rounded-none' : ''
        }`}
      >
        {/* Fondo ambient lighting estático (sin animaciones bruscas) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,rgba(0,102,255,0.22),transparent_75%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00F0FF08_1px,transparent_1px),linear-gradient(to_bottom,#00F0FF08_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        {/* CONTENEDOR MAESTRO DEL VIDEO - COMPLETAMENTE CENTRADO */}
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
          
          {/* BARRA DE SELECCIÓN MULTI-CÁMARA SINCRONIZADA CON COLORES DEPORVERSO */}
          <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#050B1A] border border-[#00F0FF]/30 shadow-lg backdrop-blur-md">
              <button
                type="button"
                onClick={() => handleSwitchCamera('CAM_MAIN')}
                className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeCamera === 'CAM_MAIN'
                    ? 'bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-slate-950 font-black shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                    : 'text-slate-400 hover:text-cyan-300 hover:bg-white/5'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>CAM 01: Principal 4K</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchCamera('CAM_GOAL')}
                className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeCamera === 'CAM_GOAL'
                    ? 'bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-slate-950 font-black shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                    : 'text-slate-400 hover:text-cyan-300 hover:bg-white/5'
                }`}
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>CAM 02: Arco & Gol</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchCamera('CAM_VAR')}
                className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeCamera === 'CAM_VAR'
                    ? 'bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-slate-950 font-black shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                    : 'text-slate-400 hover:text-cyan-300 hover:bg-white/5'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>CAM 03: Cabina VAR</span>
              </button>
            </div>

            {/* Selector de Slow Motion y Capacitación Arbitral */}
            <div className="flex items-center gap-2">
              {activeCamera === 'CAM_VAR' && (
                <button
                  type="button"
                  onClick={() => setIsSlowMo(!isSlowMo)}
                  className={`px-2.5 py-1.5 rounded-lg font-mono text-[10px] font-black border transition-all cursor-pointer ${
                    isSlowMo 
                      ? 'bg-cyan-500/20 text-[#00F0FF] border-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                      : 'bg-[#050B1A] text-slate-400 border-[#00F0FF]/30 hover:text-white'
                  }`}
                >
                  {isSlowMo ? 'SLOW-MO 0.5X ACTIVO' : 'VELOCIDAD NORMAL 1.0X'}
                </button>
              )}
            </div>
          </div>

          {/* CHASIS ULTRA MODERNO DEL REPRODUCTOR */}
          <div className={`relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-black border-2 shadow-[0_0_50px_rgba(0,240,255,0.35)] group transition-all duration-200 ${
            cameraTransitioning ? 'opacity-40 scale-[0.99] filter brightness-150' : 'opacity-100 scale-100'
          } ${
            activeCamera === 'CAM_MAIN' ? 'border-cyan-400/50' : activeCamera === 'CAM_GOAL' ? 'border-amber-400/50' : 'border-emerald-400/50'
          }`}>
            
            {/* Barra superior HUD del reproductor */}
            <div className="absolute top-0 inset-x-0 z-30 p-3 sm:p-4 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600/90 text-white font-mono text-[10px] font-black uppercase tracking-wider shadow">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  EN VIVO
                </span>
                <span className={`px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border font-mono text-[10px] font-bold ${
                  activeCamera === 'CAM_MAIN' 
                    ? 'border-cyan-500/40 text-cyan-300' 
                    : activeCamera === 'CAM_GOAL'
                    ? 'border-amber-500/40 text-amber-300'
                    : 'border-emerald-500/40 text-emerald-300'
                }`}>
                  {activeCamera === 'CAM_MAIN' && 'CAM 01 • TRANSMISIÓN PRINCIPAL 4K'}
                  {activeCamera === 'CAM_GOAL' && 'CAM 02 • ÁNGULO DE ARCO Y LÍNEA DE GOL'}
                  {activeCamera === 'CAM_VAR' && 'CAM 03 • CABINA DE REVISIÓN VAR & FUERA DE JUEGO'}
                </span>
              </div>

              {/* Botones de control en la esquina superior derecha */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReloadVideo}
                  className="p-1.5 rounded-lg bg-black/75 hover:bg-black text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/50 transition-all cursor-pointer"
                  title="Recargar transmisión"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleToggleFullscreen}
                  className="p-1.5 rounded-lg bg-black/75 hover:bg-black text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/50 transition-all cursor-pointer"
                  title="Pantalla completa"
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* CONTENIDO SEGÚN LA CÁMARA SELECCIONADA */}
            {activeCamera === 'CAM_MAIN' && (
              <iframe
                key={iframeKey}
                src={`${GOOGLE_DRIVE_VIDEO_PREVIEW_URL}?autoplay=1`}
                title="Video Oficial DeporVerso Fútbol Pro"
                className="w-full h-full object-cover bg-black border-0"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
            )}

            {/* VISTA CÁMARA 2: DETRÁS DEL ARCO & TECNOLOGÍA LÍNEA DE GOL */}
            {activeCamera === 'CAM_GOAL' && (
              <div className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
                <img 
                  src="/sports/drive/futbol_original.jpg" 
                  alt="Ángulo de Arco y Área" 
                  className="absolute inset-0 w-full h-full object-cover filter brightness-75 contrast-125"
                />
                
                {/* Overlay Táctico de Arco y Mira Balística */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/60">
                  {/* Retícula Balística Central */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-amber-400/40 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b]" />
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-amber-400/30" />
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-amber-400/30" />
                  </div>

                  {/* Línea de Gol Láser Calibrada */}
                  <div className="absolute bottom-16 inset-x-8 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b]">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/90 border border-amber-400 text-amber-300 font-mono text-[9px] font-bold">
                      LÍNEA DE GOL: DETECCIÓN ÓPTICA CALIBRADA
                    </div>
                  </div>

                  {/* Cuadro de Telemetría Flotante */}
                  <div className="absolute top-16 left-6 p-3 rounded-xl bg-black/85 backdrop-blur-md border border-amber-400/50 font-mono text-[10px] space-y-1 shadow-2xl">
                    <p className="text-amber-400 font-bold uppercase tracking-wider">TELEMETRÍA DE REMATE</p>
                    <p className="text-white">Velocidad: <span className="font-bold text-amber-300">118.4 km/h</span></p>
                    <p className="text-white">Ángulo: <span className="font-bold text-amber-300">Escuadra Superior 14°</span></p>
                    <p className="text-emerald-400 font-bold">ESTADO: GOL VÁLIDO (BALÓN REBASÓ 16.3 CM)</p>
                  </div>
                </div>

                {/* Badge en vivo de Tecnología de Línea */}
                <div className="absolute bottom-14 right-6 z-20 pointer-events-auto">
                  <div className="px-3 py-1.5 rounded-xl bg-black/90 border border-amber-400/60 shadow-lg text-right font-mono">
                    <span className="text-[9px] text-amber-300 uppercase block font-bold">CIG GOAL-LINE TECH</span>
                    <span className="text-xs font-black text-emerald-400">DECISIÓN: GOL CONFIRMADO</span>
                  </div>
                </div>
              </div>
            )}

            {/* VISTA CÁMARA 3: CABINA VAR & TRAZADO VECTORIAL DE LÍNEAS */}
            {activeCamera === 'CAM_VAR' && (
              <div className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
                <img 
                  src="/sports/drive/futbol_original.jpg" 
                  alt="Cabina VAR Calibración" 
                  className="absolute inset-0 w-full h-full object-cover filter brightness-70 contrast-110 saturate-75"
                />

                {/* Trazado Vectorial de Líneas VAR */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Línea Defensiva Roja */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 shadow-[0_0_12px_#ef4444]"
                    style={{ left: `${52 + varFrameOffset * 0.4}%` }}
                  >
                    <span className="absolute top-20 -left-12 px-2 py-0.5 rounded bg-red-600/90 text-white font-mono text-[9px] font-bold">
                      DEFENSOR: 24.80m
                    </span>
                  </div>

                  {/* Línea Atacante Azul */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_12px_#00f0ff]"
                    style={{ left: `${50 + varFrameOffset * 0.4}%` }}
                  >
                    <span className="absolute top-28 -left-12 px-2 py-0.5 rounded bg-cyan-500/90 text-black font-mono text-[9px] font-bold">
                      ATACANTE: 24.62m
                    </span>
                  </div>

                  {/* Grilla isométrica de calibración */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#00F0FF0A_1px,transparent_1px),linear-gradient(to_bottom,#00F0FF0A_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
                </div>

                {/* Panel Flotante de Decisión Arbitral */}
                <div className="absolute top-16 right-6 p-3 rounded-xl bg-black/85 backdrop-blur-md border border-emerald-400/50 font-mono text-[10px] space-y-1 shadow-2xl z-20 pointer-events-auto">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>CALIBRACIÓN OFFSIDE</span>
                  </div>
                  <p className="text-white">Diferencia: <span className="text-emerald-300 font-bold">+18.0 cm (HABILITADO)</span></p>
                  <p className="text-slate-300">Punto de impacto de balón: <span className="text-cyan-300 font-bold">FRAME #842</span></p>
                  <div className="pt-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold text-[9px]">
                      DECISIÓN CIG: JUGADA LÍCITA
                    </span>
                  </div>
                </div>

                {/* Barra de control de cuadros jog dial para árbitros */}
                <div className="absolute bottom-12 inset-x-4 sm:inset-x-12 p-2 rounded-2xl bg-black/90 backdrop-blur-md border border-cyan-500/30 flex items-center justify-between gap-2 z-20 pointer-events-auto">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setVarFrameOffset(prev => prev - 5)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono cursor-pointer"
                      title="-5 cuadros"
                    >
                      -5f
                    </button>
                    <button
                      type="button"
                      onClick={() => setVarFrameOffset(prev => prev - 1)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                      title="-1 cuadro"
                    >
                      <Rewind className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPlayingVar(!isPlayingVar)}
                      className="p-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold cursor-pointer"
                      title={isPlayingVar ? 'Pausar' : 'Reproducir'}
                    >
                      {isPlayingVar ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setVarFrameOffset(prev => prev + 1)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                      title="+1 cuadro"
                    >
                      <FastForward className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setVarFrameOffset(prev => prev + 5)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono cursor-pointer"
                      title="+5 cuadros"
                    >
                      +5f
                    </button>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="text-slate-400">TIMECODE:</span>
                    <span className="text-cyan-300 font-bold">00:34:12.{840 + varFrameOffset * 16}ms</span>
                    <button
                      type="button"
                      onClick={() => setVarFrameOffset(0)}
                      className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Barra inferior HUD con enlace directo transparente al pasar el mouse */}
            <div className="absolute bottom-0 inset-x-0 z-20 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-200">
                <span className="font-bold text-white">DEPORVERSO BROADCAST CIG</span>
                <span className="text-slate-500">•</span>
                <span className="text-cyan-400 font-semibold hidden sm:inline">
                  {activeCamera === 'CAM_MAIN' && 'Señal Principal de Video HD'}
                  {activeCamera === 'CAM_GOAL' && 'Sensor de Área y Radar Balístico'}
                  {activeCamera === 'CAM_VAR' && 'Consola Oficial de Capacitación Arbitral'}
                </span>
              </div>
            </div>

          </div>

          {/* TELEMETRÍA Y CONTROLES DEL BROADCAST INFERIOR */}
          <div className="w-full mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-center">
            <div className="p-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Resolución</span>
              <span className="text-xs sm:text-sm font-black text-cyan-300 mt-0.5">4K Ultra HD</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Cuadros/Seg</span>
              <span className="text-xs sm:text-sm font-black text-white mt-0.5">60 FPS Fluido</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Latencia VAR</span>
              <span className="text-xs sm:text-sm font-black text-emerald-400 mt-0.5">0.4 seg CIG</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Procesador</span>
              <span className="text-xs sm:text-sm font-black text-amber-300 mt-0.5">CIG Neural Core</span>
            </div>
          </div>

        </div>

        {/* BADGE CENTRAL INFERIOR DEPORVERSO CORE V2.4 */}
        <div className="mt-6 flex items-center justify-center">
          <div className="px-5 py-2 rounded-full bg-[#080F24]/90 backdrop-blur-2xl border border-[#00F0FF]/40 shadow-[0_0_30px_rgba(0,240,255,0.35)] flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-white font-extrabold flex items-center gap-1.5">
              <span>DEPORVERSO CORE V2.4</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[11px] text-[#00F0FF] font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>99.99% Uptime</span>
            </span>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* SELECTOR INTERACTIVO Y ELEGANTE DE DISCIPLINAS DEPORTIVAS */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-white tracking-wide">
                Disciplinas Integradas al Ecosistema
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold">
                Íconos Oficiales HD
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Haz clic en cualquier deporte para explorar su módulo técnico, telemetría y activar su licencia.
            </p>
          </div>

          {/* Botones de alternancia de vista con Colores Oficiales Deporverso */}
          <div className="flex items-center gap-1.5 p-1 bg-[#050B1A] rounded-xl border border-[#00F0FF]/30 text-xs self-stretch sm:self-auto justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <button
              onClick={() => setViewMode('core')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                viewMode === 'core'
                  ? 'bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-slate-950 font-black shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-white/5'
              }`}
            >
              8 Disciplinas Insignia
            </button>
            <button
              onClick={() => setViewMode('catalog')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                viewMode === 'catalog'
                  ? 'bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-slate-950 font-black shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-white/5'
              }`}
            >
              Catálogo Completo (24)
            </button>
          </div>
        </div>

        {/* VISTA 1: 8 DISCIPLINAS INSIGNIA CON ÍCONOS ADAPTADOS AL TAMAÑO DEL BOTÓN Y TÍTULO AL PIE */}
        {viewMode === 'core' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {ALL_SPORT_MODULES.map((module, idx) => {
              const isSelected = idx === selectedSportIndex;
              return (
                <div
                  key={module.id}
                  onClick={() => {
                    handleSelectSport(idx);
                    setActiveModalModule(module);
                  }}
                  className={`relative group overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-44 sm:h-48 w-full ${
                    isSelected
                      ? 'bg-[#080F24] border-[#00F0FF] shadow-[0_0_30px_rgba(0,240,255,0.55)] ring-2 ring-[#00F0FF]/60 scale-[1.03]'
                      : 'bg-[#050B1A]/95 border-[#00F0FF]/30 hover:border-[#00F0FF] hover:bg-[#08122B] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-[1.03]'
                  }`}
                >
                  {/* Resplandor ambiental de fondo Deporverso */}
                  <div 
                    className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 35%, rgba(0, 240, 255, 0.4), transparent 70%)`
                    }}
                  />

                  {/* Badge superior de categoría / CIG status */}
                  <div className="relative z-10 w-full p-2 flex items-center justify-between pointer-events-none">
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[#00F0FF] border border-[#00F0FF]/40 font-bold uppercase tracking-wider">
                      {module.tag.split(' ')[0]}
                    </span>
                    {isSelected ? (
                      <span className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] animate-pulse" />
                    ) : (
                      <span className="text-[9px] font-mono text-cyan-400/60 font-bold">CIG</span>
                    )}
                  </div>

                  {/* CUERPO DEL BOTÓN: LA IMAGEN ES EL ÍCONO */}
                  <div className="relative z-10 w-full flex-1 flex items-center justify-center p-2.5 overflow-hidden">
                    <img 
                      src={module.iconImage} 
                      alt={module.name} 
                      className="w-full h-full max-h-24 object-contain filter drop-shadow-[0_0_16px_rgba(0,240,255,0.5)] transition-transform duration-300 group-hover:scale-115"
                      loading="lazy"
                    />
                  </div>

                  {/* PIE DEL BOTÓN: TÍTULO Y ETIQUETA AL PIE CON FONDO DE ALTO CONTRASTE */}
                  <div className="relative z-10 w-full py-2 px-1.5 bg-gradient-to-t from-[#020612] via-[#050B1A] to-transparent border-t border-[#00F0FF]/25 backdrop-blur-md flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-black text-white group-hover:text-[#00F0FF] transition-colors uppercase tracking-wide truncate w-full block">
                      {module.name}
                    </span>
                    <span className="text-[9px] font-mono text-[#00F0FF] font-bold tracking-wider truncate w-full block mt-0.5">
                      Ver Módulo ↗
                    </span>
                  </div>

                  {/* Barra de acento inferior luminosa cuando está seleccionado */}
                  {isSelected && (
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-[#0066FF] via-[#00F0FF] to-[#0066FF] shadow-[0_0_12px_#00F0FF]" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* VISTA 2: CATÁLOGO COMPLETO DE 24 DEPORTES CON ÍCONOS ADAPTADOS Y TÍTULO AL PIE */}
        {viewMode === 'catalog' && (
          <div className="space-y-3">
            {/* Filtros de Categoría para el Catálogo con Colores Deporverso */}
            <div className="flex flex-wrap items-center gap-1.5 px-1">
              {[
                { id: 'ALL', label: 'Todos (24)' },
                { id: 'CANCHA', label: 'Cancha y Pista' },
                { id: 'CAMPO', label: 'Campo Abierto' },
                { id: 'COMBATE', label: 'Deportes de Combate' },
                { id: 'AGUA_RUEDAS', label: 'Acuáticos y Ruedas' },
                { id: 'PRECISION', label: 'Precisión y Fuerza' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCatalogFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    catalogFilter === cat.id
                      ? 'bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-slate-950 font-black shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                      : 'bg-[#050B1A]/80 text-slate-400 hover:text-cyan-300 border border-white/10 hover:border-[#00F0FF]/40'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Grid de 24 Deportes con Íconos Adaptados al Botón y Título al Pie */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 max-h-[460px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-cyan-500/30">
              {SPORTS_WEBP_CATALOG
                .filter((sport) => catalogFilter === 'ALL' || sport.category === catalogFilter)
                .map((sport) => {
                  // Buscar si tiene módulo homologado
                  const matchedModule = ALL_SPORT_MODULES.find(m => m.sportCode.toLowerCase() === sport.id.toLowerCase() || m.id.includes(sport.id));

                  return (
                    <div
                      key={sport.id}
                      onClick={() => {
                        if (matchedModule) {
                          setActiveModalModule(matchedModule);
                        } else {
                          // Sintetizar módulo para la disciplina del catálogo
                          setActiveModalModule({
                            id: sport.id,
                            name: sport.name,
                            subtitle: `Federación & Liga • Módulo ${sport.category}`,
                            tag: `${sport.category} CIG PRO`,
                            category: 'CANCHA',
                            sportCode: 'OTROS',
                            iconSymbol: sport.icon,
                            iconImage: sport.url,
                            accentColor: '#00F0FF',
                            secondaryColor: '#0066FF',
                            borderColor: `border-[#00F0FF]/40`,
                            hoverGlow: 'hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]',
                            stats: {
                              highlight: 'Módulo Activo',
                              sublabel: 'Federado CIG',
                              uptime: '99.99%',
                              precision: 'Reglamento Oficial'
                            },
                            features: [
                              {
                                title: `Vocalía Digital para ${sport.name}`,
                                description: 'Acta digital automatizada, control de cronómetro y acreditación por código QR anti-fraude.',
                                badge: 'CIG VOCALÍA'
                              },
                              {
                                title: 'Planilla Criptográfica Cero Papel',
                                description: 'Firma electrónica de delegados, jueces oficiales y capitanes sin uso de hojas físicas.',
                                badge: 'ANTIFRAUDE'
                              },
                              {
                                title: 'Carnetización Digital del Deportista',
                                description: 'Pasaporte biométrico que valida la categoría, club de pertenencia y habilitación deportiva.',
                                badge: 'TOKEN ÚNICO'
                              },
                              {
                                title: 'Tablas de Posiciones y Fixtures en Vivo',
                                description: 'Actualización inmediata de tablas, cruces de llaves y calendario para deportistas y aficionados.',
                                badge: 'LIVE STANDINGS'
                              }
                            ],
                            tacticalTools: [
                              `Reglamento Oficial para ${sport.name}`,
                              'Control de Alineaciones QR',
                              'Exportación de Actas a PDF',
                              'Carnet Oficial Digital'
                            ],
                            pricingText: 'Activar este módulo • Desde $25/mes',
                            simulationData: {
                              metricTitle: 'Estado del Motor',
                              metricValue: '100% OPERATIVO',
                              telemetryLabel: 'SISTEMA DE LIGA',
                              telemetryStatus: 'HABILITADO PARA DESPLIEGUE'
                            }
                          });
                        }
                      }}
                      className="relative group overflow-hidden rounded-2xl border border-[#00F0FF]/30 hover:border-[#00F0FF] bg-[#050B1A]/90 hover:bg-[#08122B] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300 cursor-pointer flex flex-col justify-between h-40 w-full"
                    >
                      {/* Cuerpo del botón: La imagen es el Ícono */}
                      <div className="relative z-10 w-full flex-1 flex items-center justify-center p-2.5 overflow-hidden">
                        <img 
                          src={sport.url} 
                          alt={sport.name} 
                          className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-transform duration-300 group-hover:scale-115"
                          loading="lazy"
                        />
                      </div>

                      {/* Pie del botón: Título y Categoría al Pie con Colores Deporverso */}
                      <div className="relative z-10 w-full py-1.5 px-1 bg-gradient-to-t from-[#020612] via-[#050B1A] to-transparent border-t border-[#00F0FF]/20 backdrop-blur-md text-center">
                        <span className="text-[11px] font-black text-white block truncate w-full group-hover:text-[#00F0FF] transition-colors uppercase tracking-wider">
                          {sport.name}
                        </span>
                        <span className="text-[8px] font-mono text-[#00F0FF]/80 block truncate w-full mt-0.5">
                          {sport.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL EXPANDIDO DE ALTO IMPACTO Y CONVERSIÓN             */}
      {/* ======================================================== */}
      {activeModalModule && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setActiveModalModule(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-gradient-to-b from-[#091122] via-[#060a14] to-[#03060f] border border-cyan-400/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,240,255,0.25)] space-y-6 text-left my-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-sport-title"
          >
            {/* Cabecera del Modal con Icono Neón, Badge y Botón de Cierre */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-2xl bg-slate-950 border-2 flex items-center justify-center p-2 shadow-lg shrink-0 overflow-hidden"
                  style={{ borderColor: activeModalModule.accentColor }}
                >
                  {activeModalModule.iconImage ? (
                    <img 
                      src={activeModalModule.iconImage} 
                      alt={activeModalModule.name} 
                      className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(0,240,255,0.5)]" 
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-3xl">{activeModalModule.iconSymbol}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {activeModalModule.tag}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      ENGINE ONLINE
                    </span>
                  </div>
                  <h3 id="modal-sport-title" className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                    {activeModalModule.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-mono">
                    {activeModalModule.subtitle}
                  </p>
                </div>
              </div>

              {/* Botón de Cierre */}
              <button
                onClick={() => setActiveModalModule(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                aria-label="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Imagen Oficial Suministrada desde Google Drive */}
            {activeModalModule.bannerImage && (
              <div className="relative w-full rounded-2xl overflow-hidden border border-cyan-500/40 shadow-xl group">
                <img 
                  src={activeModalModule.bannerImage} 
                  alt={activeModalModule.name} 
                  className="w-full h-44 sm:h-52 object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-mono text-[10px] font-black uppercase shadow">
                      IMAGEN OFICIAL DRIVE
                    </span>
                    <span className="text-xs font-mono text-white/90 drop-shadow font-bold">
                      Visual Oficial de la Disciplina DeporVerso
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Telemetría y Métricas en Tiempo Real */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-mono">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/10">
                <span className="text-[10px] text-slate-500 block uppercase">Desempeño</span>
                <span className="text-xs sm:text-sm font-bold text-white">{activeModalModule.stats.highlight}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/10">
                <span className="text-[10px] text-slate-500 block uppercase">Régimen</span>
                <span className="text-xs sm:text-sm font-bold text-cyan-300">{activeModalModule.stats.sublabel}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/10">
                <span className="text-[10px] text-slate-500 block uppercase">Disponibilidad</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-400">{activeModalModule.stats.uptime}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/10">
                <span className="text-[10px] text-slate-500 block uppercase">Precisión</span>
                <span className="text-xs sm:text-sm font-bold text-amber-300">{activeModalModule.stats.precision}</span>
              </div>
            </div>

            {/* Si es Fútbol Pro, se incluye el reproductor de video oficial en el modal también */}
            {activeModalModule.id === 'futbol-pro' && (
              <div className="relative w-full rounded-2xl overflow-hidden border border-cyan-500/40 bg-black shadow-2xl p-1.5 space-y-2">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950">
                  <iframe
                    src={GOOGLE_DRIVE_VIDEO_PREVIEW_URL}
                    title="Video Oficial Fútbol Pro DeporVerso HD"
                    className="w-full h-full border-0"
                    allow="autoplay; encrypted-media; fullscreen"
                  />
                </div>
                <div className="px-2 pb-1 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-300 font-mono">
                  <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                    <Video className="w-4 h-4 text-cyan-400" />
                    Video Oficial Suministrado por la Organización
                  </span>
                </div>
              </div>
            )}

            {/* Grilla de Características de Alto Impacto */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Capacidades de la Plataforma Oficial</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeModalModule.features.map((feature, idx) => (
                  <div 
                    key={idx} 
                    className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1 hover:border-cyan-400/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white tracking-wide">
                        {feature.title}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {feature.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Barra de Herramientas Tácticas Incluidas */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                Herramientas Tácticas Integradas para DTs y Organizadores:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeModalModule.tacticalTools.map((tool, index) => (
                  <span 
                    key={index} 
                    className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900 text-slate-200 border border-white/10 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>{tool}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Acciones y Botón de Conversión de Alta Fidelidad */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <span className="text-[10px] font-mono text-amber-400 block uppercase font-bold">
                  LICENCIA OFICIAL CIG DISPONIBLE
                </span>
                <span className="text-xs text-slate-300">
                  Despliegue inmediato en menos de 2 minutos para tu liga o club.
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setActiveModalModule(null)}
                  className="w-1/2 sm:w-auto px-5 py-3 rounded-xl bg-[#050B1A] hover:bg-[#08122B] text-cyan-300 hover:text-white border border-[#00F0FF]/40 hover:border-[#00F0FF] font-mono font-bold text-xs cursor-pointer transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                >
                  Volver al Escenario
                </button>

                <button
                  onClick={() => handleActivateFromModal(activeModalModule)}
                  className="w-1/2 sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#0066FF] via-[#0099FF] to-[#00F0FF] hover:from-[#0052cc] hover:to-[#00d0dd] text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(0,240,255,0.7)] flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-[1.02] active:scale-95 border border-[#00F0FF]/50"
                >
                  <span>{activeModalModule.pricingText}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
