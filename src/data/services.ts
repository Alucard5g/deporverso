export interface MerchItem {
  id: string;
  name: string;
  category: string;
  price: number;
  badge?: string;
  colorHex: string;
  description: string;
}

export const MERCH_ITEMS: MerchItem[] = [
  {
    id: "merch-1",
    name: "Camiseta Oficial Deporverso Pro Edition",
    category: "Indumentaria",
    price: 34.99,
    badge: "EDICIÓN LIMITADA",
    colorHex: "#0ea5e9",
    description: "Tejido microperforado transpirable con tecnología anti-sudor y escudo termosellado en relieve 3D."
  },
  {
    id: "merch-2",
    name: "Gorra Snapback Cyber-Reflect",
    category: "Accesorios",
    price: 18.50,
    badge: "REFLECTIVO",
    colorHex: "#10b981",
    description: "Visera semi-curva con aplique frontal metalizado e interior acolchado de secado rápido."
  },
  {
    id: "merch-3",
    name: "Bufanda Conmemorativa Barrial",
    category: "Colección",
    price: 14.00,
    badge: "CLÁSICA",
    colorHex: "#f59e0b",
    description: "Punto de telar jacquard con flecos trenzados y lema 'Del Barro a la Gloria' bordado."
  },
  {
    id: "merch-4",
    name: "Balón Oficial Deporverso Hybrid #5",
    category: "Equipamiento",
    price: 29.90,
    badge: "TERMOSELLADO",
    colorHex: "#6366f1",
    description: "Cámara de butilo de alta retención de aire con textura aerodinámica para cualquier superficie."
  }
];

export interface FanPost {
  id: string;
  category: "NOTICIA" | "TRIVIA" | "VOTACIÓN" | "EXCLUSIVO";
  title: string;
  excerpt: string;
  date: string;
  votesOrInteractions: string;
  tag: string;
}

export const FAN_POSTS: FanPost[] = [
  {
    id: "fp-1",
    category: "VOTACIÓN",
    title: "¿Cuál fue el gol de la fecha en la Liga Barrial?",
    excerpt: "Vota entre la volea al ángulo de Mateo Silva (San Roque) o el tiro libre de 30 metros de Luis Vega (Panteras).",
    date: "Hace 2 horas",
    votesOrInteractions: "1,428 votos activos",
    tag: "Gol del Mes"
  },
  {
    id: "fp-2",
    category: "EXCLUSIVO",
    title: "Crónica IA: Los 5 minutos que definieron el clásico de La Floresta",
    excerpt: "Análisis táctico con mapa de calor y telemetría de esfuerzo físico registrada por los vocales de mesa.",
    date: "Hoy",
    votesOrInteractions: "892 lecturas",
    tag: "Reporte Táctico"
  },
  {
    id: "fp-3",
    category: "TRIVIA",
    title: "Trivia Histórica: ¿Qué club ganó el primer torneo interparroquial?",
    excerpt: "Pon a prueba tu conocimiento de la historia del deporte de barrio y gana entradas VIP a la gran final.",
    date: "Ayer",
    votesOrInteractions: "630 participantes",
    tag: "Fan Challenge"
  }
];

export interface VarPlayDemo {
  id: string;
  title: string;
  minute: string;
  situation: string;
  ruling: string;
  confidence: string;
  tacticalNotes: string[];
}

export const VAR_DEMO_PLAY: VarPlayDemo = {
  id: "var-01",
  title: "Posible Fuera de Juego en Gol del Minuto 78",
  minute: "78:14",
  situation: "Pase en profundidad filtrado entre los dos centrales",
  ruling: "GOL VÁLIDO — HABILITADO POR 12.4 CM",
  confidence: "99.8% Precisión Cinemática",
  tacticalNotes: [
    "Línea de proyección defensiva trazada desde el talón del defensor número 4",
    "Punto de contacto del balón sincronizado a 120 cuadros por segundo",
    "Vector de velocidad del delantero: 28.4 km/h en aceleración limpia",
    "Ausencia de contacto ilícito previo en la recuperación"
  ]
};
