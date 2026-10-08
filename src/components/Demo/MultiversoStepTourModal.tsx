import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, Shield, Zap, Video, Award, FileText, Users, Activity, 
  Sparkles, CheckCircle2, ChevronRight, ChevronLeft, Play, Pause, 
  X, ExternalLink, ArrowRight, Clock, DollarSign, Download, Share2, 
  Smartphone, Eye, Layers, Compass, BarChart3, Check
} from 'lucide-react';

export interface MultiversoStepTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
  initialStepIndex?: number;
}

export interface TourStation {
  id: string;
  tabTarget: string;
  stationNumber: number;
  title: string;
  subtitle: string;
  badge: string;
  icon: any;
  accentColor: string;
  gradient: string;
  executiveSummary: string;
  problemSolved: string;
  dirigenteBenefit: string;
  metrics: {
    label: string;
    value: string;
    desc: string;
  }[];
  liveInteractiveAction: {
    buttonLabel: string;
    tabId: string;
    previewDescription: string;
  };
  mockScreenshots: {
    title: string;
    tag: string;
    detail: string;
  }[];
}

export const MULTIVERSO_STATIONS: TourStation[] = [
  {
    id: 'pichincha-league',
    tabTarget: 'league',
    stationNumber: 1,
    title: 'Liga Barrial Pichincha — Portal Oficial & Tablas en Vivo',
    subtitle: 'El Núcleo Competitivo: Automatización Total de Serie A y Serie B',
    badge: 'ESTACIÓN 1 · COMPETICIÓN',
    icon: Trophy,
    accentColor: '#00F0FF',
    gradient: 'from-[#0066FF] to-[#00F0FF]',
    executiveSummary: 'Centralización digital de todos los torneos barriales. Las tablas de posiciones, fixture de 24 fechas, diferencia de goles y tabla de goleadores se recalculan de forma instantánea al finalizar cada partido.',
    problemSolved: 'Elimina las 14 horas semanales que los directivos pierden sumando puntos a mano en hojas de cálculo y las disputas por reclamos de goles mal computados.',
    dirigenteBenefit: 'Publicación automática en la web oficial y en el teléfono de los 24 presidentes de clubes sin retrasos ni errores humanos.',
    metrics: [
      { label: 'Tiempo de Recálculo', value: '0.2 seg', desc: 'Inmediato tras el pitazo final' },
      { label: 'Ahorro de Secretaría', value: '14 hrs/sem', desc: 'Cero digitación en Excel' },
      { label: 'Transparencia de Puntos', value: '100%', desc: 'Auditoría en tiempo real' }
    ],
    liveInteractiveAction: {
      buttonLabel: 'Ver Tabla en Vivo de Liga Pichincha',
      tabId: 'league',
      previewDescription: 'Explora las posiciones oficiales, partidos finalizados y fixture de Deportivo Quito Norte, San Antonio y Club Deporverso.'
    },
    mockScreenshots: [
      { title: 'Tabla de Posiciones Serie A', tag: 'AUTOMÁTICO', detail: 'Club Deporverso liderando con 6 pts (+6 GD), seguido de Deportivo Quito Norte.' },
      { title: 'Fixture Oficial 24 Fechas', tag: 'SIN CONFLICTOS', detail: 'Asignación automática de canchas, árbitros y horarios sin cruces.' },
      { title: 'Tabla de Goleadores Oficial', tag: 'TIEMPO REAL', detail: 'Gabriel Torres y Santiago López encabezando la bota de oro barrial.' }
    ]
  },
  {
    id: 'club-deporverso',
    tabTarget: 'club-deporverso',
    stationNumber: 2,
    title: 'Club Deportivo Deporverso — El Club Modelo Digital',
    subtitle: 'La Identidad Institucional: Carnets QR, Socios y Autogestión Financiera',
    badge: 'ESTACIÓN 2 · CLUBES',
    icon: Shield,
    accentColor: '#38bdf8',
    gradient: 'from-cyan-500 to-blue-600',
    executiveSummary: 'Muestra a cada club afiliado cómo lucirá su propia institución: escudo oficial en alta definición, portada cinematográfica, plantel verificado, vitrina de trofeos y carnetización holográfica inviolable.',
    problemSolved: 'Pone fin a la suplantación de identidad de jugadores en torneos barriales y profesionaliza la imagen institucional del club ante patrocinadores.',
    dirigenteBenefit: 'Cada club cuenta con su portal autogestionable por solo $25/año, generando sentido de pertenencia y cobro ordenado de cuotas a los jugadores.',
    metrics: [
      { label: 'Suplantación de Jugadores', value: '0 Casos', desc: 'Verificación fotográfica con QR' },
      { label: 'Costo por Club', value: '$25 / año', desc: 'Accesible para ligas barriales' },
      { label: 'Socios Registrados', value: '1,420+', desc: 'Base de datos del club modelo' }
    ],
    liveInteractiveAction: {
      buttonLabel: 'Explorar Club Modelo Deporverso',
      tabId: 'club-deporverso',
      previewDescription: 'Interactúa con los carnets digitales con QR, plantilla de fútbol 11 y baloncesto, y palmarés de títulos.'
    },
    mockScreenshots: [
      { title: 'Carnet Holográfico Digital', tag: 'QR INVIOLABLE', detail: 'Código único por atleta que valida habilitación médica y federativa.' },
      { title: 'Plantilla de Élite Verificada', tag: 'DORSALES OFICIALES', detail: 'Ficha individual de Mateo Silva (#10), Gabriel Torres (#9) y plantel.' },
      { title: 'Vitrina de Trofeos', tag: 'HISTORIAL', detail: 'Registro histórico de títulos en Liga Barrial Pichincha.' }
    ]
  },
  {
    id: 'vocalia-digital',
    tabTarget: 'vocalia',
    stationNumber: 3,
    title: 'Mesa de Control & Vocalía Digital en Vivo',
    subtitle: 'Operación en Cancha: De la Hoja de Papel Arrugada a la PWA Móvil',
    badge: 'ESTACIÓN 3 · ARBITRAJE',
    icon: Zap,
    accentColor: '#f59e0b',
    gradient: 'from-amber-500 to-yellow-400',
    executiveSummary: 'El vocal de turno registra goles, amonestaciones, expulsiones y cambios desde cualquier celular o tablet. La aplicación funciona con o sin internet en la cancha y sincroniza las actas al instante.',
    problemSolved: 'Nunca más actas de partido ilegibles, tachadas, borroneadas o arruinadas por la lluvia en los estadios de tierra o sintético.',
    dirigenteBenefit: 'Acta oficial firmada digitalmente por el árbitro y los delegados al sonar el pitazo final. Las sanciones se aplican en el sistema automáticamente.',
    metrics: [
      { label: 'Ahorro en Papelería', value: '100% Cero Papel', desc: 'Elimina talonarios y copias' },
      { label: 'Disputas de Mesa', value: '-95%', desc: 'Registro minuto a minuto' },
      { label: 'Cierre de Acta', value: '< 2 minutos', desc: 'Firma y despacho digital' }
    ],
    liveInteractiveAction: {
      buttonLabel: 'Abrir Vocalía Digital en Vivo',
      tabId: 'vocalia',
      previewDescription: 'Simula el registro de incidencias en el Clásico Barrial Deportivo Quito Norte vs Atlético San Antonio.'
    },
    mockScreenshots: [
      { title: 'Cronómetro & Control de Periodos', tag: 'TIEMPO OFICIAL', detail: 'Control de 1T, 2T y tiempo de reposición con un solo toque.' },
      { title: 'Registro Rápido de Incidencias', tag: 'TÁCTIL', detail: 'Selección de jugador, dorsal y tipo de evento (Gol, Tarjeta, Sustitución).' },
      { title: 'Acta Oficial Firmada', tag: 'VALIDEZ LEGAL', detail: 'Cierre con firma del vocal e informe disciplinario de la terna.' }
    ]
  },
  {
    id: 'var-media',
    tabTarget: 'var',
    stationNumber: 4,
    title: 'Sistema VAR A La Carta & Cámaras en Cancha',
    subtitle: 'Justicia Deportiva: Tecnología de Élite Financiable para Ligas de Base',
    badge: 'ESTACIÓN 4 · VIDEO ARBITRAJE',
    icon: Video,
    accentColor: '#ef4444',
    gradient: 'from-red-500 to-rose-600',
    executiveSummary: 'Solución patentada para revisar jugadas dudosas (goles polémicos, fueras de juego, penales) mediante cámaras en cancha y teléfonos móviles de la mesa de control, con trazado de líneas y generación de clips verticales 9:16.',
    problemSolved: 'Erradica agresiones y polémicas arbitrales en finales de campeonato y clásicos barriales de alta tensión.',
    dirigenteBenefit: 'Modelo auto-sostenible: la revisión VAR cuesta $12 y es costeada por el equipo solicitante si no prospera, generando una nueva fuente de ingresos netos para la liga.',
    metrics: [
      { label: 'Resolución de Jugadas', value: '15 seg', desc: 'Repetición multiseñal instantánea' },
      { label: 'Generación Clip 9:16', value: '< 1 seg', desc: 'Listo para redes sociales' },
      { label: 'Ingreso Neto Liga', value: '+$1,200/año', desc: 'Por solicitudes de revisión' }
    ],
    liveInteractiveAction: {
      buttonLabel: 'Probar Sistema VAR Oficial',
      tabId: 'var',
      previewDescription: 'Revisa ángulos de cámara, calibración pericial y dictamen arbitral certificado en formato A4.'
    },
    mockScreenshots: [
      { title: 'Repetición Multicámara', tag: 'ÁNGULOS', detail: 'Cámara de línea de gol, área chica y tiro de esquina en simultáneo.' },
      { title: 'Generador de Clips 9:16', tag: 'VIRAL', detail: 'Extracción automática de 10s antes y 5s después para redes del torneo.' },
      { title: 'Acta Pericial Certificada', tag: 'OFICIAL A4', detail: 'Dictamen arbitral con sello de seguridad inmutable.' }
    ]
  },
  {
    id: 'scouting-talents',
    tabTarget: 'scouting',
    stationNumber: 5,
    title: 'Hub de Scouting & Talent Discovery Barrial',
    subtitle: 'Proyección del Futbolista: Del Potrero a la Ficha Técnica Profesional',
    badge: 'ESTACIÓN 5 · TALENTO',
    icon: Award,
    accentColor: '#10b981',
    gradient: 'from-emerald-500 to-teal-600',
    executiveSummary: 'Banco de talentos con Índice Deporverso (1 a 10) que cuantifica velocidad máxima, precisión de pases, recuperaciones y mapa de calor táctico para cada atleta barrial.',
    problemSolved: 'Los futbolistas talentosos de ligas barriales quedan en el anonimato sin un registro formal para ser observados por cazatalentos de clubes profesionales.',
    dirigenteBenefit: 'La liga se convierte en una cantera oficial certificada, con capacidad de exportar fichas técnicas en formato A4 imprimible con un solo clic.',
    metrics: [
      { label: 'Índice de Rendimiento', value: '1 al 10', desc: 'Métrica objetiva de evaluación' },
      { label: 'Fichas A4 Generadas', value: '1 Clic', desc: 'Descarga pericial para DTs' },
      { label: 'Proyección Juvenil', value: '+300 Atletas', desc: 'Catálogo de promesas U18' }
    ],
    liveInteractiveAction: {
      buttonLabel: 'Ver Hub de Scouting & Talentos',
      tabId: 'scouting',
      previewDescription: 'Visualiza radares de habilidades, comparativas entre extremos y fichas de jugadores destacados.'
    },
    mockScreenshots: [
      { title: 'Radar de Habilidades 360°', tag: 'METRÍCAS', detail: 'Velocidad, remate, pase, recuperación y visión de juego.' },
      { title: 'Ficha Oficial de Rendimiento', tag: 'A4 DESCARGABLE', detail: 'Documento oficial con mapa de calor y recomendaciones de posición.' },
      { title: 'Buscador de Talentos por Posición', tag: 'FILTROS', detail: 'Filtro por categoría U18, Senior, Femenino y Máster.' }
    ]
  },
  {
    id: 'chronicle-press',
    tabTarget: 'chronicle',
    stationNumber: 6,
    title: 'Sala de Prensa & Crónicas Deportivas Automatizadas',
    subtitle: 'Difusión y Prestigio: Crónicas Periodísticas en Segundos',
    badge: 'ESTACIÓN 6 · PRENSA',
    icon: FileText,
    accentColor: '#8b5cf6',
    gradient: 'from-purple-500 to-indigo-600',
    executiveSummary: 'Transforma los datos de la vocalía en crónicas periodísticas profesionales con titulares apasionantes, análisis de figuras del partido y resumen táctico para el blog de la liga y medios de comunicación.',
    problemSolved: 'Las ligas no cuentan con presupuesto para periodistas y sus resultados pasan desapercibidos fuera de la cancha.',
    dirigenteBenefit: 'Contenido diario para alimentar las redes sociales de la liga, atraer patrocinadores comerciales e impresionar a los aficionados.',
    metrics: [
      { label: 'Tiempo de Redacción', value: '3 seg', desc: 'Crónica completa tras el partido' },
      { label: 'Costo de Cobertura', value: '$0 USD', desc: 'Totalmente automatizado' },
      { label: 'Alcance Barrial', value: '10x Mayor', desc: 'Publicación directa en web y WhatsApp' }
    ],
    liveInteractiveAction: {
      buttonLabel: 'Ver Sala de Prensa & Blog',
      tabId: 'league',
      previewDescription: 'Lee la crónica del dramático 2-1 entre Deportivo Quito Norte y Atlético San Antonio.'
    },
    mockScreenshots: [
      { title: 'Crónica del Clásico Barrial', tag: 'TITULARES', detail: '¡Triunfo Dramático! Gol agónico en el Estadio Liga Barrial Pichincha.' },
      { title: 'Momentos Clave del Partido', tag: 'MINUTO A MINUTO', detail: 'Desglose de goles, revisiones VAR y atajadas decisivas.' },
      { title: 'Boletín de Prensa para WhatsApp', tag: 'COPIA RÁPIDA', detail: 'Texto formateado para difusión inmediata a medios locales.' }
    ]
  },
  {
    id: 'governance-virtual',
    tabTarget: 'governance',
    stationNumber: 7,
    title: 'Gobernanza Virtual & Asambleas Barriales',
    subtitle: 'Democracia Deportiva: Salas de Quórum, Votaciones y Resoluciones',
    badge: 'ESTACIÓN 7 · DIRECTIVA',
    icon: Users,
    accentColor: '#14b8a6',
    gradient: 'from-teal-500 to-emerald-600',
    executiveSummary: 'Sala de asambleas virtuales con verificación de quórum por delegado de club, votación secreta o pública de resoluciones del torneo, y emisión de actas firmadas.',
    problemSolved: 'Reuniones de dirigentes que se alargan hasta la medianoche en sedes barriales lejanas, con peleas por actas extraviadas y falta de quórum.',
    dirigenteBenefit: 'Reuniones eficientes de 40 minutos con asistencia remota registrada y notificaciones oficiales directas por WhatsApp con validez legal barrial.',
    metrics: [
      { label: 'Duración de Asambleas', value: '-60%', desc: 'Puntos de orden estructurados' },
      { label: 'Transparencia de Votos', value: '100% Cripto', desc: 'Registro auditado de votos' },
      { label: 'Notificación de Sanciones', value: 'Instantánea', desc: 'Avisos directos por WhatsApp' }
    ],
    liveInteractiveAction: {
      buttonLabel: 'Ver Asambleas & Resoluciones',
      tabId: 'governance',
      previewDescription: 'Explora la sala de votación de reformas al reglamento de Liga Barrial Pichincha.'
    },
    mockScreenshots: [
      { title: 'Control de Quórum en Vivo', tag: 'ASISTENCIA', detail: '20 de 24 clubes presentes con firma de delegado acreditado.' },
      { title: 'Sistema de Votación Segura', tag: 'DEMOCRACIA', detail: 'Aprobación de reformas disciplinarias con porcentaje visible en pantalla.' },
      { title: 'Acta de Asamblea Inmutable', tag: 'SEGURIDAD', detail: 'Documento oficial con hash de seguridad CIG para evitar alteraciones.' }
    ]
  },
  {
    id: 'analytics-fatigue',
    tabTarget: 'league',
    stationNumber: 8,
    title: 'Analítica Predictiva & Alertas de Desgaste Físico',
    subtitle: 'Salud y Estrategia: Detección de Desgaste en los Minutos 75 a 90+',
    badge: 'ESTACIÓN 8 · CIENCIA DEPORTIVA',
    icon: BarChart3,
    accentColor: '#ec4899',
    gradient: 'from-pink-500 to-rose-600',
    executiveSummary: 'Telemetría gráfica con Recharts que identifica a los equipos que reciben más del 60% de sus goles en los últimos 15 minutos de partido, emitiendo recomendaciones tácticas preventivas.',
    problemSolved: 'Previene lesiones musculares por sobreesfuerzo en canchas duras y ayuda a los directores técnicos barriales a gestionar sus sustituciones a tiempo.',
    dirigenteBenefit: 'Información científica y profesional que eleva el nivel competitivo de los clubes y previene accidentes cardíacos o descompensaciones.',
    metrics: [
      { label: 'Intervalo Crítico', value: 'Min 75-90+', desc: 'Concentración de goles tardíos' },
      { label: 'Alerta Táctica', value: 'Sustitución min 65', desc: 'Recomendación automática' },
      { label: 'Índice de Vulnerabilidad', value: 'Semáforo', desc: 'Rojo, Amarillo y Verde por club' }
    ],
    liveInteractiveAction: {
      buttonLabel: 'Ver Analítica de Desgaste Físico',
      tabId: 'league',
      previewDescription: 'Accede a la pestaña de analítica de Liga Pichincha con gráficos interactivos de rendimiento.'
    },
    mockScreenshots: [
      { title: 'Gráfica de Goles por Intervalo de 15 Min', tag: 'RECHARTS', detail: 'Distribución temporal de goles anotados y concedidos en el torneo.' },
      { title: 'Semáforo de Desgaste Físico', tag: 'ALERTA ROJA', detail: 'Equipos con fatiga severa en el cierre de partido identificados.' },
      { title: 'Boletín Oficial A4 Imprimible', tag: 'DESCARGA', detail: 'Resumen gerencial de la fecha listo para imprimir o enviar por WhatsApp.' }
    ]
  }
];

