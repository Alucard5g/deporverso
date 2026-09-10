import React, { useRef, useState, useEffect } from 'react';
import { 
  Download, Sparkles, Image, Calendar, Check, RefreshCw, Trophy, 
  Layout, Palette, Copy, Shield, Plus, Trash2, Edit3, FileText, 
  Globe, MapPin, Clock, Users, Eye, Sparkle
} from 'lucide-react';
import { Tenant, Match, Team } from '../types';

interface CalendarCardGeneratorProps {
  tenant: Tenant;
  matches: Match[];
  teams: Team[];
}

export interface ScheduleItem {
  id: string;
  time: string;
  dateGroup: string;
  cancha: string;
  homeTeam: string;
  homeColor1: string;
  homeColor2: string;
  awayTeam: string;
  awayColor1: string;
  awayColor2: string;
  category: string;
  stageFecha: string;
  vocalTeam: string;
  vocalCategory?: string;
}

type ThemeType = 'PRINT_SADCAF_PRO' | 'BROADCAST_TV_4K' | 'GALA_CHAMPIONS' | 'DARK_CYBER';
type AspectFormat = 'DOC_A4_SHEET' | 'STORY_VERTICAL' | 'BANNER_HORIZONTAL';

// Preset from user's SADCAF real fixture sheet
const SADCAF_REAL_PRESET: ScheduleItem[] = [
  {
    id: 's1',
    time: '19:00',
    dateGroup: 'Viernes - Julio 31, 2026',
    cancha: 'Liga Jaramillo Arteaga',
    homeTeam: 'Diego Cevallos',
    homeColor1: '#2563eb',
    homeColor2: '#f59e0b',
    awayTeam: 'Estudiantes de la Plata',
    awayColor1: '#dc2626',
    awayColor2: '#ffffff',
    category: 'Segunda',
    stageFecha: 'Primera Etapa | Fecha 4',
    vocalTeam: 'C.D. Olimpia | Segunda'
  },
  {
    id: 's2',
    time: '20:30',
    dateGroup: 'Viernes - Julio 31, 2026',
    cancha: 'Liga Jaramillo Arteaga',
    homeTeam: 'C.D. Olimpia',
    homeColor1: '#16a34a',
    homeColor2: '#ffffff',
    awayTeam: 'Esteparios',
    awayColor1: '#475569',
    awayColor2: '#0f172a',
    category: 'Segunda',
    stageFecha: 'Primera Etapa | Fecha 4',
    vocalTeam: 'Estudiantes de la Pl... | Segunda'
  },
  {
    id: 's3',
    time: '08:00',
    dateGroup: 'Sábado - Agosto 01, 2026',
    cancha: 'Liga Jaramillo Arteaga',
    homeTeam: 'Diego Cevallos',
    homeColor1: '#2563eb',
    homeColor2: '#f59e0b',
    awayTeam: 'Kokochos Master',
    awayColor1: '#d97706',
    awayColor2: '#1e293b',
    category: 'Master',
    stageFecha: 'Primera Etapa | Fecha 5',
    vocalTeam: 'Los Vikingos | Master'
  },
  {
    id: 's4',
    time: '09:30',
    dateGroup: 'Sábado - Agosto 01, 2026',
    cancha: 'Liga Jaramillo Arteaga',
    homeTeam: 'Los Vikingos',
    homeColor1: '#0284c7',
    homeColor2: '#e2e8f0',
    awayTeam: 'FUTBOL CLUB CHELSEA',
    awayColor1: '#1d4ed8',
    awayColor2: '#ffffff',
    category: 'Master',
    stageFecha: 'Primera Etapa | Fecha 5',
    vocalTeam: 'Diego Cevallos | Master'
  },
  {
    id: 's5',
    time: '11:00',
    dateGroup: 'Sábado - Agosto 01, 2026',
    cancha: 'Liga Jaramillo Arteaga',
    homeTeam: 'Flamengo',
    homeColor1: '#b91c1c',
    homeColor2: '#0f172a',
    awayTeam: 'Cosmos Jr',
    awayColor1: '#0284c7',
    awayColor2: '#ffffff',
    category: 'Master',
    stageFecha: 'Primera Etapa | Fecha 5',
    vocalTeam: 'Bruselas S.C. | Master'
  },
  {
    id: 's6',
    time: '12:30',
    dateGroup: 'Sábado - Agosto 01, 2026',
    cancha: 'Liga Jaramillo Arteaga',
    homeTeam: 'Bruselas S.C.',
    homeColor1: '#7c3aed',
    homeColor2: '#ffffff',
    awayTeam: 'C.D. Olimpia',
    awayColor1: '#16a34a',
    awayColor2: '#ffffff',
    category: 'Master',
    stageFecha: 'Primera Etapa | Fecha 5',
    vocalTeam: 'Cosmos Jr | Master'
  },
  {
    id: 's7',
    time: '14:00',
    dateGroup: 'Sábado - Agosto 01, 2026',
    cancha: 'Liga Jaramillo Arteaga',
    homeTeam: 'La Roca F.C.',
    homeColor1: '#059669',
    homeColor2: '#0f172a',
    awayTeam: 'C.D. Argentina',
    awayColor1: '#38bdf8',
    awayColor2: '#ffffff',
    category: 'Segunda',
    stageFecha: 'Primera Etapa | Fecha 4',
    vocalTeam: 'Estrella Sur | Segunda'
  },
  {
    id: 's8',
    time: '15:30',
    dateGroup: 'Sábado - Agosto 01, 2026',
    cancha: 'Liga Jaramillo Arteaga',
    homeTeam: 'Estrella Sur',
    homeColor1: '#ea580c',
    homeColor2: '#ffffff',
    awayTeam: 'Cosmos Jr',
    awayColor1: '#0284c7',
    awayColor2: '#ffffff',
    category: 'Segunda',
    stageFecha: 'Primera Etapa | Fecha 4',
    vocalTeam: 'C.D. Argentina | Segunda'
  },
  {
    id: 's9',
    time: '17:00',
    dateGroup: 'Sábado - Agosto 01, 2026',
    cancha: 'Liga Jaramillo Arteaga',
    homeTeam: 'C.D. Cruceiro',
    homeColor1: '#2563eb',
    homeColor2: '#ffffff',
    awayTeam: 'C.A. Alvez',
    awayColor1: '#0d9488',
    awayColor2: '#f59e0b',
    category: 'Primera',
    stageFecha: 'Primera Etapa | Fecha 4',
    vocalTeam: 'Spencer FC | Primera'
  },
  {
    id: 's10',
    time: '18:30',
    dateGroup: 'Sábado - Agosto 01, 2026',
    cancha: 'Liga Jaramillo Arteaga',
    homeTeam: 'Spencer FC',
    homeColor1: '#4338ca',
    homeColor2: '#e0e7ff',
    awayTeam: 'C.D. Amazonas',
    awayColor1: '#15803d',
    awayColor2: '#fef08a',
    category: 'Primera',
    stageFecha: 'Primera Etapa | Fecha 4',
    vocalTeam: 'C.D. Cruceiro | Primera'
  }
];

