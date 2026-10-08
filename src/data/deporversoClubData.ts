import deporversoClubLogo from '../assets/images/deporverso_club_logo_1791029063761.jpg';
import deporversoClubPortada from '../assets/images/deporverso_club_portada_1791029077367.jpg';

export interface ClubPlayerStatsFutbol {
  pj: number;
  goles: number;
  asistencias: number;
  minutos: number;
  amarillas: number;
  rojas: number;
  ritmo: number;
  tiro: number;
  pase: number;
  regif: number;
  defensa: number;
  fisico: number;
  rating: number;
}

export interface ClubPlayerStatsBasket {
  pj: number;
  ppg: number; // Puntos por partido
  rpg: number; // Rebotes por partido
  apg: number; // Asistencias por partido
  spg: number; // Robos por partido
  bpg: number; // Bloqueos por partido
  fgPct: number; // % Tiros de campo
  threePct: number; // % Triples
  ftPct: number; // % Tiros libres
  minutos: number;
  rating: number;
}

export interface DeporversoPlayer {
  id: string;
  code: string;
  name: string;
  nickname: string;
  dorsal: number;
  position: string;
  positionCategory: 'POR' | 'DEF' | 'MED' | 'DEL' | 'BASE' | 'ESCOLTA' | 'ALERO' | 'ALA_PIVOT' | 'PIVOT';
  age: number;
  height: string;
  weight: string;
  nationality: string;
  photoUrl: string;
  ovr: number;
  footOrHand: string;
  discipline: 'FUTBOL' | 'BALONCESTO';
  qrCode: string;
  marketValue: string;
  status: 'TITULAR' | 'ROTACIÓN' | 'CAPITÁN';
  futbolStats?: ClubPlayerStatsFutbol;
  basketStats?: ClubPlayerStatsBasket;
  bio: string;
}

export interface ClubMatch {
  id: string;
  competition: string;
  discipline: 'FUTBOL' | 'BALONCESTO';
  opponent: string;
  opponentLogo?: string;
  date: string;
  time: string;
  venue: string;
  isHome: boolean;
  status: 'SCHEDULED' | 'FINISHED';
  scoreDeporverso?: number;
  scoreOpponent?: number;
  highlights?: string;
}

export interface DeporversoClubInfo {
  name: string;
  shortName: string;
  acronym: string;
  motto: string;
  foundedYear: number;
  headquarters: string;
  stadiumFutbol: string;
  arenaBasket: string;
  city: string;
  country: string;
  membershipCount: number;
  cigLicenseId: string;
  colors: {
    primary: string; // Celeste
    secondary: string; // Blanco
    accent: string; // Negro profundo
    primaryHex: string;
    secondaryHex: string;
    accentHex: string;
  };
  logoUrl: string;
  portadaUrl: string;
  board: {
    president: string;
    sportsDirector: string;
    dtFutbol: string;
    dtBasket: string;
    headScout: string;
  };
  statsFutbol: {
    pj: number;
    pg: number;
    pe: number;
    pp: number;
    gf: number;
    gc: number;
    pts: number;
    cleanSheets: number;
    position: number;
    winRate: number;
  };
  statsBasket: {
    pj: number;
    pg: number;
    pp: number;
    ptsFavor: number;
    ptsContra: number;
    diff: number;
    winRate: number;
    position: number;
    avgPoints: number;
  };
  trophies: Array<{
    id: string;
    name: string;
    year: string;
    category: string;
    discipline: 'FUTBOL' | 'BALONCESTO';
  }>;
}

