import { Sport, Tenant, Profile, Category, Team, Player, Match, MatchEvent, VarRequest, MigrationTicket, Subscription, AiChronicle } from '../types';

export const INITIAL_SPORTS: Sport[] = [
  {
    id: 's1',
    code: 'FUTBOL',
    name: 'Fútbol 11 / 7',
    icon: 'futbol',
    description: 'Reglamento FIFA adaptable para torneos comunitarios, interclubes y profesionales',
    sport_rules: {
      periods: 2,
      period_duration_minutes: 45,
      players_per_team: 11,
      scoring_modes: [{ type: 'GOAL', points: 1, label: 'Gol' }],
      foul_cards: ['YELLOW', 'RED'],
      has_overtime: true
    }
  },
  {
    id: 's2',
    code: 'BALONCESTO',
    name: 'Baloncesto',
    icon: 'basketball',
    description: 'Anotación dinámica de 1, 2 y 3 puntos con acumulación de faltas por cuarto',
    sport_rules: {
      periods: 4,
      period_duration_minutes: 10,
      players_per_team: 5,
      scoring_modes: [
        { type: 'FREE_THROW', points: 1, label: 'Tiro Libre (+1)' },
        { type: 'FIELD_GOAL_2', points: 2, label: 'Doble (+2)' },
        { type: 'THREE_POINTER', points: 3, label: 'Triple (+3)' }
      ],
      max_personal_fouls: 5,
      has_overtime: true
    }
  },
  {
    id: 's3',
    code: 'ECUAVOLEY',
    name: 'Ecuavoley',
    icon: 'volleyball',
    description: 'Reglas tradicionales: 3 jugadores por lado, Servida/Colocada/Volada, Puntos y Cambios',
    sport_rules: {
      periods: 3,
      sets_to_win: 2,
      points_per_set: 12,
      players_per_team: 3,
      scoring_modes: [
        { type: 'ECU_POINT', points: 1, label: 'Punto Directo' },
        { type: 'ECU_CAMBIO', points: 0, label: 'Cambio de Servida' }
      ],
      positions: ['Colocador', 'Servidor', 'Volador'],
      batida_mode: 'TRADICIONAL'
    }
  },
  {
    id: 's4',
    code: 'PADEL',
    name: 'Pádel',
    icon: 'activity',
    description: 'Formato de juegos (15-30-40) y sets a 6 con Tie-Break',
    sport_rules: {
      periods: 3,
      sets_to_win: 2,
      games_per_set: 6,
      players_per_team: 2,
      scoring_modes: [{ type: 'GAME', points: 1, label: 'Juego' }]
    }
  },
  {
    id: 's5',
    code: 'FUTSAL',
    name: 'Fútsal / Microfútbol',
    icon: 'shield',
    description: 'Reglas de 5 contra 5 con tarjeta azul y faltas acumuladas',
    sport_rules: {
      periods: 2,
      period_duration_minutes: 20,
      players_per_team: 5,
      scoring_modes: [{ type: 'GOAL', points: 1, label: 'Gol' }],
      accumulated_fouls_limit: 5
    }
  }
];

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 't-pichincha',
    name: 'Liga Barrial Pichincha (Fútbol 11)',
    slug: 'liga-pichincha',
    sport_code: 'FUTBOL',
    country: 'Ecuador',
    currency: 'USD',
    domain: 'pichincha.deporverso.app',
    admin_key: 'DV-PICH-2026-ADM',
    is_active: true,
    annual_license_fee: 25.00,
    plan_tier: 'PRO_5',
    created_at: '2026-01-15T00:00:00Z'
  },
  {
    id: 't-indoor-express',
    name: 'Torneo Interclubes Indoor 7 & 9',
    slug: 'indoor-express',
    sport_code: 'FUTBOL',
    country: 'Ecuador',
    currency: 'USD',
    domain: 'indoor.deporverso.app',
    admin_key: 'DV-INDO-7926-ADM',
    is_active: true,
    annual_license_fee: 25.00,
    plan_tier: 'PRO_5',
    created_at: '2026-01-20T00:00:00Z'
  },
  {
    id: 't-futsal-metro',
    name: 'Liga Metropolitana de Fútsal 5',
    slug: 'futsal-metro',
    sport_code: 'FUTSAL',
    country: 'Ecuador',
    currency: 'USD',
    domain: 'futsal.deporverso.app',
    admin_key: 'DV-FUTS-5026-ADM',
    is_active: true,
    annual_license_fee: 25.00,
    plan_tier: 'PRO_5',
    created_at: '2026-02-01T00:00:00Z'
  },
  {
    id: 't-quito-basket',
    name: 'Asociación de Baloncesto de Quito',
    slug: 'quito-basket',
    sport_code: 'BALONCESTO',
    country: 'Ecuador',
    currency: 'USD',
    domain: 'basketquito.deporverso.app',
    admin_key: 'DV-BASK-3026-ADM',
    is_active: true,
    annual_license_fee: 25.00,
    plan_tier: 'ENTERPRISE_8',
    created_at: '2026-02-10T00:00:00Z'
  },
  {
    id: 't-azuay-ecuavoley',
    name: 'Federación de Ecuavoley del Azuay',
    slug: 'azuay-ecuavoley',
    sport_code: 'ECUAVOLEY',
    country: 'Ecuador',
    currency: 'USD',
    domain: 'ecuavoleyazuay.deporverso.app',
    admin_key: 'DV-ECUA-4026-ADM',
    is_active: true,
    annual_license_fee: 25.00,
    plan_tier: 'BASIC_3',
    created_at: '2026-03-01T00:00:00Z'
  },
  {
    id: 't-cumbaya-padel',
    name: 'Club Pádel Cumbayá & Open',
    slug: 'cumbaya-padel',
    sport_code: 'PADEL',
    country: 'Ecuador',
    currency: 'USD',
    domain: 'cumbayapadel.deporverso.app',
    admin_key: 'DV-PADE-8026-ADM',
    is_active: true,
    annual_license_fee: 25.00,
    plan_tier: 'PRO_5',
    created_at: '2026-04-05T00:00:00Z'
  }
];

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'u-rolando',
    tenant_id: undefined,
    role: 'SUPER_ADMIN',
    full_name: 'Rolando Guerra',
    email: 'rolando@deporverso.app',
    phone: '+593 99 123 4567',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'u-admin-pichincha',
    tenant_id: 't-pichincha',
    role: 'LEAGUE_ADMIN',
    full_name: 'Carlos Mendoza',
    email: 'admin@pichincha.deporverso.app',
    phone: '+593 98 765 4321'
  },
  {
    id: 'u-admin-futsal',
    tenant_id: 't-futsal-metro',
    role: 'LEAGUE_ADMIN',
    full_name: 'David Paredes (Fútsal Pro)',
    email: 'admin@futsal.deporverso.app',
    phone: '+593 99 874 1234'
  },
  {
    id: 'u-admin-indoor',
    tenant_id: 't-indoor-express',
    role: 'LEAGUE_ADMIN',
    full_name: 'Gonzalo Cevallos (Indor 7/9)',
    email: 'admin@indoor.deporverso.app',
    phone: '+593 98 432 9876'
  },
  {
    id: 'u-referee-1',
    tenant_id: 't-pichincha',
    role: 'REFEREE',
    full_name: 'Árbitro Jorge Benítez',
    email: 'jorge.ref@deporverso.app'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', tenant_id: 't-pichincha', name: 'Máxima Primera A (Fútbol 11)', gender: 'MASCULINO' },
  { id: 'cat-2', tenant_id: 't-pichincha', name: 'Femenino Honor (Fútbol 11)', gender: 'FEMENINO' },
  { id: 'cat-ind1', tenant_id: 't-indoor-express', name: 'Indoor 7 Libre', gender: 'MASCULINO' },
  { id: 'cat-ind2', tenant_id: 't-indoor-express', name: 'Indoor 9 Máster', gender: 'MASCULINO' },
  { id: 'cat-fut1', tenant_id: 't-futsal-metro', name: 'Primera Élite Fútsal 5', gender: 'MASCULINO' },
  { id: 'cat-3', tenant_id: 't-quito-basket', name: 'Primera División Basket', gender: 'MASCULINO' },
  { id: 'cat-4', tenant_id: 't-azuay-ecuavoley', name: 'Abierta Selección Ecuavoley', gender: 'MASCULINO' },
  { id: 'cat-pad1', tenant_id: 't-cumbaya-padel', name: 'Circuito Máster Oro Pádel', gender: 'MIXTO' }
];

