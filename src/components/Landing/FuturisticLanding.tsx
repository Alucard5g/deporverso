import React, { useEffect, useRef, useState } from 'react';
import { 
  Trophy, Video, Activity, Globe, Sparkles, ChevronRight, 
  ExternalLink, QrCode, FileText, CheckCircle, ShieldCheck, 
  Flame, ArrowRight, X, Play, Cpu, Layers, Zap, Tag, Image as ImageIcon
} from 'lucide-react';
import { SportCode, Tenant } from '../../types';
import { ExclusiveOfferCheckoutModal } from '../Marketing/ExclusiveOfferCheckoutModal';

interface FuturisticLandingProps {
  onNavigateTab: (tab: string) => void;
  onRequestDemo?: () => void;
  onStartNow?: () => void;
  onSelectSport?: (sport: SportCode) => void;
  onAddTenant?: (tenant: Omit<Tenant, 'id' | 'created_at'>) => void;
}

export const FuturisticLanding: React.FC<FuturisticLandingProps> = ({
  onNavigateTab,
  onRequestDemo,
  onStartNow,
  onSelectSport,
  onAddTenant
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showTechModal, setShowTechModal] = useState<boolean>(false);
  const [showCheckoutOfferModal, setShowCheckoutOfferModal] = useState<boolean>(false);
  const [activeDiscipline, setActiveDiscipline] = useState<string>('futbol');

  // Motor de Partículas Cuánticas 3D y Ondas Concéntricas (Efecto del Video)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const PARTICLE_COUNT = 360;
    const particles: Array<{
      angle: number;
      radius: number;
      angularSpeed: number;
      y: number;
      vy: number;
      size: number;
      baseAlpha: number;
      alpha: number;
      isCyan: boolean;
      currentRadius?: number;
    }> = [];

    const createParticle = (initial = false) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * (width < 768 ? 160 : 300);
      const angularSpeed = (0.003 + Math.random() * 0.007) * (Math.random() > 0.5 ? 1 : -1);
      const y = initial ? Math.random() * height : height * 0.76 + (Math.random() - 0.5) * 60;
      const vy = -(0.6 + Math.random() * 1.6);
      const size = Math.random() * 2.2 + 0.6;
      const baseAlpha = Math.random() * 0.75 + 0.2;
      return {
        angle,
        radius,
        angularSpeed,
        y,
        vy,
        size,
        baseAlpha,
        alpha: baseAlpha,
        isCyan: Math.random() > 0.45
      };
    };

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle(true));
    }

    let ripplePhase = 0;

    const drawFloorRipples = () => {
      const centerX = width / 2;
      const centerY = height * 0.68;
      const maxRadius = width < 768 ? 200 : 380;

      ctx.save();
      ripplePhase += 0.012;

      for (let i = 0; i < 4; i++) {
        const currentR = ((ripplePhase + i * 0.25) % 1) * maxRadius;
        const alpha = (1 - currentR / maxRadius) * 0.42;

        ctx.beginPath();
        ctx.ellipse(centerX, centerY, currentR, currentR * 0.26, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.shadowColor = '#00F0FF';
        ctx.shadowBlur = 10;
        ctx.stroke();
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Dibujar ondas concéntricas en el suelo
      drawFloorRipples();

      // 2. Actualizar y dibujar partículas
      const centerX = width / 2;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.angularSpeed;
        p.y += p.vy;

        // Modulación cónica/árbol del vórtice como en el video
        const progress = Math.max(0, Math.min(1, (height - p.y) / height));
        p.currentRadius = p.radius * (0.28 + Math.sin(progress * Math.PI) * 0.95);

        if (p.y < height * 0.12) {
          p.alpha -= 0.02;
        }

        if (p.y < 0 || p.alpha <= 0) {
          Object.assign(p, createParticle(false));
        }

        const x = centerX + Math.cos(p.angle) * (p.currentRadius || p.radius);
        const y = p.y;

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);

        if (p.isCyan) {
          ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
          ctx.shadowColor = '#00F0FF';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = `rgba(0, 102, 255, ${p.alpha})`;
          ctx.shadowColor = '#0066FF';
          ctx.shadowBlur = 6;
        }

        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const centerX = width / 2;
      const deltaX = (mouseX - centerX) / centerX;
      for (let i = 0; i < particles.length; i++) {
        particles[i].angle += deltaX * 0.0008;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleStartAction = () => {
    if (onStartNow) {
      onStartNow();
    } else if (onRequestDemo) {
      onRequestDemo();
    } else {
      onNavigateTab('league');
    }
  };

  const handleDemoAction = () => {
    if (onRequestDemo) {
      onRequestDemo();
    } else {
      onNavigateTab('league');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden selection:bg-[#00F0FF] selection:text-black">
      
      {/* 0. FONDO AMBIENTAL: Canvas de Vórtice 3D y Niebla Lumínica */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-gradient-to-tr from-[#0066FF]/30 via-[#00F0FF]/20 to-transparent rounded-full blur-[90px] animate-pulse"></div>
        <div className="absolute bottom-10 left-1/4 w-[500px] h-[400px] bg-[#0066FF]/15 rounded-full blur-[110px]"></div>
        <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-[#00F0FF]/15 rounded-full blur-[120px]"></div>
        
        {/* Canvas de Partículas */}
        <canvas ref={canvasRef} className="w-full h-full block opacity-95" />
        
        {/* Grilla Holográfica Sutil */}
        <div 
          className="absolute inset-0 opacity-40" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* BANNER PROMOCIONAL SUPERIOR: OFERTA 50% OFF PRIMERAS 10 LIGAS */}
        <div className="w-full bg-gradient-to-r from-[#0066FF] via-[#00F0FF] to-[#0066FF] p-[1px] shadow-[0_4px_25px_rgba(0,102,255,0.35)]">
          <div className="bg-[#030712]/95 px-4 py-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs">
            <span className="flex items-center gap-1.5 font-bold text-amber-300">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              SUPER OFERTA PRIMERAS 10 LIGAS:
            </span>
            <span className="text-slate-200">
              Precio oficial <span className="line-through text-slate-400 font-mono">$70</span> • Ahora con <strong className="text-[#00F0FF] font-bold">50% DE DESCUENTO: solo $35 por equipo</strong>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-mono font-bold border border-red-500/40 animate-pulse">
              ¡Solo 4 de 10 cupos restantes!
            </span>
            <button
              onClick={() => setShowCheckoutOfferModal(true)}
              className="px-3.5 py-1 rounded-full bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs shadow-[0_0_15px_rgba(0,102,255,0.7)] flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <span>Reclamar $35/Equipo</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00F0FF]" />
            </button>
          </div>
        </div>

        {/* 1. CABECERA (NAVBAR) */}
        <header className="w-full px-6 py-5 max-w-7xl mx-auto flex items-center justify-between">
          
          {/* LOGOTIPO */}
          <div 
            onClick={() => onNavigateTab('welcome')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#00F0FF] p-[1.5px] shadow-[0_0_20px_rgba(0,102,255,0.6)]">
              <div className="w-full h-full bg-[#050B1B] rounded-[10px] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#00F0FF] transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="m4.93 4.93 4.24 4.24"/>
                  <path d="m14.83 9.17 4.24-4.24"/>
                  <path d="m14.83 14.83 4.24 4.24"/>
                  <path d="m9.17 14.83-4.24 4.24"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Deporverso
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
              </span>
              <span className="text-[10px] font-mono text-[#00F0FF]/80 tracking-widest uppercase">Global Multi-Sport</span>
            </div>
          </div>

          {/* MENÚ CENTRAL EN CÁPSULA GLASSMORPHIC */}
          <nav className="hidden md:flex items-center gap-1 px-4 py-2 rounded-full bg-[#080F24]/70 backdrop-blur-xl border border-white/10 shadow-2xl">
            <button 
              onClick={() => onNavigateTab('league')} 
              className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              Plataforma
            </button>
            <button 
              onClick={() => onNavigateTab('calendar')} 
              className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              Torneos
            </button>
            <button 
              onClick={() => onNavigateTab('scouting')} 
              className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              Analítica
            </button>
            <button 
              onClick={() => onNavigateTab('var')} 
              className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              Integraciones
            </button>
          </nav>

          {/* ACCIONES A LA DERECHA */}
          <div className="flex items-center gap-3">
            {/* Badge estilo QR "Easy to Start" del video */}
            <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#080F24]/70 backdrop-blur-md border border-white/10 text-xs">
              <div className="w-6 h-6 bg-white rounded p-0.5 flex items-center justify-center">
                <QrCode className="w-full h-full text-black" />
              </div>
              <div className="leading-tight text-left">
                <p className="font-semibold text-white text-[11px]">Fácil Inicio</p>
                <p className="text-[9px] text-slate-400">Escanea la App</p>
              </div>
            </div>

            {/* CTA Solicitar Demo */}
            <button
              onClick={handleDemoAction}
              className="px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white tracking-wide bg-[#0066FF] hover:bg-[#0052cc] shadow-[0_0_25px_rgba(0,102,255,0.6)] hover:shadow-[0_0_35px_rgba(0,240,255,0.8)] transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Solicitar Demo</span>
              <ArrowRight className="w-4 h-4 text-[#00F0FF]" />
            </button>
          </div>
        </header>


        {/* 2. SECCIÓN HERO */}
        <main className="flex-1 flex flex-col justify-center px-6 pt-4 pb-16 max-w-7xl mx-auto w-full">
          
          <div className="text-center max-w-4xl mx-auto pt-6 pb-4">
            
            {/* Píldora Superior: Badge Inteligencia Deportiva */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F172A]/80 backdrop-blur-xl border border-white/15 shadow-[0_0_20px_rgba(0,102,255,0.3)] text-xs font-semibold text-cyan-300 tracking-wider uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
              <span>INTELIGENCIA DEPORTIVA GLOBAL</span>
            </div>

            {/* Título Principal */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-6">
              La Evolución de la <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-[#00F0FF]">
                Gestión Multideporte Global
              </span>
            </h1>

            {/* Párrafo Descriptivo Secundario */}
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
              Orquestación integral de ligas y torneos en tiempo real: automatización inteligente de fixtures, sistema VAR a la carta, vocalía digital y analítica predictiva de alto rendimiento.
            </p>

            {/* Botones de Acción */}
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={() => setShowCheckoutOfferModal(true)}
                className="px-6 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-extrabold text-white tracking-wide bg-[#0066FF] hover:bg-[#0052cc] shadow-[0_0_25px_rgba(0,102,255,0.7)] hover:shadow-[0_0_35px_rgba(0,240,255,0.8)] transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Tag className="w-4 h-4 text-[#00F0FF]" />
                <span>Oferta 50% OFF ($35/Eq)</span>
              </button>

              <button
                onClick={() => setShowTechModal(true)}
                className="px-5 sm:px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                Documentación
              </button>
            </div>
          </div>

          {/* ESCENARIO CENTRAL 3D / VÓRTICE CON PÍLDORAS FLOTANTES DE DISCIPLINAS */}
          <div className="relative w-full max-w-5xl mx-auto h-[440px] md:h-[500px] flex items-center justify-center mt-2">
            
            {/* Piso con Ondas y Reflejos Concéntricos */}
            <div 
              className="absolute bottom-6 w-[340px] md:w-[580px] h-[150px] rounded-[100%] border border-[#00F0FF]/30 flex items-center justify-center"
              style={{
                background: 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(0, 102, 255, 0.25), rgba(3, 7, 18, 0.95) 75%)'
              }}
            >
              <div className="w-4 h-4 rounded-full bg-[#00F0FF] shadow-[0_0_30px_#00F0FF] z-10" />
            </div>

            {/* Píldoras Flotantes Alrededor del Vórtice */}
            
            {/* 1. Fútbol Pro */}
            <div 
              onClick={() => {
                setActiveDiscipline('futbol');
                if (onSelectSport) onSelectSport('FUTBOL');
                onNavigateTab('league');
              }}
              className="absolute top-12 left-4 sm:left-10 lg:left-16 cursor-pointer transform hover:scale-105 transition-all z-20"
            >
              <div className="px-4 sm:px-5 py-3 rounded-2xl bg-[#0F172A]/80 backdrop-blur-xl border border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex items-center gap-3.5 hover:border-[#00F0FF] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all">
                <div className="w-9 h-9 rounded-xl bg-[#0066FF]/30 border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF]">
                  ⚽
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white tracking-wide">Fútbol Pro</p>
                  <p className="text-[10px] text-[#00F0FF]/80 font-mono">11v11 • Indor 7 & 9</p>
                </div>
              </div>
            </div>

            {/* 2. Baloncesto */}
            <div 
              onClick={() => {
                setActiveDiscipline('baloncesto');
                if (onSelectSport) onSelectSport('BALONCESTO');
                onNavigateTab('league');
              }}
              className="absolute bottom-24 left-4 sm:left-16 lg:left-24 cursor-pointer transform hover:scale-105 transition-all z-20"
            >
              <div className="px-4 sm:px-5 py-3 rounded-2xl bg-[#0F172A]/80 backdrop-blur-xl border border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex items-center gap-3.5 hover:border-orange-400 hover:shadow-[0_0_25px_rgba(251,146,60,0.4)] transition-all">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400">
                  🏀
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white tracking-wide">Baloncesto</p>
                  <p className="text-[10px] text-orange-300/80 font-mono">FIBA • Shot Clock</p>
                </div>
              </div>
            </div>

            {/* 3. eSports */}
            <div 
              onClick={() => {
                setActiveDiscipline('esports');
                onNavigateTab('heroes-vr');
              }}
              className="absolute top-10 right-4 sm:right-10 lg:right-16 cursor-pointer transform hover:scale-105 transition-all z-20"
            >
              <div className="px-4 sm:px-5 py-3 rounded-2xl bg-[#0F172A]/80 backdrop-blur-xl border border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex items-center gap-3.5 hover:border-purple-400 hover:shadow-[0_0_25px_rgba(192,132,252,0.4)] transition-all">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                  🎮
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white tracking-wide">eSports</p>
                  <p className="text-[10px] text-purple-300/80 font-mono">Sim Racing • VR</p>
                </div>
              </div>
            </div>

            {/* 4. Tenis & Pádel */}
            <div 
              onClick={() => {
                setActiveDiscipline('tennis');
                if (onSelectSport) onSelectSport('TENNIS');
                onNavigateTab('league');
              }}
              className="absolute bottom-24 right-4 sm:right-16 lg:right-24 cursor-pointer transform hover:scale-105 transition-all z-20"
            >
              <div className="px-4 sm:px-5 py-3 rounded-2xl bg-[#0F172A]/80 backdrop-blur-xl border border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex items-center gap-3.5 hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(52,211,153,0.4)] transition-all">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                  🎾
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white tracking-wide">Tenis & Pádel</p>
                  <p className="text-[10px] text-emerald-300/80 font-mono">Sets • Tiebreak VAR</p>
                </div>
              </div>
            </div>

            {/* 5. Centro: Píldora de Estado Central */}
            <div className="absolute z-30 bottom-10">
              <div className="px-5 py-2 rounded-full bg-[#080F24]/80 backdrop-blur-xl border border-[#00F0FF]/40 shadow-[0_0_30px_rgba(0,240,255,0.3)] flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-ping" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-white font-bold">DEPORVERSO CORE v2.4</span>
                <span className="text-slate-500">|</span>
                <span className="text-[11px] text-[#00F0FF] font-medium">99.99% Uptime</span>
              </div>
            </div>

          </div>

        </main>


        {/* 3. SECCIÓN DE CAPACIDADES (GRID DE 4 TARJETAS) */}
        <section id="capacidades" className="py-20 px-6 max-w-7xl mx-auto w-full relative z-20">
          
          {/* Encabezado */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 border-b border-white/10 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00F0FF] tracking-widest uppercase mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                ARQUITECTURA DE MISIÓN CRÍTICA
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Tecnología con Propósito Deportivo
              </h2>
            </div>
            <p className="text-slate-400 max-w-md text-sm md:text-base leading-relaxed">
              Una suite integrada de motores computacionales diseñada para ligas profesionales, federaciones y clubes que exigen máxima precisión operativa y escalabilidad global.
            </p>
          </div>

          {/* Cuadrícula de 4 Tarjetas Numeradas (01, 02, 03, 04) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* TARJETA 01 */}
            <div 
              onClick={() => onNavigateTab('league')}
              className="rounded-2xl p-7 flex flex-col justify-between group relative overflow-hidden bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl border border-white/10 hover:border-[#00F0FF]/40 hover:bg-gradient-to-br hover:from-[#0066FF]/15 hover:to-[#00F0FF]/05 transition-all duration-400 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1.5"
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#0066FF]/20 rounded-full blur-2xl group-hover:bg-[#00F0FF]/30 transition-all duration-500" />
              
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-3xl font-mono font-bold text-white/30 group-hover:text-[#00F0FF] transition-colors">
                    01
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F0FF] group-hover:border-[#00F0FF]/50 group-hover:bg-[#00F0FF]/10 transition-all">
                    <Trophy className="w-5 h-5" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-[#00F0FF] transition-colors">
                  Gestión de Torneos en Vivo
                </h3>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Sincronización instantánea de fixture dinámico, vocalía digital remota y control automatizado de amonestaciones y tablas de posiciones en tiempo real.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-[#00F0FF]">
                <span>MOTOR MULTI-TENANT</span>
                <span className="flex items-center gap-1 font-semibold">VER PORTAL <ChevronRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>

            {/* TARJETA 02 */}
            <div 
              onClick={() => onNavigateTab('var')}
              className="rounded-2xl p-7 flex flex-col justify-between group relative overflow-hidden bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl border border-white/10 hover:border-[#00F0FF]/40 hover:bg-gradient-to-br hover:from-[#0066FF]/15 hover:to-[#00F0FF]/05 transition-all duration-400 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1.5"
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#0066FF]/20 rounded-full blur-2xl group-hover:bg-[#00F0FF]/30 transition-all duration-500" />

              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-3xl font-mono font-bold text-white/30 group-hover:text-[#00F0FF] transition-colors">
                    02
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F0FF] group-hover:border-[#00F0FF]/50 group-hover:bg-[#00F0FF]/10 transition-all">
                    <Video className="w-5 h-5" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-[#00F0FF] transition-colors">
                  Sistema VAR y Video Arbitraje
                </h3>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Repetición multicámara a la carta, calibración de líneas de fuera de juego, corte vertical asistido para redes y actas arbitrales selladas con hash de seguridad.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-[#00F0FF]">
                <span>FFMPEG + YOLOv8</span>
                <span className="flex items-center gap-1 font-semibold">VAR A LA CARTA <ChevronRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>

            {/* TARJETA 03 */}
            <div 
              onClick={() => onNavigateTab('scouting')}
              className="rounded-2xl p-7 flex flex-col justify-between group relative overflow-hidden bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl border border-white/10 hover:border-[#00F0FF]/40 hover:bg-gradient-to-br hover:from-[#0066FF]/15 hover:to-[#00F0FF]/05 transition-all duration-400 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1.5"
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#0066FF]/20 rounded-full blur-2xl group-hover:bg-[#00F0FF]/30 transition-all duration-500" />

              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-3xl font-mono font-bold text-white/30 group-hover:text-[#00F0FF] transition-colors">
                    03
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F0FF] group-hover:border-[#00F0FF]/50 group-hover:bg-[#00F0FF]/10 transition-all">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-[#00F0FF] transition-colors">
                  Analítica Avanzada de Rendimiento
                </h3>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Métricas biomecánicas, mapas de calor interactivos, scouting de talentos y generación automática de crónicas y actas oficiales del torneo.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-[#00F0FF]">
                <span>MOTOR DE ANALÍTICA AVANZADA</span>
                <span className="flex items-center gap-1 font-semibold">SCOUTING <ChevronRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>

            {/* TARJETA 04 */}
            <div 
              onClick={() => onNavigateTab('calendar')}
              className="rounded-2xl p-7 flex flex-col justify-between group relative overflow-hidden bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl border border-white/10 hover:border-[#00F0FF]/40 hover:bg-gradient-to-br hover:from-[#0066FF]/15 hover:to-[#00F0FF]/05 transition-all duration-400 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1.5"
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#0066FF]/20 rounded-full blur-2xl group-hover:bg-[#00F0FF]/30 transition-all duration-500" />

              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-3xl font-mono font-bold text-white/30 group-hover:text-[#00F0FF] transition-colors">
                    04
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F0FF] group-hover:border-[#00F0FF]/50 group-hover:bg-[#00F0FF]/10 transition-all">
                    <Globe className="w-5 h-5" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-[#00F0FF] transition-colors">
                  Ecosistema Multideporte Escalable
                </h3>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Soporte nativo con reglamentos adaptables para Indor Fútbol, Baloncesto, Fútsal, Voleibol, Tenis, Pádel y deportes electrónicos en una misma cuenta unificada.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-[#00F0FF]">
                <span>CLOUD DISTRIBUTED</span>
                <span className="flex items-center gap-1 font-semibold">CALENDARIO <ChevronRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>

          </div>

        </section>


        {/* PIE DE PÁGINA */}
        <footer className="py-8 px-6 border-t border-white/5 text-center text-xs text-slate-400 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF]" />
            <span className="text-slate-300 font-semibold">Deporverso Platform</span>
            <span>• Todos los derechos reservados</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            PROTEGIDO POR CORPORACIÓN E INNOVACIÓN GUERRA (CIG)
          </div>
        </footer>

      </div>

      {/* MODAL DE DOCUMENTACIÓN TÉCNICA */}
      {showTechModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="relative w-full max-w-2xl bg-[#090F1E] border border-[#00F0FF]/30 rounded-3xl p-7 shadow-[0_0_50px_rgba(0,102,255,0.4)] overflow-hidden">
            
            {/* Cabecera del modal */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0066FF]/20 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF]">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Especificaciones de Arquitectura</h3>
                  <p className="text-xs text-slate-400 font-mono">Stack Técnico de Nivel Enterprise</p>
                </div>
              </div>
              <button
                onClick={() => setShowTechModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido técnico estructurado */}
            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-2 font-bold text-white mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#00F0FF]" />
                  <span>Aislamiento Multi-Tenant & RLS en Base de Datos</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Arquitectura con políticas de seguridad a nivel de fila (Row Level Security) y aislamiento de datos por liga, garantizando confidencialidad absoluta de socios, contratos y finanzas.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-2 font-bold text-white mb-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Pipeline VAR en Tiempo Real & Procesamiento de Video</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Motor de transcodificación FFmpeg de baja latencia acoplado a modelos de visión por computador (YOLOv8 + EasyOCR) para detección automatizada de jugadas polémicas y cronometraje oficial.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-2 font-bold text-white mb-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Sellado Criptográfico CIG Core (RFC 8032 Ed25519)</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Cada acta digital, resolución de asamblea y registro de puntuación cuenta con sellado pericial de integridad hash SHA-256 inmutable.
                </p>
              </div>
            </div>

            {/* Botón de cierre */}
            <div className="pt-6 mt-6 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowTechModal(false)}
                className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#0066FF] hover:bg-[#0052cc] transition-all cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHECKOUT OFERTA EXCLUSIVA 50% OFF ($35/EQUIPO) */}
      <ExclusiveOfferCheckoutModal
        isOpen={showCheckoutOfferModal}
        onClose={() => setShowCheckoutOfferModal(false)}
        onAddTenant={onAddTenant}
      />

    </div>
  );
};
