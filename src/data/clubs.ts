export interface ClubData {
  id: string;
  name: string;
  shortName: string;
  category: string;
  city: string;
  badgeColor: string;
  nextMatch: {
    opponent: string;
    date: string;
    time: string;
    stadium: string;
  };
  position: number;
  stats: {
    pj: number;
    pg: number;
    pe: number;
    pp: number;
    gf: number;
    gc: number;
    pts: number;
  };
  subdomain: string;
}

export const CLUBS_DATA: ClubData[] = [
  {
    id: "club-001",
    name: "Atlético San Roque",
    shortName: "ASR",
    category: "Serie A Barrial",
    city: "Quito, EC",
    badgeColor: "from-amber-500 to-red-600",
    nextMatch: {
      opponent: "Deportivo Los Pinos",
      date: "Sábado 19 Sep",
      time: "15:30",
      stadium: "Cancha Central San Roque"
    },
    position: 1,
    stats: {
      pj: 14,
      pg: 11,
      pe: 2,
      pp: 1,
      gf: 36,
      gc: 14,
      pts: 35
    },
    subdomain: "sanroque.deporverso.com"
  },
  {
    id: "club-002",
    name: "Club Social Panteras",
    shortName: "PAN",
    category: "Serie A Barrial",
    city: "Guayaquil, EC",
    badgeColor: "from-blue-600 to-cyan-400",
    nextMatch: {
      opponent: "Estrella del Sur",
      date: "Domingo 20 Sep",
      time: "11:00",
      stadium: "Estadio La Floresta"
    },
    position: 2,
    stats: {
      pj: 14,
      pg: 9,
      pe: 3,
      pp: 2,
      gf: 28,
      gc: 16,
      pts: 30
    },
    subdomain: "panteras.deporverso.com"
  },
  {
    id: "club-003",
    name: "Independiente del Valle Juvenil",
    shortName: "IDV-J",
    category: "Formativa Sub-19",
    city: "Sangolquí, EC",
    badgeColor: "from-emerald-500 to-teal-700",
    nextMatch: {
      opponent: "Real Chimbacalle",
      date: "Sábado 19 Sep",
      time: "17:00",
      stadium: "Complejo Deportivo El Valle"
    },
    position: 3,
    stats: {
      pj: 14,
      pg: 8,
      pe: 4,
      pp: 2,
      gf: 29,
      gc: 18,
      pts: 28
    },
    subdomain: "idv-formativas.deporverso.com"
  },
  {
    id: "club-004",
    name: "Trío de Oro Ecuavoley",
    shortName: "TDO",
    category: "Élite Ecuavoley",
    city: "Ambato, EC",
    badgeColor: "from-yellow-400 to-amber-600",
    nextMatch: {
      opponent: "Machachi Máster",
      date: "Domingo 20 Sep",
      time: "16:00",
      stadium: "Coliseo Mayor"
    },
    position: 1,
    stats: {
      pj: 12,
      pg: 10,
      pe: 0,
      pp: 2,
      gf: 22,
      gc: 8,
      pts: 30
    },
    subdomain: "triodeoro.deporverso.com"
  }
];
