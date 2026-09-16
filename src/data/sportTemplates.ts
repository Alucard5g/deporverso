import { SportCode } from '../types';

export interface ExampleTeam {
  id: string;
  name: string;
  badgeEmoji: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  delegate: string;
  phone: string;
  playersCount: number;
  captain: string;
  formation: string;
  keyPlayers: { number: number; name: string; position: string; hasQr: boolean }[];
}

export interface LeagueSegment {
  id: string;
  title: string;
  badge: string;
  colorClass: string;
  borderClass: string;
  bgClass: string;
  ageRequirement: string;
  duration: string;
  rules: string[];
  features: string[];
  fixtureSummary: string;
}

export interface SportCatalogItem {
  code: SportCode;
  name: string;
  icon: string;
  badge: string;
  desc: string;
  automationFocus: string;
}

export const SPORTS_CATALOG: SportCatalogItem[] = [
  { 
    code: 'FUTBOL', 
    name: 'Fútbol 11 / 7', 
    icon: '⚽', 
    badge: 'Reglamento FIFA', 
    desc: '11 vs 11 o 7 vs 7, tiempos reglamentarios, actas electrónicas y Módulo VAR',
    automationFocus: 'Control de tarjetas acumuladas, planillas digitales y actas arbitrales'
  },
  { 
    code: 'PADEL', 
    name: 'Pádel', 
    icon: '🎾', 
    badge: 'FIP / Circuito', 
    desc: 'Parejas, sets a 6 games, punto de oro, cuadros eliminatorios y rankings ELO',
    automationFocus: 'Generador de llaves/brackets, rankings por parejas y control de tie-breaks'
  },
  { 
    code: 'BEISBOL', 
    name: 'Béisbol', 
    icon: '⚾', 
    badge: '9 Innings / Boxscore', 
    desc: 'Carreras, outs, strikes, bolas, conteo de pitcheo (pitch count) y boxscore oficial',
    automationFocus: 'Radar de lanzamientos, control de límites de pitcheo juvenil y boxscore inning por inning'
  },
  { 
    code: 'SOFTBOL', 
    name: 'Sóftbol', 
    icon: '🥎', 
    badge: '7 Innings Molinete', 
    desc: 'Lanzamiento por debajo del hombro, Mercy Rule (diferencia 10 carreras) y slowpitch',
    automationFocus: 'Reglas de misericordia automatizadas, categorías mixtas y estadísticas de bateo'
  },
  { 
    code: 'FUTBOL_AMERICANO', 
    name: 'Fútbol Americano / Flag', 
    icon: '🏈', 
    badge: '4 Downs / 10 Yds', 
    desc: '4 cuartos, avances de 10 yardas, Touchdowns (+6), conversiones y tackle/flag',
    automationFocus: 'Rastreo de yardas por posesión, reloj de jugada (play clock) y telemetría de downs'
  },
  { 
    code: 'ARTES_MARCIALES', 
    name: 'Artes Marciales / MMA / Box', 
    icon: '🥋', 
    badge: '10-9 Must / Pesaje', 
    desc: 'Combates por asaltos (rounds), pesajes por división, tarjetas de jueces y KO/Sumisión',
    automationFocus: 'Tarjetas electrónicas de 3 jueces laterales, control de pesaje previo y récords Pro/Am'
  },
  { 
    code: 'TENNIS', 
    name: 'Tenis (Singles & Dobles)', 
    icon: '🎾', 
    badge: 'ATP / ITF Circuito', 
    desc: 'Singles y dobles, games 15-30-40, ventajas, súper tie-break y ranking de socios',
    automationFocus: 'Cuadros de cabezas de serie, cálculo dinámico de puntos de ranking y reservas de cancha'
  },
  { 
    code: 'ECUAVOLEY', 
    name: 'Ecuavoley', 
    icon: '🏐', 
    badge: 'Puntos & Cambios', 
    desc: '3 vs 3 tradicional ecuatoriano: Colocador, Servidor, Volador, batida y puntos',
    automationFocus: 'Motor de cambios y puntos directos, control de batida y registro de apuestas reglamentadas'
  },
  { 
    code: 'BALONCESTO', 
    name: 'Baloncesto', 
    icon: '🏀', 
    badge: 'FIBA 4 Cuartos', 
    desc: 'Anotaciones de 1, 2 y 3 puntos, acumulación de faltas colectivas y reloj 24s',
    automationFocus: 'Cronómetro integrado con bocina digital, faltas personales y tiro libre automatizado'
  },
  { 
    code: 'FUTSAL', 
    name: 'Fútsal / Microfútbol', 
    icon: '👟', 
    badge: '5v5 Acumuladas', 
    desc: '5 jugadores, tarjeta azul, faltas acumuladas (tiro libre sin barrera) y cancha techada',
    automationFocus: 'Conteo de faltas acumuladas por tiempo, tarjeta azul temporal y planilla rápida'
  },
  { 
    code: 'VOLEIBOL', 
    name: 'Voleibol Sala / Playa', 
    icon: '🏐', 
    badge: 'FIVB 25 Pts', 
    desc: 'Sets a 25 puntos con diferencia de 2, rotaciones reglamentarias y jugador líbero',
    automationFocus: 'Control de rotaciones obligatorias, sustitución de líbero y sets a 25/15 puntos'
  },
  { 
    code: 'OTROS', 
    name: 'Multideporte / Todo Deporte', 
    icon: '🏆', 
    badge: 'Modular 100%', 
    desc: 'Cualquier disciplina deportiva que requiera fixture, carnetización QR y automatización de liga',
    automationFocus: 'Módulo adaptable con reglas personalizables, tabla general y actas digitales'
  }
];

