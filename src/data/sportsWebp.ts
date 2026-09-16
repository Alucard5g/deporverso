export interface SportWebpCard {
  id: string;
  name: string;
  icon: string;
  url: string;
  category: 'CAMPO' | 'CANCHA' | 'COMBATE' | 'AGUA_RUEDAS' | 'PRECISION';
  accentColor: string;
}

export const SPORTS_WEBP_CATALOG: SportWebpCard[] = [
  { id: 'futbol', name: 'Fútbol', icon: '⚽', url: '/sports/futbol.webp', category: 'CAMPO', accentColor: '#f59e0b' },
  { id: 'basquetbol', name: 'Básquetbol', icon: '🏀', url: '/sports/basquetbol.webp', category: 'CANCHA', accentColor: '#f97316' },
  { id: 'voleibol', name: 'Voleibol', icon: '🏐', url: '/sports/voleibol.webp', category: 'CANCHA', accentColor: '#eab308' },
  { id: 'futsal', name: 'Futsal', icon: '⚡', url: '/sports/futsal.webp', category: 'CANCHA', accentColor: '#10b981' },
  { id: 'tenis', name: 'Tenis', icon: '🎾', url: '/sports/tenis.webp', category: 'CANCHA', accentColor: '#84cc16' },
  { id: 'atletismo', name: 'Atletismo', icon: '🏃', url: '/sports/atletismo.webp', category: 'CAMPO', accentColor: '#fbbf24' },
  { id: 'boxeo', name: 'Boxeo', icon: '🥊', url: '/sports/boxeo.webp', category: 'COMBATE', accentColor: '#ef4444' },
  { id: 'beisbol', name: 'Béisbol', icon: '⚾', url: '/sports/beisbol.webp', category: 'CAMPO', accentColor: '#d97706' },
  { id: 'natacion', name: 'Natación', icon: '🏊', url: '/sports/natacion.webp', category: 'AGUA_RUEDAS', accentColor: '#06b6d4' },
  { id: 'ciclismo', name: 'Ciclismo', icon: '🚴', url: '/sports/ciclismo.webp', category: 'AGUA_RUEDAS', accentColor: '#14b8a6' },
  { id: 'padel', name: 'Pádel', icon: '🎾', url: '/sports/padel.webp', category: 'CANCHA', accentColor: '#22c55e' },
  { id: 'rugby', name: 'Rugby', icon: '🏉', url: '/sports/rugby.webp', category: 'CAMPO', accentColor: '#b45309' },
  { id: 'balonmano', name: 'Balonmano', icon: '🤾', url: '/sports/balonmano.webp', category: 'CANCHA', accentColor: '#f59e0b' },
  { id: 'gimnasia', name: 'Gimnasia', icon: '🤸', url: '/sports/gimnasia.webp', category: 'PRECISION', accentColor: '#a855f7' },
  { id: 'hockey', name: 'Hockey', icon: '🏑', url: '/sports/hockey.webp', category: 'CAMPO', accentColor: '#38bdf8' },
  { id: 'tenis_mesa', name: 'Tenis de Mesa', icon: '🏓', url: '/sports/tenis_mesa.webp', category: 'CANCHA', accentColor: '#f87171' },
  { id: 'taekwondo', name: 'Taekwondo', icon: '🥋', url: '/sports/taekwondo.webp', category: 'COMBATE', accentColor: '#fb923c' },
  { id: 'skateboarding', name: 'Skateboarding', icon: '🛹', url: '/sports/skateboarding.webp', category: 'AGUA_RUEDAS', accentColor: '#facc15' },
  { id: 'halterofilia', name: 'Halterofilia', icon: '🏋️', url: '/sports/halterofilia.webp', category: 'PRECISION', accentColor: '#fb7185' },
  { id: 'badminton', name: 'Bádminton', icon: '🏸', url: '/sports/badminton.webp', category: 'CANCHA', accentColor: '#2dd4bf' },
  { id: 'voleibol_playa', name: 'Vóley Playa', icon: '🏖️', url: '/sports/voleibol_playa.webp', category: 'CAMPO', accentColor: '#f59e0b' },
  { id: 'crossfit', name: 'CrossFit', icon: '🔥', url: '/sports/crossfit.webp', category: 'PRECISION', accentColor: '#ef4444' },
  { id: 'esgrima', name: 'Esgrima', icon: '🤺', url: '/sports/esgrima.webp', category: 'COMBATE', accentColor: '#e2e8f0' },
  { id: 'tiro_arco', name: 'Tiro con Arco', icon: '🏹', url: '/sports/tiro_arco.webp', category: 'PRECISION', accentColor: '#34d399' }
];