export const DEPORVERSO_CLUB_DATA: DeporversoClubInfo = {
  name: 'Club Deportivo Deporverso',
  shortName: 'CD Deporverso',
  acronym: 'DPV',
  motto: 'Evolución, Ciencia & Pasión Deportiva',
  foundedYear: 2024,
  headquarters: 'Complejo Deportivo Tecnológico Deporverso, Av. Olímpica 100',
  stadiumFutbol: 'Estadio Metropolitano Deporverso (Césped Reglamentario Pro)',
  arenaBasket: 'Coliseo Arena Deporverso (Piso de Tabloncillo Roble)',
  city: 'Quito',
  country: 'Ecuador',
  membershipCount: 1480,
  cigLicenseId: 'CIG-DPV-GLOBAL-2026',
  colors: {
    primary: 'Celeste (#00E5FF / #38BDF8)',
    secondary: 'Blanco Puro (#FFFFFF)',
    accent: 'Negro Azabache (#090D16)',
    primaryHex: '#00e5ff',
    secondaryHex: '#ffffff',
    accentHex: '#090d16',
  },
  logoUrl: deporversoClubLogo,
  portadaUrl: deporversoClubPortada,
  board: {
    president: 'Dirección CIG Deporverso',
    sportsDirector: 'Ing. Elena Ramos',
    dtFutbol: 'Prof. Marcelo Gallardo E.',
    dtBasket: 'Coach Gregory "Pop" Albarracín',
    headScout: 'Lic. Mateo Valdivieso',
  },
  statsFutbol: {
    pj: 16,
    pg: 14,
    pe: 2,
    pp: 0,
    gf: 48,
    gc: 12,
    pts: 44,
    cleanSheets: 8,
    position: 1,
    winRate: 87.5,
  },
  statsBasket: {
    pj: 18,
    pg: 16,
    pp: 2,
    ptsFavor: 1584,
    ptsContra: 1320,
    diff: 264,
    winRate: 88.9,
    position: 1,
    avgPoints: 88.0,
  },
  trophies: [
    { id: 'tr-1', name: 'Copa Apertura Pichincha Serie A', year: '2025', category: 'Fútbol 11', discipline: 'FUTBOL' },
    { id: 'tr-2', name: 'Supercopa Élite Metropolitana', year: '2025', category: 'Baloncesto Conferencia Oro', discipline: 'BALONCESTO' },
    { id: 'tr-3', name: 'Torneo Relámpago Interclubes Indor 9', year: '2025', category: 'Indoor Fútbol', discipline: 'FUTBOL' },
    { id: 'tr-4', name: 'Copa de Campeones Fútsal Pro', year: '2024', category: 'Fútsal 5', discipline: 'FUTBOL' },
    { id: 'tr-5', name: 'Grand Prix CIG Baloncesto 3x3 y 5x5', year: '2024', category: 'Baloncesto', discipline: 'BALONCESTO' },
  ],
};