export const MultiversoStepTourModal: React.FC<MultiversoStepTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  initialStepIndex = 0
}) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStepIndex);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(10);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  const activeStation = MULTIVERSO_STATIONS[currentStep] || MULTIVERSO_STATIONS[0];
  const IconComponent = activeStation.icon;

  useEffect(() => {
    setCurrentStep(initialStepIndex);
  }, [initialStepIndex]);

  // Manejador del modo Auto-Play para proyectores y presentaciones
  useEffect(() => {
    if (!isOpen || !isAutoPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setSecondsLeft(10);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          handleNext();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isAutoPlaying, currentStep]);

  if (!isOpen) return null;

  const handleNext = () => {
    setCurrentStep((prev) => (prev < MULTIVERSO_STATIONS.length - 1 ? prev + 1 : 0));
    setSecondsLeft(10);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : MULTIVERSO_STATIONS.length - 1));
    setSecondsLeft(10);
  };

  const handleGoToModule = () => {
    onNavigateTab(activeStation.liveInteractiveAction.tabId);
    onClose();
  };

  const handleShareSummary = () => {
    const text = `🏆 *Propuesta Oficial DeporVerso para Dirigentes de Liga Barrial Pichincha*\n\nEstación ${activeStation.stationNumber}/8: *${activeStation.title}*\n\n✅ Beneficio: ${activeStation.dirigenteBenefit}\n⏱️ Ahorro: 14 hrs/semana en secretaría y tablas automáticas.\n🛡️ Cero papel con Vocalía Digital y Carnet QR inviolable.\n\nVer demostración completa en vivo: https://deporverso.app`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#070b16] border border-cyan-500/30 rounded-3xl shadow-[0_0_80px_rgba(0,240,255,0.25)] flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* ============================================================== */}
        {/* HEADER SUPERIOR: PROGRESO Y CONTROLES                         */}
        {/* ============================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-white/10 bg-[#040711]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${activeStation.gradient} p-0.5 shadow-lg shadow-cyan-500/20`}>
              <div className="w-full h-full bg-[#060a14] rounded-[14px] flex items-center justify-center">
                <IconComponent className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                  {activeStation.badge}
                </span>
                <span className="text-xs text-white/50 font-mono">
                  Paso {currentStep + 1} de {MULTIVERSO_STATIONS.length}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight line-clamp-1">
                Tour Ejecutivo para Dirigentes · Liga Barrial Pichincha
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-Play Toggle */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isAutoPlaying 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
              title="Modo presentación automática con temporizador para proyectores"
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{isAutoPlaying ? `Auto (${secondsLeft}s)` : 'Auto-Play'}</span>
            </button>

            {/* Compartir WhatsApp */}
            <button
              onClick={handleShareSummary}
              className="p-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 text-slate-300 hover:text-emerald-300 transition-colors cursor-pointer"
              title="Copiar resumen para WhatsApp de dirigentes"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Cerrar Modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 text-slate-300 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BARRA DE PROGRESO DE ESTACIONES */}
        <div className="w-full bg-[#03060f] px-6 py-2 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto">
          {MULTIVERSO_STATIONS.map((station, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <button
                key={station.id}
                onClick={() => {
                  setCurrentStep(idx);
                  setSecondsLeft(10);
                }}
                className={`flex-1 min-w-[32px] sm:min-w-[40px] h-2 rounded-full transition-all cursor-pointer ${
                  isCurrent 
                    ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_10px_rgba(0,240,255,0.8)] scale-y-125' 
                    : isCompleted 
                    ? 'bg-cyan-500/50 hover:bg-cyan-400/80' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
                title={`Paso ${idx + 1}: ${station.title}`}
              />
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* CUERPO CENTRAL DE LA ESTACIÓN                                 */}
        {/* ============================================================== */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* TÍTULO Y DESCRIPCIÓN */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                Estación 0{activeStation.stationNumber} de 08
              </span>
              <span className="text-white/20">·</span>
              <span className="text-xs text-slate-400 font-mono">
                {activeStation.subtitle}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {activeStation.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
              {activeStation.executiveSummary}
            </p>
          </div>

          {/* TARJETAS CLAVE: PROBLEMA RESUELTO VS BENEFICIO DIRIGENTE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0b1326] border border-rose-500/30 rounded-2xl p-5 space-y-2 shadow-lg">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                <span>Problema Tradicional que Elimina</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {activeStation.problemSolved}
              </p>
            </div>

            <div className="bg-[#0b1326] border border-emerald-500/30 rounded-2xl p-5 space-y-2 shadow-lg">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Beneficio Directo para la Directiva</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {activeStation.dirigenteBenefit}
              </p>
            </div>
          </div>

          {/* MÉTRICAS DE IMPACTO CUANTIFICABLE */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeStation.metrics.map((metric, i) => (
              <div 
                key={i} 
                className="bg-[#091124]/80 border border-white/10 rounded-2xl p-4 text-center hover:border-cyan-400/40 transition-colors"
              >
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">
                  {metric.label}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono block">
                  {metric.value}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {metric.desc}
                </span>
              </div>
            ))}
          </div>

          {/* CAPACIDADES Y MOCKUPS VISUALES DE LA ESTACIÓN */}
          <div className="bg-[#050914] border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 border-b border-white/10 pb-2.5">
              <span>Módulos y Automatizaciones en esta Estación:</span>
              <span className="text-cyan-400">Totalmente Operativo en Producción</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {activeStation.mockScreenshots.map((item, idx) => (
                <div key={idx} className="bg-[#091020] border border-white/5 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white line-clamp-1">{item.title}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* FOOTER INFERIOR: ACCIONES Y NAVEGACIÓN ENTRE PASOS            */}
        {/* ============================================================== */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#040711] flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Botón de acción interactiva en vivo (Navega a la app real) */}
          <button
            onClick={handleGoToModule}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-[1.02] active:scale-95"
          >
            <span>{activeStation.liveInteractiveAction.buttonLabel}</span>
            <ExternalLink className="w-4 h-4 text-slate-950" />
          </button>

          {/* Navegación Anterior / Siguiente */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrev}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <span>{currentStep === MULTIVERSO_STATIONS.length - 1 ? 'Reiniciar Tour' : 'Siguiente Estación'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