export const INITIAL_TEAMS: Team[] = [
  // Fútbol 11 (Liga Barrial Pichincha)
  { id: 'tm-1', tenant_id: 't-pichincha', category_id: 'cat-1', name: 'Deportivo Quito Norte', primary_color: '#ef4444', secondary_color: '#1e3a8a' },
  { id: 'tm-2', tenant_id: 't-pichincha', category_id: 'cat-1', name: 'Atlético San Antonio', primary_color: '#10b981', secondary_color: '#ffffff' },
  { id: 'tm-3', tenant_id: 't-pichincha', category_id: 'cat-1', name: 'LDU Comunitario', primary_color: '#3b82f6', secondary_color: '#dc2626' },
  { id: 'tm-4', tenant_id: 't-pichincha', category_id: 'cat-1', name: 'Estrella Roja FC', primary_color: '#b91c1c', secondary_color: '#f59e0b' },

  // Indoor 7 y 9 (Torneo Interclubes Indoor 7 & 9)
  { id: 'tm-ind1', tenant_id: 't-indoor-express', category_id: 'cat-ind1', name: 'Relámpagos Indor 7', primary_color: '#06b6d4', secondary_color: '#0f172a' },
  { id: 'tm-ind2', tenant_id: 't-indoor-express', category_id: 'cat-ind1', name: 'Gladiadores Indor 7', primary_color: '#f59e0b', secondary_color: '#111827' },
  { id: 'tm-ind3', tenant_id: 't-indoor-express', category_id: 'cat-ind2', name: 'Centauros Indor 9', primary_color: '#10b981', secondary_color: '#064e3b' },
  { id: 'tm-ind4', tenant_id: 't-indoor-express', category_id: 'cat-ind2', name: 'Furia Nocturna Indor 9', primary_color: '#8b5cf6', secondary_color: '#ffffff' },

  // Fútsal 5 (Liga Metropolitana de Fútsal 5)
  { id: 'tm-fut1', tenant_id: 't-futsal-metro', category_id: 'cat-fut1', name: 'Titanes del Valle Futsal 5', primary_color: '#f43f5e', secondary_color: '#1e1b4b' },
  { id: 'tm-fut2', tenant_id: 't-futsal-metro', category_id: 'cat-fut1', name: 'Huracán Futsal Club 5', primary_color: '#8b5cf6', secondary_color: '#fef08a' },
  { id: 'tm-fut3', tenant_id: 't-futsal-metro', category_id: 'cat-fut1', name: 'Águilas Doradas Futsal 5', primary_color: '#eab308', secondary_color: '#18181b' },
  { id: 'tm-fut4', tenant_id: 't-futsal-metro', category_id: 'cat-fut1', name: 'Leones del Norte Futsal 5', primary_color: '#3b82f6', secondary_color: '#ffffff' },
  
  // Baloncesto (Asociación de Baloncesto de Quito)
  { id: 'tm-bk1', tenant_id: 't-quito-basket', category_id: 'cat-3', name: 'Grizzlies de Quito', primary_color: '#7c3aed', secondary_color: '#fbbf24' },
  { id: 'tm-bk2', tenant_id: 't-quito-basket', category_id: 'cat-3', name: 'Halcones del Valle', primary_color: '#2563eb', secondary_color: '#ffffff' },

  // Ecuavoley (Federación de Ecuavoley del Azuay)
  { id: 'tm-ecu1', tenant_id: 't-azuay-ecuavoley', category_id: 'cat-4', name: 'Trío "El Poncho" Azuay', primary_color: '#059669', secondary_color: '#facc15' },
  { id: 'tm-ecu2', tenant_id: 't-azuay-ecuavoley', category_id: 'cat-4', name: 'Trío "Los Rayos" Cuenca', primary_color: '#db2777', secondary_color: '#111827' },

  // Pádel (Club Pádel Cumbayá & Open)
  { id: 'tm-pad1', tenant_id: 't-cumbaya-padel', category_id: 'cat-pad1', name: 'Smash Pro Cumbayá (Dupla Oro)', primary_color: '#84cc16', secondary_color: '#064e3b' },
  { id: 'tm-pad2', tenant_id: 't-cumbaya-padel', category_id: 'cat-pad1', name: 'Víbora Pádel Master (Dupla Plata)', primary_color: '#06b6d4', secondary_color: '#0f172a' },
  { id: 'tm-pad3', tenant_id: 't-cumbaya-padel', category_id: 'cat-pad1', name: 'Drop Shot Cumbayá', primary_color: '#f59e0b', secondary_color: '#18181b' },
  { id: 'tm-pad4', tenant_id: 't-cumbaya-padel', category_id: 'cat-pad1', name: 'Bandeja Power Team', primary_color: '#ec4899', secondary_color: '#ffffff' }
];

