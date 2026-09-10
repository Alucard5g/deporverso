import { SportCode } from '../types';

export interface SportVisualTheme {
  code: SportCode;
  name: string;
  tagline: string;
  badge: string;
  heroImage: string;
  actionImages: {
    title: string;
    description: string;
    url: string;
    tag: string;
  }[];
  color: {
    primary: string;
    accent: string;
    gradient: string;
    glow: string;
    border: string;
  };
  metrics: {
    label: string;
    value: string;
  }[];
}

export const SPORT_VISUAL_THEMES: Record<SportCode, SportVisualTheme> = {
  FUTBOL: {
    code: 'FUTBOL',
    name: 'Fútbol 11 & Sénior',
    tagline: 'Gestión reglamentaria FIFA, planillas electrónicas y VAR a la carta',
    badge: '⚽ Disciplina Reina',
    heroImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200',
    actionImages: [
      {
        title: 'Estadio Iluminado & Graderías',
        description: 'Atmósfera nocturna de finales barriales y federadas.',
        url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=600',
        tag: 'Estadio Nocturno'
      },
      {
        title: 'Control Táctico en el Círculo Central',
        description: 'Seguimiento de pases, amonestaciones y sustituciones.',
        url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600',
        tag: 'VAR & Vocalía'
      },
      {
        title: 'Celebración de Gol & Pasión de Club',
        description: 'Crónicas generadas en segundos para redes de la liga.',
        url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=600',
        tag: 'IA Periodística'
      }
    ],
    color: {
      primary: '#10b981',
      accent: '#34d399',
      gradient: 'from-emerald-500 via-teal-400 to-cyan-400',
      glow: 'rgba(16, 185, 129, 0.25)',
      border: 'border-emerald-500/30'
    },
    metrics: [
      { label: 'Tiempo Reglamentario', value: '2 × 45 min' },
      { label: 'Sustituciones', value: 'Hasta 5 cambios' },
      { label: 'Control Arbitral', value: 'Amarillas / Rojas / VAR' },
      { label: 'Verificación QR', value: '< 1s por jugador' }
    ]
  },
  BALONCESTO: {
    code: 'BALONCESTO',
    name: 'Baloncesto & Streetball',
    tagline: 'Cronómetro de posesión, cuartos dinámicos y tableros de puntuación 1-2-3',
    badge: '🏀 Alta Intensidad',
    heroImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=1200',
    actionImages: [
      {
        title: 'Remate en el Aro con Suspensión',
        description: 'Captura fotográfica y registro instantáneo de triples y dobles.',
        url: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&q=80&w=600',
        tag: 'Tiro de Campo'
      },
      {
        title: 'Reflejo en Parquet Profesional',
        description: 'Control de faltas individuales, colectivas y técnicas.',
        url: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&q=80&w=600',
        tag: 'Mesa de Anotación'
      },
      {
        title: 'Estrategia de Minuto Solicitado',
        description: 'Tiempos muertos gestionados directamente desde la app de mesa.',
        url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600',
        tag: 'Pizarra DT'
      }
    ],
    color: {
      primary: '#f59e0b',
      accent: '#fbbf24',
      gradient: 'from-amber-500 via-orange-500 to-yellow-400',
      glow: 'rgba(245, 158, 11, 0.25)',
      border: 'border-amber-500/30'
    },
    metrics: [
      { label: 'Estructura de Juego', value: '4 cuartos × 10m' },
      { label: 'Puntuación Dinámica', value: '1, 2 y 3 Puntos' },
      { label: 'Límite de Faltas', value: '5 personales por jugador' },
      { label: 'Reloj de Posesión', value: 'Integrado en Mesa' }
    ]
  },
  ECUAVOLEY: {
    code: 'ECUAVOLEY',
    name: 'Ecuavoley Tradicional',
    tagline: 'Modalidad de 3 vs 3 con cambios de saque, batidas, ponchadas y quinces',
    badge: '🏐 Tradición & Pasión',
    heroImage: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=1200',
    actionImages: [
      {
        title: 'Batida & Bloqueo en la Red Alta',
        description: 'Alineación de 3 jugadores: colocador, volador y servidor.',
        url: 'https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&q=80&w=600',
        tag: 'Punto de Quince'
      },
      {
        title: 'Cancha de Cemento y Arcilla',
        description: 'Conteo especial de cambios y puntos válidos por rotación.',
        url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=600',
        tag: 'Reglamento Barrial'
      },
      {
        title: 'Final con Barra y Graderías Llenas',
        description: 'Liquidación de apuestas reglamentadas y actas firmadas.',
        url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=600',
        tag: 'Torneo Abierto'
      }
    ],
    color: {
      primary: '#06b6d4',
      accent: '#22d3ee',
      gradient: 'from-cyan-500 via-sky-400 to-blue-500',
      glow: 'rgba(6, 182, 212, 0.25)',
      border: 'border-cyan-500/30'
    },
    metrics: [
      { label: 'Jugadores por Lado', value: '3 vs 3 (Colocador, Volador, Servidor)' },
      { label: 'Sistema de Sets', value: 'Quinces a 10, 12 o 15 pts' },
      { label: 'Regla de Cambios', value: 'Punto solo con posesión de saque' },
      { label: 'Altura de Red', value: '2.80m / 2.85m oficial' }
    ]
  },
  PADEL: {
    code: 'PADEL',
    name: 'Pádel & Tenis',
    tagline: 'Control de sets, ventajas o punto de oro, tie-breaks y rankings por parejas',
    badge: '🎾 Precisión & Estrategia',
    heroImage: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=1200',
    actionImages: [
      {
        title: 'Pista Panorámica de Cristal',
        description: 'Seguimiento por sets a 6 juegos con tie-break a 7 puntos.',
        url: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=600',
        tag: 'Pista de Cristal'
      },
      {
        title: 'Golpe de Bandeja y Remate Smash',
        description: 'Estadísticas de puntos ganadores y errores no forzados.',
        url: 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?auto=format&fit=crop&q=80&w=600',
        tag: 'Estadística en Vivo'
      },
      {
        title: 'Parejas Federadas y Torneo Abierto',
        description: 'Cuadros de llaves de eliminación directa y round-robin.',
        url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
        tag: 'Ranking Parejas'
      }
    ],
    color: {
      primary: '#84cc16',
      accent: '#a3e635',
      gradient: 'from-lime-400 via-emerald-400 to-teal-500',
      glow: 'rgba(132, 204, 22, 0.25)',
      border: 'border-lime-500/30'
    },
    metrics: [
      { label: 'Formato Oficial', value: 'Sets a 6 juegos (Mejor de 3)' },
      { label: 'Punto Decisivo', value: 'Ventaja o Punto de Oro' },
      { label: 'Desempate', value: 'Tie-break a 7 puntos' },
      { label: 'Categorías', value: '1ª a 6ª, Mixto & Máster' }
    ]
  },
  FUTSAL: {
    code: 'FUTSAL',
    name: 'Fútsal & Indor Fútbol',
    tagline: 'Control estricto de 5 faltas acumuladas, tiro directo de 10m y reloj parado',
    badge: '👟 Dinamismo Total',
    heroImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
    actionImages: [
      {
        title: 'Duelo 1 vs 1 en Parquet Pulido',
        description: 'Tiempos de 20 minutos con cronómetro detenido al silbato.',
        url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=600',
        tag: 'Alta Velocidad'
      },
      {
        title: 'Tiro de Diez Metros por 5ª Falta',
        description: 'Alerta sonora y visual en pantalla de mesa al superar faltas.',
        url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600',
        tag: 'Doble Penal'
      },
      {
        title: 'Portero-Jugador en Minuto Crítico',
        description: 'Gestión de tácticas especiales y sustituciones volantes.',
        url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=600',
        tag: 'Poder Ofensivo'
      }
    ],
    color: {
      primary: '#f43f5e',
      accent: '#fb7185',
      gradient: 'from-rose-500 via-pink-500 to-red-500',
      glow: 'rgba(244, 63, 94, 0.25)',
      border: 'border-rose-500/30'
    },
    metrics: [
      { label: 'Tiempo de Juego', value: '2 × 20 min cronometrados' },
      { label: 'Faltas de Tiro Libre', value: '5ª acumulada activa tiro 10m' },
      { label: 'Sustituciones', value: 'Volantes e ilimitadas' },
      { label: 'Portero Jugador', value: 'Habilitado reglamentariamente' }
    ]
  },
  VOLEIBOL: {
    code: 'VOLEIBOL',
    name: 'Voleibol Sala & Playa',
    tagline: 'Rotaciones de 6 jugadores, control de líbero, sets a 25 puntos y tie-break a 15',
    badge: '🏐 Salto & Coordinación',
    heroImage: 'https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&q=80&w=1200',
    actionImages: [
      {
        title: 'Ataque por Zona 4 y Bloqueo Doble',
        description: 'Registro de puntos de ataque, bloqueo y errores de servicio.',
        url: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=600',
        tag: 'Ataque Directo'
      },
      {
        title: 'Recepción Defensiva del Líbero',
        description: 'Control de sustituciones especializadas sin agotar cambios.',
        url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=600',
        tag: 'Líbero Activo'
      },
      {
        title: 'Match Point en Set Definitivo',
        description: 'Regla de ventaja obligatoria de 2 puntos en todos los sets.',
        url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=600',
        tag: 'Set Decisivo'
      }
    ],
    color: {
      primary: '#3b82f6',
      accent: '#60a5fa',
      gradient: 'from-blue-500 via-indigo-500 to-sky-400',
      glow: 'rgba(59, 130, 246, 0.25)',
      border: 'border-blue-500/30'
    },
    metrics: [
      { label: 'Plantilla en Pista', value: '6 vs 6 + Líbero' },
      { label: 'Formato de Sets', value: 'Sets a 25 pts (Ventaja 2 pts)' },
      { label: '5º Set de Desempate', value: 'Tie-break a 15 pts' },
      { label: 'Toques Máximos', value: '3 toques por bando' }
    ]
  },
  BEISBOL: {
    code: 'BEISBOL',
    name: 'Béisbol & Sóftbol',
    tagline: 'Conteo de bolas y strikes, entradas completas, bateo por turnos y carreras',
    badge: '⚾ Diamante Deportivo',
    heroImage: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&q=80&w=1200',
    actionImages: [
      {
        title: 'Bateo de Cuadrangular (Home Run)',
        description: 'Registro de hits, dobles, triples y jonrones al instante.',
        url: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=600',
        tag: 'Jonrón'
      },
      {
        title: 'Lanzamiento a 95 MPH desde el Montículo',
        description: 'Seguimiento de efectividad de pitchers y ponches (K).',
        url: 'https://images.unsplash.com/photo-1531247448636-47565b43d1a7?auto=format&fit=crop&q=80&w=600',
        tag: 'Montículo'
      },
      {
        title: 'Atrapada en el Jardín Central',
        description: 'Mesa de anotación digital con diagrama de bases en vivo.',
        url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600',
        tag: 'Defensa'
      }
    ],
    color: {
      primary: '#ea580c',
      accent: '#f97316',
      gradient: 'from-orange-600 via-amber-500 to-yellow-500',
      glow: 'rgba(234, 88, 12, 0.25)',
      border: 'border-orange-500/30'
    },
    metrics: [
      { label: 'Estructura de Juego', value: '7 o 9 Entradas (Innings)' },
      { label: 'Outs por Entrada', value: '3 outs por turno de bateo' },
      { label: 'Conteo del Árbitro', value: 'Strikes, Bolas y Outs' },
      { label: 'Bases en Juego', value: 'Primera, Segunda, Tercera y Home' }
    ]
  },
  OTROS: {
    code: 'OTROS',
    name: 'Artes Marciales & Disciplinas Adaptables',
    tagline: 'Esquema de combate por asaltos, categorías de peso y puntuación libre',
    badge: '🥊 Disciplina Marcial',
    heroImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200',
    actionImages: [
      {
        title: 'Combate en Tatami & Ring Oficial',
        description: 'Jueces laterales con pulsadores de puntos en tiempo real.',
        url: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=600',
        tag: 'Tatami'
      },
      {
        title: 'Control de Pesaje y Categoría',
        description: 'Verificación por carnet biométrico antes del ingreso a combate.',
        url: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&q=80&w=600',
        tag: 'Báscula Oficial'
      },
      {
        title: 'Medallero de Campeonato',
        description: 'Llaves de repechaje, finales y premiación automática.',
        url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=600',
        tag: 'Podio'
      }
    ],
    color: {
      primary: '#a855f7',
      accent: '#c084fc',
      gradient: 'from-purple-600 via-fuchsia-500 to-pink-500',
      glow: 'rgba(168, 85, 247, 0.25)',
      border: 'border-purple-500/30'
    },
    metrics: [
      { label: 'Sistema de Rondas', value: 'Asaltos o Rounds configurables' },
      { label: 'Criterio de Victoria', value: 'Puntos, Ippon o Decisión Unánime' },
      { label: 'Pesaje & División', value: 'Categorías por peso estricto' },
      { label: 'Sanciones', value: 'Advertencias y descalificaciones' }
    ]
  }
};
