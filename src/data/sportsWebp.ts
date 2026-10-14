export interface SportWebpCard {
  id: string;
  name: string;
  icon: string;
  url: string;
  category: 'CAMPO' | 'CANCHA' | 'COMBATE' | 'AGUA_RUEDAS' | 'PRECISION';
  accentColor: string;
}

export const SPORTS_WEBP_CATALOG: SportWebpCard[] = [
  { id: 'artes_marciales', name: 'Artes Marciales', icon: '🥋', url: '/sports/drive/artes_marciales_sq.webp', category: 'COMBATE', accentColor: '#ef4444' },
  { id: 'futbol', name: 'Fútbol', icon: '⚽', url: '/sports/drive/futbol_sq.webp', category: 'CAMPO', accentColor: '#f59e0b' },
  { id: 'basquetbol', name: 'Básquetbol', icon: '🏀', url: '/sports/drive/baloncesto_sq.webp', category: 'CANCHA', accentColor: '#f97316' },
  { id: 'voleibol', name: 'Voleibol', icon: '🏐', url: '/sports/drive/voleibol_sq.webp', category: 'CANCHA', accentColor: '#eab308' },
  { id: 'futsal', name: 'Futsal', icon: '⚡', url: '/sports/drive/futbol_sq.webp', category: 'CANCHA', accentColor: '#10b981' },
  { id: 'tenis', name: 'Tenis', icon: '🎾', url: '/sports/drive/tennis_sq.webp', category: 'CANCHA', accentColor: '#84cc16' },
  { id: 'cig_game', name: 'C.I.G Deporverso game', icon: '🎮', url: '/sports/drive/cig_game_sq.webp', category: 'CANCHA', accentColor: '#00F0FF' },
  { id: 'atletismo', name: 'Atletismo', icon: '🏃', url: '/sports/drive/atletismo_sq.webp', category: 'CAMPO', accentColor: '#fbbf24' },
  { id: 'boxeo', name: 'Boxeo', icon: '🥊', url: '/sports/drive/boxeo_sq.webp', category: 'COMBATE', accentColor: '#ef4444' },
  { id: 'beisbol', name: 'Béisbol', icon: '⚾', url: '/sports/drive/beisbol_sq.webp', category: 'CAMPO', accentColor: '#d97706' },
  { id: 'natacion', name: 'Natación', icon: '🏊', url: '/sports/drive/natacion_sq.webp', category: 'AGUA_RUEDAS', accentColor: '#06b6d4' },
  { id: 'ciclismo', name: 'Ciclismo', icon: '🚴', url: '/sports/drive/ciclismo_sq.webp', category: 'AGUA_RUEDAS', accentColor: '#14b8a6' },
  { id: 'padel', name: 'Pádel', icon: '🎾', url: '/sports/drive/tennis_sq.webp', category: 'CANCHA', accentColor: '#22c55e' },
  { id: 'rugby', name: 'Rugby', icon: '🏉', url: '/sports/drive/rugby_sq.webp', category: 'CAMPO', accentColor: '#b45309' },
  { id: 'balonmano', name: 'Balonmano', icon: '🤾', url: '/sports/drive/balonmano_sq.webp', category: 'CANCHA', accentColor: '#f59e0b' },
  { id: 'gimnasia', name: 'Gimnasia', icon: '🤸', url: '/sports/drive/gimnasia_sq.webp', category: 'PRECISION', accentColor: '#a855f7' },
  { id: 'hockey', name: 'Hockey', icon: '🏑', url: '/sports/drive/hockey_sq.webp', category: 'CAMPO', accentColor: '#38bdf8' },
  { id: 'tenis_mesa', name: 'Tenis de Mesa', icon: '🏓', url: '/sports/drive/tenis_mesa_sq.webp', category: 'CANCHA', accentColor: '#f87171' },
  { id: 'taekwondo', name: 'Taekwondo', icon: '🥋', url: '/sports/drive/taekwondo_sq.webp', category: 'COMBATE', accentColor: '#fb923c' },
  { id: 'skateboarding', name: 'Skateboarding', icon: '🛹', url: '/sports/drive/skateboarding_sq.webp', category: 'AGUA_RUEDAS', accentColor: '#facc15' },
  { id: 'halterofilia', name: 'Halterofilia', icon: '🏋️', url: '/sports/drive/halterofilia_sq.webp', category: 'PRECISION', accentColor: '#fb7185' },
  { id: 'badminton', name: 'Bádminton', icon: '🏸', url: '/sports/drive/tennis_sq.webp', category: 'CANCHA', accentColor: '#2dd4bf' },
  { id: 'voleibol_playa', name: 'Vóley Playa', icon: '🏖️', url: '/sports/drive/voleibol_playa_sq.webp', category: 'CAMPO', accentColor: '#f59e0b' },
  { id: 'crossfit', name: 'CrossFit', icon: '🔥', url: '/sports/drive/crossfit_sq.webp', category: 'PRECISION', accentColor: '#ef4444' },
  { id: 'esgrima', name: 'Esgrima', icon: '🤺', url: '/sports/drive/esgrima_sq.webp', category: 'COMBATE', accentColor: '#e2e8f0' },
  { id: 'tiro_arco', name: 'Tiro con Arco', icon: '🏹', url: '/sports/drive/tiro_arco_sq.webp', category: 'PRECISION', accentColor: '#34d399' },
  { id: 'futbol_americano', name: 'Fútbol Americano', icon: '🏈', url: '/sports/drive/futbol_americano_sq.webp', category: 'CAMPO', accentColor: '#ea580c' }
];