export const INITIAL_PLAYERS: Player[] = [
  // Deportivo Quito Norte (tm-1)
  { 
    id: 'pl-1', 
    tenant_id: 't-pichincha', 
    team_id: 'tm-1', 
    full_name: 'Mateo Guerrero', 
    jersey_number: 10, 
    position: 'Mediocampista Creativo', 
    photo_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400',
    qr_code: 'SPORTIA-QR-PL-101', 
    is_active: true 
  },
  { 
    id: 'pl-2', 
    tenant_id: 't-pichincha', 
    team_id: 'tm-1', 
    full_name: 'Santiago López', 
    jersey_number: 9, 
    position: 'Delantero Centro', 
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    qr_code: 'SPORTIA-QR-PL-102', 
    is_active: true 
  },
  { 
    id: 'pl-10', 
    tenant_id: 't-pichincha', 
    team_id: 'tm-1', 
    full_name: 'Esteban Paredes', 
    jersey_number: 7, 
    position: 'Extremo Derecho', 
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    qr_code: 'SPORTIA-QR-PL-110', 
    is_active: true 
  },
  { 
    id: 'pl-11', 
    tenant_id: 't-pichincha', 
    team_id: 'tm-1', 
    full_name: 'Franklin Salas', 
    jersey_number: 1, 
    position: 'Portero Titular', 
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    qr_code: 'SPORTIA-QR-PL-111', 
    is_active: true 
  },
  { 
    id: 'pl-12', 
    tenant_id: 't-pichincha', 
    team_id: 'tm-1', 
    full_name: 'Diego Calderón', 
    jersey_number: 4, 
    position: 'Defensa Central', 
    photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    qr_code: 'SPORTIA-QR-PL-112', 
    is_active: true 
  },

  // Atlético San Antonio (tm-2)
  { 
    id: 'pl-3', 
    tenant_id: 't-pichincha', 
    team_id: 'tm-2', 
    full_name: 'Andrés Villacís', 
    jersey_number: 7, 
    position: 'Extremo Izquierdo', 
    photo_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    qr_code: 'SPORTIA-QR-PL-103', 
    is_active: true 
  },
  { 
    id: 'pl-4', 
    tenant_id: 't-pichincha', 
    team_id: 'tm-2', 
    full_name: 'David "El Rayo" Rocha', 
    jersey_number: 11, 
    position: 'Lateral Izquierdo', 
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    qr_code: 'SPORTIA-QR-PL-104', 
    is_active: true 
  },
  { 
    id: 'pl-13', 
    tenant_id: 't-pichincha', 
    team_id: 'tm-2', 
    full_name: 'Javier Corozo', 
    jersey_number: 9, 
    position: 'Delantero Centro', 
    photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    qr_code: 'SPORTIA-QR-PL-113', 
    is_active: true 
  },
  { 
    id: 'pl-14', 
    tenant_id: 't-pichincha', 
    team_id: 'tm-2', 
    full_name: 'Byron Mina', 
    jersey_number: 5, 
    position: 'Volante de Marca', 
    photo_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400',
    qr_code: 'SPORTIA-QR-PL-114', 
    is_active: true 
  },
  { 
    id: 'pl-15', 
    tenant_id: 't-pichincha', 
    team_id: 'tm-2', 
    full_name: 'Alexander Domínguez', 
    jersey_number: 1, 
    position: 'Arquero', 
    photo_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
    qr_code: 'SPORTIA-QR-PL-115', 
    is_active: true 
  },

  // LDU Comunitario (tm-3)
  { 
    id: 'pl-5', 
    tenant_id: 't-pichincha', 
    team_id: 'tm-3', 
    full_name: 'Carlos "El Muro" Vaca', 
    jersey_number: 1, 
    position: 'Portero Titular', 
    photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    qr_code: 'SPORTIA-QR-PL-105', 
    is_active: true 
  },
  { 
    id: 'pl-16', 
    tenant_id: 't-pichincha', 
    team_id: 'tm-3', 
    full_name: 'Renato Ibarra', 
    jersey_number: 8, 
    position: 'Volante Ofensivo', 
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    qr_code: 'SPORTIA-QR-PL-116', 
    is_active: true 
  },

  // Estrella Roja FC (tm-4)
  { 
    id: 'pl-6', 
    tenant_id: 't-pichincha', 
    team_id: 'tm-4', 
    full_name: 'Gabriel Benavides', 
    jersey_number: 8, 
    position: 'Defensa Central', 
    photo_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400',
    qr_code: 'SPORTIA-QR-PL-106', 
    is_active: true 
  },
  { 
    id: 'pl-17', 
    tenant_id: 't-pichincha', 
    team_id: 'tm-4', 
    full_name: 'Gonzalo Plata', 
    jersey_number: 10, 
    position: 'Delantero', 
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    qr_code: 'SPORTIA-QR-PL-117', 
    is_active: true 
  },

  // Basket & Ecuavoley
  { 
    id: 'pl-7', 
    tenant_id: 't-quito-basket', 
    team_id: 'tm-bk1', 
    full_name: 'Christian "La Torre" Silva', 
    jersey_number: 23, 
    position: 'Pívot', 
    photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    qr_code: 'SPORTIA-QR-PL-201', 
    is_active: true 
  },
  { 
    id: 'pl-8', 
    tenant_id: 't-azuay-ecuavoley', 
    team_id: 'tm-ecu1', 
    full_name: 'Galo "El Zorro" Morales', 
    jersey_number: 1, 
    position: 'Colocador', 
    photo_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
    qr_code: 'SPORTIA-QR-PL-301', 
    is_active: true 
  },

  // Jugadores Fútsal 5 (t-futsal-metro)
  {
    id: 'pl-fut-1',
    tenant_id: 't-futsal-metro',
    team_id: 'tm-fut1',
    full_name: 'Esteban "El Rayo" Cárdenas',
    jersey_number: 10,
    position: 'Pívot Goleador',
    photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    qr_code: 'DV-QR-FUTS-101',
    is_active: true
  },
  {
    id: 'pl-fut-2',
    tenant_id: 't-futsal-metro',
    team_id: 'tm-fut1',
    full_name: 'Bryan Vaca',
    jersey_number: 1,
    position: 'Portero Cierre',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    qr_code: 'DV-QR-FUTS-102',
    is_active: true
  },
  {
    id: 'pl-fut-3',
    tenant_id: 't-futsal-metro',
    team_id: 'tm-fut2',
    full_name: 'Nicolás Andrade',
    jersey_number: 7,
    position: 'Ala Izquierda',
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    qr_code: 'DV-QR-FUTS-201',
    is_active: true
  },

  // Jugadores Indoor 7 & 9 (t-indoor-express)
  {
    id: 'pl-ind-1',
    tenant_id: 't-indoor-express',
    team_id: 'tm-ind1',
    full_name: 'Kevin "El Mago" Salgado',
    jersey_number: 8,
    position: 'Mediocampista Creativo (Indoor 7)',
    photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    qr_code: 'DV-QR-INDO-101',
    is_active: true
  },
  {
    id: 'pl-ind-2',
    tenant_id: 't-indoor-express',
    team_id: 'tm-ind1',
    full_name: 'Andrés Paredes',
    jersey_number: 9,
    position: 'Delantero Punta (Indoor 7)',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    qr_code: 'DV-QR-INDO-102',
    is_active: true
  },
  {
    id: 'pl-ind-3',
    tenant_id: 't-indoor-express',
    team_id: 'tm-ind3',
    full_name: 'Mauricio Guayasamín',
    jersey_number: 11,
    position: 'Extremo Rápido (Indoor 9)',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    qr_code: 'DV-QR-INDO-301',
    is_active: true
  }
];

