import { Router, Request, Response } from 'express';
import { checkSubdomainAvailability, provisionClubTenant } from '../controllers/tenantProvisioningController';
import { ingestVrTelemetry } from '../controllers/heroesVrTelemetryController';
import { tagVarPlay, resolveVarReview } from '../controllers/varController';
import { HeroesBridgeService } from '../services/heroesBridgeService';
import { executeMaster, executeInTenant } from '../config/database';

export const deporversoRouter = Router();

// ---------------------------------------------------------------------------
// 1. AUTO-PROVISIONAMIENTO (MULTI-TENANT & SUBDOMINIOS *.deporverso.com)
// ---------------------------------------------------------------------------

// Check subdomain availability
deporversoRouter.get('/onboarding/check-subdomain', checkSubdomainAvailability);

// Process $25 USD Onboarding & Auto-Provision Schema in PostgreSQL
deporversoRouter.post('/onboarding/provision', provisionClubTenant);

// List active tenants on DeporVerso
deporversoRouter.get('/tenants', async (req: Request, res: Response) => {
  try {
    const tenants = await executeMaster(
      'SELECT id, subdomain, name, sport_type, tier, status, created_at FROM public.tenants ORDER BY created_at DESC LIMIT 50;'
    );
    res.json({
      platform: 'DeporVerso Global Multi-Sport SaaS',
      domain: 'deporverso.com',
      totalTenants: tenants.length,
      tenants,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Error al listar ligas', details: err.message });
  }
});

// ---------------------------------------------------------------------------
// 2. HEROES VR (SIMULADOR DE CARRERA Y DEPORTE EN CASA / WEBXR)
// ---------------------------------------------------------------------------

// Ingest high-speed VR telemetry (Headset, heart rate, cadence, shot precision)
deporversoRouter.post('/heroes-vr/telemetry', ingestVrTelemetry);

// Query VR athlete career progression & Hall of Fame status
deporversoRouter.get('/heroes-vr/player-career/:subdomain/:playerId', async (req: Request, res: Response) => {
  try {
    const { subdomain, playerId } = req.params;
    const playerRows = await executeInTenant(
      subdomain,
      'SELECT id, first_name, last_name, dorsal, position, vr_player_xp, stat_ritmo, stat_tiro, stat_pase, stat_defensa, stat_fisico FROM players WHERE id = $1 LIMIT 1;',
      [playerId]
    );

    const telemetryRows = await executeInTenant(
      subdomain,
      'SELECT drill_type, duration_seconds, avg_heart_rate, calories_burned, precision_accuracy_pct, xp_gained, created_at FROM heroes_vr_telemetry WHERE player_id = $1 ORDER BY created_at DESC LIMIT 10;',
      [playerId]
    );

    const player = playerRows && playerRows.length > 0 ? playerRows[0] : null;

    res.json({
      player: player || { id: playerId, name: 'Atleta DeporVerso VR', vr_player_xp: 1450 },
      recentDrills: telemetryRows || [],
      hallOfFameCard: {
        overallRating: 82,
        cardRarity: 'GOLD_HERO',
        specialTrait: 'VR Reflex Master (195ms)',
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Error al consultar carrera VR', details: err.message });
  }
});

// ---------------------------------------------------------------------------
// 3. PUENTE DE GAMIFICACIÓN CON HEROESDELDEPORTE.COM
// ---------------------------------------------------------------------------

deporversoRouter.post('/heroes-bridge/sync-match-performance', async (req: Request, res: Response) => {
  try {
    const result = await HeroesBridgeService.syncAthletePerformance(req.body);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Incoming webhook from heroesdeldeporte.com
deporversoRouter.post('/heroes-bridge/webhook', (req: Request, res: Response) => {
  const signature = (req.headers['x-heroes-signature'] as string) || '';
  const rawBody = JSON.stringify(req.body);

  if (process.env.NODE_ENV === 'production' && !HeroesBridgeService.verifyIncomingSignature(rawBody, signature)) {
    return res.status(401).json({ error: 'Firma criptográfica inválida de heroesdeldeporte.com' });
  }

  console.log('[HeroesBridge Webhook] Inbound notification received:', req.body.eventType);
  return res.json({ acknowledged: true, processedAt: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// 4. MÓDULO VAR A LA CARTA
// ---------------------------------------------------------------------------

deporversoRouter.post('/var/tag-play', tagVarPlay);
deporversoRouter.post('/var/resolve-review', resolveVarReview);

// ---------------------------------------------------------------------------
// 5. MOTOR DE FIXTURES Y GESTIÓN MULTI-DEPORTE
// ---------------------------------------------------------------------------

deporversoRouter.post('/fixtures/generate-round-robin', async (req: Request, res: Response) => {
  try {
    const { subdomain, tournamentId, teams } = req.body;
    if (!subdomain || !teams || teams.length < 2) {
      return res.status(400).json({ error: 'subdomain y al menos 2 equipos requeridos.' });
    }

    // Berger round-robin pairing algorithm
    const fixturesGenerated: Array<{ round: number; home: string; away: string }> = [];
    const teamList = [...teams];
    if (teamList.length % 2 !== 0) {
      teamList.push('DESCANSA');
    }

    const numRounds = teamList.length - 1;
    const half = teamList.length / 2;

    for (let round = 0; round < numRounds; round++) {
      for (let i = 0; i < half; i++) {
        const home = teamList[i];
        const away = teamList[teamList.length - 1 - i];
        if (home !== 'DESCANSA' && away !== 'DESCANSA') {
          fixturesGenerated.push({ round: round + 1, home, away });
        }
      }
      teamList.splice(1, 0, teamList.pop()!);
    }

    return res.json({
      success: true,
      tournamentId,
      totalMatches: fixturesGenerated.length,
      fixtures: fixturesGenerated,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Error al generar fixture', details: err.message });
  }
});
