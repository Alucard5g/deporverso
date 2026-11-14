import { CINEMATIC_ASSETS } from './cinematicAssets';
import soccerHeroImg from '../assets/images/soccer_hero_banner_1785853921446.jpg';
import basketHeroImg from '../assets/images/basketball_hero_bg_1785854264293.jpg';
import volleyHeroImg from '../assets/images/volleyball_hero_bg_1785854282070.jpg';
import pichinchaHeroImg from '../assets/images/liga_barrial_pichincha_hero_1791927900990.jpg';
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
    tagline: 'Gestión reglamentaria oficial, planillas electrónicas y VAR a la carta',
    badge: '⚽ Disciplina Reina',
    heroImage: '/sports/drive/futbol_original.jpg',
    actionImages: [
      {
        title: 'Estadio Iluminado & Graderías',
        description: 'Atmósfera nocturna de finales barriales y federadas.',
        url: CINEMATIC_ASSETS.stadiumBroadcast,
        tag: 'Estadio Nocturno'
      },
      {
        title: 'Control Táctico en el Círculo Central',
        description: 'Seguimiento de pases, amonestaciones y sustituciones.',
        url: CINEMATIC_ASSETS.goalMoment,
        tag: 'VAR & Vocalía'
      },
      {
        title: 'Celebración de Gol & Pasión de Club',
        description: 'Crónicas generadas en segundos para redes de la liga.',
        url: CINEMATIC_ASSETS.clubTunnel,
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
    heroImage: '/sports/drive/baloncesto_original.jpg',
    actionImages: [
      {
        title: 'Remate en el Aro con Suspensión',
        description: 'Captura fotográfica y registro instantáneo de triples y dobles.',
        url: CINEMATIC_ASSETS.varBooth,
        tag: 'Tiro de Campo'
      },
      {
        title: 'Reflejo en Parquet Profesional',
        description: 'Control de faltas individuales, colectivas y técnicas.',
        url: soccerHeroImg,
        tag: 'Mesa de Anotación'
      },
      {
        title: 'Estrategia de Minuto Solicitado',
        description: 'Tiempos muertos gestionados directamente desde la app de mesa.',
        url: basketHeroImg,
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
    heroImage: '/sports/drive/voleibol_original.jpg',
    actionImages: [
      {
        title: 'Batida & Bloqueo en la Red Alta',
        description: 'Alineación de 3 jugadores: colocador, volador y servidor.',
        url: volleyHeroImg,
        tag: 'Punto de Quince'
      },
      {
        title: 'Cancha de Cemento y Arcilla',
        description: 'Conteo especial de cambios y puntos válidos por rotación.',
        url: pichinchaHeroImg,
        tag: 'Reglamento Barrial'
      },
      {
        title: 'Final con Barra y Graderías Llenas',
        description: 'Liquidación de apuestas reglamentadas y actas firmadas.',
        url: CINEMATIC_ASSETS.stadiumBroadcast,
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
    heroImage: '/sports/drive/tennis_original.jpg',
    actionImages: [
      {
        title: 'Pista Panorámica de Cristal',
        description: 'Seguimiento por sets a 6 juegos con tie-break a 7 puntos.',
        url: CINEMATIC_ASSETS.goalMoment,
        tag: 'Pista de Cristal'
      },
      {
        title: 'Golpe de Bandeja y Remate Smash',
        description: 'Estadísticas de puntos ganadores y errores no forzados.',
        url: CINEMATIC_ASSETS.clubTunnel,
        tag: 'Estadística en Vivo'
      },
      {
        title: 'Parejas Federadas y Torneo Abierto',
        description: 'Cuadros de llaves de eliminación directa y round-robin.',
        url: CINEMATIC_ASSETS.varBooth,
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
    heroImage: CINEMATIC_ASSETS.stadiumBroadcast,
    actionImages: [
      {
        title: 'Duelo 1 vs 1 en Parquet Pulido',
        description: 'Tiempos de 20 minutos con cronómetro detenido al silbato.',
        url: basketHeroImg,
        tag: 'Alta Velocidad'
      },
      {
        title: 'Tiro de Diez Metros por 5ª Falta',
        description: 'Alerta sonora y visual en pantalla de mesa al superar faltas.',
        url: volleyHeroImg,
        tag: 'Doble Penal'
      },
      {
        title: 'Portero-Jugador en Minuto Crítico',
        description: 'Gestión de tácticas especiales y sustituciones volantes.',
        url: pichinchaHeroImg,
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
    heroImage: pichinchaHeroImg,
    actionImages: [
      {
        title: 'Ataque por Zona 4 y Bloqueo Doble',
        description: 'Registro de puntos de ataque, bloqueo y errores de servicio.',
        url: CINEMATIC_ASSETS.goalMoment,
        tag: 'Ataque Directo'
      },
      {
        title: 'Recepción Defensiva del Líbero',
        description: 'Control de sustituciones especializadas sin agotar cambios.',
        url: CINEMATIC_ASSETS.clubTunnel,
        tag: 'Líbero Activo'
      },
      {
        title: 'Match Point en Set Definitivo',
        description: 'Regla de ventaja obligatoria de 2 puntos en todos los sets.',
        url: CINEMATIC_ASSETS.varBooth,
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
    heroImage: soccerHeroImg,
    actionImages: [
      {
        title: 'Bateo de Cuadrangular (Home Run)',
        description: 'Registro de hits, dobles, triples y jonrones al instante.',
        url: basketHeroImg,
        tag: 'Jonrón'
      },
      {
        title: 'Lanzamiento a 95 MPH desde el Montículo',
        description: 'Seguimiento de efectividad de pitchers y ponches (K).',
        url: volleyHeroImg,
        tag: 'Montículo'
      },
      {
        title: 'Atrapada en el Jardín Central',
        description: 'Mesa de anotación digital con diagrama de bases en vivo.',
        url: pichinchaHeroImg,
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
  SOFTBOL: {
    code: 'SOFTBOL',
    name: 'Sóftbol Fastpitch & Slowpitch',
    tagline: 'Lanzamiento molinete bajo hombro, Mercy Rule y categorías mixtas',
    badge: '🥎 Velocidad & Precisión',
    heroImage: CINEMATIC_ASSETS.stadiumBroadcast,
    actionImages: [
      {
        title: 'Lanzamiento Molinete Femenino',
        description: 'Técnica de alta velocidad y control de zona de strike.',
        url: CINEMATIC_ASSETS.goalMoment,
        tag: 'Molinete'
      },
      {
        title: 'Bateo Oportuno con Corredores',
        description: 'Anotación instantánea de carreras producidas y outs.',
        url: CINEMATIC_ASSETS.clubTunnel,
        tag: 'Bateo'
      },
      {
        title: 'Defensa de Cuadro Interior',
        description: 'Doble matanzas y asistencia rápida en primera base.',
        url: CINEMATIC_ASSETS.varBooth,
        tag: 'Infield'
      }
    ],
    color: {
      primary: '#eab308',
      accent: '#facc15',
      gradient: 'from-yellow-500 via-amber-500 to-orange-500',
      glow: 'rgba(234, 179, 8, 0.25)',
      border: 'border-yellow-500/30'
    },
    metrics: [
      { label: 'Estructura de Juego', value: '7 Entradas (Innings)' },
      { label: 'Regla de Misericordia', value: '10 Carreras de Ventaja' },
      { label: 'Modalidad de Lanzamiento', value: 'Molinete o Arco Alto' },
      { label: 'Control de Bateo', value: 'Boxscore Digital' }
    ]
  },
  FUTBOL_AMERICANO: {
    code: 'FUTBOL_AMERICANO',
    name: 'Fútbol Americano & Flag Football',
    tagline: 'Estrategia de 4 downs, yardas ganadas, touchdowns y play clock digital',
    badge: '🏈 Táctica & Potencia',
    heroImage: pichinchaHeroImg,
    actionImages: [
      {
        title: 'Pase en Profundidad del Quarterback',
        description: 'Lectura de cobertura y precisión en rutas aéreas.',
        url: basketHeroImg,
        tag: 'Pase QB'
      },
      {
        title: 'Línea de Golpeo & Bloqueo',
        description: 'Duelo en las trincheras y protección del mariscal.',
        url: volleyHeroImg,
        tag: 'Tackle'
      },
      {
        title: 'Flag Football Olímpico 5v5',
        description: 'Extracción limpia de cintas y velocidad en espacio abierto.',
        url: pichinchaHeroImg,
        tag: 'Flag'
      }
    ],
    color: {
      primary: '#ea580c',
      accent: '#f97316',
      gradient: 'from-orange-600 via-red-600 to-amber-500',
      glow: 'rgba(234, 88, 12, 0.25)',
      border: 'border-orange-500/30'
    },
    metrics: [
      { label: 'Sistema de Avance', value: '4 Downs / 10 Yardas' },
      { label: 'Anotaciones', value: 'TD 6pts, FG 3pts, Conv 1-2' },
      { label: 'Reloj de Jugada', value: 'Play Clock 25/40s' },
      { label: 'Arbitraje', value: 'Cadena de Medición Digital' }
    ]
  },
  ARTES_MARCIALES: {
    code: 'ARTES_MARCIALES',
    name: 'Artes Marciales, MMA & Boxeo',
    tagline: 'Octágono, ring y tatami con pesaje biométrico y tarjetas de 3 jueces 10-9 Must',
    badge: '🥋 Honor & Combate',
    heroImage: soccerHeroImg,
    actionImages: [
      {
        title: 'Combate en Octágono Profesional',
        description: 'Control de rounds de 5 minutos, sumisiones y striking.',
        url: CINEMATIC_ASSETS.goalMoment,
        tag: 'MMA Pro'
      },
      {
        title: 'Báscula y Pesaje Oficial',
        description: 'Registro biométrico previo para cumplimiento de división.',
        url: CINEMATIC_ASSETS.clubTunnel,
        tag: 'Pesaje'
      },
      {
        title: 'Jiu-Jitsu & Grappling No-Gi',
        description: 'Puntuación IBJJF en tiempo real y finalizaciones por sumisión.',
        url: CINEMATIC_ASSETS.varBooth,
        tag: 'Tatami'
      }
    ],
    color: {
      primary: '#e11d48',
      accent: '#f43f5e',
      gradient: 'from-rose-600 via-red-600 to-purple-600',
      glow: 'rgba(225, 29, 72, 0.25)',
      border: 'border-rose-500/30'
    },
    metrics: [
      { label: 'Sistema de Jueces', value: '3 Jueces Laterales (10-9)' },
      { label: 'Duración de Asaltos', value: '3 o 5 Rounds × 5 min' },
      { label: 'Control de Peso', value: 'Báscula Certificada' },
      { label: 'Resolución de Combate', value: 'KO, TKO, Sumisión o Decisión' }
    ]
  },
  TENNIS: {
    code: 'TENNIS',
    name: 'Tenis Singles & Dobles',
    tagline: 'Ranking ATP/ITF dinámico, gestión de cuadros de eliminación y súper tie-breaks',
    badge: '🎾 Pista & Circuito',
    heroImage: CINEMATIC_ASSETS.stadiumBroadcast,
    actionImages: [
      {
        title: 'Saque As a 200 KM/H',
        description: 'Registro de primeros servicios y efectividad de quiebre.',
        url: basketHeroImg,
        tag: 'Saque As'
      },
      {
        title: 'Intercambio desde el Fondo en Arcilla',
        description: 'Estadísticas de winners de revés y errores no forzados.',
        url: volleyHeroImg,
        tag: 'Arcilla'
      },
      {
        title: 'Definición en la Red de Dobles',
        description: 'Coordinación táctica de pareja y definición en tie-break.',
        url: pichinchaHeroImg,
        tag: 'Dobles'
      }
    ],
    color: {
      primary: '#059669',
      accent: '#10b981',
      gradient: 'from-emerald-600 via-teal-500 to-cyan-500',
      glow: 'rgba(5, 150, 105, 0.25)',
      border: 'border-emerald-500/30'
    },
    metrics: [
      { label: 'Estructura de Sets', value: 'Al mejor de 3 sets (games a 6)' },
      { label: 'Puntuación de Games', value: '15 - 30 - 40 - Juego' },
      { label: 'Desempate', value: 'Tie-break a 7 o 10 Pts' },
      { label: 'Ranking Oficial', value: 'Cálculo de Puntos ELO' }
    ]
  },
  OTROS: {
    code: 'OTROS',
    name: 'Multideporte & Disciplinas Adaptables',
    tagline: 'Esquema modular para cualquier deporte federado o comunal que requiera liga',
    badge: '🏆 Modular 100%',
    heroImage: pichinchaHeroImg,
    actionImages: [
      {
        title: 'Competición Multidisciplinaria',
        description: 'Adaptable a deportes de raqueta, combate, césped o pista.',
        url: CINEMATIC_ASSETS.goalMoment,
        tag: 'Multideporte'
      },
      {
        title: 'Control de Participantes y Carnet QR',
        description: 'Identificación digital instantánea contra falsificaciones.',
        url: CINEMATIC_ASSETS.clubTunnel,
        tag: 'Carnet QR'
      },
      {
        title: 'Podio y Premiación Final',
        description: 'Generación automática de tablas acumuladas y trofeos.',
        url: CINEMATIC_ASSETS.varBooth,
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
      { label: 'Sistema de Rondas', value: 'Asaltos o Tiempos configurables' },
      { label: 'Criterio de Victoria', value: 'Puntos, Sets o Goles' },
      { label: 'Inscripción', value: 'Plantillas y Fichas QR' },
      { label: 'Automatización', value: 'Actas Digitales Cloud' }
    ]
  }
};