export const INITIAL_MATCHES: Match[] = [
  // --- FÚTBOL 11 ---
  {
    id: 'm-live-futbol',
    tenant_id: 't-pichincha',
    category_id: 'cat-1',
    home_team_id: 'tm-1',
    away_team_id: 'tm-2',
    sport_code: 'FUTBOL',
    match_date: '2026-07-28T10:00:00Z',
    field_location: 'Estadio Liga Barrial Pichincha - Cancha Principal 1',
    status: 'IN_PROGRESS',
    home_score: 2,
    away_score: 1,
    match_data: { 
      round: 'Fecha 2 - Fase Clasificatoria',
      venue_name: 'Estadio Central La Vicentina',
      referee_name: 'Árbitro Jorge Benítez (Colegio Pichincha)',
      vocal_name: 'Ing. Rodrigo Almendariz (Mesa Central)',
      court_surface: 'Césped Sintético Monofilamento 50mm',
      weather_temp: '19°C Parcialmente Nublado',
      ticket_status: 'General $1.50 • Niños Gratis',
      stream_url: 'https://youtube.com/live/deporverso-futbol',
      current_period: '2ND_HALF', 
      fouls_home: 4, 
      fouls_away: 6,
      player_stats: {
        'pl-1': { player_id: 'pl-1', jersey_number: 10, player_name: 'Mateo Guerrero', team_id: 'tm-1', goals: 1, yellow_cards: 0, red_cards: 0 },
        'pl-2': { player_id: 'pl-2', jersey_number: 9, player_name: 'Santiago López', team_id: 'tm-1', goals: 1, yellow_cards: 1, red_cards: 0 },
        'pl-10': { player_id: 'pl-10', jersey_number: 7, player_name: 'Esteban Paredes', team_id: 'tm-1', goals: 0, yellow_cards: 0, red_cards: 0 },
        'pl-11': { player_id: 'pl-11', jersey_number: 1, player_name: 'Franklin Salas', team_id: 'tm-1', goals: 0, yellow_cards: 0, red_cards: 0 },
        'pl-12': { player_id: 'pl-12', jersey_number: 4, player_name: 'Diego Calderón', team_id: 'tm-1', goals: 0, yellow_cards: 0, red_cards: 0 },
        
        'pl-3': { player_id: 'pl-3', jersey_number: 7, player_name: 'Andrés Villacís', team_id: 'tm-2', goals: 1, yellow_cards: 0, red_cards: 0 },
        'pl-4': { player_id: 'pl-4', jersey_number: 11, player_name: 'David "El Rayo" Rocha', team_id: 'tm-2', goals: 0, yellow_cards: 1, red_cards: 0 },
        'pl-13': { player_id: 'pl-13', jersey_number: 9, player_name: 'Javier Corozo', team_id: 'tm-2', goals: 0, yellow_cards: 0, red_cards: 0 },
        'pl-14': { player_id: 'pl-14', jersey_number: 5, player_name: 'Byron Mina', team_id: 'tm-2', goals: 0, yellow_cards: 1, red_cards: 0 },
        'pl-15': { player_id: 'pl-15', jersey_number: 1, player_name: 'Alexander Domínguez', team_id: 'tm-2', goals: 0, yellow_cards: 0, red_cards: 0 }
      },
      vocal_report: {
        vocal_name: 'Ing. Rodrigo Almendariz',
        vocal_cedula: '1712498231',
        observations: 'Cancha en perfecto estado. Balones reglamentarios Nº 5 entregados por ambos delegados a tiempo. Se verificaron todas las credenciales QR antes del pitazo inicial.',
        status: 'CONFORME',
        start_time: '10:05',
        end_time: '11:55',
        signed: true,
        ball_conditions: 'Excelente (2 balones autorizados)',
        uniforms_status: 'Uniformes reglamentarios completos',
        saved_at: '2026-07-28T11:58:00Z'
      },
      referee_report: {
        main_referee: 'Árbitro Jorge Benítez',
        assistant_1: 'Marco Vinicio Guayasamín',
        assistant_2: 'Luis Morales',
        fourth_official: 'Patricio Córdova',
        disciplinary_notes: 'Partido disputado con intensidad. Se exhibieron 3 tarjetas amarillas por juego brusco. No hubo incidentes graves con las bancas de suplentes.',
        incidents: 'Minuto 65: Reclamo airado del DT de Atlético San Antonio solucionado con advertencia verbal.',
        signatures_verified: true,
        pitch_conditions: 'Césped sintético seco en óptimas condiciones',
        saved_at: '2026-07-28T12:00:00Z'
      },
      is_public_published: true,
      last_synced_at: '2026-07-28T12:00:00Z'
    },
    created_at: '2026-07-28T09:00:00Z'
  },
  {
    id: 'm-fut-f1-1',
    tenant_id: 't-pichincha',
    category_id: 'cat-1',
    home_team_id: 'tm-1',
    away_team_id: 'tm-3',
    sport_code: 'FUTBOL',
    match_date: '2026-07-21T10:00:00Z',
    field_location: 'Estadio Liga Barrial Pichincha - Cancha 1',
    status: 'FINISHED',
    home_score: 3,
    away_score: 2,
    match_data: {
      round: 'Fecha 1 - Inauguración',
      venue_name: 'Estadio La Floresta Central',
      referee_name: 'Carlos Vera (Árbitro FIFA Ret.)',
      vocal_name: 'Dra. Patricia Vinueza',
      court_surface: 'Césped Natural',
      weather_temp: '18°C Soleado',
      ticket_status: 'Agotado (350 espectadores)',
      is_public_published: true
    },
    created_at: '2026-07-20T10:00:00Z'
  },
  {
    id: 'm-fut-f1-2',
    tenant_id: 't-pichincha',
    category_id: 'cat-1',
    home_team_id: 'tm-2',
    away_team_id: 'tm-4',
    sport_code: 'FUTBOL',
    match_date: '2026-07-21T12:30:00Z',
    field_location: 'Estadio Liga Barrial Pichincha - Cancha 2',
    status: 'FINISHED',
    home_score: 1,
    away_score: 1,
    match_data: {
      round: 'Fecha 1 - Inauguración',
      venue_name: 'Cancha 2 El Dorado',
      referee_name: 'Marlon Escalante',
      vocal_name: 'Santiago Morales',
      court_surface: 'Césped Sintético',
      weather_temp: '21°C Despejado',
      ticket_status: 'Entrada Libre',
      is_public_published: true
    },
    created_at: '2026-07-20T10:00:00Z'
  },
  {
    id: 'm-sched-1',
    tenant_id: 't-pichincha',
    category_id: 'cat-1',
    home_team_id: 'tm-3',
    away_team_id: 'tm-4',
    sport_code: 'FUTBOL',
    match_date: '2026-07-28T15:00:00Z',
    field_location: 'Estadio Liga Barrial Pichincha - Cancha 2',
    status: 'SCHEDULED',
    home_score: 0,
    away_score: 0,
    match_data: {
      round: 'Fecha 2 - Fase Clasificatoria',
      venue_name: 'Cancha 2 El Dorado',
      referee_name: 'Christian Lescano',
      vocal_name: 'Lic. Fernando Moncayo',
      court_surface: 'Césped Sintético',
      weather_temp: '22°C Despejado',
      ticket_status: 'General $1.50'
    },
    created_at: '2026-07-28T08:00:00Z'
  },
  {
    id: 'm-fut-f3-1',
    tenant_id: 't-pichincha',
    category_id: 'cat-1',
    home_team_id: 'tm-2',
    away_team_id: 'tm-3',
    sport_code: 'FUTBOL',
    match_date: '2026-08-04T10:30:00Z',
    field_location: 'Estadio Liga Barrial Pichincha - Cancha Principal 1',
    status: 'SCHEDULED',
    home_score: 0,
    away_score: 0,
    match_data: {
      round: 'Fecha 3 - Clásicos Barriales',
      venue_name: 'Estadio Central La Vicentina',
      referee_name: 'Patricio Loustau (Designado)',
      vocal_name: 'Comisión Técnica Pichincha',
      court_surface: 'Césped Sintético Monofilamento',
      weather_temp: 'Pronóstico 20°C',
      ticket_status: 'Preventa Digital $2.00',
      stream_url: 'https://deporverso.com/live/clasico-sanantonio-ldu'
    },
    created_at: '2026-07-28T12:00:00Z'
  },
  {
    id: 'm-fut-f3-2',
    tenant_id: 't-pichincha',
    category_id: 'cat-1',
    home_team_id: 'tm-1',
    away_team_id: 'tm-4',
    sport_code: 'FUTBOL',
    match_date: '2026-08-04T13:00:00Z',
    field_location: 'Estadio Liga Barrial Pichincha - Cancha Principal 1',
    status: 'SCHEDULED',
    home_score: 0,
    away_score: 0,
    match_data: {
      round: 'Fecha 3 - Clásicos Barriales',
      venue_name: 'Estadio Central La Vicentina',
      referee_name: 'Árbitro Guillermo Guerrero',
      vocal_name: 'Mesa Oficial Deporverso',
      court_surface: 'Césped Sintético Monofilamento',
      ticket_status: 'General $1.50'
    },
    created_at: '2026-07-28T12:00:00Z'
  },

  // --- BALONCESTO ---
  {
    id: 'm-bk-f1-1',
    tenant_id: 't-quito-basket',
    category_id: 'cat-3',
    home_team_id: 'tm-bk1',
    away_team_id: 'tm-bk2',
    sport_code: 'BALONCESTO',
    match_date: '2026-07-20T19:00:00Z',
    field_location: 'Coliseo Julio César Hidalgo - Tablado Central',
    status: 'FINISHED',
    home_score: 79,
    away_score: 72,
    match_data: {
      round: 'Fecha 1 - Apertura de Baloncesto',
      venue_name: 'Coliseo Julio César Hidalgo',
      referee_name: 'Árbitro Juan Silva (FIBA)',
      vocal_name: 'Mesa Arbitral FEB',
      court_surface: 'Tablado de Madera Flotante Roble',
      weather_temp: 'Climatizado Techado',
      ticket_status: 'Gradas $2.00',
      is_public_published: true
    },
    created_at: '2026-07-19T18:00:00Z'
  },
  {
    id: 'm-live-basket',
    tenant_id: 't-quito-basket',
    category_id: 'cat-3',
    home_team_id: 'tm-bk1',
    away_team_id: 'tm-bk2',
    sport_code: 'BALONCESTO',
    match_date: '2026-07-28T11:30:00Z',
    field_location: 'Coliseo Julio César Hidalgo - Tablado Central',
    status: 'IN_PROGRESS',
    home_score: 68,
    away_score: 64,
    match_data: { 
      round: 'Fecha 2 - Serie de Honor',
      venue_name: 'Coliseo Julio César Hidalgo',
      referee_name: 'Árbitro Juan Silva (FIBA) & J. Alarcón',
      vocal_name: 'Cronometrador Marcelo Peña',
      court_surface: 'Tablado de Madera Flotante Roble',
      weather_temp: 'Techado Climatizado',
      ticket_status: 'Entradas Agotadas',
      stream_url: 'https://youtube.com/live/deporverso-basket',
      current_period: '4TH_QUARTER', 
      fouls_home: 3, 
      fouls_away: 4, 
      timeouts_home: 1, 
      timeouts_away: 2 
    },
    created_at: '2026-07-28T09:30:00Z'
  },
  {
    id: 'm-bk-f3-1',
    tenant_id: 't-quito-basket',
    category_id: 'cat-3',
    home_team_id: 'tm-bk2',
    away_team_id: 'tm-bk1',
    sport_code: 'BALONCESTO',
    match_date: '2026-08-05T18:30:00Z',
    field_location: 'Coliseo Rumiñahui - Cancha 1',
    status: 'SCHEDULED',
    home_score: 0,
    away_score: 0,
    match_data: {
      round: 'Fecha 3 - Revancha Semifinal',
      venue_name: 'Coliseo General Rumiñahui',
      referee_name: 'Terna Arbitral FIBA Pichincha',
      vocal_name: 'Mesa de Control FEB',
      court_surface: 'Piso de Maple Flotante',
      ticket_status: 'Preferencial $3.00'
    },
    created_at: '2026-07-28T10:00:00Z'
  },

  // --- ECUAVOLEY ---
  {
    id: 'm-ecu-f1-1',
    tenant_id: 't-azuay-ecuavoley',
    category_id: 'cat-4',
    home_team_id: 'tm-ecu2',
    away_team_id: 'tm-ecu1',
    sport_code: 'ECUAVOLEY',
    match_date: '2026-07-22T16:00:00Z',
    field_location: 'Complejo Deportivo Cuenca - Cancha de Red Alta 1',
    status: 'FINISHED',
    home_score: 2,
    away_score: 1,
    match_data: {
      round: 'Fecha 1 - Desafío de Campeones',
      venue_name: 'Parque La Madre - Cuenca',
      referee_name: 'Juez Nacional "Pato" Carrión',
      vocal_name: 'Vocal Alfonso Cárdenas',
      court_surface: 'Tierra Batida Compacta / Red a 2.80m',
      weather_temp: '17°C Fresco',
      ticket_status: 'Apuesta Oficial Registrada',
      sets_home: [12, 9, 12],
      sets_away: [10, 12, 8],
      is_public_published: true
    },
    created_at: '2026-07-21T12:00:00Z'
  },
  {
    id: 'm-live-ecuavoley',
    tenant_id: 't-azuay-ecuavoley',
    category_id: 'cat-4',
    home_team_id: 'tm-ecu1',
    away_team_id: 'tm-ecu2',
    sport_code: 'ECUAVOLEY',
    match_date: '2026-07-28T12:00:00Z',
    field_location: 'Cancha Central de Ecuavoley El Ejido',
    status: 'IN_PROGRESS',
    home_score: 10,
    away_score: 8,
    match_data: { 
      round: 'Fecha 2 - Gran Clásico Interprovincial',
      venue_name: 'Cancha Central El Ejido',
      referee_name: 'Juez Don Manuel "El Búho" Quishpe',
      vocal_name: 'Mesa de Ecuavoley Tradicional',
      court_surface: 'Cemento Pulido con Caucho / Red a 2.85m',
      weather_temp: '22°C Sol Radiante',
      ticket_status: 'Tribuna Libre con Consumo',
      stream_url: 'https://facebook.com/deporverso/ecuavoley-live',
      sets_home: [12, 9, 10], 
      sets_away: [8, 12, 8], 
      current_set: 3, 
      serving_team_id: 'tm-ecu1', 
      cambios_count: 5 
    },
    created_at: '2026-07-28T10:00:00Z'
  },
  {
    id: 'm-ecu-f3-1',
    tenant_id: 't-azuay-ecuavoley',
    category_id: 'cat-4',
    home_team_id: 'tm-ecu1',
    away_team_id: 'tm-ecu2',
    sport_code: 'ECUAVOLEY',
    match_date: '2026-08-06T15:30:00Z',
    field_location: 'Cancha La Vicentina - Cancha 3',
    status: 'SCHEDULED',
    home_score: 0,
    away_score: 0,
    match_data: {
      round: 'Fecha 3 - Revancha por la Copa de Oro',
      venue_name: 'Cancha Tradicional La Vicentina',
      referee_name: 'Juez Don Manuel Quishpe',
      vocal_name: 'Sr. Washington Celi',
      court_surface: 'Tierra Batida / Red 2.85m',
      ticket_status: 'Entrada Libre'
    },
    created_at: '2026-07-28T12:00:00Z'
  },

  // --- PÁDEL ---
  {
    id: 'm-pad-f1-1',
    tenant_id: 't-cumbaya-padel',
    category_id: 'cat-pad1',
    home_team_id: 'tm-pad1',
    away_team_id: 'tm-pad2',
    sport_code: 'PADEL',
    match_date: '2026-07-23T17:00:00Z',
    field_location: 'Club Pádel Cumbayá - Pista Panorámica 1 (Cristal)',
    status: 'FINISHED',
    home_score: 2,
    away_score: 0,
    match_data: {
      round: 'Fecha 1 - Open Cumbayá 500',
      venue_name: 'Club Pádel Cumbayá Stadium',
      referee_name: 'Juez Árbitro FEP Juan Pablo Rivas',
      vocal_name: 'Oficial de Torneo Sofía Vallejo',
      court_surface: 'Césped Texturado Azul WPT y Cristal Templado 12mm',
      weather_temp: '23°C Atardecer Despejado',
      ticket_status: 'Acceso Socios e Invitados',
      sets_home: [6, 7],
      sets_away: [4, 5],
      is_public_published: true
    },
    created_at: '2026-07-22T10:00:00Z'
  },
  {
    id: 'm-pad-f2-1',
    tenant_id: 't-cumbaya-padel',
    category_id: 'cat-pad1',
    home_team_id: 'tm-pad3',
    away_team_id: 'tm-pad4',
    sport_code: 'PADEL',
    match_date: '2026-07-28T16:30:00Z',
    field_location: 'Club Pádel Cumbayá - Pista 2 Panorámica',
    status: 'IN_PROGRESS',
    home_score: 1,
    away_score: 1,
    match_data: {
      round: 'Fecha 2 - Fase de Grupos Oro',
      venue_name: 'Club Pádel Cumbayá',
      referee_name: 'Juez FEP Juan Pablo Rivas',
      vocal_name: 'Mesa de Pádel Pro',
      court_surface: 'Césped Sintético Texturado Azul',
      weather_temp: '24°C Despejado',
      ticket_status: 'Entrada Libre',
      stream_url: 'https://youtube.com/live/deporverso-padel',
      sets_home: [6, 4],
      sets_away: [3, 6],
      current_set: 3,
      current_period: 'SET 3 (GAMES 4-3)'
    },
    created_at: '2026-07-28T14:00:00Z'
  },
  {
    id: 'm-pad-f3-1',
    tenant_id: 't-cumbaya-padel',
    category_id: 'cat-pad1',
    home_team_id: 'tm-pad1',
    away_team_id: 'tm-pad3',
    sport_code: 'PADEL',
    match_date: '2026-08-08T10:00:00Z',
    field_location: 'Club Pádel Cumbayá - Pista Central Panorámica',
    status: 'SCHEDULED',
    home_score: 0,
    away_score: 0,
    match_data: {
      round: 'Fecha 3 - Semifinal Gran Cuadro',
      venue_name: 'Club Pádel Cumbayá Stadium',
      referee_name: 'Juez Oficial FEP',
      vocal_name: 'Comisión Pádel Deporverso',
      court_surface: 'Césped Texturado Azul WPT',
      ticket_status: 'Pase VIP $5.00'
    },
    created_at: '2026-07-28T12:00:00Z'
  },

  // --- FÚTSAL 5 (Liga Metropolitana de Fútsal 5 - t-futsal-metro) ---
  {
    id: 'm-fut-live',
    tenant_id: 't-futsal-metro',
    category_id: 'cat-fut1',
    home_team_id: 'tm-fut1',
    away_team_id: 'tm-fut2',
    sport_code: 'FUTSAL',
    match_date: '2026-07-28T18:00:00Z',
    field_location: 'Coliseo Mayor - Cancha Central de Fútsal (Parquet)',
    status: 'IN_PROGRESS',
    home_score: 3,
    away_score: 2,
    match_data: {
      round: 'Fecha 2 - Copa Metropolitana Futsal 5',
      venue_name: 'Coliseo Mayor Central',
      referee_name: 'Árbitro FIFA Futsal Jorge Silva',
      vocal_name: 'Sr. David Paredes (Mesa Futsal)',
      court_surface: 'Piso Parquet Flotante Oficial FIFA',
      weather_temp: 'Techado Climatizado',
      ticket_status: 'Entrada $1.50',
      stream_url: 'https://youtube.com/live/deporverso-futsal',
      current_period: '2ND_HALF',
      fouls_home: 4,
      fouls_away: 5,
      is_public_published: true
    },
    created_at: '2026-07-28T17:00:00Z'
  },
  {
    id: 'm-fut-ind1',
    tenant_id: 't-futsal-metro',
    category_id: 'cat-fut1',
    home_team_id: 'tm-fut3',
    away_team_id: 'tm-fut4',
    sport_code: 'FUTSAL',
    match_date: '2026-07-24T20:00:00Z',
    field_location: 'Coliseo Parroquial San Juan - Cancha de Parquet',
    status: 'FINISHED',
    home_score: 6,
    away_score: 4,
    match_data: {
      round: 'Fecha 1 - Torneo Élite Fútsal 5',
      venue_name: 'Coliseo San Juan',
      referee_name: 'Árbitro Futsal Wilson Tapia',
      vocal_name: 'Sr. Germán Viteri',
      court_surface: 'Piso Sintético Poliuretano Antideslizante',
      weather_temp: '16°C Techado',
      ticket_status: 'Entrada $1.00',
      is_public_published: true
    },
    created_at: '2026-07-23T15:00:00Z'
  },
  {
    id: 'm-fut-ind2',
    tenant_id: 't-futsal-metro',
    category_id: 'cat-fut1',
    home_team_id: 'tm-fut2',
    away_team_id: 'tm-fut1',
    sport_code: 'FUTSAL',
    match_date: '2026-08-07T20:30:00Z',
    field_location: 'Coliseo Parroquial San Juan - Cancha de Parquet',
    status: 'SCHEDULED',
    home_score: 0,
    away_score: 0,
    match_data: {
      round: 'Fecha 3 - Gran Revancha Fútsal 5',
      venue_name: 'Coliseo San Juan',
      referee_name: 'Terna de Fútsal Metropolitana',
      vocal_name: 'Mesa de Control Futsal',
      court_surface: 'Poliuretano Techado',
      ticket_status: 'Entrada $1.00'
    },
    created_at: '2026-07-28T12:00:00Z'
  },

  // --- INDOOR 7 & 9 (Torneo Interclubes Indoor 7 & 9 - t-indoor-express) ---
  {
    id: 'm-ind-live',
    tenant_id: 't-indoor-express',
    category_id: 'cat-ind1',
    home_team_id: 'tm-ind1',
    away_team_id: 'tm-ind2',
    sport_code: 'FUTBOL',
    match_date: '2026-07-28T19:30:00Z',
    field_location: 'Complejo Indoor Express - Cancha 1 con Rebote (7 vs 7)',
    status: 'IN_PROGRESS',
    home_score: 4,
    away_score: 3,
    match_data: {
      round: 'Fecha 2 - Torneo Relámpago Indoor 7',
      venue_name: 'Cancha 1 Rebound Turf',
      referee_name: 'Árbitro Gonzalo Cevallos',
      vocal_name: 'Mesa Técnica Indoor',
      court_surface: 'Césped Sintético Monofilamento con Muros Perimetrales',
      weather_temp: '17°C Techado Iluminado',
      ticket_status: 'General $1.50',
      current_period: '2ND_HALF',
      fouls_home: 3,
      fouls_away: 2,
      is_public_published: true
    },
    created_at: '2026-07-28T18:00:00Z'
  },
  {
    id: 'm-ind-f1',
    tenant_id: 't-indoor-express',
    category_id: 'cat-ind2',
    home_team_id: 'tm-ind3',
    away_team_id: 'tm-ind4',
    sport_code: 'FUTBOL',
    match_date: '2026-07-25T16:00:00Z',
    field_location: 'Complejo Indoor Express - Cancha 2 Ampliada (9 vs 9)',
    status: 'FINISHED',
    home_score: 5,
    away_score: 2,
    match_data: {
      round: 'Fecha 1 - Apertura Indoor 9 Máster',
      venue_name: 'Cancha 2 Mega Turf',
      referee_name: 'Árbitro Patricio Córdova',
      vocal_name: 'Vocal Rodrigo Almendariz',
      court_surface: 'Césped Sintético 60mm',
      ticket_status: 'Entrada Libre',
      is_public_published: true
    },
    created_at: '2026-07-24T12:00:00Z'
  },
  {
    id: 'm-ind-sched',
    tenant_id: 't-indoor-express',
    category_id: 'cat-ind1',
    home_team_id: 'tm-ind1',
    away_team_id: 'tm-ind3',
    sport_code: 'FUTBOL',
    match_date: '2026-08-05T20:00:00Z',
    field_location: 'Complejo Indoor Express - Cancha 1 con Rebote (7 vs 7)',
    status: 'SCHEDULED',
    home_score: 0,
    away_score: 0,
    match_data: {
      round: 'Fecha 3 - Duelo Intergrupos Indoor',
      venue_name: 'Cancha 1 Rebound Turf',
      referee_name: 'Terna Designada Indoor',
      vocal_name: 'Mesa de Turno',
      court_surface: 'Césped Sintético Monofilamento',
      ticket_status: 'Preventa $1.00'
    },
    created_at: '2026-07-28T12:00:00Z'
  }
];