// Helper to get 5 Example Teams based on sport
export function getExampleTeamsForSport(sport: SportCode): ExampleTeam[] {
  switch (sport) {
    case 'PADEL':
      return [
        {
          id: 'padel-1',
          name: 'Dupla Smash & Volea (Padel Pro Club)',
          badgeEmoji: '🎾',
          primaryColor: '#0ea5e9',
          secondaryColor: '#0284c7',
          textColor: '#ffffff',
          delegate: 'Santiago Rivas',
          phone: '+593 99 234 5678',
          playersCount: 4,
          captain: 'Santiago Rivas (Drive)',
          formation: 'Pareja Clásica (Drive + Revés)',
          keyPlayers: [
            { number: 1, name: 'Santiago Rivas', position: 'Jugador de Drive (Control)', hasQr: true },
            { number: 2, name: 'Martín Galindo', position: 'Jugador de Revés (Definidor)', hasQr: true },
            { number: 3, name: 'Esteban Coka', position: 'Suplente / Reserva Drive', hasQr: true },
            { number: 4, name: 'David Peña', position: 'Suplente / Reserva Revés', hasQr: true }
          ]
        },
        {
          id: 'padel-2',
          name: 'Víbora & Bandeja Padel Team',
          badgeEmoji: '⚡',
          primaryColor: '#eab308',
          secondaryColor: '#000000',
          textColor: '#000000',
          delegate: 'Nicolás Andrade',
          phone: '+593 98 765 4321',
          playersCount: 4,
          captain: 'Nicolás Andrade (#7)',
          formation: 'Agresiva en Red',
          keyPlayers: [
            { number: 7, name: 'Nicolás Andrade', position: 'Revés Ofensivo', hasQr: true },
            { number: 10, name: 'Mateo Borja', position: 'Drive Estratégico', hasQr: true },
            { number: 11, name: 'Diego Terán', position: 'Reserva General', hasQr: true },
            { number: 15, name: 'Joaquín Mora', position: 'Reserva General', hasQr: true }
          ]
        },
        {
          id: 'padel-3',
          name: 'Club Padel Center Los Valles',
          badgeEmoji: '🏆',
          primaryColor: '#10b981',
          secondaryColor: '#ffffff',
          textColor: '#ffffff',
          delegate: 'Ing. Felipe Moncayo',
          phone: '+593 99 876 5432',
          playersCount: 6,
          captain: 'Carlos Dávila',
          formation: 'Defensa de Cristal',
          keyPlayers: [
            { number: 5, name: 'Carlos Dávila', position: 'Drive Defensivo', hasQr: true },
            { number: 8, name: 'Juan Pablo Vera', position: 'Revés Rematador', hasQr: true },
            { number: 9, name: 'Ricardo Falconí', position: 'Pareja B Drive', hasQr: true },
            { number: 12, name: 'Pablo Endara', position: 'Pareja B Revés', hasQr: true }
          ]
        },
        {
          id: 'padel-4',
          name: 'Padelistas de la Sierra',
          badgeEmoji: '🏔️',
          primaryColor: '#8b5cf6',
          secondaryColor: '#ffffff',
          textColor: '#ffffff',
          delegate: 'Sebastián Noboa',
          phone: '+593 97 123 9876',
          playersCount: 4,
          captain: 'Sebastián Noboa',
          formation: 'Transición Rápida',
          keyPlayers: [
            { number: 3, name: 'Sebastián Noboa', position: 'Drive Polivalente', hasQr: true },
            { number: 4, name: 'Gabriel Valarezo', position: 'Revés Aéreo', hasQr: true }
          ]
        },
        {
          id: 'padel-5',
          name: 'Master Padel Tour 40+',
          badgeEmoji: '🥇',
          primaryColor: '#f97316',
          secondaryColor: '#000000',
          textColor: '#ffffff',
          delegate: 'Marcelo Carrera',
          phone: '+593 99 555 4433',
          playersCount: 6,
          captain: 'Marcelo Carrera',
          formation: 'Táctica Veteranos',
          keyPlayers: [
            { number: 1, name: 'Marcelo Carrera', position: 'Drive de Precisión', hasQr: true },
            { number: 2, name: 'Guillermo Paz', position: 'Revés Colocado', hasQr: true }
          ]
        }
      ];

    case 'BEISBOL':
      return [
        {
          id: 'bb-1',
          name: 'Cardenales del Diamante BBC',
          badgeEmoji: '⚾',
          primaryColor: '#dc2626',
          secondaryColor: '#ffffff',
          textColor: '#ffffff',
          delegate: 'Rafael Santana',
          phone: '+593 99 111 2233',
          playersCount: 18,
          captain: 'Carlos Betancourt (Pitcher)',
          formation: 'Lineup Poder Ofensivo',
          keyPlayers: [
            { number: 34, name: 'Carlos Betancourt', position: 'Pitcher Abridor (Lanzador)', hasQr: true },
            { number: 12, name: 'Moisés Arrieta', position: 'Catcher (Receptor)', hasQr: true },
            { number: 24, name: 'Nelson Cabrera', position: 'Primera Base (1B)', hasQr: true },
            { number: 6, name: 'Javier Guillén', position: 'Shortstop (Campocorto)', hasQr: true },
            { number: 99, name: 'Anthony Rivas', position: 'Bateador Designado (DH)', hasQr: true }
          ]
        },
        {
          id: 'bb-2',
          name: 'Tiburones de la Costa',
          badgeEmoji: '🦈',
          primaryColor: '#0284c7',
          secondaryColor: '#f59e0b',
          textColor: '#ffffff',
          delegate: 'Oswaldo Guillén',
          phone: '+593 98 222 3344',
          playersCount: 19,
          captain: 'Franklin Romero (#10)',
          formation: 'Defensiva de Cuadro Rápida',
          keyPlayers: [
            { number: 45, name: 'Yorman Bazardo', position: 'Lanzador Relevista', hasQr: true },
            { number: 8, name: 'Franklin Romero', position: 'Segunda Base (2B)', hasQr: true },
            { number: 5, name: 'Alexánder Escobar', position: 'Tercera Base (3B)', hasQr: true },
            { number: 27, name: 'Ender Inciarte', position: 'Center Field (Jardín Central)', hasQr: true }
          ]
        },
        {
          id: 'bb-3',
          name: 'Gigantes del Norte',
          badgeEmoji: '🦁',
          primaryColor: '#ea580c',
          secondaryColor: '#000000',
          textColor: '#ffffff',
          delegate: 'Armando Benítez',
          phone: '+593 99 333 4455',
          playersCount: 20,
          captain: 'Jesús Montero (#44)',
          formation: 'Velocidad en Bases',
          keyPlayers: [
            { number: 21, name: 'Jesús Montero', position: 'Catcher / Cuarto Bate', hasQr: true },
            { number: 31, name: 'Ugueth Urbina', position: 'Pitcher Cerrador', hasQr: true }
          ]
        },
        {
          id: 'bb-4',
          name: 'Leones de la Bahía BBC',
          badgeEmoji: '👑',
          primaryColor: '#eab308',
          secondaryColor: '#1e3a8a',
          textColor: '#000000',
          delegate: 'Víctor Davalillo',
          phone: '+593 97 444 5566',
          playersCount: 17,
          captain: 'César Tovar (#1)',
          formation: 'Contacto y Toque de Bola',
          keyPlayers: [
            { number: 1, name: 'César Tovar', position: 'Right Field (Jardín Derecho)', hasQr: true },
            { number: 18, name: 'Melvin Mora', position: 'Left Field (Jardín Izquierdo)', hasQr: true }
          ]
        },
        {
          id: 'bb-5',
          name: 'Águilas de Pichincha',
          badgeEmoji: '🦅',
          primaryColor: '#0f766e',
          secondaryColor: '#ffffff',
          textColor: '#ffffff',
          delegate: 'Luis Sojo',
          phone: '+593 99 555 6677',
          playersCount: 18,
          captain: 'David Concepción (#13)',
          formation: 'Fundamentos de Pitcheo',
          keyPlayers: [
            { number: 13, name: 'David Concepción', position: 'Campocorto Estelar', hasQr: true },
            { number: 50, name: 'Freddy García', position: 'Pitcher Abridor', hasQr: true }
          ]
        }
      ];

    case 'SOFTBOL':
      return [
        {
          id: 'sb-1',
          name: 'Amazonas Sóftbol Club (Femenino Molinete)',
          badgeEmoji: '🥎',
          primaryColor: '#db2777',
          secondaryColor: '#ffffff',
          textColor: '#ffffff',
          delegate: 'Lcda. María Elena Prado',
          phone: '+593 99 333 7788',
          playersCount: 15,
          captain: 'Dayana Sánchez (Pitcher Molinete)',
          formation: 'Fastpitch 7 Innings',
          keyPlayers: [
            { number: 10, name: 'Dayana Sánchez', position: 'Lanzadora Molinete (Pitcher)', hasQr: true },
            { number: 5, name: 'Gabriela Cruz', position: 'Receptora (Catcher)', hasQr: true },
            { number: 7, name: 'Valeria Loor', position: 'Campocorto (SS)', hasQr: true },
            { number: 14, name: 'Paola Rosero', position: 'Primera Base', hasQr: true }
          ]
        },
        {
          id: 'sb-2',
          name: 'Rangers Fastpitch Masculino',
          badgeEmoji: '⚡',
          primaryColor: '#2563eb',
          secondaryColor: '#f97316',
          textColor: '#ffffff',
          delegate: 'Ing. Carlos Zambrano',
          phone: '+593 98 444 8899',
          playersCount: 16,
          captain: 'Roberto Macías (#3)',
          formation: 'Lanzamiento Rápido',
          keyPlayers: [
            { number: 3, name: 'Roberto Macías', position: 'Lanzador Molinete', hasQr: true },
            { number: 9, name: 'Fabricio Solís', position: 'Tercera Base', hasQr: true }
          ]
        },
        {
          id: 'sb-3',
          name: 'Cerveceros Slowpitch Mixto',
          badgeEmoji: '🍺',
          primaryColor: '#f59e0b',
          secondaryColor: '#000000',
          textColor: '#000000',
          delegate: 'Diego Salazar',
          phone: '+593 99 555 9900',
          playersCount: 18,
          captain: 'Andrés Viteri (#22)',
          formation: 'Slowpitch Recreativo (Arco Alto)',
          keyPlayers: [
            { number: 22, name: 'Andrés Viteri', position: 'Bateador de Poder', hasQr: true },
            { number: 11, name: 'Lorena Cadena', position: 'Segunda Base', hasQr: true }
          ]
        },
        {
          id: 'sb-4',
          name: 'Diamantes de Quito Sóftbol',
          badgeEmoji: '💎',
          primaryColor: '#06b6d4',
          secondaryColor: '#ffffff',
          textColor: '#000000',
          delegate: 'Patricia Mendoza',
          phone: '+593 97 666 0011',
          playersCount: 15,
          captain: 'Carla Villacís (#12)',
          formation: 'Femenino Juvenil U19',
          keyPlayers: [
            { number: 12, name: 'Carla Villacís', position: 'Jardinera Central', hasQr: true }
          ]
        },
        {
          id: 'sb-5',
          name: 'Veteranos Sóftbol Máster 50+',
          badgeEmoji: '🏆',
          primaryColor: '#475569',
          secondaryColor: '#e2e8f0',
          textColor: '#ffffff',
          delegate: 'Julio Narváez',
          phone: '+593 99 777 1122',
          playersCount: 17,
          captain: 'Julio Narváez (#8)',
          formation: 'Modificado Adultos',
          keyPlayers: [
            { number: 8, name: 'Julio Narváez', position: 'Lanzador Modificado', hasQr: true }
          ]
        }
      ];

    case 'FUTBOL_AMERICANO':
      return [
        {
          id: 'fa-1',
          name: 'Quito Condors Football (Tackle 11v11)',
          badgeEmoji: '🏈',
          primaryColor: '#1e3a8a',
          secondaryColor: '#f59e0b',
          textColor: '#ffffff',
          delegate: 'Coach Javier Ramos',
          phone: '+593 99 888 1234',
          playersCount: 35,
          captain: 'Mateo Guerrero (QB #12)',
          formation: 'Spread Offense / 4-3 Defense',
          keyPlayers: [
            { number: 12, name: 'Mateo Guerrero', position: 'Quarterback (Mariscal de Campo)', hasQr: true },
            { number: 88, name: 'Daniel Pazmiño', position: 'Wide Receiver (Receptor Abierto)', hasQr: true },
            { number: 22, name: 'Esteban Cárdenas', position: 'Running Back (Corredor)', hasQr: true },
            { number: 55, name: 'Santiago Loor', position: 'Middle Linebacker (MLB)', hasQr: true },
            { number: 21, name: 'Kevin Morales', position: 'Cornerback (Esquinero)', hasQr: true }
          ]
        },
        {
          id: 'fa-2',
          name: 'Spartans Flag Football 7v7',
          badgeEmoji: '🛡️',
          primaryColor: '#b91c1c',
          secondaryColor: '#ffffff',
          textColor: '#ffffff',
          delegate: 'Coach Andrés Vaca',
          phone: '+593 98 999 2345',
          playersCount: 14,
          captain: 'David Falconí (QB #7)',
          formation: 'No Contact Flag Rápido',
          keyPlayers: [
            { number: 7, name: 'David Falconí', position: 'Quarterback Flag', hasQr: true },
            { number: 11, name: 'Pablo Erazo', position: 'Slot Receiver', hasQr: true },
            { number: 23, name: 'Bryan Villalba', position: 'Rusher / Presión', hasQr: true }
          ]
        },
        {
          id: 'fa-3',
          name: 'Valkirias Flag Football Femenino',
          badgeEmoji: '⚡',
          primaryColor: '#7c3aed',
          secondaryColor: '#38bdf8',
          textColor: '#ffffff',
          delegate: 'Coach Valeria Suárez',
          phone: '+593 99 111 3456',
          playersCount: 15,
          captain: 'Camila Endara (QB #10)',
          formation: 'Air Raid 5v5 Femenino',
          keyPlayers: [
            { number: 10, name: 'Camila Endara', position: 'Quarterback Femenina', hasQr: true },
            { number: 80, name: 'Sofía Reinoso', position: 'Wide Receiver Elusiva', hasQr: true }
          ]
        },
        {
          id: 'fa-4',
          name: 'Titanes del Guayas Football',
          badgeEmoji: '🔱',
          primaryColor: '#0284c7',
          secondaryColor: '#000000',
          textColor: '#ffffff',
          delegate: 'Coach Roberto Chong',
          phone: '+593 97 222 4567',
          playersCount: 32,
          captain: 'Galo Viteri (#52 LB)',
          formation: 'Power I-Formation',
          keyPlayers: [
            { number: 52, name: 'Galo Viteri', position: 'Linebacker Capitán', hasQr: true }
          ]
        },
        {
          id: 'fa-5',
          name: 'Warriors Football Juvenil U18',
          badgeEmoji: '🏹',
          primaryColor: '#15803d',
          secondaryColor: '#eab308',
          textColor: '#ffffff',
          delegate: 'Coach Marcelo Benavides',
          phone: '+593 99 333 5678',
          playersCount: 28,
          captain: 'Sebastián Carrera (#18)',
          formation: 'Pistol Offense',
          keyPlayers: [
            { number: 18, name: 'Sebastián Carrera', position: 'Quarterback Juvenil', hasQr: true }
          ]
        }
      ];

    case 'ARTES_MARCIALES':
      return [
        {
          id: 'mma-1',
          name: 'Academia Cobra Combat & BJJ',
          badgeEmoji: '🥋',
          primaryColor: '#000000',
          secondaryColor: '#ef4444',
          textColor: '#ffffff',
          delegate: 'Prof. Carlos "El Toro" Benítez (Cinturón Negro)',
          phone: '+593 99 777 8899',
          playersCount: 22,
          captain: 'Marcos Viteri (Campeón Peso Ligero 70kg)',
          formation: 'Striking + Lucha + Jiu-Jitsu',
          keyPlayers: [
            { number: 1, name: 'Marcos Viteri', position: 'MMA Pro Peso Ligero (70.3 kg)', hasQr: true },
            { number: 2, name: 'Daniela Salazar', position: 'BJJ Femenino Peso Mosca (56.7 kg)', hasQr: true },
            { number: 3, name: 'Jorge "El Demoledor" Silva', position: 'Muay Thai Peso Wélter (77.1 kg)', hasQr: true },
            { number: 4, name: 'Esteban Coka', position: 'Boxeo Amateur Peso Medio (83.9 kg)', hasQr: true },
            { number: 5, name: 'Alexis Ibarra', position: 'Cinturón Marrón No-Gi', hasQr: true }
          ]
        },
        {
          id: 'mma-2',
          name: 'Dojo Bushido MMA Team',
          badgeEmoji: '⚔️',
          primaryColor: '#991b1b',
          secondaryColor: '#ffffff',
          textColor: '#ffffff',
          delegate: 'Sensei Hiroshi Noboa',
          phone: '+593 98 888 9900',
          playersCount: 18,
          captain: 'Kevin "El Samurai" Quishpe (#66kg)',
          formation: 'Judo + Grappling Olímpico',
          keyPlayers: [
            { number: 10, name: 'Kevin Quishpe', position: 'MMA Peso Pluma (65.8 kg)', hasQr: true },
            { number: 12, name: 'Paúl Caicedo', position: 'Lucha Grecorromana 74kg', hasQr: true }
          ]
        },
        {
          id: 'mma-3',
          name: 'Club de Boxeo Golden Ring',
          badgeEmoji: '🥊',
          primaryColor: '#eab308',
          secondaryColor: '#09090b',
          textColor: '#000000',
          delegate: 'Entrenador Segundo Mercado',
          phone: '+593 99 999 0011',
          playersCount: 25,
          captain: 'David "Puño de Hierro" Cedeño',
          formation: 'Boxeo Olímpico y Profesional',
          keyPlayers: [
            { number: 7, name: 'David Cedeño', position: 'Boxeo Peso Crucero (90.7 kg)', hasQr: true },
            { number: 8, name: 'Marcos Benítez', position: 'Boxeo Peso Gallo (53.5 kg)', hasQr: true }
          ]
        },
        {
          id: 'mma-4',
          name: 'Gladiadores Kickboxing & K-1',
          badgeEmoji: '🔥',
          primaryColor: '#ea580c',
          secondaryColor: '#ffffff',
          textColor: '#ffffff',
          delegate: 'Prof. Mario Alvear',
          phone: '+593 97 000 1122',
          playersCount: 16,
          captain: 'Fabián Carrera (#75kg K-1)',
          formation: 'Low Kicks y Rodillas',
          keyPlayers: [
            { number: 9, name: 'Fabián Carrera', position: 'Striker K-1 Pro', hasQr: true }
          ]
        },
        {
          id: 'mma-5',
          name: 'Spartan BJJ & Grappling Submission',
          badgeEmoji: '🐍',
          primaryColor: '#1e293b',
          secondaryColor: '#38bdf8',
          textColor: '#ffffff',
          delegate: 'Prof. Renato Aguirre',
          phone: '+593 99 111 2233',
          playersCount: 20,
          captain: 'José Cárdenas (Cinturón Negro BJJ)',
          formation: 'Sumisión Only / EBI Rules',
          keyPlayers: [
            { number: 99, name: 'José Cárdenas', position: 'Grappler Absoluto', hasQr: true }
          ]
        }
      ];

    case 'TENNIS':
      return [
        {
          id: 'ten-1',
          name: 'Club de Tenis Los Andes',
          badgeEmoji: '🎾',
          primaryColor: '#15803d',
          secondaryColor: '#ffffff',
          textColor: '#ffffff',
          delegate: 'Lic. Andrés Gómez',
          phone: '+593 99 444 5566',
          playersCount: 12,
          captain: 'Nicolás Lapentti Jr. (Singles 1)',
          formation: 'Singles 1, 2 + Dobles Oficial',
          keyPlayers: [
            { number: 1, name: 'Nicolás Lapentti Jr.', position: 'Singles 1 (Primera Categoría ATP)', hasQr: true },
            { number: 2, name: 'Emilio Campozano', position: 'Singles 2 (Revés a una mano)', hasQr: true },
            { number: 3, name: 'Gonzalo Escobar', position: 'Dobles Especialista 1', hasQr: true },
            { number: 4, name: 'Roberto Quiroz', position: 'Dobles Especialista 2', hasQr: true }
          ]
        },
        {
          id: 'ten-2',
          name: 'Raquetas del Valle Country Club',
          badgeEmoji: '🏆',
          primaryColor: '#0284c7',
          secondaryColor: '#eab308',
          textColor: '#ffffff',
          delegate: 'Ing. Fernando Ycaza',
          phone: '+593 98 555 6677',
          playersCount: 14,
          captain: 'Julio Peralta (#Singles A)',
          formation: 'Fondo de Pista y Saque Red',
          keyPlayers: [
            { number: 5, name: 'Julio Peralta', position: 'Singles A', hasQr: true },
            { number: 6, name: 'Martín Zormann', position: 'Singles B', hasQr: true }
          ]
        },
        {
          id: 'ten-3',
          name: 'Academia Match Point Tennis',
          badgeEmoji: '⚡',
          primaryColor: '#dc2626',
          secondaryColor: '#000000',
          textColor: '#ffffff',
          delegate: 'Prof. Raúl Viver',
          phone: '+593 99 666 7788',
          playersCount: 16,
          captain: 'Diego Hidalgo (#1)',
          formation: 'Alta Competencia Juvenil',
          keyPlayers: [
            { number: 7, name: 'Diego Hidalgo', position: 'Singles U18', hasQr: true }
          ]
        },
        {
          id: 'ten-4',
          name: 'Tenis Damas y Mixtos Pichincha',
          badgeEmoji: '🌸',
          primaryColor: '#d946ef',
          secondaryColor: '#ffffff',
          textColor: '#ffffff',
          delegate: 'Dra. María Dolores Dávila',
          phone: '+593 97 777 8899',
          playersCount: 12,
          captain: 'Camila Romero (#Damas 1)',
          formation: 'Circuito Femenino y Mixto',
          keyPlayers: [
            { number: 10, name: 'Camila Romero', position: 'Singles Damas Primera', hasQr: true }
          ]
        },
        {
          id: 'ten-5',
          name: 'Masters Tenis Senior 50+',
          badgeEmoji: '🥇',
          primaryColor: '#b45309',
          secondaryColor: '#fef3c7',
          textColor: '#ffffff',
          delegate: 'Dr. Alberto Viteri',
          phone: '+593 99 888 9900',
          playersCount: 10,
          captain: 'Dr. Alberto Viteri',
          formation: 'Veteranos Dobles',
          keyPlayers: [
            { number: 8, name: 'Dr. Alberto Viteri', position: 'Dobles Máster', hasQr: true }
          ]
        }
      ];

    case 'ECUAVOLEY':
      return [
        {
          id: 'ecu-1',
          name: 'Trío Los Voladores del Sur',
          badgeEmoji: '🏐',
          primaryColor: '#0284c7',
          secondaryColor: '#ffffff',
          textColor: '#ffffff',
          delegate: 'Don Gonzalo Pillajo',
          phone: '+593 99 123 4567',
          playersCount: 5,
          captain: 'Nelson "El Cañón" Guachamín',
          formation: '3 Jugadores: Colocador, Servidor, Volador',
          keyPlayers: [
            { number: 10, name: 'Nelson Guachamín', position: 'Colocador de Punta (Ganchador)', hasQr: true },
            { number: 8, name: 'Washington Chiluisa', position: 'Servidor Fino (Armador de Mano)', hasQr: true },
            { number: 1, name: 'Marco Benítez', position: 'Volador Espectacular (Defensa de Suelo)', hasQr: true },
            { number: 2, name: 'Galo Viteri', position: 'Suplente Polivalente', hasQr: true }
          ]
        },
        {
          id: 'ecu-2',
          name: 'Selección de Ecuavoley El Arbolito',
          badgeEmoji: '🌳',
          primaryColor: '#15803d',
          secondaryColor: '#facc15',
          textColor: '#ffffff',
          delegate: 'Sr. Wilson Carrera',
          phone: '+593 98 234 5678',
          playersCount: 5,
          captain: 'Carlos "El Mago" Narváez',
          formation: 'Colocada Corta al Clavo',
          keyPlayers: [
            { number: 7, name: 'Carlos Narváez', position: 'Colocador Técnico', hasQr: true },
            { number: 4, name: 'Esteban Loor', position: 'Servidor Alto', hasQr: true },
            { number: 3, name: 'Paúl Caicedo', position: 'Volador Rápido', hasQr: true }
          ]
        },
        {
          id: 'ecu-3',
          name: 'Trío Dinamita de Guamaní',
          badgeEmoji: '🧨',
          primaryColor: '#dc2626',
          secondaryColor: '#000000',
          textColor: '#ffffff',
          delegate: 'Sr. Jorge Alvear',
          phone: '+593 99 345 6789',
          playersCount: 4,
          captain: 'David "El Rayo" Cedeño',
          formation: 'Batida Fuerte y Bloqueo',
          keyPlayers: [
            { number: 9, name: 'David Cedeño', position: 'Colocador Fuerte', hasQr: true },
            { number: 5, name: 'Xavier López', position: 'Servidor Firme', hasQr: true }
          ]
        },
        {
          id: 'ecu-4',
          name: 'Trío Relámpago de Carapungo',
          badgeEmoji: '⚡',
          primaryColor: '#eab308',
          secondaryColor: '#09090b',
          textColor: '#000000',
          delegate: 'Sr. Fernando Castro',
          phone: '+593 97 456 7890',
          playersCount: 4,
          captain: 'Bryan Romero (#11)',
          formation: 'Defensa Hermética',
          keyPlayers: [
            { number: 11, name: 'Bryan Romero', position: 'Colocador', hasQr: true }
          ]
        },
        {
          id: 'ecu-5',
          name: 'Ecuavoley Máster Cuarentones',
          badgeEmoji: '🏆',
          primaryColor: '#475569',
          secondaryColor: '#ffffff',
          textColor: '#ffffff',
          delegate: 'Sr. Diego Vivanco',
          phone: '+593 99 567 8901',
          playersCount: 5,
          captain: 'Damián Ledesma (#1)',
          formation: 'Tradicional 12 Puntos',
          keyPlayers: [
            { number: 1, name: 'Damián Ledesma', position: 'Colocador Veterano', hasQr: true }
          ]
        }
      ];

    case 'BALONCESTO':
      return [
        {
          id: 'bk-1',
          name: 'Spartans Basketball Club',
          badgeEmoji: '🏀',
          primaryColor: '#b91c1c',
          secondaryColor: '#f59e0b',
          textColor: '#ffffff',
          delegate: 'Coach Fernando Otero',
          phone: '+593 99 666 1122',
          playersCount: 14,
          captain: 'Carlos Delgado (Base #5)',
          formation: '1 Base, 2 Escoltas, 1 Alero, 1 Pívot',
          keyPlayers: [
            { number: 5, name: 'Carlos Delgado', position: 'Base Armador (Point Guard)', hasQr: true },
            { number: 23, name: 'Mateo Cárdenas', position: 'Escolta Tirador (Shooting Guard)', hasQr: true },
            { number: 11, name: 'Andrés Morales', position: 'Alero Atlético (Small Forward)', hasQr: true },
            { number: 33, name: 'Patricio Loor', position: 'Ala-Pívot Fuerte (Power Forward)', hasQr: true },
            { number: 50, name: 'Marcos Benítez', position: 'Pívot Centro (Center 2.05m)', hasQr: true }
          ]
        },
        {
          id: 'bk-2',
          name: 'Warriors del Valle Basket',
          badgeEmoji: '⚡',
          primaryColor: '#2563eb',
          secondaryColor: '#facc15',
          textColor: '#ffffff',
          delegate: 'Coach Diego Terán',
          phone: '+593 98 777 2233',
          playersCount: 15,
          captain: 'Juan Rivas (#10)',
          formation: 'Small Ball (Tiro Exterior)',
          keyPlayers: [
            { number: 10, name: 'Juan Rivas', position: 'Base Triplero', hasQr: true },
            { number: 7, name: 'Alexis Ibarra', position: 'Escolta Penetrador', hasQr: true }
          ]
        },
        {
          id: 'bk-3',
          name: 'Halcones del Norte Basketball',
          badgeEmoji: '🦅',
          primaryColor: '#059669',
          secondaryColor: '#ffffff',
          textColor: '#ffffff',
          delegate: 'Coach Roberto Salazar',
          phone: '+593 99 888 3344',
          playersCount: 14,
          captain: 'David Cedeño (#9 Pívot)',
          formation: 'Poste Bajo y Rebote Defensivo',
          keyPlayers: [
            { number: 9, name: 'David Cedeño', position: 'Pívot Dominante', hasQr: true }
          ]
        },
        {
          id: 'bk-4',
          name: 'Bulls Barrial Baloncesto',
          badgeEmoji: '🐂',
          primaryColor: '#dc2626',
          secondaryColor: '#000000',
          textColor: '#ffffff',
          delegate: 'Coach Diego Vivanco',
          phone: '+593 97 999 4455',
          playersCount: 13,
          captain: 'Xavier López (#24)',
          formation: 'Presión Toda Cancha',
          keyPlayers: [
            { number: 24, name: 'Xavier López', position: 'Alero Defensivo', hasQr: true }
          ]
        },
        {
          id: 'bk-5',
          name: 'Master Basket Pichincha +45',
          badgeEmoji: '🏆',
          primaryColor: '#d97706',
          secondaryColor: '#1e293b',
          textColor: '#ffffff',
          delegate: 'Coach Héctor Carrillo',
          phone: '+593 99 000 5566',
          playersCount: 12,
          captain: 'Héctor Carrillo (#15)',
          formation: 'Juego de Pases Veteranos',
          keyPlayers: [
            { number: 15, name: 'Héctor Carrillo', position: 'Base Experimentado', hasQr: true }
          ]
        }
      ];

    default: // Standard Football default (FUTBOL, FUTSAL, OTROS)
      return [
        {
          id: 'team-1',
          name: 'Club Atlético Central',
          badgeEmoji: '🦁',
          primaryColor: '#1e3a8a',
          secondaryColor: '#f59e0b',
          textColor: '#ffffff',
          delegate: 'Ing. Carlos Mena',
          phone: '+593 99 234 5678',
          playersCount: 18,
          captain: 'Juan Rivas (#10)',
          formation: '4-3-3 Ofensivo',
          keyPlayers: [
            { number: 1, name: 'Marcos Benítez', position: 'Arquero', hasQr: true },
            { number: 4, name: 'Esteban Loor', position: 'Defensa Central', hasQr: true },
            { number: 8, name: 'Cristian Paredes', position: 'Volante Mixto', hasQr: true },
            { number: 10, name: 'Juan Rivas', position: 'Enganche Creativo', hasQr: true },
            { number: 9, name: 'Mateo Morales', position: 'Delantero Centro', hasQr: true }
          ]
        },
        {
          id: 'team-2',
          name: 'Deportivo Juvenil La Cantera',
          badgeEmoji: '🔥',
          primaryColor: '#b91c1c',
          secondaryColor: '#000000',
          textColor: '#ffffff',
          delegate: 'Lcda. Andrea Morales',
          phone: '+593 98 765 4321',
          playersCount: 16,
          captain: 'Marco Torres (#8)',
          formation: '4-4-2 Clásico',
          keyPlayers: [
            { number: 12, name: 'Galo Viteri', position: 'Arquero', hasQr: true },
            { number: 3, name: 'Paúl Caicedo', position: 'Lateral Izquierdo', hasQr: true },
            { number: 8, name: 'Marco Torres', position: 'Volante de Marca', hasQr: true },
            { number: 7, name: 'Alexis Ibarra', position: 'Extremo Derecho', hasQr: true },
            { number: 11, name: 'Bryan Romero', position: 'Delantero Punta', hasQr: true }
          ]
        },
        {
          id: 'team-3',
          name: 'Estrella del Valle FC',
          badgeEmoji: '⭐',
          primaryColor: '#047857',
          secondaryColor: '#ffffff',
          textColor: '#ffffff',
          delegate: 'Sr. Roberto Salazar',
          phone: '+593 99 876 5432',
          playersCount: 17,
          captain: 'David Cedeño (#9)',
          formation: '3-5-2 Presión Alta',
          keyPlayers: [
            { number: 22, name: 'Sebastián Valle', position: 'Arquero Líbero', hasQr: true },
            { number: 5, name: 'Jorge Narváez', position: 'Líbero Central', hasQr: true },
            { number: 6, name: 'Luis Alvear', position: 'Volante Central', hasQr: true },
            { number: 9, name: 'David Cedeño', position: 'Goleador', hasQr: true },
            { number: 14, name: 'Fabián Carrera', position: 'Interior Zurdo', hasQr: true }
          ]
        },
        {
          id: 'team-4',
          name: 'Huracán Barrial',
          badgeEmoji: '🌪️',
          primaryColor: '#0284c7',
          secondaryColor: '#ffffff',
          textColor: '#ffffff',
          delegate: 'Sr. Diego Vivanco',
          phone: '+593 97 123 9876',
          playersCount: 19,
          captain: 'Xavier López (#5)',
          formation: '4-2-3-1 Dinámico',
          keyPlayers: [
            { number: 1, name: 'Damián Ledesma', position: 'Guardameta', hasQr: true },
            { number: 5, name: 'Xavier López', position: 'Contención', hasQr: true },
            { number: 10, name: 'Ángel Guachamín', position: 'Mediapunta', hasQr: true },
            { number: 17, name: 'Kevin Quishpe', position: 'Extremo Veloz', hasQr: true },
            { number: 19, name: 'Mario Silva', position: 'Centrodelantero', hasQr: true }
          ]
        },
        {
          id: 'team-5',
          name: 'Sporting Relámpago',
          badgeEmoji: '⚡',
          primaryColor: '#eab308',
          secondaryColor: '#09090b',
          textColor: '#000000',
          delegate: 'Sr. Fernando Castro',
          phone: '+593 99 555 4433',
          playersCount: 18,
          captain: 'Bryan Romero (#11)',
          formation: '4-3-3 Transición Rápida',
          keyPlayers: [
            { number: 25, name: 'Héctor Carrillo', position: 'Arquero', hasQr: true },
            { number: 2, name: 'Washington Chiluisa', position: 'Lateral Derecho', hasQr: true },
            { number: 16, name: 'Renato Aguirre', position: 'Pivote Táctico', hasQr: true },
            { number: 11, name: 'Bryan Romero', position: 'Extremo Creativo', hasQr: true },
            { number: 99, name: 'José Cárdenas', position: 'Acelerador de Ataque', hasQr: true }
          ]
        }
      ];
  }
}

