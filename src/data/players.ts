export interface PlayerData {
  id: string;
  code: string;
  name: string;
  nickname: string;
  position: string;
  team: string;
  ovr: number;
  photoUrl?: string;
  stats: {
    vel: number;
    pas: number;
    def: number;
    tec: number;
    fis: number;
  };
  backside: {
    program: string;
    trainingHours: number;
    sessionsCompleted: number;
    targetGoals: string;
    progressPercentage: number;
    vrStatus: string;
    nextSession: string;
  };
}

export const HERO_PLAYER: PlayerData = {
  id: "player-001",
  code: "PLAYER 001",
  name: "Mateo Silva",
  nickname: "El Rayo del Barrio",
  position: "EXTREMO DERECHO / MEDIAPUNTA",
  team: "Atlético San Roque",
  ovr: 87,
  stats: {
    vel: 91,
    pas: 88,
    def: 76,
    tec: 93,
    fis: 84
  },
  backside: {
    program: "DEPORTE EN CASA & ALTO RENDIMIENTO",
    trainingHours: 148,
    sessionsCompleted: 42,
    targetGoals: "Velocidad de reacción y definición al primer toque",
    progressPercentage: 89,
    vrStatus: "VR EXPERIENCE READY — Oculus & Mobile 360°",
    nextSession: "Rutina #43: Pliometría y Cambios de Ritmo"
  }
};