export const INITIAL_MATCH_EVENTS: MatchEvent[] = [
  {
    id: 'evt-1',
    tenant_id: 't-pichincha',
    match_id: 'm-live-futbol',
    team_id: 'tm-1',
    player_id: 'pl-2',
    event_type: 'GOAL',
    period: '1ST_HALF',
    timestamp_seconds: 1420,
    player_name: 'Santiago López',
    team_name: 'Deportivo Quito Norte',
    details: { description: 'Gol de remate cruzado con la pierna derecha' },
    created_at: '2026-07-28T10:23:00Z'
  },
  {
    id: 'evt-2',
    tenant_id: 't-pichincha',
    match_id: 'm-live-futbol',
    team_id: 'tm-2',
    player_id: 'pl-3',
    event_type: 'GOAL',
    period: '1ST_HALF',
    timestamp_seconds: 2100,
    player_name: 'Andrés Villacís',
    team_name: 'Atlético San Antonio',
    details: { description: 'Gol de tiro libre directo' },
    created_at: '2026-07-28T10:35:00Z'
  },
  {
    id: 'evt-3',
    tenant_id: 't-quito-basket',
    match_id: 'm-live-basket',
    team_id: 'tm-bk1',
    player_id: 'pl-4',
    event_type: 'BASKET_3',
    period: '4TH_QUARTER',
    timestamp_seconds: 480,
    player_name: 'Christian "La Torre" Silva',
    team_name: 'Grizzlies de Quito',
    details: { description: 'Triple decisivo desde la esquina derecha' },
    created_at: '2026-07-28T11:45:00Z'
  }
];