// Helper to get 3 Segments based on sport
export function getSegmentsForSport(sport: SportCode): LeagueSegment[] {
  switch (sport) {
    case 'PADEL':
      return [
        {
          id: 'seg-padel-1',
          title: '1. Primera & Segunda Categoría (Open Pro)',
          badge: 'Open Élite FIP',
          colorClass: 'text-cyan-400',
          borderClass: 'border-cyan-500/40',
          bgClass: 'bg-cyan-500/10',
          ageRequirement: 'Nivel avanzado con ranking oficial FIP / Circuito local',
          duration: 'Al mejor de 3 sets (games a 6 con punto de oro y Tie-Break)',
          rules: [
            'Punto de oro obligatorio en el 40-40 (el receptor elige el lado del saque).',
            'En caso de empate a 1 set, tercer set completo a 6 games.',
            'Llaves de cuadro principal con cabezas de serie y ranking ELO dinámico.',
            'Pelotas reglamentarias presurizadas cambiadas cada 3 partidos.'
          ],
          features: [
            'Generación automática de brackets de eliminación simple y cuadro de consolación.',
            'Estadísticas de puntos ganados en la red, errores no forzados y smashes ganadores.',
            'Streaming y marcadores en vivo para las pistas centrales.'
          ],
          fixtureSummary: 'Fase de zonas clasificatorias + Cuadro eliminatorio de 16 parejas + Gran Final'
        },
        {
          id: 'seg-padel-2',
          title: '2. Tercera a Quinta Categoría (Amateur & Socios)',
          badge: 'Amateur Interclubes',
          colorClass: 'text-emerald-400',
          borderClass: 'border-emerald-500/40',
          bgClass: 'bg-emerald-500/10',
          ageRequirement: 'Abierto para socios de clubes y jugadores recreativos',
          duration: '2 sets a 6 games + Súper Tie-Break a 10 puntos en el tercero',
          rules: [
            'Súper Tie-break a 10 puntos con diferencia de 2 en caso de 1-1 en sets.',
            'Control de puntualidad con W.O. a los 15 minutos de la hora fijada en cancha.',
            'Carnet QR de pareja para registro de resultados en mesa de jueces.'
          ],
          features: [
            'Tabla de posiciones por parejas y por club representante.',
            'Chat interactivo de programación entre parejas para coordinar horarios de pista.',
            'Copa de Plata para las parejas que caigan en primera ronda.'
          ],
          fixtureSummary: 'Torneo fin de semana relámpago con mínimo 3 partidos garantizados por pareja'
        },
        {
          id: 'seg-padel-3',
          title: '3. Categoría Dobles Mixto & Máster +40',
          badge: 'Mixto & Máster 40+',
          colorClass: 'text-amber-400',
          borderClass: 'border-amber-500/40',
          bgClass: 'bg-amber-500/10',
          ageRequirement: 'Pareja mixta (Dama + Caballero) o jugadores mayores de 40 años',
          duration: 'Partidos con punto de oro y set final a 10 puntos',
          rules: [
            'Reglamento de convivencia deportiva y juego limpio con puntos extra de fair-play.',
            'Se permite reemplazo justificado por lesión hasta 2 horas antes de la ronda.',
            'Planilla digital con registro instantáneo en la nube.'
          ],
          features: [
            'Galería de fotos HD de cada jornada compartible en redes sociales.',
            'Premios de auspiciantes oficiales y paleteros técnicos para los finalistas.'
          ],
          fixtureSummary: 'Zonas de 4 parejas todos contra todos + Semifinales y Final domingo'
        }
      ];

    case 'BEISBOL':
      return [
        {
          id: 'seg-bb-1',
          title: '1. Liga Mayor Primera División (9 Innings)',
          badge: 'Béisbol Mayor 9 Innings',
          colorClass: 'text-red-400',
          borderClass: 'border-red-500/40',
          bgClass: 'bg-red-500/10',
          ageRequirement: 'Categoría libre federada (bates de madera o aluminio homologado)',
          duration: '9 entradas reglamentarias (o extra-innings con corredor en segunda)',
          rules: [
            'Límite de 100 lanzamientos por pitcher abridor con días de descanso obligatorio.',
            'Anotación de boxscore en vivo con strikes, bolas, outs, hits y errores.',
            'Regla de misericordia (Mercy Rule): 10 carreras de diferencia en la 7ma entrada.',
            'Revisión VAR a la carta para llamadas cerradas en home plate y líneas de foul.'
          ],
          features: [
            'Estadísticas completas: ERA, WHIP, promedio de bateo (AVG), OBP y SLG.',
            'Ficha de control de lanzamientos (pitch tracker) en tiempo real para evitar lesiones.',
            'Transmisión en vivo y crónica periodística automatizada con IA al finalizar las 9 entradas.'
          ],
          fixtureSummary: 'Temporada regular de 20 juegos + Serie de Campeonato al mejor de 5 juegos'
        },
        {
          id: 'seg-bb-2',
          title: '2. Categoría Juvenil U18 (Desarrollo & Prospectos)',
          badge: 'Prospectos U18',
          colorClass: 'text-cyan-400',
          borderClass: 'border-cyan-500/40',
          bgClass: 'bg-cyan-500/10',
          ageRequirement: 'Atletas nacidos en 2008 o menores con cédula biométrica validada',
          duration: '7 entradas con bates de aluminio BBCOR certificado',
          rules: [
            'Límite estricto de 85 lanzamientos por juego con seguimiento médico de brazo.',
            'Casco de doble orejera obligatorio para todos los bateadores y corredores.',
            'Carnetización QR anticlonación para evitar alteración de edades.'
          ],
          features: [
            'Vitrina de scouting para scouts universitarios y academias internacionales.',
            'Radar de velocidad de pitcheo y velocidad de salida del bate integrados.'
          ],
          fixtureSummary: 'Torneo Apertura y Clausura con liguilla final de prospectos'
        },
        {
          id: 'seg-bb-3',
          title: '3. Categoría Máster 45+ (Leyendas del Béisbol)',
          badge: 'Máster Leyendas 45+',
          colorClass: 'text-amber-400',
          borderClass: 'border-amber-500/40',
          bgClass: 'bg-amber-500/10',
          ageRequirement: 'Peloteros mayores de 45 años con chequeo médico deportivo anual',
          duration: '7 entradas con tolerancia y cambios de corredores de cortesía',
          rules: [
            'Corredor de cortesía permitido para receptores y lanzadores mayores.',
            'No se permite barrida dura en las bases (colisión prohibida en home plate).',
            'Sustituciones libres con reingreso acordado en mesa técnica.'
          ],
          features: [
            'Ranking histórico de jonroneros y mejores lanzadores veteranos.',
            'Tercer tiempo de camaradería y actas digitales entregadas en PDF por WhatsApp.'
          ],
          fixtureSummary: '12 jornadas dominicales matutinas + Cuadrangular de Leyendas'
        }
      ];

    case 'SOFTBOL':
      return [
        {
          id: 'seg-sb-1',
          title: '1. Sóftbol Femenino Molinete (Fastpitch)',
          badge: 'Fastpitch Femenino Élite',
          colorClass: 'text-pink-400',
          borderClass: 'border-pink-500/40',
          bgClass: 'bg-pink-500/10',
          ageRequirement: 'Categoría libre femenina de alto rendimiento',
          duration: '7 entradas reglamentarias con lanzamiento molinete oficial WBSC',
          rules: [
            'Lanzamiento molinete completo por debajo de la cadera.',
            'Regla de misericordia (Mercy Rule): 15 carreras en el 3ro, 10 en el 4to, 7 en el 5to.',
            'Uso de casco protector con careta facial para bateadoras y receptoras.',
            'Planilla de anotación digital con registro de robos de base y ponches.'
          ],
          features: [
            'Líderes de bateo, carreras impulsadas (RBI), efectividad y juegos ganados.',
            'Crónicas periodísticas automáticas con IA destacando las jugadas clave.'
          ],
          fixtureSummary: '14 fechas todos contra todos + Playoffs Serie de Campeonato'
        },
        {
          id: 'seg-sb-2',
          title: '2. Sóftbol Slowpitch Mixto (Recreativo & Empresas)',
          badge: 'Slowpitch Mixto Recreativo',
          colorClass: 'text-emerald-400',
          borderClass: 'border-emerald-500/40',
          bgClass: 'bg-emerald-500/10',
          ageRequirement: 'Equipos integrados por damas y caballeros (mínimo 4 mujeres en campo)',
          duration: '7 entradas con arco de lanzamiento obligatorio entre 1.8m y 3.6m',
          rules: [
            'Lanzamiento en arco suave (slowpitch); no se permite toque de bola ni robos.',
            'Todos los jugadores inscritos pueden formar parte del orden al bate.',
            'Línea de anotación de seguridad en home plate para evitar choques físicos.'
          ],
          features: [
            'Integración comunitaria y corporativa con carnetización rápida desde el móvil.',
            'Premiación especial para el equipo con mejor espíritu deportivo (Fair Play).'
          ],
          fixtureSummary: 'Torneo nocturno entre semana o fines de semana con finales festivas'
        },
        {
          id: 'seg-sb-3',
          title: '3. Sóftbol Masculino Rápido / Máster',
          badge: 'Masculino Fastpitch & Máster',
          colorClass: 'text-blue-400',
          borderClass: 'border-blue-500/40',
          bgClass: 'bg-blue-500/10',
          ageRequirement: 'Mayores de 35 años y primera división masculina',
          duration: '7 entradas con lanzadores de velocidad molinete o modificado',
          rules: [
            'Control de bates de sóftbol con sellos ASA / WBSC autorizados.',
            'Designación de ampáyer principal y de bases con planilla electrónica.'
          ],
          features: [
            'Tablas de posiciones sincronizadas con el subdominio web de la liga.',
            'Certificados de participación digitales emitidos al finalizar el torneo.'
          ],
          fixtureSummary: 'Torneo cuadrangular o liguilla regular + Gran Final'
        }
      ];

    case 'FUTBOL_AMERICANO':
      return [
        {
          id: 'seg-fa-1',
          title: '1. Primera División Tackle Adultos (11 vs 11)',
          badge: 'Tackle Adulto 11v11',
          colorClass: 'text-amber-400',
          borderClass: 'border-amber-500/40',
          bgClass: 'bg-amber-500/10',
          ageRequirement: 'Mayores de 18 años con equipo de protección certificado (casco, hombreras)',
          duration: '4 cuartos de 12 o 15 minutos con reloj oficial detenido',
          rules: [
            'Sistema de 4 oportunidades (downs) para avanzar 10 yardas reglamentarias.',
            'Anotaciones: Touchdown (6 pts), Punto Extra (1 pt), Conversión (2 pts), Field Goal (3 pts), Safety (2 pts).',
            'Sanciones de castigo automáticas (Holding, False Start, Pass Interference, Targeting).',
            'Revisión VAR a la carta para anotaciones polémicas en la línea de gol.'
          ],
          features: [
            'Estadísticas de yardas por pase, yardas por carrera, tacleadas y pases interceptados.',
            'Play-by-play interactivo minuto a minuto en la web de la liga.'
          ],
          fixtureSummary: 'Temporada Regular de 8 jornadas + Semifinales + Tazón de Campeonato (Bowl)'
        },
        {
          id: 'seg-fa-2',
          title: '2. Flag Football Femenino (5 vs 5 / 7 vs 7 Sin Contacto)',
          badge: 'Flag Femenino Olímpico',
          colorClass: 'text-cyan-400',
          borderClass: 'border-cyan-500/40',
          bgClass: 'bg-cyan-500/10',
          ageRequirement: 'Modalidad oficial olímpica de banderas, categoría abierta',
          duration: '2 tiempos de 20 minutos con reloj corrido (últimos 2m reloj detenido)',
          rules: [
            'Cinturón reglamentario con 2 banderas laterales de extracción limpia.',
            'Prohibido el contacto físico, bloqueo con manos o protección indebida de bandera.',
            'Avance de medio campo para renovar los 4 downs de primera oportunidad.'
          ],
          features: [
            'Rankings de pasadoras más eficientes y receptoras con más touchdowns capturados.',
            'Registro de carnets biométricos y vitrina para selección nacional de Flag.'
          ],
          fixtureSummary: 'Circuito de 10 fechas relámpago + Torneo Final de Play-offs'
        },
        {
          id: 'seg-fa-3',
          title: '3. Flag Football Juvenil Mixto U17',
          badge: 'Flag Juvenil Cantera U17',
          colorClass: 'text-emerald-400',
          borderClass: 'border-emerald-500/40',
          bgClass: 'bg-emerald-500/10',
          ageRequirement: 'Jóvenes de 13 a 17 años con formación escolar y barrial',
          duration: '2 tiempos de 18 minutos formativos con enfoque técnico',
          rules: [
            'Prioridad en el desarrollo táctico, velocidad y juego limpio.',
            'Todos los atletas inscritos deben tener minutos mínimos de juego garantizados.'
          ],
          features: [
            'Insignias al mérito deportivo y estadísticas formativas compartidas con padres de familia.'
          ],
          fixtureSummary: 'Encuentros sabatinos matutinos con cuadrangulares de habilidades'
        }
      ];

    case 'ARTES_MARCIALES':
      return [
        {
          id: 'seg-mma-1',
          title: '1. MMA Profesional & Semi-Pro (Jaula / Octágono)',
          badge: 'MMA Pro & Semi-Pro',
          colorClass: 'text-red-500',
          borderClass: 'border-red-500/40',
          bgClass: 'bg-red-500/10',
          ageRequirement: 'Peleadores profesionales o con experiencia amateur con récord comprobable',
          duration: '3 asaltos de 5 minutos (5 asaltos para peleas de título de campeonato)',
          rules: [
            'Reglas unificadas de Artes Marciales Mixtas (striking, derribos, lucha en suelo y sumisión).',
            'Puntuación obligatoria de 3 jueces laterales bajo el sistema de 10-9 Must.',
            'Pesaje oficial estricto 24 horas antes con verificación médica de hidratación.',
            'Victorias por KO, TKO, Sumisión, Decisión Unánime, Decisión Dividida o Empate.'
          ],
          features: [
            'Control de pesajes digitales con foto oficial y generación de tarjetas de combate.',
            'Tablas de ranking libra por libra y campeones por división de peso.',
            'Historial de peleas (Fight Record) con links a los videos de cada asalto.'
          ],
          fixtureSummary: 'Cartelera numerada con 8 a 12 combates: Preliminares, Estelares y Pelea Titular'
        },
        {
          id: 'seg-mma-2',
          title: '2. Torneo Abierto de Boxeo Olímpico & Kickboxing K-1',
          badge: 'Boxeo & Kickboxing K-1',
          colorClass: 'text-amber-400',
          borderClass: 'border-amber-500/40',
          bgClass: 'bg-amber-500/10',
          ageRequirement: 'Categorías Mosca, Gallo, Pluma, Ligero, Wélter, Medio y Pesado',
          duration: '3 asaltos de 3 minutos con 1 minuto de descanso entre asaltos',
          rules: [
            'Guantes reglamentarios de 10oz o 12oz según la categoría de peso.',
            'Conteo de protección de 8 segundos del árbitro en caso de caída o castigo excesivo.',
            'Prohibido golpes a la nuca, riñones o después de la campana.'
          ],
          features: [
            'Tarjetas electrónicas de puntuación en tiempo real visibles en la pantalla del escenario.',
            'Equipo médico de ringside con registro de suspensiones preventivas por corte.'
          ],
          fixtureSummary: 'Llaves de eliminación directa por división de peso hasta la medalla de oro'
        },
        {
          id: 'seg-mma-3',
          title: '3. Brazilian Jiu-Jitsu (BJJ Gi & No-Gi por Cinturones)',
          badge: 'BJJ Gi & No-Gi Submission',
          colorClass: 'text-purple-400',
          borderClass: 'border-purple-500/40',
          bgClass: 'bg-purple-500/10',
          ageRequirement: 'Dividido por cinturones (Blanco, Azul, Morado, Marrón, Negro) y peso',
          duration: 'Combates de 5 a 10 minutos según la graduación de cinturón',
          rules: [
            'Puntaje oficial IBJJF: Montada (4 pts), Espalda (4 pts), Pase de guardia (3 pts), Raspado/Derribo (2 pts).',
            'Victoria inmediata por sumisión (estrangulación, palanca de brazo, candado al tobillo).',
            'Pesaje con quimono (Gi) o sin quimono (No-Gi) previo al ingreso al tatami.'
          ],
          features: [
            'Llamado automático a tatamis mediante pantalla central y mensaje SMS al atleta.',
            'Diploma y carnet de grado emitido con validación QR anticopia.'
          ],
          fixtureSummary: 'Brackets eliminatorios en 4 tatamis simultáneos con categoría Absoluto Libre'
        }
      ];

    case 'TENNIS':
      return [
        {
          id: 'seg-ten-1',
          title: '1. Circuito Abierto Singles Primera Categoría (ATP Style)',
          badge: 'Singles Open Primera',
          colorClass: 'text-emerald-400',
          borderClass: 'border-emerald-500/40',
          bgClass: 'bg-emerald-500/10',
          ageRequirement: 'Categoría abierta de alto nivel técnico y federado',
          duration: 'Al mejor de 3 sets (games a 6 con ventaja y Tie-break a 7 puntos)',
          rules: [
            'Reglamento oficial ITF: saques alternos con 2 servicios por punto.',
            'Tie-break tradicional a 7 puntos con ventaja de 2 en caso de 6-6 en games.',
            'Tercer set completo para definir partidos de cuartos, semifinales y final.',
            'Cuadro de cabezas de serie sembrados según ranking oficial de la liga.'
          ],
          features: [
            'Actualización automática del ranking tras cada ronda disputada.',
            'Reserva digital de canchas de arcilla o pista rápida con luces para el torneo.',
            'Crónica con IA con recuento de aces, dobles faltas y quiebres de servicio.'
          ],
          fixtureSummary: 'Cuadro principal de 32 tenistas + Ronda de Clasificación previa (Qualy)'
        },
        {
          id: 'seg-ten-2',
          title: '2. Torneo de Dobles Caballeros & Dobles Mixto',
          badge: 'Dobles & Mixtos Interclubes',
          colorClass: 'text-cyan-400',
          borderClass: 'border-cyan-500/40',
          bgClass: 'bg-cyan-500/10',
          ageRequirement: 'Duplas masculinas, femeninas o mixtas de clubes afiliados',
          duration: '2 sets regulares + Súper Tie-Break a 10 puntos en caso de empate',
          rules: [
            'Modalidad sin ventaja (No-Ad scoring) para agilizar la rotación de pistas.',
            'En el 40-40 se juega punto decisivo con elección de lado por los receptores.'
          ],
          features: [
            'Puntaje acumulado para la Copa Interclubes anual de la provincia.',
            'Carnet de jugador con historial de enfrentamientos cara a cara (Head-to-Head).'
          ],
          fixtureSummary: 'Zonas de grupos todos contra todos + Llaves de cuartos de final a domingo'
        },
        {
          id: 'seg-ten-3',
          title: '3. Categoría Senior Máster +45 & Damas Promocional',
          badge: 'Senior 45+ & Damas',
          colorClass: 'text-amber-400',
          borderClass: 'border-amber-500/40',
          bgClass: 'bg-amber-500/10',
          ageRequirement: 'Jugadores mayores de 45 años y categorías de iniciación damas',
          duration: 'Partidos en fines de semana con descansos programados',
          rules: [
            'Tolerancia de 15 minutos en el llamado oficial a pista.',
            'Opción de pactar horarios flexibles entre delegados a través de la app.'
          ],
          features: [
            'Álbum digital de recuerdos y entrega de trofeos en el cóctel de clausura.'
          ],
          fixtureSummary: 'Fase de grupos con mínimo 3 partidos garantizados por participante'
        }
      ];

    case 'ECUAVOLEY':
      return [
        {
          id: 'seg-ecu-1',
          title: '1. Categoría de Primera (Colocada Fuerte & Gancho)',
          badge: 'Primera Élite Ecuavoley',
          colorClass: 'text-amber-400',
          borderClass: 'border-amber-500/40',
          bgClass: 'bg-amber-500/10',
          ageRequirement: 'Jugadores élite barriales y cantonales (3 por equipo)',
          duration: '2 de 3 sets a 15 puntos (modalidad cambios y puntos directos)',
          rules: [
            'Batida tradicional desde la zona posterior sin pisar la línea de fondo.',
            'Red reglamentaria de 2.85 metros de altura con varillas demarcadoras.',
            'Puntos y cambios: solo suma punto el trío que tenga la batida a su favor.',
            'Sanción rigurosa de pasada de mano sobre la red y cargada de balón.'
          ],
          features: [
            'Marcador digital en tiempo real con alternancia de batida y puntos.',
            'Estadísticas de ganchos efectivos, bolas salvadas en el suelo y bloqueos.',
            'Transmisión en directo por Facebook/YouTube con panel marcador oficial.'
          ],
          fixtureSummary: '16 fechas con clásicos barriales + Cuadrangular Final en Coliseo'
        },
        {
          id: 'seg-ecu-2',
          title: '2. Categoría Segunda & Colocada Barrial Tradicional',
          badge: 'Segunda División Comunitaria',
          colorClass: 'text-cyan-400',
          borderClass: 'border-cyan-500/40',
          bgClass: 'bg-cyan-500/10',
          ageRequirement: 'Abierto para tríos locales de barrios y parroquias',
          duration: '2 de 3 sets a 12 puntos',
          rules: [
            'Tolerancia de 15 minutos en el primer partido de la tarde.',
            'Carnet QR obligatorio en mesa de vocalía antes del sorteo de cancha.'
          ],
          features: [
            'Tabla general de puntos y registro de vocalías digitales sin papel.'
          ],
          fixtureSummary: 'Fase de grupos todos contra todos + Liguilla y Gran Final'
        },
        {
          id: 'seg-ecu-3',
          title: '3. Categoría Máster +40 (Veteranos del Ecuavoley)',
          badge: 'Máster Cuarentones',
          colorClass: 'text-emerald-400',
          borderClass: 'border-emerald-500/40',
          bgClass: 'bg-emerald-500/10',
          ageRequirement: 'Colocadores, servidores y voladores nacidos en 1986 o antes',
          duration: '2 sets a 12 puntos con descanso de 5 minutos entre sets',
          rules: [
            'Reingreso de jugadores suplentes permitido en mesa de control.',
            'Enfoque en camaradería, juego limpio y salud deportiva.'
          ],
          features: [
            'Reconocimiento a glorias históricas del ecuavoley barrial.'
          ],
          fixtureSummary: 'Encuentros dominicales familiares con final en cancha cubierta'
        }
      ];

    case 'BALONCESTO':
      return [
        {
          id: 'seg-bk-1',
          title: '1. Primera División Masculina (Norma FIBA)',
          badge: 'Primera Masculina FIBA',
          colorClass: 'text-red-400',
          borderClass: 'border-red-500/40',
          bgClass: 'bg-red-500/10',
          ageRequirement: 'Categoría libre federada o barrial de alta competencia',
          duration: '4 cuartos de 10 minutos (tiempo cronometrado oficial)',
          rules: [
            'Reloj de posesión de 24 segundos (14s en rebote ofensivo).',
            'Límite de 5 faltas personales por jugador para descalificación.',
            'Bonificación de tiros libres a partir de la 5ta falta colectiva por cuarto.',
            'Anotaciones registradas: 1 pt (Tiro Libre), 2 pts (Doble), 3 pts (Triple).'
          ],
          features: [
            'Planilla electrónica oficial con boxscore en tiempo real.',
            'Líderes de anotación, asistencias, rebotes ofensivos/defensivos y tapones.',
            'Generación instantánea de actas firmadas digitalmente por los jueces de mesa.'
          ],
          fixtureSummary: 'Fase de clasificación ida y vuelta + Playoffs al mejor de 3 juegos'
        },
        {
          id: 'seg-bk-2',
          title: '2. Liga Femenina de Baloncesto Élite & Cantera',
          badge: 'Baloncesto Femenino',
          colorClass: 'text-purple-400',
          borderClass: 'border-purple-500/40',
          bgClass: 'bg-purple-500/10',
          ageRequirement: 'Equipos femeninos de clubes, colegios y universidades',
          duration: '4 cuartos de 10 minutos con balón reglamentario N° 6',
          rules: [
            'Tiempos fuera reglamentarios: 2 en la primera mitad, 3 en la segunda.',
            'Seguro deportivo y carnet biométrico QR verificado en mesa.'
          ],
          features: [
            'Difusión de crónicas periodísticas y MVP de cada partido votado en la app.'
          ],
          fixtureSummary: 'Torneo Apertura y Clausura + Final a partido único'
        },
        {
          id: 'seg-bk-3',
          title: '3. Categoría Máster +40 & Maxibasket',
          badge: 'Maxibasket Máster 40+',
          colorClass: 'text-amber-400',
          borderClass: 'border-amber-500/40',
          bgClass: 'bg-amber-500/10',
          ageRequirement: 'Basquetbolistas mayores de 40 años',
          duration: '4 cuartos de 8 o 10 minutos con sustituciones rotativas',
          rules: [
            'Reglamento de Maxibasket FIMBA con control de pulsaciones y descansos amplios.'
          ],
          features: [
            'Tablas de posiciones y fotos del encuentro compartibles por WhatsApp.'
          ],
          fixtureSummary: 'Jornadas de fin de semana con cuadrangular de clausura'
        }
      ];

    default: // Standard Football defaults (FUTBOL, FUTSAL, OTROS)
      return [
        {
          id: 'seg-master',
          title: '1. Categoría Máster +40 (Veteranos)',
          badge: 'Máster Senior 40+',
          colorClass: 'text-amber-400',
          borderClass: 'border-amber-500/40',
          bgClass: 'bg-amber-500/10',
          ageRequirement: 'Jugadores nacidos hasta 1986 (cédula validada en sistema)',
          duration: '2 tiempos de 40 minutos con 10 min de descanso',
          rules: [
            'Sustituciones ilimitadas con opción de reingreso reglamentado en mesa de control.',
            'Control de carnet digital con código QR obligatorio previo al pitazo inicial.',
            'Acumulación de 3 tarjetas amarillas acarrea 1 fecha de suspensión automática.',
            'Tolerancia de 15 minutos en el primer partido de la programación matutina.'
          ],
          features: [
            'Tabla de posiciones acumulada con diferencia de gol en tiempo real.',
            'Estadística de goleadores veteranos y valla menos batida.',
            'Liguilla final de Copa de Oro y Copa de Plata para incentivar a todos los clubes.'
          ],
          fixtureSummary: '14 fechas regulares + Playoffs a partido de ida y vuelta + Gran Final dominical'
        },
        {
          id: 'seg-senior',
          title: '2. Categoría Senior Primera División (Alta Competencia)',
          badge: 'Primera División Élite',
          colorClass: 'text-emerald-400',
          borderClass: 'border-emerald-500/40',
          bgClass: 'bg-emerald-500/10',
          ageRequirement: 'Categoría abierta (edad libre con registro federado/barrial)',
          duration: '2 tiempos reglamentarios de 45 minutos (Norma FIFA)',
          rules: [
            'Máximo 5 sustituciones en 3 ventanas reglamentarias oficiales.',
            'Acta de vocalía 100% digital en tiempo real con sincronización a la nube.',
            'Compatibilidad nativa con Módulo VAR a la carta para jugadas polémicas de gol o penal.',
            'Sanción directa con tarjeta roja amerita tribunal de penas virtual automático.'
          ],
          features: [
            'Transmisión en vivo y generación de Crónicas Periodísticas con Inteligencia Artificial.',
            'Ficha biométrica de rendimiento y carnet digital interactivo para cada atleta.',
            'Designación de terna arbitral certificada con planilla electrónica.'
          ],
          fixtureSummary: 'Torneo Apertura y Clausura + Cuartos, Semifinal y Gran Final con premiación'
        },
        {
          id: 'seg-femenina',
          title: '3. Categoría Femenina Libre / Formativa Comunitaria',
          badge: 'Femenina & Cantera',
          colorClass: 'text-purple-400',
          borderClass: 'border-purple-500/40',
          bgClass: 'bg-purple-500/10',
          ageRequirement: 'Libre para deportistas femeninas y formativas de la comunidad',
          duration: '2 tiempos de 35 minutos con 10 min de hidratación',
          rules: [
            'Balón reglamentario de alta visibilidad según la sede.',
            'Sustituciones con hasta 7 variantes para dinamizar la participación deportiva.',
            'Seguro médico y ficha médica deportiva digital integrada en el carnet QR.',
            'Criterio especial de desempate por Juego Limpio (Fair Play / Menor puntaje disciplinario).'
          ],
          features: [
            'Portal exclusivo de difusión para el deporte formativo con fotos HD.',
            'Rankings de figuras del partido (*MVP*) votadas por los aficionados en la app.',
            'Insignia de Club Formativo Destacado otorgada por la dirección de la liga.'
          ],
          fixtureSummary: 'Fase de grupos todos contra todos + Cuadrangular Final por el Trofeo Campeonas'
        }
      ];
  }
}