export const CalendarCardGenerator: React.FC<CalendarCardGeneratorProps> = ({
  tenant,
  matches,
  teams
}) => {
  const safeTenant: Tenant = tenant || {
    id: 't-default',
    name: 'Liga Deportivo Jaramillo Arteaga',
    slug: 'jaramilloarteaga',
    sport_code: 'FUTBOL',
    country: 'Ecuador',
    currency: 'USD',
    domain: 'jaramilloarteaga.sadcaf.com',
    is_active: true,
    annual_license_fee: 25.0,
    created_at: '2026-01-01T00:00:00Z'
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Customization Options
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('PRINT_SADCAF_PRO');
  const [aspectFormat, setAspectFormat] = useState<AspectFormat>('DOC_A4_SHEET');
  
  // Header Info
  const [leagueName, setLeagueName] = useState<string>(safeTenant.name || 'Liga Deportiva Jaramillo Arteaga');
  const [domainUrl, setDomainUrl] = useState<string>(safeTenant.domain || 'jaramilloarteaga.sadcaf.com');
  const [countryText, setCountryText] = useState<string>(safeTenant.country || 'Ecuador');
  const [mainTitle, setMainTitle] = useState<string>('HORARIOS PRÓXIMA FECHA');
  const [generationDateText, setGenerationDateText] = useState<string>('Julio 30, 2026 15:30:00');

  // Schedule Items State
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(SADCAF_REAL_PRESET);

  // New Match Form State
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newItem, setNewItem] = useState<Partial<ScheduleItem>>({
    time: '12:00',
    dateGroup: 'Sábado - Agosto 01, 2026',
    cancha: 'Liga Jaramillo Arteaga',
    homeTeam: 'Equipo Local',
    homeColor1: '#2563eb',
    homeColor2: '#ffffff',
    awayTeam: 'Equipo Visitante',
    awayColor1: '#dc2626',
    awayColor2: '#ffffff',
    category: 'Primera',
    stageFecha: 'Primera Etapa | Fecha 5',
    vocalTeam: 'Vocal Asignado'
  });

  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Helper to draw team shield/crest on canvas
  const drawTeamCrest = (
    ctx: CanvasRenderingContext2D,
    teamName: string,
    x: number,
    y: number,
    radius: number,
    color1: string,
    color2: string,
    isDarkTheme: boolean
  ) => {
    ctx.save();
    ctx.translate(x, y);

    const w = radius * 1.8;
    const h = radius * 2.1;
    const top = -h / 2;

    ctx.beginPath();
    ctx.moveTo(0, top);
    ctx.lineTo(w / 2, top + h * 0.2);
    ctx.lineTo(w / 2, top + h * 0.65);
    ctx.quadraticCurveTo(w / 2, top + h, 0, top + h * 1.15);
    ctx.quadraticCurveTo(-w / 2, top + h, -w / 2, top + h * 0.65);
    ctx.lineTo(-w / 2, top + h * 0.2);
    ctx.closePath();

    ctx.save();
    ctx.clip();

    ctx.fillStyle = color1 || '#2563eb';
    ctx.fillRect(-w, -h, w, h * 2);
    ctx.fillStyle = color2 || '#dc2626';
    ctx.fillRect(0, -h, w, h * 2);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.beginPath();
    ctx.moveTo(-w, h);
    ctx.lineTo(w, -h);
    ctx.lineTo(w, -h + 15);
    ctx.lineTo(-w, h + 15);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    ctx.strokeStyle = isDarkTheme ? '#ffffff' : '#0f172a';
    ctx.lineWidth = radius * 0.15;
    ctx.stroke();

    const initials = teamName
      ? teamName
          .split(' ')
          .map((word) => word[0])
          .filter(Boolean)
          .slice(0, 2)
          .join('')
          .toUpperCase()
      : 'FC';

    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 3;
    ctx.font = `black ${Math.round(radius * 0.7)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 0, 1);

    ctx.restore();
  };

  // Main Canvas Drawing Routine
  const drawCalendarImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 1240;
    let height = 1754; // A4 standard high-res ratio

    if (aspectFormat === 'STORY_VERTICAL') {
      width = 1080;
      height = 1920;
    } else if (aspectFormat === 'BANNER_HORIZONTAL') {
      width = 1920;
      height = 1080;
    }

    canvas.width = width;
    canvas.height = height;

    const isDark = selectedTheme !== 'PRINT_SADCAF_PRO';

    // --- 1. BACKGROUND ENGINE ---
    if (selectedTheme === 'PRINT_SADCAF_PRO') {
      // Official Print Document Clean White Layout
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Top Header Teal/Blue Polygon Accents (SADCAF Style)
      ctx.fillStyle = '#0e7490'; // Teal
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, 50);
      ctx.lineTo(0, 110);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#1e3a8a'; // Dark Blue
      ctx.beginPath();
      ctx.moveTo(width, 0);
      ctx.lineTo(width, 90);
      ctx.lineTo(width * 0.35, 30);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#06b6d4'; // Light Cyan Stripe
      ctx.beginPath();
      ctx.moveTo(0, 108);
      ctx.lineTo(width, 48);
      ctx.lineTo(width, 56);
      ctx.lineTo(0, 116);
      ctx.closePath();
      ctx.fill();
    } else if (selectedTheme === 'BROADCAST_TV_4K') {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#050c1a');
      grad.addColorStop(0.5, '#0a192f');
      grad.addColorStop(1, '#020611');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Stadium Spotlight Effects
      const glow1 = ctx.createRadialGradient(width / 2, 200, 50, width / 2, 200, 600);
      glow1.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
      glow1.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, width, height);
    } else if (selectedTheme === 'GALA_CHAMPIONS') {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#120f0a');
      grad.addColorStop(0.5, '#241b0e');
      grad.addColorStop(1, '#080604');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Gold Radial Glow
      const glow = ctx.createRadialGradient(width / 2, 300, 20, width / 2, 300, 700);
      glow.addColorStop(0, 'rgba(245, 158, 11, 0.2)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
    } else {
      // DARK_CYBER
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#040d09');
      grad.addColorStop(0.5, '#091c13');
      grad.addColorStop(1, '#020704');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // --- 2. HEADER SECTION ---
    let headerY = selectedTheme === 'PRINT_SADCAF_PRO' ? 140 : 60;

    if (selectedTheme === 'PRINT_SADCAF_PRO') {
      // League Logo Shield on Top Left
      drawTeamCrest(ctx, leagueName, 100, headerY + 15, 34, '#b91c1c', '#0f172a', false);

      // League Name & URL Header
      ctx.fillStyle = '#0f172a';
      ctx.font = 'black 32px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(leagueName, 160, headerY + 10);

      ctx.fillStyle = '#475569';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(domainUrl, 160, headerY + 36);

      ctx.fillStyle = '#64748b';
      ctx.font = '18px sans-serif';
      ctx.fillText(countryText, 160, headerY + 58);

      // Main Title: "HORARIOS PRÓXIMA FECHA"
      ctx.fillStyle = '#0f172a';
      ctx.font = 'black 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(mainTitle, width / 2, headerY + 120);

      // Accent underline below title
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(120, headerY + 135);
      ctx.lineTo(width - 120, headerY + 135);
      ctx.stroke();

      headerY += 160;
    } else {
      // Dark / Broadcast Header Styling
      ctx.fillStyle = selectedTheme === 'GALA_CHAMPIONS' ? '#f59e0b' : '#38bdf8';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚽ SPORTIA GLOBAL MULTISPORT ENGINE • PROGRAMACIÓN OFICIAL', width / 2, headerY);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'black 48px sans-serif';
      ctx.fillText(leagueName.toUpperCase(), width / 2, headerY + 50);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(`${mainTitle} • ${domainUrl}`, width / 2, headerY + 85);

      headerY += 120;
    }

    // --- 3. SCHEDULE ITEMS RENDERING ENGINE ---
    // Group matches by dateGroup
    const groupedMatches: { [date: string]: ScheduleItem[] } = {};
    scheduleItems.forEach((item) => {
      const dg = item.dateGroup || 'Fecha Programada';
      if (!groupedMatches[dg]) groupedMatches[dg] = [];
      groupedMatches[dg].push(item);
    });

    let currentY = headerY;
    const marginX = selectedTheme === 'PRINT_SADCAF_PRO' ? 100 : 80;
    const contentWidth = width - marginX * 2;

    Object.keys(groupedMatches).forEach((dateKey) => {
      const itemsInGroup = groupedMatches[dateKey];

      // --- Date Header Bar ---
      if (selectedTheme === 'PRINT_SADCAF_PRO') {
        // Date Pill / Bar (SADCAF Style: "Viernes - Julio 31, 2026")
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(marginX, currentY, contentWidth, 42);

        // Subtle green border & underline
        ctx.strokeStyle = '#86efac';
        ctx.lineWidth = 3;
        ctx.strokeRect(marginX, currentY, contentWidth, 42);

        ctx.fillStyle = '#1e293b';
        ctx.font = 'italic bold 22px serif';
        ctx.textAlign = 'center';
        ctx.fillText(dateKey, width / 2, currentY + 28);

        currentY += 52;

        // Cancha Sub-bar: "Cancha: Liga Jaramillo Arteaga"
        const canchaName = itemsInGroup[0]?.cancha || 'Liga Jaramillo Arteaga';
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Cancha: ${canchaName}`, width / 2, currentY + 18);

        currentY += 32;
      } else {
        // Dark Theme Date Section Bar
        ctx.fillStyle = selectedTheme === 'GALA_CHAMPIONS' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)';
        ctx.fillRect(marginX, currentY, contentWidth, 46);

        ctx.strokeStyle = selectedTheme === 'GALA_CHAMPIONS' ? '#f59e0b' : '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(marginX, currentY, contentWidth, 46);

        ctx.fillStyle = selectedTheme === 'GALA_CHAMPIONS' ? '#fef08a' : '#e0f2fe';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`📅 ${dateKey}  |  📍 Cancha: ${itemsInGroup[0]?.cancha || 'Sede Principal'}`, width / 2, currentY + 30);

        currentY += 60;
      }

      // --- Match Rows ---
      const rowHeight = selectedTheme === 'PRINT_SADCAF_PRO' ? 70 : 80;
      const rowGap = selectedTheme === 'PRINT_SADCAF_PRO' ? 8 : 12;

      itemsInGroup.forEach((match, idx) => {
        const rowY = currentY;

        if (selectedTheme === 'PRINT_SADCAF_PRO') {
          // Zebra striping
          ctx.fillStyle = idx % 2 === 0 ? '#f8fafc' : '#ffffff';
          ctx.fillRect(marginX, rowY, contentWidth, rowHeight);

          // Card Outer Border
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(marginX, rowY, contentWidth, rowHeight);

          // Time Box Left (e.g., "19:00", "08:00")
          const timeBoxW = 100;
          ctx.fillStyle = '#f1f5f9';
          ctx.fillRect(marginX, rowY, timeBoxW, rowHeight);
          ctx.strokeStyle = '#cbd5e1';
          ctx.strokeRect(marginX, rowY, timeBoxW, rowHeight);

          ctx.fillStyle = '#0f172a';
          ctx.font = 'black 22px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(match.time, marginX + timeBoxW / 2, rowY + 40);

          // Center Matchup Details
          const matchCenterX = marginX + timeBoxW + (contentWidth - timeBoxW) / 2;

          // Home Team (Right-aligned to VS)
          ctx.textAlign = 'right';
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 21px sans-serif';
          ctx.fillText(match.homeTeam, matchCenterX - 60, rowY + 28);

          // Home Crest
          drawTeamCrest(ctx, match.homeTeam, matchCenterX - 35, rowY + 22, 12, match.homeColor1, match.homeColor2, false);

          // "VS" Label
          ctx.textAlign = 'center';
          ctx.fillStyle = '#475569';
          ctx.font = 'italic bold 18px serif';
          ctx.fillText('VS', matchCenterX, rowY + 28);

          // Away Crest
          drawTeamCrest(ctx, match.awayTeam, matchCenterX + 35, rowY + 22, 12, match.awayColor1, match.awayColor2, false);

          // Away Team (Left-aligned from VS)
          ctx.textAlign = 'left';
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 21px sans-serif';
          ctx.fillText(match.awayTeam, matchCenterX + 60, rowY + 28);

          // --- Sub-row Metadata (SADCAF Style) ---
          const subY = rowY + 54;
          ctx.font = '15px sans-serif';

          // Category
          ctx.textAlign = 'left';
          ctx.fillStyle = '#334155';
          ctx.fillText(`Categoría: ${match.category}`, marginX + timeBoxW + 15, subY);

          // Stage / Fecha
          ctx.textAlign = 'center';
          ctx.fillStyle = '#475569';
          ctx.fillText(match.stageFecha, matchCenterX, subY);

          // Vocal Team
          ctx.textAlign = 'right';
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 15px sans-serif';
          ctx.fillText(`Vocal: ${match.vocalTeam}`, marginX + contentWidth - 15, subY);
        } else {
          // --- Dark / TV / Gala Theme Match Row ---
          ctx.fillStyle = selectedTheme === 'GALA_CHAMPIONS' ? 'rgba(30, 24, 12, 0.9)' : 'rgba(15, 23, 42, 0.9)';
          ctx.fillRect(marginX, rowY, contentWidth, rowHeight);

          ctx.strokeStyle = selectedTheme === 'GALA_CHAMPIONS' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(56, 189, 248, 0.3)';
          ctx.lineWidth = 1;
          ctx.strokeRect(marginX, rowY, contentWidth, rowHeight);

          // Left Accent Stripe
          ctx.fillStyle = selectedTheme === 'GALA_CHAMPIONS' ? '#f59e0b' : '#06b6d4';
          ctx.fillRect(marginX, rowY, 8, rowHeight);

          // Time Badge
          const timeBoxW = 120;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          ctx.fillRect(marginX + 20, rowY + 15, timeBoxW, rowHeight - 30);

          ctx.fillStyle = selectedTheme === 'GALA_CHAMPIONS' ? '#fbfbfe' : '#ffffff';
          ctx.font = 'black 24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(match.time, marginX + 20 + timeBoxW / 2, rowY + 48);

          // Teams
          const matchCenterX = marginX + (contentWidth / 2) + 20;

          // Home Team
          ctx.textAlign = 'right';
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 24px sans-serif';
          ctx.fillText(match.homeTeam, matchCenterX - 70, rowY + 36);

          drawTeamCrest(ctx, match.homeTeam, matchCenterX - 40, rowY + 30, 16, match.homeColor1, match.homeColor2, true);

          // VS Circle
          ctx.fillStyle = selectedTheme === 'GALA_CHAMPIONS' ? '#f59e0b' : '#38bdf8';
          ctx.beginPath();
          ctx.arc(matchCenterX, rowY + 32, 20, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#000000';
          ctx.font = 'black 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('VS', matchCenterX, rowY + 37);

          // Away Team
          drawTeamCrest(ctx, match.awayTeam, matchCenterX + 40, rowY + 30, 16, match.awayColor1, match.awayColor2, true);

          ctx.textAlign = 'left';
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 24px sans-serif';
          ctx.fillText(match.awayTeam, matchCenterX + 70, rowY + 36);

          // Sub-row Badge details
          ctx.font = '14px sans-serif';
          ctx.fillStyle = '#94a3b8';
          ctx.textAlign = 'center';
          ctx.fillText(`${match.category} • ${match.stageFecha}  |  Vocal: ${match.vocalTeam}`, width / 2, rowY + 68);
        }

        currentY += rowHeight + rowGap;
      });

      currentY += 15; // Gap between date groups
    });

    // --- 4. DOCUMENT FOOTER SECTION ---
    if (selectedTheme === 'PRINT_SADCAF_PRO') {
      const footerY = height - 80;

      // Top separator line
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(marginX, footerY - 15);
      ctx.lineTo(width - marginX, footerY - 15);
      ctx.stroke();

      // Generation Metadata Stamp
      ctx.textAlign = 'left';
      ctx.fillStyle = '#334155';
      ctx.font = '16px sans-serif';
      ctx.fillText(`Fecha de generación del documento: ${generationDateText}`, marginX, footerY + 10);
      ctx.fillText(`Documento generado desde el sistema Deporverso | www.deporverso.com`, marginX, footerY + 32);
      ctx.fillText('Página 1', marginX, footerY + 54);

      // Bottom Right Logo / Brand Stamp
      ctx.textAlign = 'right';
      ctx.fillStyle = '#0f172a';
      ctx.font = 'black 28px sans-serif';
      ctx.fillText('DEPORVERSO', width - marginX, footerY + 30);
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('Plataforma Deportiva Global', width - marginX, footerY + 52);
    } else {
      const footerY = height - 60;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`⚡ INFOGRAFÍA CREADA CON SPORTIA ENGINE • ${domainUrl}`, width / 2, footerY);
    }
  };

  useEffect(() => {
    drawCalendarImage();
  }, [
    selectedTheme, aspectFormat, leagueName, domainUrl, countryText, 
    mainTitle, generationDateText, scheduleItems
  ]);

  // Handle Download Image
  const handleDownloadJpg = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `calendario_oficial_${safeTenant.slug || 'liga'}_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Handle Copy to Clipboard
  const handleCopyToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(dataUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      } else {
        handleDownloadJpg();
      }
    } catch (err) {
      handleDownloadJpg();
    }
  };

  // Preset Loaders
  const loadSadcafPreset = () => {
    setLeagueName('Liga Deportiva Jaramillo Arteaga');
    setDomainUrl('jaramilloarteaga.sadcaf.com');
    setCountryText('Ecuador');
    setMainTitle('HORARIOS PRÓXIMA FECHA');
    setSelectedTheme('PRINT_SADCAF_PRO');
    setAspectFormat('DOC_A4_SHEET');
    setScheduleItems(SADCAF_REAL_PRESET);
  };

  const loadActiveTenantPreset = () => {
    setLeagueName(safeTenant.name || 'Liga Barrial Deporverso');
    setDomainUrl(safeTenant.domain || 'deporverso.com');
    setCountryText(safeTenant.country || 'Ecuador');
    setMainTitle('PROGRAMACIÓN OFICIAL DE PARTIDOS');
    
    if (matches && matches.length > 0) {
      const mappedItems: ScheduleItem[] = matches.map((m, idx) => {
        const homeT = teams.find(t => t.id === m.home_team_id);
        const awayT = teams.find(t => t.id === m.away_team_id);
        
        return {
          id: m.id || `m-${idx}`,
          time: m.match_date ? new Date(m.match_date).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }) : '15:00',
          dateGroup: m.match_date ? new Date(m.match_date).toLocaleDateString('es-EC', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Sábado - Agosto 01, 2026',
          cancha: m.field_location || 'Estadio Central',
          homeTeam: homeT ? homeT.name : 'Equipo Local',
          homeColor1: homeT?.primary_color || '#2563eb',
          homeColor2: homeT?.secondary_color || '#ffffff',
          awayTeam: awayT ? awayT.name : 'Equipo Visitante',
          awayColor1: awayT?.primary_color || '#dc2626',
          awayColor2: awayT?.secondary_color || '#ffffff',
          category: 'Primera Senior',
          stageFecha: `Fase Regular | Fecha ${idx + 1}`,
          vocalTeam: teams[(idx + 2) % (teams.length || 1)]?.name || 'Vocalía Asignada'
        };
      });
      setScheduleItems(mappedItems);
    }
  };

  // Add Item to Schedule
  const handleAddItem = () => {
    if (!newItem.homeTeam || !newItem.awayTeam) return;

    const itemToAdd: ScheduleItem = {
      id: `custom-${Date.now()}`,
      time: newItem.time || '15:00',
      dateGroup: newItem.dateGroup || 'Sábado - Agosto 01, 2026',
      cancha: newItem.cancha || 'Liga Jaramillo Arteaga',
      homeTeam: newItem.homeTeam || 'Equipo A',
      homeColor1: newItem.homeColor1 || '#2563eb',
      homeColor2: newItem.homeColor2 || '#ffffff',
      awayTeam: newItem.awayTeam || 'Equipo B',
      awayColor1: newItem.awayColor1 || '#dc2626',
      awayColor2: newItem.awayColor2 || '#ffffff',
      category: newItem.category || 'Primera',
      stageFecha: newItem.stageFecha || 'Primera Etapa | Fecha 1',
      vocalTeam: newItem.vocalTeam || 'Vocal Asignado'
    };

    setScheduleItems(prev => [...prev, itemToAdd]);
    setShowAddForm(false);
  };

  // Remove Item
  const handleRemoveItem = (id: string) => {
    setScheduleItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="bg-[#0a0a0a] border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Shield className="w-3 h-3" /> Generador de Calendarios HD Realistas
            </span>
            <span className="text-white/40 text-xs font-mono">Formatos SADCAF Impreso, TV Broadcast & Stories</span>
          </div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-400" />
            Programador & Generador Gráfico de Horarios Próxima Fecha
          </h2>
          <p className="text-xs text-white/50 mt-1">
            Diseña documentos de calendario oficiales estilo SADCAF impreso de alta precisión, afiches TV Broadcast y placas HD para redes sociales.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopyToClipboard}
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-3 rounded-2xl border border-white/20 transition-all cursor-pointer"
          >
            {copySuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">¡Imagen Copiada!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Imagen</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadJpg}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs px-5 py-3 rounded-2xl shadow-xl shadow-amber-500/20 cursor-pointer transition-all"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Documento Guardado!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Descargar Documento HD (JPG)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Quick Loader Buttons */}
      <div className="flex flex-wrap items-center gap-3 bg-[#121212] p-4 rounded-2xl border border-white/10">
        <span className="text-xs font-bold text-white/60 flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Plantillas Rápidas:
        </span>

        <button
          onClick={loadSadcafPreset}
          className="px-3.5 py-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          Cargar Ejemplo Real "Liga Jaramillo Arteaga" (SADCAF)
        </button>

        <button
          onClick={loadActiveTenantPreset}
          className="px-3.5 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Trophy className="w-3.5 h-3.5" />
          Cargar Partidos de la Liga Actual ({safeTenant.name})
        </button>
      </div>

      {/* Control Settings Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#121212] p-5 rounded-2xl border border-white/10 text-xs">
        <div>
          <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5" /> Estilo & Tema Gráfico
          </label>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value as ThemeType)}
            className="w-full bg-[#0a0a0a] border border-white/15 rounded-xl px-3 py-2.5 text-white font-bold focus:border-amber-500 focus:outline-none"
          >
            <option value="PRINT_SADCAF_PRO">📄 Documento Oficial Impreso HD (SADCAF Pro)</option>
            <option value="BROADCAST_TV_4K">📺 Transmisión TV 4K (Oscuro Broadcast & Luces)</option>
            <option value="GALA_CHAMPIONS">🏆 Edición Champions (Dorado & Neón)</option>
            <option value="DARK_CYBER">🟢 Cyber Neón (Social Media / WhatsApp)</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <Layout className="w-3.5 h-3.5" /> Formato de Salida
          </label>
          <select
            value={aspectFormat}
            onChange={(e) => setAspectFormat(e.target.value as AspectFormat)}
            className="w-full bg-[#0a0a0a] border border-white/15 rounded-xl px-3 py-2.5 text-white font-bold focus:border-amber-500 focus:outline-none"
          >
            <option value="DOC_A4_SHEET">📄 Hoja Documento A4 (1240 x 1754 px - Impresión/PDF)</option>
            <option value="STORY_VERTICAL">📱 Story Vertical 9:16 (1080 x 1920 px - Mobile)</option>
            <option value="BANNER_HORIZONTAL">🖥️ Banner Widescreen 16:9 (1920 x 1080 px)</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-1">
            Nombre de la Liga / Organización
          </label>
          <input
            type="text"
            value={leagueName}
            onChange={(e) => setLeagueName(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-1">
            Sitio Web / Subdominio URL
          </label>
          <input
            type="text"
            value={domainUrl}
            onChange={(e) => setDomainUrl(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-1">
            Título Principal del Afiche
          </label>
          <input
            type="text"
            value={mainTitle}
            onChange={(e) => setMainTitle(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-1">
            País / Provincia
          </label>
          <input
            type="text"
            value={countryText}
            onChange={(e) => setCountryText(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-1">
            Fecha de Generación del Documento
          </label>
          <input
            type="text"
            value={generationDateText}
            onChange={(e) => setGenerationDateText(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Ocultar Formulario' : 'Agregar Partido al Horario'}</span>
          </button>
        </div>
      </div>

      {/* Add New Match Inline Form */}
      {showAddForm && (
        <div className="bg-[#121212] border border-emerald-500/30 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-black text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
            <Plus className="w-4 h-4" /> Añadir Nuevo Partido a la Programación
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[10px] text-white/60 block mb-1 font-bold">Fecha / Día (Grupo)</label>
              <input
                type="text"
                value={newItem.dateGroup}
                onChange={e => setNewItem({...newItem, dateGroup: e.target.value})}
                placeholder="Ej: Sábado - Agosto 01, 2026"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2 text-white"
              />
            </div>

            <div>
              <label className="text-[10px] text-white/60 block mb-1 font-bold">Hora del Partido</label>
              <input
                type="text"
                value={newItem.time}
                onChange={e => setNewItem({...newItem, time: e.target.value})}
                placeholder="Ej: 19:00"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] text-white/60 block mb-1 font-bold">Cancha / Sede</label>
              <input
                type="text"
                value={newItem.cancha}
                onChange={e => setNewItem({...newItem, cancha: e.target.value})}
                placeholder="Ej: Liga Jaramillo Arteaga"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2 text-white"
              />
            </div>

            <div>
              <label className="text-[10px] text-white/60 block mb-1 font-bold">Equipo Local</label>
              <input
                type="text"
                value={newItem.homeTeam}
                onChange={e => setNewItem({...newItem, homeTeam: e.target.value})}
                placeholder="Nombre Equipo Local"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2 text-white font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] text-white/60 block mb-1 font-bold">Equipo Visitante</label>
              <input
                type="text"
                value={newItem.awayTeam}
                onChange={e => setNewItem({...newItem, awayTeam: e.target.value})}
                placeholder="Nombre Equipo Visitante"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2 text-white font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] text-white/60 block mb-1 font-bold">Categoría</label>
              <input
                type="text"
                value={newItem.category}
                onChange={e => setNewItem({...newItem, category: e.target.value})}
                placeholder="Ej: Segunda / Master / Primera"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2 text-white"
              />
            </div>

            <div>
              <label className="text-[10px] text-white/60 block mb-1 font-bold">Etapa / Fecha</label>
              <input
                type="text"
                value={newItem.stageFecha}
                onChange={e => setNewItem({...newItem, stageFecha: e.target.value})}
                placeholder="Ej: Primera Etapa | Fecha 4"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2 text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] text-white/60 block mb-1 font-bold">Equipo Vocal Asignado (Vocalía)</label>
              <input
                type="text"
                value={newItem.vocalTeam}
                onChange={e => setNewItem({...newItem, vocalTeam: e.target.value})}
                placeholder="Ej: C.D. Olimpia | Segunda"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2 text-white"
              />
            </div>
          </div>

          <button
            onClick={handleAddItem}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl cursor-pointer transition-all shadow-lg shadow-emerald-500/20"
          >
            Insertar Partido a la Lista ({scheduleItems.length + 1} partidos en total)
          </button>
        </div>
      )}

      {/* Schedule Items Quick List Manager */}
      <div className="bg-[#121212] p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            Lista de Partidos Programados ({scheduleItems.length})
          </span>
          <span className="text-white/40 text-[11px]">Haz clic en el bote de basura para eliminar partidos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
          {scheduleItems.map((item, idx) => (
            <div key={item.id} className="bg-[#0a0a0a] p-2.5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500/20 text-amber-400 font-mono font-bold text-[10px] px-1.5 py-0.5 rounded">
                    {item.time}
                  </span>
                  <span className="font-bold text-white">{item.homeTeam} vs {item.awayTeam}</span>
                </div>
                <div className="text-[10px] text-white/50 flex items-center gap-2">
                  <span>Categoría: {item.category}</span>
                  <span>•</span>
                  <span>Vocal: {item.vocalTeam}</span>
                </div>
              </div>

              <button
                onClick={() => handleRemoveItem(item.id)}
                className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-all cursor-pointer"
                title="Eliminar partido"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Live Canvas Visualizer Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white/80 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-amber-400" />
            Vista Previa en Tiempo Real ({aspectFormat === 'DOC_A4_SHEET' ? 'Hoja A4 Documento HD (1240 x 1754 px)' : aspectFormat === 'STORY_VERTICAL' ? 'Story 9:16 (1080 x 1920 px)' : '1920 x 1080 px'})
          </span>
          <button
            onClick={drawCalendarImage}
            className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            Forzar Renderizado Manual
          </button>
        </div>

        <div className="bg-[#050505] p-6 rounded-2xl border border-white/10 flex justify-center overflow-x-auto">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto rounded-xl shadow-2xl border border-amber-500/30 max-h-[850px] object-contain bg-white"
          />
        </div>
      </div>
    </div>
  );
};
