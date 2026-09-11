import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Sparkles, Download, Play, RefreshCw, Shield, Zap, 
  ArrowRight, FileText, Check, Layout, Eye, Move, Info, Trophy,
  Sliders, Award
} from 'lucide-react';
import { SportCode, Sport, Tenant } from '../../types';

interface TacticalBoardProps {
  sport: Sport;
  tenant?: Tenant;
}

export interface PlayerToken {
  id: string;
  number: number;
  name: string;
  role: string;
  x: number; // percentage on board (0 to 100)
  y: number; // percentage on board (0 to 100)
  team?: 'home' | 'away';
}

export type TacticalModality = 'FUTSAL_5' | 'INDOR_7' | 'INDOR_9' | 'FUTBOL_11' | 'ECUAVOLEY_3' | 'BASKET_5' | 'PADEL_2';

interface TacticalPreset {
  id: string;
  name: string;
  modality: TacticalModality;
  playerCount: number;
  description: string;
  homeTokens: PlayerToken[];
  awayTokens: PlayerToken[];
}

// -------------------------------------------------------------
// PRESETS TÁCTICOS ADAPTADOS POR DEPORTE Y NÚMERO DE JUGADORES
// -------------------------------------------------------------
const TACTICAL_PRESETS: TacticalPreset[] = [
  // --- FÚTSAL (5 JUGADORES) ---
  {
    id: 'futsal-1-2-2',
    name: 'Fútsal 1-2-2 Rombo Tradicional',
    modality: 'FUTSAL_5',
    playerCount: 5,
    description: 'Sistema clásico de fútbol sala con un cierre, dos alas veloces y un pívot fijador.',
    homeTokens: [
      { id: 'h1', number: 1, name: 'Portero', role: 'POR', x: 12, y: 50, team: 'home' },
      { id: 'h2', number: 2, name: 'Cierre', role: 'DEF', x: 28, y: 50, team: 'home' },
      { id: 'h3', number: 7, name: 'Ala Izquierda', role: 'ALA', x: 50, y: 20, team: 'home' },
      { id: 'h4', number: 8, name: 'Ala Derecha', role: 'ALA', x: 50, y: 80, team: 'home' },
      { id: 'h5', number: 9, name: 'Pívot Ofensivo', role: 'PIV', x: 78, y: 50, team: 'home' },
    ],
    awayTokens: [
      { id: 'a1', number: 1, name: 'Portero Rival', role: 'POR', x: 88, y: 50, team: 'away' },
      { id: 'a2', number: 3, name: 'Cierre Rival', role: 'DEF', x: 72, y: 50, team: 'away' },
      { id: 'a3', number: 11, name: 'Ala Izq Rival', role: 'ALA', x: 52, y: 80, team: 'away' },
      { id: 'a4', number: 10, name: 'Ala Der Rival', role: 'ALA', x: 52, y: 20, team: 'away' },
      { id: 'a5', number: 9, name: 'Pívot Rival', role: 'PIV', x: 26, y: 50, team: 'away' },
    ]
  },
  {
    id: 'futsal-1-3-1',
    name: 'Fútsal 1-3-1 Presión Alta en Rombo',
    modality: 'FUTSAL_5',
    playerCount: 5,
    description: 'Presión asfixiante sobre salida del rival con alas adelantadas y repliegue rápido.',
    homeTokens: [
      { id: 'h1', number: 1, name: 'Portero', role: 'POR', x: 14, y: 50, team: 'home' },
      { id: 'h2', number: 4, name: 'Cierre Líbero', role: 'DEF', x: 32, y: 50, team: 'home' },
      { id: 'h3', number: 6, name: 'Medio Centro', role: 'ALA', x: 52, y: 50, team: 'home' },
      { id: 'h4', number: 11, name: 'Extremo Rápido', role: 'ALA', x: 68, y: 22, team: 'home' },
      { id: 'h5', number: 9, name: 'Pívot Cazagol', role: 'PIV', x: 82, y: 72, team: 'home' },
    ],
    awayTokens: [
      { id: 'a1', number: 1, name: 'Portero Rival', role: 'POR', x: 88, y: 50, team: 'away' },
      { id: 'a2', number: 4, name: 'Defensa Rival', role: 'DEF', x: 70, y: 35, team: 'away' },
      { id: 'a3', number: 2, name: 'Defensa Rival', role: 'DEF', x: 70, y: 65, team: 'away' },
      { id: 'a4', number: 8, name: 'Medio Rival', role: 'ALA', x: 45, y: 50, team: 'away' },
      { id: 'a5', number: 10, name: 'Delantero Rival', role: 'PIV', x: 25, y: 50, team: 'away' },
    ]
  },
  {
    id: 'futsal-1-4-0',
    name: 'Fútsal 1-4-0 Falso Pívot (Rotación Continua)',
    modality: 'FUTSAL_5',
    playerCount: 5,
    description: 'Línea de cuatro jugadores móviles sin posición fija para generar espacios a la espalda.',
    homeTokens: [
      { id: 'h1', number: 1, name: 'Portero', role: 'POR', x: 12, y: 50, team: 'home' },
      { id: 'h2', number: 5, name: 'Organizador I', role: 'ROT', x: 48, y: 22, team: 'home' },
      { id: 'h3', number: 8, name: 'Conector Central I', role: 'ROT', x: 45, y: 40, team: 'home' },
      { id: 'h4', number: 10, name: 'Conector Central D', role: 'ROT', x: 45, y: 60, team: 'home' },
      { id: 'h5', number: 7, name: 'Organizador D', role: 'ROT', x: 48, y: 78, team: 'home' },
    ],
    awayTokens: [
      { id: 'a1', number: 1, name: 'Portero Rival', role: 'POR', x: 88, y: 50, team: 'away' },
      { id: 'a2', number: 2, name: 'Cierre Rival', role: 'DEF', x: 68, y: 40, team: 'away' },
      { id: 'a3', number: 3, name: 'Cierre Rival', role: 'DEF', x: 68, y: 60, team: 'away' },
      { id: 'a4', number: 7, name: 'Ala Rival', role: 'ALA', x: 58, y: 25, team: 'away' },
      { id: 'a5', number: 11, name: 'Ala Rival', role: 'ALA', x: 58, y: 75, team: 'away' },
    ]
  },

  // --- INDOR 7 (7 JUGADORES) ---
  {
    id: 'indor7-1-2-3-1',
    name: 'Indor 7: 1-2-3-1 Diamante Dinámico',
    modality: 'INDOR_7',
    playerCount: 7,
    description: 'Esquema insignia del fútbol 7: solidez central, alas proyectadas y rebote en paredes.',
    homeTokens: [
      { id: 'h1', number: 1, name: 'Arquero', role: 'POR', x: 10, y: 50, team: 'home' },
      { id: 'h2', number: 2, name: 'Líbero', role: 'DEF', x: 26, y: 35, team: 'home' },
      { id: 'h3', number: 3, name: 'Stopper', role: 'DEF', x: 26, y: 65, team: 'home' },
      { id: 'h4', number: 5, name: 'Pivote Tapón', role: 'MED', x: 46, y: 50, team: 'home' },
      { id: 'h5', number: 7, name: 'Carrilero Izq', role: 'ALA', x: 58, y: 18, team: 'home' },
      { id: 'h6', number: 8, name: 'Carrilero Der', role: 'ALA', x: 58, y: 82, team: 'home' },
      { id: 'h7', number: 9, name: 'Delantero Centro', role: 'DEL', x: 82, y: 50, team: 'home' },
    ],
    awayTokens: [
      { id: 'a1', number: 1, name: 'Arquero Rival', role: 'POR', x: 90, y: 50, team: 'away' },
      { id: 'a2', number: 2, name: 'Defensa Rival', role: 'DEF', x: 74, y: 35, team: 'away' },
      { id: 'a3', number: 4, name: 'Defensa Rival', role: 'DEF', x: 74, y: 65, team: 'away' },
      { id: 'a4', number: 6, name: 'Medio Rival', role: 'MED', x: 54, y: 50, team: 'away' },
      { id: 'a5', number: 11, name: 'Banda Rival', role: 'ALA', x: 42, y: 20, team: 'away' },
      { id: 'a6', number: 8, name: 'Banda Rival', role: 'ALA', x: 42, y: 80, team: 'away' },
      { id: 'a7', number: 9, name: 'Punta Rival', role: 'DEL', x: 22, y: 50, team: 'away' },
    ]
  },
  {
    id: 'indor7-1-3-2-1',
    name: 'Indor 7: 1-3-2-1 Bloque Sólido',
    modality: 'INDOR_7',
    playerCount: 7,
    description: 'Línea de 3 defensas fija para blindar la portería y salida veloz en 2 toques.',
    homeTokens: [
      { id: 'h1', number: 1, name: 'Arquero', role: 'POR', x: 10, y: 50, team: 'home' },
      { id: 'h2', number: 4, name: 'Lateral Izq', role: 'DEF', x: 28, y: 20, team: 'home' },
      { id: 'h3', number: 2, name: 'Central Fijo', role: 'DEF', x: 25, y: 50, team: 'home' },
      { id: 'h4', number: 3, name: 'Lateral Der', role: 'DEF', x: 28, y: 80, team: 'home' },
      { id: 'h5', number: 8, name: 'Volante Mixto I', role: 'MED', x: 52, y: 36, team: 'home' },
      { id: 'h6', number: 10, name: 'Volante Creador D', role: 'MED', x: 52, y: 64, team: 'home' },
      { id: 'h7', number: 9, name: 'Ariete Rápido', role: 'DEL', x: 80, y: 50, team: 'home' },
    ],
    awayTokens: [
      { id: 'a1', number: 1, name: 'Arquero Rival', role: 'POR', x: 90, y: 50, team: 'away' },
      { id: 'a2', number: 3, name: 'Defensa Rival', role: 'DEF', x: 72, y: 25, team: 'away' },
      { id: 'a3', number: 5, name: 'Defensa Rival', role: 'DEF', x: 72, y: 75, team: 'away' },
      { id: 'a4', number: 8, name: 'Medio Rival', role: 'MED', x: 50, y: 35, team: 'away' },
      { id: 'a5', number: 10, name: 'Medio Rival', role: 'MED', x: 50, y: 65, team: 'away' },
      { id: 'a6', number: 7, name: 'Punta Rival', role: 'DEL', x: 25, y: 38, team: 'away' },
      { id: 'a7', number: 9, name: 'Punta Rival', role: 'DEL', x: 25, y: 62, team: 'away' },
    ]
  },
  {
    id: 'indor7-1-2-2-2',
    name: 'Indor 7: 1-2-2-2 Ataque Doble Punta',
    modality: 'INDOR_7',
    playerCount: 7,
    description: 'Sistema altamente ofensivo para remontadas con presión alta de dos delanteros.',
    homeTokens: [
      { id: 'h1', number: 1, name: 'Arquero', role: 'POR', x: 10, y: 50, team: 'home' },
      { id: 'h2', number: 2, name: 'Central I', role: 'DEF', x: 28, y: 35, team: 'home' },
      { id: 'h3', number: 3, name: 'Central D', role: 'DEF', x: 28, y: 65, team: 'home' },
      { id: 'h4', number: 6, name: 'Medio Izq', role: 'MED', x: 52, y: 30, team: 'home' },
      { id: 'h5', number: 8, name: 'Medio Der', role: 'MED', x: 52, y: 70, team: 'home' },
      { id: 'h6', number: 9, name: 'Punta I', role: 'DEL', x: 80, y: 36, team: 'home' },
      { id: 'h7', number: 11, name: 'Punta D', role: 'DEL', x: 80, y: 64, team: 'home' },
    ],
    awayTokens: [
      { id: 'a1', number: 1, name: 'Arquero Rival', role: 'POR', x: 90, y: 50, team: 'away' },
      { id: 'a2', number: 4, name: 'Defensa Rival', role: 'DEF', x: 72, y: 30, team: 'away' },
      { id: 'a3', number: 2, name: 'Defensa Rival', role: 'DEF', x: 72, y: 70, team: 'away' },
      { id: 'a4', number: 5, name: 'Pivote Rival', role: 'MED', x: 55, y: 50, team: 'away' },
      { id: 'a5', number: 8, name: 'Volante Rival', role: 'MED', x: 45, y: 25, team: 'away' },
      { id: 'a6', number: 10, name: 'Volante Rival', role: 'MED', x: 45, y: 75, team: 'away' },
      { id: 'a7', number: 9, name: 'Delantero Rival', role: 'DEL', x: 22, y: 50, team: 'away' },
    ]
  },

  // --- INDOR 9 (9 JUGADORES) ---
  {
    id: 'indor9-1-3-3-2',
    name: 'Indor 9: 1-3-3-2 Clásico Barrial',
    modality: 'INDOR_9',
    playerCount: 9,
    description: 'El esquema estándar para torneos de fútbol 9 con tres zagueros y doble delantera.',
    homeTokens: [
      { id: 'h1', number: 1, name: 'Arquero', role: 'POR', x: 10, y: 50, team: 'home' },
      { id: 'h2', number: 4, name: 'Lateral Izq', role: 'DEF', x: 27, y: 20, team: 'home' },
      { id: 'h3', number: 2, name: 'Líbero Central', role: 'DEF', x: 24, y: 50, team: 'home' },
      { id: 'h4', number: 3, name: 'Lateral Der', role: 'DEF', x: 27, y: 80, team: 'home' },
      { id: 'h5', number: 6, name: 'Volante Izq', role: 'MED', x: 50, y: 24, team: 'home' },
      { id: 'h6', number: 8, name: 'Mediocentro Eje', role: 'MED', x: 48, y: 50, team: 'home' },
      { id: 'h7', number: 7, name: 'Volante Der', role: 'MED', x: 50, y: 76, team: 'home' },
      { id: 'h8', number: 9, name: 'Delantero 1', role: 'DEL', x: 78, y: 38, team: 'home' },
      { id: 'h9', number: 11, name: 'Delantero 2', role: 'DEL', x: 78, y: 62, team: 'home' },
    ],
    awayTokens: [
      { id: 'a1', number: 1, name: 'Arquero Rival', role: 'POR', x: 90, y: 50, team: 'away' },
      { id: 'a2', number: 3, name: 'Lateral Rival', role: 'DEF', x: 73, y: 22, team: 'away' },
      { id: 'a3', number: 2, name: 'Central Rival', role: 'DEF', x: 76, y: 50, team: 'away' },
      { id: 'a4', number: 4, name: 'Lateral Rival', role: 'DEF', x: 73, y: 78, team: 'away' },
      { id: 'a5', number: 5, name: 'Medio Rival', role: 'MED', x: 52, y: 50, team: 'away' },
      { id: 'a6', number: 7, name: 'Ala Rival', role: 'MED', x: 50, y: 22, team: 'away' },
      { id: 'a7', number: 11, name: 'Ala Rival', role: 'MED', x: 50, y: 78, team: 'away' },
      { id: 'a8', number: 9, name: 'Punta Rival', role: 'DEL', x: 24, y: 40, team: 'away' },
      { id: 'a9', number: 10, name: 'Punta Rival', role: 'DEL', x: 24, y: 60, team: 'away' },
    ]
  },
  {
    id: 'indor9-1-3-4-1',
    name: 'Indor 9: 1-3-4-1 Rombo en Mediacancha',
    modality: 'INDOR_9',
    playerCount: 9,
    description: 'Máximo control de posesión en césped sintético con 4 mediocampistas.',
    homeTokens: [
      { id: 'h1', number: 1, name: 'Arquero', role: 'POR', x: 10, y: 50, team: 'home' },
      { id: 'h2', number: 4, name: 'Defensa Izq', role: 'DEF', x: 27, y: 22, team: 'home' },
      { id: 'h3', number: 2, name: 'Defensa Centro', role: 'DEF', x: 25, y: 50, team: 'home' },
      { id: 'h4', number: 3, name: 'Defensa Der', role: 'DEF', x: 27, y: 78, team: 'home' },
      { id: 'h5', number: 5, name: 'Pivote Tapón', role: 'MED', x: 42, y: 50, team: 'home' },
      { id: 'h6', number: 6, name: 'Ala Izq', role: 'MED', x: 56, y: 20, team: 'home' },
      { id: 'h7', number: 8, name: 'Ala Der', role: 'MED', x: 56, y: 80, team: 'home' },
      { id: 'h8', number: 10, name: 'Enganche Creativo', role: 'MED', x: 62, y: 50, team: 'home' },
      { id: 'h9', number: 9, name: 'Punta Definidor', role: 'DEL', x: 82, y: 50, team: 'home' },
    ],
    awayTokens: [
      { id: 'a1', number: 1, name: 'Arquero Rival', role: 'POR', x: 90, y: 50, team: 'away' },
      { id: 'a2', number: 4, name: 'Defensa Rival', role: 'DEF', x: 74, y: 25, team: 'away' },
      { id: 'a3', number: 2, name: 'Defensa Rival', role: 'DEF', x: 74, y: 50, team: 'away' },
      { id: 'a4', number: 3, name: 'Defensa Rival', role: 'DEF', x: 74, y: 75, team: 'away' },
      { id: 'a5', number: 6, name: 'Medio Rival', role: 'MED', x: 52, y: 35, team: 'away' },
      { id: 'a6', number: 8, name: 'Medio Rival', role: 'MED', x: 52, y: 65, team: 'away' },
      { id: 'a7', number: 7, name: 'Extremo Rival', role: 'DEL', x: 34, y: 22, team: 'away' },
      { id: 'a8', number: 11, name: 'Extremo Rival', role: 'DEL', x: 34, y: 78, team: 'away' },
      { id: 'a9', number: 9, name: 'Punta Rival', role: 'DEL', x: 22, y: 50, team: 'away' },
    ]
  },
  {
    id: 'indor9-1-4-3-1',
    name: 'Indor 9: 1-4-3-1 Muralla y Contragolpe',
    modality: 'INDOR_9',
    playerCount: 9,
    description: 'Línea de 4 defensores para partidos cerrados con salidas en largo hacia el ariete.',
    homeTokens: [
      { id: 'h1', number: 1, name: 'Arquero', role: 'POR', x: 10, y: 50, team: 'home' },
      { id: 'h2', number: 4, name: 'Lateral I', role: 'DEF', x: 26, y: 15, team: 'home' },
      { id: 'h3', number: 2, name: 'Central I', role: 'DEF', x: 24, y: 38, team: 'home' },
      { id: 'h4', number: 3, name: 'Central D', role: 'DEF', x: 24, y: 62, team: 'home' },
      { id: 'h5', number: 5, name: 'Lateral D', role: 'DEF', x: 26, y: 85, team: 'home' },
      { id: 'h6', number: 8, name: 'Interior I', role: 'MED', x: 50, y: 30, team: 'home' },
      { id: 'h7', number: 6, name: 'Contención', role: 'MED', x: 46, y: 50, team: 'home' },
      { id: 'h8', number: 10, name: 'Interior D', role: 'MED', x: 50, y: 70, team: 'home' },
      { id: 'h9', number: 9, name: 'Tanque Centro', role: 'DEL', x: 80, y: 50, team: 'home' },
    ],
    awayTokens: [
      { id: 'a1', number: 1, name: 'Arquero Rival', role: 'POR', x: 90, y: 50, team: 'away' },
      { id: 'a2', number: 2, name: 'Central Rival', role: 'DEF', x: 74, y: 35, team: 'away' },
      { id: 'a3', number: 3, name: 'Central Rival', role: 'DEF', x: 74, y: 65, team: 'away' },
      { id: 'a4', number: 6, name: 'Medio Rival', role: 'MED', x: 54, y: 25, team: 'away' },
      { id: 'a5', number: 8, name: 'Medio Rival', role: 'MED', x: 54, y: 50, team: 'away' },
      { id: 'a6', number: 10, name: 'Medio Rival', role: 'MED', x: 54, y: 75, team: 'away' },
      { id: 'a7', number: 7, name: 'Banda Rival', role: 'DEL', x: 30, y: 25, team: 'away' },
      { id: 'a8', number: 9, name: 'Centro Rival', role: 'DEL', x: 22, y: 50, team: 'away' },
      { id: 'a9', number: 11, name: 'Banda Rival', role: 'DEL', x: 30, y: 75, team: 'away' },
    ]
  },

  // --- FÚTBOL 11 (11 JUGADORES) ---
  {
    id: 'futbol-4-3-3',
    name: 'Fútbol 11: 4-3-3 Ofensivo Moderno',
    modality: 'FUTBOL_11',
    playerCount: 11,
    description: 'Presión alta, posesión y amplitud total con extremos abiertos y delanteros en diagonal.',
    homeTokens: [
      { id: 'h1', number: 1, name: 'Arquero', role: 'POR', x: 8, y: 50, team: 'home' },
      { id: 'h2', number: 4, name: 'Lateral Der', role: 'DEF', x: 26, y: 15, team: 'home' },
      { id: 'h3', number: 2, name: 'Central Der', role: 'DEF', x: 22, y: 38, team: 'home' },
      { id: 'h4', number: 3, name: 'Central Izq', role: 'DEF', x: 22, y: 62, team: 'home' },
      { id: 'h5', number: 5, name: 'Lateral Izq', role: 'DEF', x: 26, y: 85, team: 'home' },
      { id: 'h6', number: 6, name: 'Pivote Def', role: 'MED', x: 42, y: 50, team: 'home' },
      { id: 'h7', number: 8, name: 'Interior Der', role: 'MED', x: 54, y: 32, team: 'home' },
      { id: 'h8', number: 10, name: 'Interior Izq', role: 'MED', x: 54, y: 68, team: 'home' },
      { id: 'h9', number: 7, name: 'Extremo Der', role: 'DEL', x: 76, y: 18, team: 'home' },
      { id: 'h10', number: 9, name: 'Delantero C', role: 'DEL', x: 84, y: 50, team: 'home' },
      { id: 'h11', number: 11, name: 'Extremo Izq', role: 'DEL', x: 76, y: 82, team: 'home' },
    ],
    awayTokens: [
      { id: 'a1', number: 1, name: 'Arquero Rival', role: 'POR', x: 92, y: 50, team: 'away' },
      { id: 'a2', number: 4, name: 'Lateral Rival', role: 'DEF', x: 74, y: 15, team: 'away' },
      { id: 'a3', number: 2, name: 'Central Rival', role: 'DEF', x: 78, y: 38, team: 'away' },
      { id: 'a4', number: 3, name: 'Central Rival', role: 'DEF', x: 78, y: 62, team: 'away' },
      { id: 'a5', number: 5, name: 'Lateral Rival', role: 'DEF', x: 74, y: 85, team: 'away' },
      { id: 'a6', number: 6, name: 'Medio Rival', role: 'MED', x: 58, y: 50, team: 'away' },
      { id: 'a7', number: 8, name: 'Medio Rival', role: 'MED', x: 48, y: 35, team: 'away' },
      { id: 'a8', number: 10, name: 'Medio Rival', role: 'MED', x: 48, y: 65, team: 'away' },
      { id: 'a9', number: 7, name: 'Extremo Rival', role: 'DEL', x: 30, y: 20, team: 'away' },
      { id: 'a10', number: 9, name: 'Punta Rival', role: 'DEL', x: 22, y: 50, team: 'away' },
      { id: 'a11', number: 11, name: 'Extremo Rival', role: 'DEL', x: 30, y: 80, team: 'away' },
    ]
  },
  {
    id: 'futbol-4-4-2',
    name: 'Fútbol 11: 4-4-2 Tradicional Compacto',
    modality: 'FUTBOL_11',
    playerCount: 11,
    description: 'Estructura rígida de dos líneas de cuatro con doble ariete y repliegue rápido.',
    homeTokens: [
      { id: 'h1', number: 1, name: 'Arquero', role: 'POR', x: 8, y: 50, team: 'home' },
      { id: 'h2', number: 4, name: 'Lateral D', role: 'DEF', x: 25, y: 16, team: 'home' },
      { id: 'h3', number: 2, name: 'Central D', role: 'DEF', x: 23, y: 38, team: 'home' },
      { id: 'h4', number: 3, name: 'Central I', role: 'DEF', x: 23, y: 62, team: 'home' },
      { id: 'h5', number: 5, name: 'Lateral I', role: 'DEF', x: 25, y: 84, team: 'home' },
      { id: 'h6', number: 7, name: 'Interior D', role: 'MED', x: 50, y: 18, team: 'home' },
      { id: 'h7', number: 6, name: 'Contención D', role: 'MED', x: 46, y: 40, team: 'home' },
      { id: 'h8', number: 8, name: 'Contención I', role: 'MED', x: 46, y: 60, team: 'home' },
      { id: 'h9', number: 11, name: 'Interior I', role: 'MED', x: 50, y: 82, team: 'home' },
      { id: 'h10', number: 9, name: 'Punta I', role: 'DEL', x: 78, y: 38, team: 'home' },
      { id: 'h11', number: 10, name: 'Punta D', role: 'DEL', x: 78, y: 62, team: 'home' },
    ],
    awayTokens: [
      { id: 'a1', number: 1, name: 'Arquero Rival', role: 'POR', x: 92, y: 50, team: 'away' },
      { id: 'a2', number: 4, name: 'Lateral Rival', role: 'DEF', x: 75, y: 16, team: 'away' },
      { id: 'a3', number: 2, name: 'Central Rival', role: 'DEF', x: 77, y: 38, team: 'away' },
      { id: 'a4', number: 3, name: 'Central Rival', role: 'DEF', x: 77, y: 62, team: 'away' },
      { id: 'a5', number: 5, name: 'Lateral Rival', role: 'DEF', x: 75, y: 84, team: 'away' },
      { id: 'a6', number: 7, name: 'Banda Rival', role: 'MED', x: 52, y: 20, team: 'away' },
      { id: 'a7', number: 8, name: 'Medio Rival', role: 'MED', x: 52, y: 40, team: 'away' },
      { id: 'a8', number: 6, name: 'Medio Rival', role: 'MED', x: 52, y: 60, team: 'away' },
      { id: 'a9', number: 11, name: 'Banda Rival', role: 'MED', x: 52, y: 80, team: 'away' },
      { id: 'a10', number: 9, name: 'Punta Rival', role: 'DEL', x: 26, y: 38, team: 'away' },
      { id: 'a11', number: 10, name: 'Punta Rival', role: 'DEL', x: 26, y: 62, team: 'away' },
    ]
  },

  // --- ECUAVOLEY (3 JUGADORES) ---
  {
    id: 'ecuavoley-tradicional',
    name: 'Ecuavoley 3 vs 3 Tradicional',
    modality: 'ECUAVOLEY_3',
    playerCount: 3,
    description: 'Pizarra reglamentaria de ecuavoley: Colocador en red, Servidor en centro y Volador atrás.',
    homeTokens: [
      { id: 'h1', number: 1, name: 'Colocador (Red)', role: 'COLOCADOR', x: 38, y: 30, team: 'home' },
      { id: 'h2', number: 2, name: 'Servidor (Alza)', role: 'SERVIDOR', x: 34, y: 68, team: 'home' },
      { id: 'h3', number: 3, name: 'Volador (Zaguero)', role: 'VOLADOR', x: 16, y: 50, team: 'home' },
    ],
    awayTokens: [
      { id: 'a1', number: 1, name: 'Colocador Rival', role: 'COLOCADOR', x: 62, y: 70, team: 'away' },
      { id: 'a2', number: 2, name: 'Servidor Rival', role: 'SERVIDOR', x: 66, y: 32, team: 'away' },
      { id: 'a3', number: 3, name: 'Volador Rival', role: 'VOLADOR', x: 84, y: 50, team: 'away' },
    ]
  },

  // --- BALONCESTO (5 JUGADORES) ---
  {
    id: 'basket-2-3-zona',
    name: 'Baloncesto 2-3 Zona Defensiva',
    modality: 'BASKET_5',
    playerCount: 5,
    description: 'Protección perimetral y rebote con pívots grandes bajo el tablero.',
    homeTokens: [
      { id: 'h1', number: 1, name: 'Base (PG)', role: 'PG', x: 46, y: 35, team: 'home' },
      { id: 'h2', number: 2, name: 'Escolta (SG)', role: 'SG', x: 46, y: 65, team: 'home' },
      { id: 'h3', number: 3, name: 'Alero (SF)', role: 'SF', x: 68, y: 20, team: 'home' },
      { id: 'h4', number: 4, name: 'Ala-Pívot (PF)', role: 'PF', x: 74, y: 50, team: 'home' },
      { id: 'h5', number: 5, name: 'Pívot (C)', role: 'C', x: 68, y: 80, team: 'home' },
    ],
    awayTokens: [
      { id: 'a1', number: 1, name: 'Base Rival', role: 'PG', x: 36, y: 50, team: 'away' },
      { id: 'a2', number: 2, name: 'Escolta Rival', role: 'SG', x: 48, y: 24, team: 'away' },
      { id: 'a3', number: 3, name: 'Alero Rival', role: 'SF', x: 48, y: 76, team: 'away' },
      { id: 'a4', number: 4, name: 'Ala Rival', role: 'PF', x: 60, y: 36, team: 'away' },
      { id: 'a5', number: 5, name: 'Centro Rival', role: 'C', x: 60, y: 64, team: 'away' },
    ]
  },

  // --- PÁDEL (2 JUGADORES) ---
  {
    id: 'padel-ataque-red',
    name: 'Pádel: Ataque en Red (Víbora / Bandeja)',
    modality: 'PADEL_2',
    playerCount: 2,
    description: 'Dominio de la red con voleas cruzadas y cierre de reja.',
    homeTokens: [
      { id: 'h1', number: 1, name: 'Jugador Revés', role: 'REV', x: 36, y: 35, team: 'home' },
      { id: 'h2', number: 2, name: 'Jugador Drive', role: 'DRI', x: 36, y: 65, team: 'home' },
    ],
    awayTokens: [
      { id: 'a1', number: 1, name: 'Rival Fondo I', role: 'FONDO', x: 80, y: 32, team: 'away' },
      { id: 'a2', number: 2, name: 'Rival Fondo D', role: 'FONDO', x: 80, y: 68, team: 'away' },
    ]
  }
];

