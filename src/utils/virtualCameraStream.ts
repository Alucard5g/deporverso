/**
 * Generador de Feed de Cancha Virtual y Cámara Simulada de Alta Fidelidad
 * Proporciona un MediaStream real (canvas.captureStream) para entornos donde los
 * permisos de cámara física no están otorgados o están restringidos por el navegador/iframe.
 * Permite que todas las herramientas de TV, Grabación local, Recortes de VAR (25s) y
 * Scoreboards funcionen al 100% sin depender de hardware físico ni arrojar errores.
 */

export interface VirtualPitchStreamOptions {
  width?: number;
  height?: number;
  fps?: number;
  homeTeamName?: string;
  awayTeamName?: string;
  homeScore?: number;
  awayScore?: number;
  leagueName?: string;
}

export interface VirtualStreamHandle {
  stream: MediaStream;
  stop: () => void;
  updateScore?: (home: number, away: number) => void;
}

export function createVirtualPitchStream(options: VirtualPitchStreamOptions = {}): VirtualStreamHandle {
  const width = options.width || 1280;
  const height = options.height || 720;
  const fps = options.fps || 30;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  let animFrameId: number | null = null;
  let ballX = width / 2;
  let ballY = height / 2;
  let ballVx = 3.5;
  let ballVy = 2.2;
  let currentHomeScore = options.homeScore ?? 2;
  let currentAwayScore = options.awayScore ?? 1;
  const homeName = options.homeTeamName || 'Atlético Juvenil';
  const awayName = options.awayTeamName || 'Sporting San Pedro';
  const leagueName = options.leagueName || 'LIGA DEPORVERSO';

  let matchSeconds = 1420;

  const renderFrame = () => {
    if (!ctx) return;

    matchSeconds += 1 / fps;

    // 1. Césped de estadio con gradiente de corte
    const turfGrad = ctx.createLinearGradient(0, 0, width, height);
    turfGrad.addColorStop(0, '#0c381e');
    turfGrad.addColorStop(0.5, '#134e2c');
    turfGrad.addColorStop(1, '#0e331c');
    ctx.fillStyle = turfGrad;
    ctx.fillRect(0, 0, width, height);

    // Franjas de corte de césped
    const stripeWidth = width / 12;
    for (let i = 0; i < 12; i += 2) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.fillRect(i * stripeWidth, 0, stripeWidth, height);
    }

    // 2. Líneas tácticas reglamentarias de la cancha
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 4;

    // Perímetro
    const margin = 35;
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

    // Línea media
    ctx.beginPath();
    ctx.moveTo(width / 2, margin);
    ctx.lineTo(width / 2, height - margin);
    ctx.stroke();

    // Círculo central
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 75, 0, Math.PI * 2);
    ctx.stroke();

    // Punto central
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 6, 0, Math.PI * 2);
    ctx.fill();

    // Áreas de penalti
    const boxWidth = 140;
    const boxHeight = 260;
    // Izquierda
    ctx.strokeRect(margin, (height - boxHeight) / 2, boxWidth, boxHeight);
    // Derecha
    ctx.strokeRect(width - margin - boxWidth, (height - boxHeight) / 2, boxWidth, boxHeight);

    // 3. Pelota en movimiento táctico continuo
    ballX += ballVx;
    ballY += ballVy;

    if (ballX <= margin + 15 || ballX >= width - margin - 15) {
      ballVx = -ballVx;
    }
    if (ballY <= margin + 15 || ballY >= height - margin - 15) {
      ballVy = -ballVy;
    }

    // Sombra del balón
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(ballX, ballY + 12, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Balón
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ballX, ballY, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pentágonos del balón
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(ballX - 2, ballY - 2, 4, 0, Math.PI * 2);
    ctx.fill();

    // 4. Jugadores tácticos simulados (Puntos con halos)
    const playersA = [
      { x: width * 0.25, y: height * 0.3 },
      { x: width * 0.28, y: height * 0.65 },
      { x: width * 0.42, y: height * 0.45 },
      { x: width * 0.38, y: height * 0.8 },
      { x: width * 0.12, y: height * 0.5 }
    ];
    const playersB = [
      { x: width * 0.75, y: height * 0.35 },
      { x: width * 0.72, y: height * 0.7 },
      { x: width * 0.58, y: height * 0.5 },
      { x: width * 0.62, y: height * 0.2 },
      { x: width * 0.88, y: height * 0.5 }
    ];

    // Render equipo A (Cian)
    ctx.fillStyle = '#00e5ff';
    playersA.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Render equipo B (Rosa)
    ctx.fillStyle = '#f43f5e';
    playersB.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // 5. HUD de Transmisión Oficial de DeporVerso (Marca de Agua Profesional)
    ctx.fillStyle = 'rgba(3, 7, 18, 0.85)';
    ctx.fillRect(margin + 10, margin + 10, 360, 48);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(margin + 10, margin + 10, 360, 48);

    // Indicador LIVE
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(margin + 26, margin + 34, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('LIVE VIRTUAL CAM', margin + 38, margin + 38);

    // Scoreboard integrado
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${homeName.slice(0, 8)} ${currentHomeScore} - ${currentAwayScore} ${awayName.slice(0, 8)}`, margin + 160, margin + 38);

    // Marca de agua Deporverso inferior
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText(`DEPORVERSO CIG • ${leagueName} • CÁMARA TÁCTICA 1080p`, margin + 15, height - margin - 15);

    animFrameId = requestAnimationFrame(renderFrame);
  };

  renderFrame();

  let stream: MediaStream;
  if ((canvas as any).captureStream) {
    stream = (canvas as any).captureStream(fps);
  } else {
    // Fallback básico si captureStream no existiera
    const emptyCanvas = document.createElement('canvas');
    emptyCanvas.width = 320;
    emptyCanvas.height = 240;
    stream = (emptyCanvas as any).captureStream ? (emptyCanvas as any).captureStream(10) : new MediaStream();
  }

  // Agregar una pista de audio sintética para que el grabador de medios (MediaRecorder) no falle por falta de audio
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      gainNode.gain.value = 0.001; // Audio casi silencioso pero activo
      osc.connect(gainNode);
      const dest = audioCtx.createMediaStreamDestination();
      gainNode.connect(dest);
      osc.start();

      const audioTrack = dest.stream.getAudioTracks()[0];
      if (audioTrack) {
        stream.addTrack(audioTrack);
      }
    }
  } catch (e) {
    // El stream de video continúa funcionando sin problemas
  }

  return {
    stream,
    stop: () => {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
      stream.getTracks().forEach(t => t.stop());
    },
    updateScore: (h: number, a: number) => {
      currentHomeScore = h;
      currentAwayScore = a;
    }
  };
}
