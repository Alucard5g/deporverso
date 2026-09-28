/**
 * ============================================================================
 * CORPORACIÓN E INNOVACIÓN GUERRA (CIG)
 * SISTEMA DE RATE-LIMITING DINÁMICO Y BLINDAJE ANTI-SCRAPING
 * ============================================================================
 * Módulo: server/security/rateLimiter.ts
 * Propósito: 
 *   1. Bloqueo de herramientas automatizadas de scraping e ingeniería inversa.
 *   2. Limitación de frecuencia de peticiones (sliding window) por IP.
 *   3. Inyección de cabeceras de endurecimiento perimetral (Hardened Headers).
 * ============================================================================
 */

import { Request, Response, NextFunction } from 'express';

interface IpRateRecord {
  windowStart: number;
  count: number;
  aiCount: number;
  lastSuspiciousHit?: number;
}

// Almacén en memoria volátil de alta velocidad (Sliding Window Bucket)
const ipStore = new Map<string, IpRateRecord>();

// Limpieza periódica de IPs inactivas cada 5 minutos para evitar fugas de memoria
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipStore.entries()) {
    if (now - record.windowStart > 300000) { // 5 minutos
      ipStore.delete(ip);
    }
  }
}, 300000);

// Lista de firmas de User-Agents asociados a scraping hostil y escaneo de vulnerabilidades
const HOSTILE_USER_AGENTS = [
  /sqlmap/i,
  /nikto/i,
  /masscan/i,
  /dirbuster/i,
  /gobuster/i,
  /censys/i,
  /shodan/i,
  /scrapy/i,
  /python-requests/i,
  /aiohttp/i,
  /zgrab/i,
  /nmap/i,
  /burp/i,
  /netsparker/i,
  /wpscan/i,
  /phantomjs/i,
  /acunetix/i,
  /havij/i
];

/**
 * Extrae la dirección IP real del cliente considerando proxies y balanceadores Cloud Run
 */
function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return ips.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

/**
 * 1. Middleware Anti-Scraping y Filtrado de Bots Hostiles
 */
export function antiScrapingMiddleware(req: Request, res: Response, next: NextFunction): void {
  const userAgent = req.headers['user-agent'] || '';
  const clientIp = getClientIp(req);

  // Permitir explícitamente health-checks de Google Cloud y Wget interno del Dockerfile
  if (
    userAgent.includes('GoogleHC') ||
    userAgent.includes('Wget') ||
    req.path === '/api/health'
  ) {
    return next();
  }

  // Detección de patrones de User-Agent hostil
  for (const pattern of HOSTILE_USER_AGENTS) {
    if (pattern.test(userAgent)) {
      console.warn(`[CIG SECURITY ALERT] Bloqueado User-Agent hostil (${pattern}) desde IP ${clientIp} en ${req.path}`);
      
      res.status(403).json({
        error: 'Acceso Denegado por el Escudo de Seguridad Industrial CIG',
        code: 'CIG_HOSTILE_AGENT_BLOCKED',
        timestamp: new Date().toISOString(),
        advisory: 'CORPORACIÓN E INNOVACIÓN GUERRA (CIG) protege este software contra ingeniería inversa y scraping no autorizado.'
      });
      return;
    }
  }

  next();
}

/**
 * 2. Middleware de Rate-Limiting Dinámico (Sliding Window de 60 segundos)
 */
export function rateLimiterMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Saltear archivos estáticos no-API y healthcheck para máxima velocidad
  if (!req.path.startsWith('/api') || req.path === '/api/health') {
    return next();
  }

  const clientIp = getClientIp(req);
  const now = Date.now();
  const WINDOW_MS = 60 * 1000; // 1 minuto
  const MAX_GLOBAL_API_PER_MIN = 120; // 120 peticiones/minuto por IP
  const MAX_AI_CALLS_PER_MIN = 25; // 25 peticiones costosas IA/minuto por IP

  let record = ipStore.get(clientIp);

  if (!record || now - record.windowStart > WINDOW_MS) {
    record = {
      windowStart: now,
      count: 1,
      aiCount: req.path.includes('/generate-chronicle') || req.path.includes('/parse-schedule') ? 1 : 0
    };
    ipStore.set(clientIp, record);
  } else {
    record.count++;
    if (req.path.includes('/generate-chronicle') || req.path.includes('/parse-schedule')) {
      record.aiCount++;
    }
  }

  const resetSeconds = Math.ceil((record.windowStart + WINDOW_MS - now) / 1000);
  const remaining = Math.max(0, MAX_GLOBAL_API_PER_MIN - record.count);

  res.setHeader('X-RateLimit-Limit', MAX_GLOBAL_API_PER_MIN.toString());
  res.setHeader('X-RateLimit-Remaining', remaining.toString());
  res.setHeader('X-RateLimit-Reset', resetSeconds.toString());

  // Verificar límites
  const isAiRoute = req.path.includes('/generate-chronicle') || req.path.includes('/parse-schedule');
  const isOverAiLimit = isAiRoute && record.aiCount > MAX_AI_CALLS_PER_MIN;
  const isOverGlobalLimit = record.count > MAX_GLOBAL_API_PER_MIN;

  if (isOverGlobalLimit || isOverAiLimit) {
    console.warn(`[CIG RATE-LIMIT] Excedido límite para IP ${clientIp} en ${req.path} (Count: ${record.count}, AI: ${record.aiCount})`);
    
    res.status(429).json({
      error: 'Límite de solicitudes superado (Rate Limit Exceeded)',
      code: 'CIG_RATE_LIMIT_EXCEEDED',
      retryAfterSeconds: resetSeconds,
      timestamp: new Date().toISOString()
    });
    return;
  }

  next();
}

/**
 * 3. Middleware de Inyección de Cabeceras de Seguridad Perimetral CIG
 */
export function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Endurecimiento de cabeceras HTTP (Defense-in-depth)
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Corporate-Security', 'CORPORACION E INNOVACION GUERRA (CIG)');
  res.setHeader('X-IP-Protected', 'TRUE; Ed25519; SHA-256; OpenTimestamps');
  res.setHeader('X-Sovereign-Platform', 'DeporVerso Global Multi-Sport SaaS');

  next();
}

/**
 * Métricas en memoria para el panel de auditoría CIG
 */
export function getSecurityMetrics(): { activeTrackedIps: number; totalTrackedHits: number } {
  let totalTrackedHits = 0;
  for (const r of ipStore.values()) {
    totalTrackedHits += r.count;
  }
  return {
    activeTrackedIps: ipStore.size,
    totalTrackedHits
  };
}