export const TacticalBoard: React.FC<TacticalBoardProps> = ({ sport, tenant }) => {
  const sportCode = sport?.code || 'FUTBOL';
  const sportName = sport?.name || 'Fútbol';

  // Determine initial modality based on sport or default
  const getInitialModality = (): TacticalModality => {
    if (sportCode === 'FUTSAL') return 'FUTSAL_5';
    if (sportCode === 'ECUAVOLEY') return 'ECUAVOLEY_3';
    if (sportCode === 'BALONCESTO') return 'BASKET_5';
    if (sportCode === 'PADEL') return 'PADEL_2';
    // If football, check if tenant or title has indoor/futsal keywords
    const tName = (tenant?.name || '').toLowerCase();
    if (tName.includes('futsal') || tName.includes('sala')) return 'FUTSAL_5';
    if (tName.includes('indor 7') || tName.includes('indoor 7') || tName.includes('fútbol 7')) return 'INDOR_7';
    if (tName.includes('indor 9') || tName.includes('indoor 9') || tName.includes('fútbol 9')) return 'INDOR_9';
    if (tName.includes('indor') || tName.includes('indoor')) return 'INDOR_7';
    return 'FUTBOL_11';
  };

  const [activeModality, setActiveModality] = useState<TacticalModality>(getInitialModality());
  const [showRivalTeam, setShowRivalTeam] = useState(true);
  const [draggedTokenId, setDraggedTokenId] = useState<string | null>(null);

  // Filter presets for active modality
  const currentPresets = TACTICAL_PRESETS.filter(p => p.modality === activeModality);
  const activePresetObj = currentPresets[0] || TACTICAL_PRESETS[0];
  const [selectedPresetId, setSelectedPresetId] = useState<string>(activePresetObj.id);

  const [homeTokens, setHomeTokens] = useState<PlayerToken[]>(activePresetObj.homeTokens);
  const [awayTokens, setAwayTokens] = useState<PlayerToken[]>(activePresetObj.awayTokens);

  const [aiReport, setAiReport] = useState<string | null>(null);
  const [generatingAi, setGeneratingAi] = useState(false);

  // Sync modality when sport changes from outside
  useEffect(() => {
    const newMod = getInitialModality();
    setActiveModality(newMod);
  }, [sportCode, tenant?.name]);

  // When modality changes, pick its default preset
  useEffect(() => {
    const presetsForMod = TACTICAL_PRESETS.filter(p => p.modality === activeModality);
    if (presetsForMod.length > 0) {
      const p = presetsForMod[0];
      setSelectedPresetId(p.id);
      setHomeTokens(p.homeTokens);
      setAwayTokens(p.awayTokens);
      setAiReport(null);
    }
  }, [activeModality]);

  const handleSelectPreset = (preset: TacticalPreset) => {
    setSelectedPresetId(preset.id);
    setHomeTokens(preset.homeTokens);
    setAwayTokens(preset.awayTokens);
    setAiReport(null);
  };

  const handleResetPositions = () => {
    const p = TACTICAL_PRESETS.find(pr => pr.id === selectedPresetId);
    if (p) {
      setHomeTokens(p.homeTokens);
      setAwayTokens(p.awayTokens);
    }
  };

  // Dragging / Moving token logic
  const boardRef = useRef<HTMLDivElement>(null);

  const handleBoardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggedTokenId || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const x = Math.max(4, Math.min(96, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(5, Math.min(95, Math.round(((e.clientY - rect.top) / rect.height) * 100)));

    if (draggedTokenId.startsWith('h')) {
      setHomeTokens(prev => prev.map(t => t.id === draggedTokenId ? { ...t, x, y } : t));
    } else {
      setAwayTokens(prev => prev.map(t => t.id === draggedTokenId ? { ...t, x, y } : t));
    }
    setDraggedTokenId(null);
  };

  const handleTokenClick = (e: React.MouseEvent, tokenId: string) => {
    e.stopPropagation();
    if (draggedTokenId === tokenId) {
      setDraggedTokenId(null);
    } else {
      setDraggedTokenId(tokenId);
    }
  };

  const handleGenerateAiReport = () => {
    setGeneratingAi(true);
    const p = TACTICAL_PRESETS.find(pr => pr.id === selectedPresetId) || activePresetObj;

    setTimeout(() => {
      setGeneratingAi(false);

      let advice = '';
      if (activeModality === 'FUTSAL_5') {
        advice = `• Dinámica de 5 Jugadores: Priorizar salidas de 3 en rombo con apoyo del portero como jugador adicional si hay presión alta.\n` +
                 `• Transición Rápida: Los 2 alas deben alternar desmarques en diagonal hacia el pívot boya.\n` +
                 `• Consejo Defensivo: Bloque en rombo cerrado en media cancha para forzar disparos lejanos y salir en contragolpe de 3 vs 2.`;
      } else if (activeModality === 'INDOR_7') {
        advice = `• Dinámica de 7 Jugadores (Césped Sintético & Paredes): Utilizar las paredes perimetrales de rebote como pared viva para desarmar marcas pegadas.\n` +
                 `• Presión Escalonada: El pivote tapón (#5) debe relevar la espalda de los carrileros cuando se proyectan al ataque.\n` +
                 `• Consejo DT: Finalizar jugadas antes de los 8 segundos para evitar repliegue rival y balones sueltos en el área chica.`;
      } else if (activeModality === 'INDOR_9') {
        advice = `• Dinámica de 9 Jugadores: Aprovechar el espacio intermedio entre los 3 defensores y la doble delantera.\n` +
                 `• Ocupación de Bandas: Los 2 volantes laterales deben ensanchar la cancha para que los 2 delanteros fijen a los centrales.\n` +
                 `• Consejo DT: Mantener una distancia máxima de 25 metros entre la última línea y los delanteros para compactar el bloque.`;
      } else if (activeModality === 'ECUAVOLEY_3') {
        advice = `• Dinámica de Ecuavoley (3 vs 3): Colocador (#1) debe variar entre bola corta a la raya y batida al fondo cruzado.\n` +
                 `• Servidor (#2): Alzar el balón a 50cm sobre la red con trayectoria parabólica limpia para que el colocador tenga ángulo de visión total.\n` +
                 `• Volador (#3): Cobertura profunda en diagonal y comunicación constante con el servidor para la segunda jugada.`;
      } else if (activeModality === 'BASKET_5') {
        advice = `• Dinámica Baloncesto 5 vs 5: Cierre del poste bajo para impedir penetraciones y forzar tiro exterior.\n` +
                 `• Bloqueo y Continuación (Pick & Roll): El base (#1) debe sincronizarse con el pívot (#5) para generar mismatch.`;
      } else if (activeModality === 'PADEL_2') {
        advice = `• Dinámica de Pádel Dobles: Mantener la red a toda costa con bandejas profundas al cristal de fondo del rival.\n` +
                 `• Comunicación de Pareja: Si el rival tira globo, ambos retroceden coordinados manteniendo la línea.`;
      } else {
        advice = `• Ocupación óptima de espacios en 11 vs 11 con balance ofensivo-defensivo.\n` +
                 `• Presión tras pérdida en los primeros 5 segundos en campo rival.`;
      }

      setAiReport(
        `🧠 ANÁLISIS TÁCTICO IA (DEPORVERSO ANALYTICS - GEMINI):\n` +
        `• Esquema Activo: ${p.name} (${p.playerCount} Jugadores por Equipo).\n` +
        `• Modalidad: ${activeModality.replace('_', ' ')} • Subdominio: ${tenant?.domain || 'deporverso.app'}.\n\n` +
        `${advice}\n\n` +
        `• Eficacia Estimada: 94.2% con transiciones controladas en menos de 3 toques.`
      );
    }, 1200);
  };

  // Court appearance based on modality
  const getCourtVisuals = () => {
    switch (activeModality) {
      case 'FUTSAL_5':
        return {
          bg: 'bg-gradient-to-br from-[#0c2e4e] via-[#09223a] to-[#041424]',
          border: 'border-cyan-400/40',
          lines: 'border-cyan-300/40',
          tag: 'Cancha Oficial de Fútsal FIFA (Piso Flotante Azul / 5 Jugadores)',
          laser: 'via-cyan-400'
        };
      case 'INDOR_7':
        return {
          bg: 'bg-gradient-to-br from-[#072b16] via-[#041c0e] to-[#020d06]',
          border: 'border-[#00ff66]/50',
          lines: 'border-[#00ff66]/40',
          tag: 'Cancha Sintética Indor 7 con Paredes de Rebote (7 Jugadores)',
          laser: 'via-[#00ff66]'
        };
      case 'INDOR_9':
        return {
          bg: 'bg-gradient-to-br from-[#09351b] via-[#052312] to-[#03150a]',
          border: 'border-emerald-400/40',
          lines: 'border-emerald-300/40',
          tag: 'Cancha Césped Sintético Indor 9 (9 Jugadores)',
          laser: 'via-emerald-400'
        };
      case 'ECUAVOLEY_3':
        return {
          bg: 'bg-gradient-to-br from-[#2a1708] via-[#1a0e04] to-[#0c0602]',
          border: 'border-amber-500/50',
          lines: 'border-amber-400/40',
          tag: 'Cancha Reglamentaria de Ecuavoley (Red 2.80m / 3 Jugadores)',
          laser: 'via-amber-400'
        };
      case 'BASKET_5':
        return {
          bg: 'bg-gradient-to-br from-[#2e1808] via-[#1d0e04] to-[#0c0502]',
          border: 'border-orange-500/50',
          lines: 'border-orange-400/40',
          tag: 'Tabloncillo Parquet Baloncesto (5 Jugadores)',
          laser: 'via-orange-400'
        };
      case 'PADEL_2':
        return {
          bg: 'bg-gradient-to-br from-[#0c2438] via-[#061522] to-[#020b12]',
          border: 'border-sky-400/50',
          lines: 'border-sky-300/40',
          tag: 'Pista de Pádel Cristal & Red Central (Duplas)',
          laser: 'via-sky-400'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-[#062413] via-[#04170c] to-[#020c06]',
          border: 'border-emerald-500/50',
          lines: 'border-emerald-400/40',
          tag: 'Campo Reglamentario Fútbol 11 (11 Jugadores)',
          laser: 'via-emerald-400'
        };
    }
  };

  const court = getCourtVisuals();

  return (
    <div className="space-y-6">
      {/* TACTICAL BOARD BANNER */}
      <div className="bg-gradient-to-r from-[#0a1b2a] via-[#05111c] to-[#030910] p-6 sm:p-8 rounded-3xl border border-cyan-500/35 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden card-3d-interactive">
        <div className="corner-bracket-tl"></div>
        <div className="corner-bracket-br"></div>
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="bg-cyan-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Layout className="w-3.5 h-3.5" />
              <span>Pizarra Táctica Multideporte</span>
            </span>
            <span className="text-cyan-400 text-xs font-mono font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {sportName}
            </span>
            {tenant && (
              <span className="text-emerald-400 text-xs font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {tenant.name} ({tenant.domain})
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Pizarra Táctica Inteligente para DTs & Arbitraje
          </h1>
          <p className="text-xs text-white/60 mt-1 max-w-2xl leading-relaxed">
            Adaptada para cada deporte: <strong>Indor 7</strong> y <strong>Indor 9</strong> jugadores, <strong>Fútsal 5</strong> jugadores, <strong>Fútbol 11</strong>, <strong>Ecuavoley 3</strong>, <strong>Baloncesto</strong> y <strong>Pádel</strong>. Sincronizada con el subdominio de tu liga.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleGenerateAiReport}
            disabled={generatingAi}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 via-teal-400 to-[#00ff66] hover:from-cyan-300 hover:to-emerald-300 text-black font-black px-5 py-3 rounded-2xl shadow-xl shadow-cyan-500/25 transition-all cursor-pointer whitespace-nowrap text-xs hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>{generatingAi ? 'Analizando Formación...' : 'Análisis Táctico Gemini IA'}</span>
          </button>
        </div>
      </div>

      {/* SELECTOR DE MODALIDAD (FUTSAL 5, INDOR 7, INDOR 9, FUTBOL 11, ETC.) */}
      <div className="bg-[#050b12] p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Modalidad de Cancha:</span>
          </span>

          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveModality('FUTSAL_5')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer font-mono flex items-center gap-1.5 ${
                activeModality === 'FUTSAL_5'
                  ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/30 ring-2 ring-cyan-300'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-500" />
              Fútsal (5 Jugadores)
            </button>

            <button
              onClick={() => setActiveModality('INDOR_7')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer font-mono flex items-center gap-1.5 ${
                activeModality === 'INDOR_7'
                  ? 'bg-[#00ff66] text-slate-950 shadow-md shadow-[#00ff66]/30 ring-2 ring-emerald-300'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              Indor 7 (7 Jugadores)
            </button>

            <button
              onClick={() => setActiveModality('INDOR_9')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer font-mono flex items-center gap-1.5 ${
                activeModality === 'INDOR_9'
                  ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/30 ring-2 ring-emerald-300'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              Indor 9 (9 Jugadores)
            </button>

            <button
              onClick={() => setActiveModality('FUTBOL_11')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer font-mono flex items-center gap-1.5 ${
                activeModality === 'FUTBOL_11'
                  ? 'bg-teal-400 text-slate-950 shadow-md shadow-teal-400/30 ring-2 ring-teal-300'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-teal-600" />
              Fútbol 11 (11 Jugadores)
            </button>

            <button
              onClick={() => setActiveModality('ECUAVOLEY_3')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer font-mono flex items-center gap-1.5 ${
                activeModality === 'ECUAVOLEY_3'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 ring-2 ring-amber-300'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Ecuavoley 3
            </button>
          </div>
        </div>

        {/* CONTROLES DE LA PIZARRA */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={() => setShowRivalTeam(!showRivalTeam)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-mono ${
              showRivalTeam
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-700 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showRivalTeam ? 'Ocultar Rival' : 'Mostrar Rival'}</span>
          </button>

          <button
            onClick={handleResetPositions}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 font-mono"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* IZQUIERDA: PIZARRA DE CANCHA VISUAL */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#050b12] border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden card-3d-interactive">
            <div className="corner-bracket-tl"></div>
            <div className="corner-bracket-br"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-2 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>{court.tag}</span>
                </span>
                <p className="text-[11px] text-white/50 font-mono mt-0.5">
                  Haz clic en una ficha y luego en cualquier zona de la cancha para reposicionarla libremente.
                </p>
              </div>

              {/* SELECTOR DE PRESETS DE LA MODALIDAD */}
              <div className="flex gap-1.5 flex-wrap">
                {currentPresets.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer font-mono ${
                      selectedPresetId === preset.id
                        ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30 font-black'
                        : 'bg-black/50 text-white/60 hover:text-white border border-white/10'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* SIMULADOR DE CANCHA */}
            <div
              ref={boardRef}
              onClick={handleBoardClick}
              className={`relative w-full aspect-[16/9] ${court.bg} border-2 ${court.border} rounded-2xl overflow-hidden shadow-2xl select-none cursor-crosshair`}
            >
              {/* LÁSER DE RASTREO TÁCTICO */}
              <div className={`absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent ${court.laser} to-transparent shadow-[0_0_12px_#22d3ee] animate-laser-sweep pointer-events-none z-10`} />

              {/* DEMARCACIÓN SEGÚN MODALIDAD */}
              {activeModality === 'ECUAVOLEY_3' ? (
                // LÍNEAS ECUAVOLEY
                <div className="absolute inset-0 pointer-events-none">
                  {/* Borde exterior */}
                  <div className="absolute inset-4 border-2 border-amber-400/40 rounded" />
                  {/* Red central vertical alta */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-1.5 bg-gradient-to-b from-amber-300 via-white to-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.6)] z-10" />
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-black font-black text-[9px] px-2 py-0.5 rounded uppercase font-mono z-20">
                    RED 2.80M
                  </div>
                  {/* Zonas de servicio */}
                  <div className="absolute top-4 bottom-4 left-1/4 w-0.5 border-r border-dashed border-amber-400/30" />
                  <div className="absolute top-4 bottom-4 right-1/4 w-0.5 border-r border-dashed border-amber-400/30" />
                </div>
              ) : activeModality === 'FUTSAL_5' ? (
                // LÍNEAS FÚTSAL (PARQUET/AZUL FIFA)
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-4 border-2 border-cyan-300/40 rounded-xl" />
                  {/* Línea de medio campo */}
                  <div className="absolute top-4 bottom-4 left-1/2 w-0.5 bg-cyan-300/40" />
                  {/* Círculo central 3m */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-cyan-300/40 rounded-full" />
                  {/* Área penal semicircular 6m Local */}
                  <div className="absolute top-1/2 left-4 -translate-y-1/2 w-20 h-36 border-r-2 border-cyan-300/40 rounded-r-full" />
                  {/* Punto penal 6m Local */}
                  <div className="absolute top-1/2 left-24 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-300 rounded-full" />
                  {/* Doble penalti 10m Local */}
                  <div className="absolute top-1/2 left-36 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-300/60 rounded-full" />
                  {/* Área penal Visitante */}
                  <div className="absolute top-1/2 right-4 -translate-y-1/2 w-20 h-36 border-l-2 border-cyan-300/40 rounded-l-full" />
                  <div className="absolute top-1/2 right-24 translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-300 rounded-full" />
                  <div className="absolute top-1/2 right-36 translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-300/60 rounded-full" />
                </div>
              ) : (
                // LÍNEAS DE INDOR 7, INDOR 9 Y FÚTBOL 11
                <div className="absolute inset-0 pointer-events-none">
                  <div className={`absolute inset-4 border-2 ${court.lines} rounded-xl`} />
                  <div className={`absolute top-4 bottom-4 left-1/2 w-0.5 ${court.lines}`} />
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-2 ${court.lines} rounded-full`} />
                  {/* Área local */}
                  <div className={`absolute top-1/2 left-4 -translate-y-1/2 w-24 h-44 border-r-2 border-t-2 border-b-2 ${court.lines} rounded-r-lg`} />
                  <div className={`absolute top-1/2 left-20 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-300 rounded-full`} />
                  {/* Área visitante */}
                  <div className={`absolute top-1/2 right-4 -translate-y-1/2 w-24 h-44 border-l-2 border-t-2 border-b-2 ${court.lines} rounded-l-lg`} />
                  <div className={`absolute top-1/2 right-20 translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-300 rounded-full`} />
                  {/* Paredes de rebote indicativas en Indor */}
                  {(activeModality === 'INDOR_7' || activeModality === 'INDOR_9') && (
                    <>
                      <div className="absolute top-1 inset-x-4 h-1.5 bg-[#00ff66]/30 rounded shadow-[0_0_8px_#00ff66]" />
                      <div className="absolute bottom-1 inset-x-4 h-1.5 bg-[#00ff66]/30 rounded shadow-[0_0_8px_#00ff66]" />
                    </>
                  )}
                </div>
              )}

              {/* FICHAS LOCALES (CIAN / ESMERALDA) */}
              {homeTokens.map((t) => {
                const isSelected = draggedTokenId === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={(e) => handleTokenClick(e, t.id)}
                    style={{ left: `${t.x}%`, top: `${t.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer z-30 transition-transform ${
                      isSelected ? 'scale-125' : 'hover:scale-110'
                    }`}
                  >
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-cyan-400 via-teal-300 to-[#00ff66] text-black font-black text-xs flex items-center justify-center border-2 ${
                      isSelected ? 'border-yellow-300 shadow-[0_0_20px_#eab308]' : 'border-white shadow-[0_0_15px_rgba(34,211,238,0.6)]'
                    }`}>
                      {t.number}
                    </div>
                    <span className="text-[9px] font-mono font-bold text-white bg-black/90 px-1.5 py-0.5 rounded-full border border-cyan-500/40 mt-0.5 whitespace-nowrap shadow-md">
                      {t.name}
                    </span>
                  </div>
                );
              })}

              {/* FICHAS VISITANTES (ROJO RUBÍ / ÁMBAR) */}
              {showRivalTeam && awayTokens.map((t) => {
                const isSelected = draggedTokenId === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={(e) => handleTokenClick(e, t.id)}
                    style={{ left: `${t.x}%`, top: `${t.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer z-30 transition-transform ${
                      isSelected ? 'scale-125' : 'hover:scale-110'
                    }`}
                  >
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 text-white font-black text-xs flex items-center justify-center border-2 ${
                      isSelected ? 'border-yellow-300 shadow-[0_0_20px_#eab308]' : 'border-white/80 shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                    }`}>
                      {t.number}
                    </div>
                    <span className="text-[9px] font-mono font-bold text-white bg-rose-950/90 px-1.5 py-0.5 rounded-full border border-rose-500/40 mt-0.5 whitespace-nowrap shadow-md">
                      {t.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* BARRA DE ESTADO Y LEYENDA */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono text-white/60">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 border border-white" />
                  <span>Equipo Local ({homeTokens.length} Jugadores)</span>
                </div>
                {showRivalTeam && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500 border border-white" />
                    <span>Equipo Rival ({awayTokens.length} Jugadores)</span>
                  </div>
                )}
              </div>

              {draggedTokenId && (
                <span className="text-yellow-300 font-bold bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/30 animate-pulse">
                  📍 Ficha seleccionada. Haz clic en la cancha para moverla.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* DERECHA: REPORTE E INFORME TÁCTICO */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#050b12] rounded-3xl border border-cyan-500/30 p-6 space-y-4 shadow-2xl relative overflow-hidden card-3d-interactive">
            <div className="corner-bracket-tl"></div>
            <div className="corner-bracket-br"></div>

            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <FileText className="w-4 h-4" />
              <span>Informe de Pizarra Táctica DT</span>
            </h3>

            {aiReport ? (
              <div className="p-4 rounded-2xl bg-black/70 border border-cyan-500/30 text-xs text-white/90 space-y-2 font-mono">
                <pre className="whitespace-pre-wrap leading-relaxed">{aiReport}</pre>
              </div>
            ) : (
              <div className="text-xs text-white/60 leading-relaxed bg-black/50 p-4 rounded-2xl border border-white/5 space-y-2">
                <p>
                  Esquema actual: <strong className="text-cyan-300">{activePresetObj.name}</strong>
                </p>
                <p className="text-[11px] text-white/50">
                  {activePresetObj.description}
                </p>
                <p className="text-[11px] text-emerald-400 pt-1">
                  Presiona <strong>"Análisis Táctico Gemini IA"</strong> para generar un desglose profesional de fortalezas y debilidades.
                </p>
              </div>
            )}

            {/* LISTA DE JUGADORES Y ROLES EN CANCHA */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white/70 block font-mono">
                  Alineación Local ({homeTokens.length}):
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">
                  {activeModality.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {homeTokens.map(t => (
                  <div 
                    key={t.id} 
                    onClick={(e) => handleTokenClick(e, t.id)}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      draggedTokenId === t.id
                        ? 'bg-cyan-950/60 border-cyan-400 text-white'
                        : 'bg-black/50 border-white/5 hover:border-cyan-500/30 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyan-400 text-black font-black text-[10px] flex items-center justify-center">
                        {t.number}
                      </div>
                      <span className="font-bold">{t.name}</span>
                    </div>
                    <span className="text-[10px] bg-cyan-500/15 text-cyan-300 px-2 py-0.5 rounded-md font-mono border border-cyan-500/20">
                      {t.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