// ==========================================
// PLANTILLA OFICIAL DE FÚTBOL
// ==========================================
export const DEPORVERSO_FUTBOL_PLAYERS: DeporversoPlayer[] = [
  {
    id: 'dpv-fut-10',
    code: 'DPV-F-10',
    name: 'Mateo "El Rayo" Silva',
    nickname: 'El Rayo',
    dorsal: 10,
    position: 'Mediocampista Creativo',
    positionCategory: 'MED',
    age: 24,
    height: '1.78 m',
    weight: '73 kg',
    nationality: 'Ecuador',
    photoUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400',
    ovr: 89,
    footOrHand: 'Derecho',
    discipline: 'FUTBOL',
    qrCode: 'DPV-QR-MATEO-10',
    marketValue: '$45,000 USD',
    status: 'CAPITÁN',
    bio: 'Capitán insignia del club. Visión periférica sobresaliente, precisión quirúrgica de pase entre líneas y liderazgo natural en campo.',
    futbolStats: {
      pj: 16,
      goles: 12,
      asistencias: 14,
      minutos: 1420,
      amarillas: 2,
      rojas: 0,
      ritmo: 88,
      tiro: 87,
      pase: 93,
      regif: 91,
      defensa: 65,
      fisico: 82,
      rating: 9.3,
    },
  },
  {
    id: 'dpv-fut-9',
    code: 'DPV-F-09',
    name: 'Gabriel "Depredador" Torres',
    nickname: 'Depredador',
    dorsal: 9,
    position: 'Delantero Centro',
    positionCategory: 'DEL',
    age: 26,
    height: '1.86 m',
    weight: '81 kg',
    nationality: 'Ecuador',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    ovr: 90,
    footOrHand: 'Ambidiestro',
    discipline: 'FUTBOL',
    qrCode: 'DPV-QR-TORRES-09',
    marketValue: '$52,000 USD',
    status: 'TITULAR',
    bio: 'Máximo goleador del torneo. Letal dentro del área, juego aéreo dominante y definición potente de primera intención.',
    futbolStats: {
      pj: 15,
      goles: 18,
      asistencias: 5,
      minutos: 1340,
      amarillas: 1,
      rojas: 0,
      ritmo: 86,
      tiro: 94,
      pase: 78,
      regif: 85,
      defensa: 48,
      fisico: 89,
      rating: 9.4,
    },
  },
  {
    id: 'dpv-fut-1',
    code: 'DPV-F-01',
    name: 'Lucas "Muralla" Benítez',
    nickname: 'La Muralla',
    dorsal: 1,
    position: 'Portero Titular',
    positionCategory: 'POR',
    age: 27,
    height: '1.92 m',
    weight: '86 kg',
    nationality: 'Ecuador',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    ovr: 88,
    footOrHand: 'Derecho',
    discipline: 'FUTBOL',
    qrCode: 'DPV-QR-LUCAS-01',
    marketValue: '$38,000 USD',
    status: 'TITULAR',
    bio: 'Valla menos batida de la temporada. Seguridad total en balones aéreos, reflejos felinos y excelente salida con los pies.',
    futbolStats: {
      pj: 16,
      goles: 0,
      asistencias: 1,
      minutos: 1440,
      amarillas: 0,
      rojas: 0,
      ritmo: 75,
      tiro: 62,
      pase: 82,
      regif: 79,
      defensa: 89,
      fisico: 88,
      rating: 9.1,
    },
  },
  {
    id: 'dpv-fut-4',
    code: 'DPV-F-04',
    name: 'Carlos "Titán" Arboleda',
    nickname: 'El Titán',
    dorsal: 4,
    position: 'Defensa Central',
    positionCategory: 'DEF',
    age: 28,
    height: '1.88 m',
    weight: '84 kg',
    nationality: 'Ecuador',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    ovr: 87,
    footOrHand: 'Derecho',
    discipline: 'FUTBOL',
    qrCode: 'DPV-QR-ARBOLEDA-04',
    marketValue: '$35,000 USD',
    status: 'TITULAR',
    bio: 'Jerarquía defensiva pura. Cruces providenciales, anticipación táctica y salida limpia desde el fondo con balón dominado.',
    futbolStats: {
      pj: 16,
      goles: 3,
      asistencias: 2,
      minutos: 1440,
      amarillas: 3,
      rojas: 0,
      ritmo: 79,
      tiro: 68,
      pase: 80,
      regif: 76,
      defensa: 91,
      fisico: 92,
      rating: 8.9,
    },
  },
  {
    id: 'dpv-fut-7',
    code: 'DPV-F-07',
    name: 'Julián "Flecha" Morales',
    nickname: 'Flecha',
    dorsal: 7,
    position: 'Extremo Derecho',
    positionCategory: 'DEL',
    age: 22,
    height: '1.75 m',
    weight: '70 kg',
    nationality: 'Ecuador',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    ovr: 86,
    footOrHand: 'Derecho',
    discipline: 'FUTBOL',
    qrCode: 'DPV-QR-MORALES-07',
    marketValue: '$32,000 USD',
    status: 'TITULAR',
    bio: 'Velocidad de aceleración imparable. Desborde por banda, centros milimétricos y sacrificio constante en retroceso.',
    futbolStats: {
      pj: 15,
      goles: 8,
      asistencias: 10,
      minutos: 1250,
      amarillas: 1,
      rojas: 0,
      ritmo: 94,
      tiro: 83,
      pase: 85,
      regif: 89,
      defensa: 56,
      fisico: 78,
      rating: 8.8,
    },
  },
  {
    id: 'dpv-fut-8',
    code: 'DPV-F-08',
    name: 'Sebastián "Motor" Rivas',
    nickname: 'El Motor',
    dorsal: 8,
    position: 'Pivote Organizador',
    positionCategory: 'MED',
    age: 25,
    height: '1.80 m',
    weight: '76 kg',
    nationality: 'Ecuador',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    ovr: 86,
    footOrHand: 'Derecho',
    discipline: 'FUTBOL',
    qrCode: 'DPV-QR-RIVAS-08',
    marketValue: '$30,000 USD',
    status: 'TITULAR',
    bio: 'Despliegue físico incansable. Recuperador nato con criterio para oxigenar el juego y cambiar de frente con precisión.',
    futbolStats: {
      pj: 16,
      goles: 2,
      asistencias: 7,
      minutos: 1390,
      amarillas: 4,
      rojas: 0,
      ritmo: 82,
      tiro: 76,
      pase: 88,
      regif: 83,
      defensa: 84,
      fisico: 88,
      rating: 8.7,
    },
  },
  {
    id: 'dpv-fut-11',
    code: 'DPV-F-11',
    name: 'Andrés "Zurda" Vélez',
    nickname: 'Zurda Mágica',
    dorsal: 11,
    position: 'Extremo Izquierdo',
    positionCategory: 'DEL',
    age: 23,
    height: '1.77 m',
    weight: '72 kg',
    nationality: 'Ecuador',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
    ovr: 85,
    footOrHand: 'Izquierdo',
    discipline: 'FUTBOL',
    qrCode: 'DPV-QR-VELEZ-11',
    marketValue: '$28,000 USD',
    status: 'TITULAR',
    bio: 'Especialista en tiros libres y balones parados. Dribling desconcertante en el uno contra uno.',
    futbolStats: {
      pj: 14,
      goles: 5,
      asistencias: 6,
      minutos: 1100,
      amarillas: 1,
      rojas: 0,
      ritmo: 89,
      tiro: 84,
      pase: 86,
      regif: 88,
      defensa: 52,
      fisico: 76,
      rating: 8.6,
    },
  },
  {
    id: 'dpv-fut-3',
    code: 'DPV-F-03',
    name: 'Martín "Cerrojo" Cáceres',
    nickname: 'El Cerrojo',
    dorsal: 3,
    position: 'Lateral Izquierdo',
    positionCategory: 'DEF',
    age: 24,
    height: '1.79 m',
    weight: '75 kg',
    nationality: 'Ecuador',
    photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400',
    ovr: 84,
    footOrHand: 'Izquierdo',
    discipline: 'FUTBOL',
    qrCode: 'DPV-QR-CACERES-03',
    marketValue: '$24,000 USD',
    status: 'ROTACIÓN',
    bio: 'Gran proyección ofensiva por la banda izquierda y solvencia en el repliegue defensivo.',
    futbolStats: {
      pj: 13,
      goles: 1,
      asistencias: 4,
      minutos: 1020,
      amarillas: 2,
      rojas: 0,
      ritmo: 86,
      tiro: 70,
      pase: 81,
      regif: 80,
      defensa: 82,
      fisico: 83,
      rating: 8.3,
    },
  },
];