export const INITIAL_VAR_REQUESTS: VarRequest[] = [
  {
    id: 'var-101',
    tenant_id: 't-pichincha',
    match_id: 'm-live-futbol',
    fee_amount: 12.00,
    status: 'APPROVED',
    camera_angle: 'Cámara Línea de Gol / Área Chica',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    result_notes: 'Revisión VAR confirma la validez del gol por no existir fuera de juego.',
    created_at: '2026-07-28T10:25:00Z',
    match_title: 'Deportivo Quito Norte vs Atlético San Antonio'
  }
];

export const INITIAL_MIGRATION_TICKETS: MigrationTicket[] = [
  {
    id: 'tk-1001',
    tenant_id: 't-pichincha',
    source_system: 'Sistema Anterior / Excel',
    contact_email: 'pichincha.liga@gmail.com',
    contact_phone: '+593 99 888 7777',
    file_urls: ['plantilla_liga_2025.xlsx', 'actas_partidos.pdf'],
    status: 'IN_REVIEW',
    notes: 'Migración masiva de 24 equipos, 480 jugadores y historial de sanciones 2024-2025',
    created_at: '2026-07-26T14:30:00Z'
  }
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1',
    tenant_id: 't-pichincha',
    plan_tier: 'PRO_5',
    price_monthly: 5.00,
    status: 'ACTIVE',
    current_period_start: '2026-01-01T00:00:00Z',
    current_period_end: '2027-01-01T00:00:00Z'
  },
  {
    id: 'sub-2',
    tenant_id: 't-quito-basket',
    plan_tier: 'ENTERPRISE_8',
    price_monthly: 8.00,
    status: 'ACTIVE',
    current_period_start: '2026-02-01T00:00:00Z',
    current_period_end: '2027-02-01T00:00:00Z'
  },
  {
    id: 'sub-3',
    tenant_id: 't-azuay-ecuavoley',
    plan_tier: 'BASIC_3',
    price_monthly: 3.00,
    status: 'ACTIVE',
    current_period_start: '2026-03-01T00:00:00Z',
    current_period_end: '2027-03-01T00:00:00Z'
  }
];

export const INITIAL_CHRONICLES: AiChronicle[] = [
  {
    match_id: 'm-live-futbol',
    headline: '¡Triunfo Dramático en el Clásico Barrial! Deportivo Quito Norte Vence 2-1 con Gol Agónico de Santiago López',
    body: 'En un choque lleno de intensidad y apasionante despliegue físico en el Estadio Liga Barrial Pichincha, Deportivo Quito Norte selló una victoria memorable por 2-1 frente a un aguerrido Atlético San Antonio.\n\nEl encuentro inició con un alto ritmo táctico. Santiago López adelantó al cuadro local al minuto 23 con un derechazo potente tras asistencia de Mateo Guerrero. La respuesta de Atlético San Antonio no se hizo esperar, emparejando las acciones antes del descanso por intermedio de Andrés Villacís.\n\nEn la etapa complementaria, la mesa de control registrada en vivo y la asistencia técnica VAR confirmaron la máxima tensión. Un contragolpe fulminante en los minutos finales sentenció la victoria para el júbilo de la afición en las gradas.',
    key_moments: [
      'Min 23: Golazo de Santiago López tras habilitación de Mateo Guerrero (1-0).',
      'Min 38: Empate de Andrés Villacís con remate esquinado (1-1).',
      'Min 82: Revisión VAR aprobada por la mesa de control confirma jugada habilitada.',
      'Min 88: Gol agónico de la victoria para Deportivo Quito Norte (2-1).'
    ],
    tactical_notes: 'Deportivo Quito Norte explotó las transiciones rápidas por las bandas, mientras que San Antonio dominó la posesión en el mediocampo pero sufrió en el repliegue defensivo.',
    generated_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    match_id: 'm-live-basket',
    headline: 'Noche de Infarto en la Liga de Baloncesto: Halcones de Quito Mantiene la Lideranza en Cierre Ajustado',
    body: 'El Coliseo Julio César Hidalgo vivió una noche mágica de baloncesto de alto nivel. Halcones de Quito superó 68-64 a los Águilas del Sur en un duelo no apto para cardíacos.\n\nChristian "La Torre" Silva fue la figura indiscutible de la jornada con 24 puntos y 12 rebotes, dominando la zona pintada y bloqueando lanzamientos clave en el último cuarto.',
    key_moments: [
      '1º Cuarto: Parcial de 18-12 a favor de Halcones con triples espectaculares.',
      '3º Cuarto: Remontada de Águilas apretando el marcador a 52-50.',
      '4º Cuarto: Doble-doble de Christian Silva para asegurar el triunfo.'
    ],
    tactical_notes: 'Dominio absoluto de la pintura por parte de Silva y un excelente porcentaje de efectividad en tiros libres en la recta final del partido.',
    generated_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