// ==========================================
// PLANTILLA OFICIAL DE BALONCESTO
// ==========================================
export const DEPORVERSO_BASKET_PLAYERS: DeporversoPlayer[] = [
  {
    id: 'dpv-bk-7',
    code: 'DPV-B-07',
    name: 'Kevin "Sniper" Andrade',
    nickname: 'El Francotirador',
    dorsal: 7,
    position: 'Escolta / Shooting Guard',
    positionCategory: 'ESCOLTA',
    age: 25,
    height: '1.96 m',
    weight: '92 kg',
    nationality: 'Ecuador',
    photoUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400',
    ovr: 91,
    footOrHand: 'Derecho',
    discipline: 'BALONCESTO',
    qrCode: 'DPV-QR-ANDRADE-07',
    marketValue: '$48,000 USD',
    status: 'CAPITÁN',
    bio: 'Tirador de élite con rango ilimitado. Líder anotador de la Conferencia Oro con 43.8% de efectividad detrás del arco.',
    basketStats: {
      pj: 18,
      ppg: 24.5,
      rpg: 5.2,
      apg: 4.8,
      spg: 1.6,
      bpg: 0.8,
      fgPct: 49.2,
      threePct: 43.8,
      ftPct: 88.5,
      minutos: 33.5,
      rating: 9.5,
    },
  },
  {
    id: 'dpv-bk-23',
    code: 'DPV-B-23',
    name: 'Dante "Air" Caicedo',
    nickname: 'Air Caicedo',
    dorsal: 23,
    position: 'Alero / Small Forward',
    positionCategory: 'ALERO',
    age: 26,
    height: '2.01 m',
    weight: '98 kg',
    nationality: 'Ecuador',
    photoUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&q=80&w=400',
    ovr: 90,
    footOrHand: 'Derecho',
    discipline: 'BALONCESTO',
    qrCode: 'DPV-QR-CAICEDO-23',
    marketValue: '$46,000 USD',
    status: 'TITULAR',
    bio: 'Poderío atlético dominante. Clavadas espectaculares en transición, versatilidad para defender múltiples posiciones y rebote ofensivo.',
    basketStats: {
      pj: 18,
      ppg: 21.8,
      rpg: 7.6,
      apg: 3.9,
      spg: 1.8,
      bpg: 1.3,
      fgPct: 53.4,
      threePct: 37.5,
      ftPct: 81.0,
      minutos: 34.0,
      rating: 9.3,
    },
  },
  {
    id: 'dpv-bk-3',
    code: 'DPV-B-03',
    name: 'Marcus "The General" Valdivieso',
    nickname: 'El General',
    dorsal: 3,
    position: 'Base / Point Guard',
    positionCategory: 'BASE',
    age: 27,
    height: '1.88 m',
    weight: '85 kg',
    nationality: 'Ecuador',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    ovr: 89,
    footOrHand: 'Derecho',
    discipline: 'BALONCESTO',
    qrCode: 'DPV-QR-VALDIVIESO-03',
    marketValue: '$40,000 USD',
    status: 'TITULAR',
    bio: 'Cerebro táctico del equipo. Manejo pulcro del Pick & Roll, control del ritmo del partido y líder asistidor de la liga (9.4 APG).',
    basketStats: {
      pj: 17,
      ppg: 16.2,
      rpg: 3.8,
      apg: 9.4,
      spg: 2.2,
      bpg: 0.3,
      fgPct: 46.8,
      threePct: 39.1,
      ftPct: 86.4,
      minutos: 32.8,
      rating: 9.2,
    },
  },
  {
    id: 'dpv-bk-33',
    code: 'DPV-B-33',
    name: 'Bruno "Torre" Moreira',
    nickname: 'La Torre',
    dorsal: 33,
    position: 'Pívot / Center',
    positionCategory: 'PIVOT',
    age: 28,
    height: '2.08 m',
    weight: '112 kg',
    nationality: 'Ecuador',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    ovr: 88,
    footOrHand: 'Derecho',
    discipline: 'BALONCESTO',
    qrCode: 'DPV-QR-MOREIRA-33',
    marketValue: '$36,000 USD',
    status: 'TITULAR',
    bio: 'Protector de pintura implacable. Máximo taponador del torneo, juego de espaldas al aro clásico y presencia intimidante bajo el tablero.',
    basketStats: {
      pj: 18,
      ppg: 14.2,
      rpg: 11.8,
      apg: 2.1,
      spg: 0.6,
      bpg: 2.4,
      fgPct: 59.1,
      threePct: 0.0,
      ftPct: 74.2,
      minutos: 29.5,
      rating: 9.0,
    },
  },
  {
    id: 'dpv-bk-15',
    code: 'DPV-B-15',
    name: 'Anthony "Tanque" Espinoza',
    nickname: 'El Tanque',
    dorsal: 15,
    position: 'Ala-Pívot / Power Forward',
    positionCategory: 'ALA_PIVOT',
    age: 24,
    height: '2.03 m',
    weight: '104 kg',
    nationality: 'Ecuador',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    ovr: 87,
    footOrHand: 'Derecho',
    discipline: 'BALONCESTO',
    qrCode: 'DPV-QR-ESPINOZA-15',
    marketValue: '$33,000 USD',
    status: 'TITULAR',
    bio: 'Energía pura y músculo. Ala-pívot moderno con tiro de media distancia confiable y capacidad de cerrar el rebote defensivo.',
    basketStats: {
      pj: 18,
      ppg: 15.6,
      rpg: 9.2,
      apg: 2.4,
      spg: 1.1,
      bpg: 1.4,
      fgPct: 51.5,
      threePct: 34.0,
      ftPct: 79.0,
      minutos: 31.0,
      rating: 8.8,
    },
  },
  {
    id: 'dpv-bk-0',
    code: 'DPV-B-00',
    name: 'Felipe "Flash" Cordero',
    nickname: 'Flash',
    dorsal: 0,
    position: 'Base Suplente / 6to Hombre',
    positionCategory: 'BASE',
    age: 21,
    height: '1.83 m',
    weight: '78 kg',
    nationality: 'Ecuador',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    ovr: 84,
    footOrHand: 'Izquierdo',
    discipline: 'BALONCESTO',
    qrCode: 'DPV-QR-CORDERO-00',
    marketValue: '$25,000 USD',
    status: 'ROTACIÓN',
    bio: 'Chispa inmediata saliendo desde la banca. Cambio de marcha eléctrico y defensa a presión en toda la cancha.',
    basketStats: {
      pj: 18,
      ppg: 11.4,
      rpg: 2.3,
      apg: 5.1,
      spg: 1.5,
      bpg: 0.1,
      fgPct: 45.0,
      threePct: 36.2,
      ftPct: 83.3,
      minutos: 18.5,
      rating: 8.4,
    },
  },
  {
    id: 'dpv-bk-11',
    code: 'DPV-B-11',
    name: 'Leonardo "Daga" Solís',
    nickname: 'La Daga',
    dorsal: 11,
    position: 'Escolta Defensivo / 3&D',
    positionCategory: 'ESCOLTA',
    age: 23,
    height: '1.93 m',
    weight: '88 kg',
    nationality: 'Ecuador',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    ovr: 84,
    footOrHand: 'Derecho',
    discipline: 'BALONCESTO',
    qrCode: 'DPV-QR-SOLIS-11',
    marketValue: '$24,000 USD',
    status: 'ROTACIÓN',
    bio: 'Especialista defensivo asignado a neutralizar a las estrellas rivales. Tiros de esquina confiables.',
    basketStats: {
      pj: 16,
      ppg: 10.8,
      rpg: 3.5,
      apg: 2.2,
      spg: 2.1,
      bpg: 0.5,
      fgPct: 44.5,
      threePct: 40.5,
      ftPct: 85.0,
      minutos: 22.0,
      rating: 8.3,
    },
  },
];

// ==========================================
// PARTIDOS / FIXTURE OFICIAL DE AMBAS DISCIPLINAS
// ==========================================
export const DEPORVERSO_MATCHES: ClubMatch[] = [
  // FÚTBOL
  {
    id: 'dpv-match-f1',
    competition: 'Liga Barrial Pichincha - Serie A (Fecha 17)',
    discipline: 'FUTBOL',
    opponent: 'Deportivo Quito Norte',
    date: 'Sábado 25 Octubre',
    time: '16:00',
    venue: 'Estadio Metropolitano Deporverso',
    isHome: true,
    status: 'SCHEDULED',
  },
  {
    id: 'dpv-match-f2',
    competition: 'Liga Barrial Pichincha - Serie A (Fecha 16)',
    discipline: 'FUTBOL',
    opponent: 'Atlético San Antonio',
    date: 'Sábado 18 Octubre',
    time: '15:30',
    venue: 'Cancha Central San Antonio',
    isHome: false,
    status: 'FINISHED',
    scoreDeporverso: 4,
    scoreOpponent: 1,
    highlights: 'Goles: Gabriel Torres (2), Mateo Silva (1), Julián Morales (1). VAR ratificó penal al minuto 62.',
  },
  {
    id: 'dpv-match-f3',
    competition: 'Liga Barrial Pichincha - Serie A (Fecha 15)',
    discipline: 'FUTBOL',
    opponent: 'Estrella Roja FC',
    date: 'Sábado 11 Octubre',
    time: '14:00',
    venue: 'Estadio Metropolitano Deporverso',
    isHome: true,
    status: 'FINISHED',
    scoreDeporverso: 3,
    scoreOpponent: 0,
    highlights: 'Valla invicta para Lucas Benítez. Gol olímpico de tiro de esquina por Mateo Silva.',
  },

  // BALONCESTO
  {
    id: 'dpv-match-b1',
    competition: 'Liga Metropolitana de Baloncesto - Oro (Jornada 19)',
    discipline: 'BALONCESTO',
    opponent: 'Grizzlies de Quito',
    date: 'Domingo 26 Octubre',
    time: '18:30',
    venue: 'Coliseo Arena Deporverso',
    isHome: true,
    status: 'SCHEDULED',
  },
  {
    id: 'dpv-match-b2',
    competition: 'Liga Metropolitana de Baloncesto - Oro (Jornada 18)',
    discipline: 'BALONCESTO',
    opponent: 'Halcones del Valle',
    date: 'Domingo 19 Octubre',
    time: '17:00',
    venue: 'Coliseo Los Chillos',
    isHome: false,
    status: 'FINISHED',
    scoreDeporverso: 92,
    scoreOpponent: 84,
    highlights: 'Kevin Andrade 31 puntos (6 triples). Dante Caicedo 18 puntos y 12 rebotes.',
  },
  {
    id: 'dpv-match-b3',
    competition: 'Liga Metropolitana de Baloncesto - Oro (Jornada 17)',
    discipline: 'BALONCESTO',
    opponent: 'Titanes del Norte',
    date: 'Domingo 12 Octubre',
    time: '19:00',
    venue: 'Coliseo Arena Deporverso',
    isHome: true,
    status: 'FINISHED',
    scoreDeporverso: 88,
    scoreOpponent: 76,
    highlights: 'Marcus Valdivieso 14 asistencias récord. Dominio absoluto en pintura de Bruno Moreira.',
  },
];
