import { Request, Response } from 'express';
import { executeInTenant } from '../config/database';
import { getFirestoreDb } from '../config/firebase';
import { HeroesBridgeService } from '../services/heroesBridgeService';

/**
 * HEROES VR TELEMETRY CONTROLLER (WebXR & At-Home Sports Simulator)
 * Processes high-frequency telemetry from VR headsets (Quest, Vision Pro, Pico):
 * - Evaluates cardiovascular intensity, reaction speed and drill precision
 * - Calculates earned Player XP and attributes
 * - Syncs to PostgreSQL tenant schema and triggers Heroes del Deporte card level-up
 */

export interface VrTelemetryIngestRequest {
  tenantSubdomain: string;
  playerId: string;
  athleteFullName?: string;
  heroesAthleteId?: string;
  deviceInfo?: {
    headset: string;
    trackingFramework: 'WebXR_Device_API' | 'OpenXR' | 'WebXR_Hand_Tracking';
    refreshRateHz: number;
  };
  sessionData: {
    drillType: 'PENALTY_SHOOTOUT' | 'GOALKEEPER_REFLEX' | 'DRIBBLE_SLALOM' | 'ECUAVOLEY_SETTING' | 'FREE_THROW_BASKET';
    durationSeconds: number;
    avgHeartRateBpm: number;
    peakHeartRateBpm?: number;
    caloriesBurned: number;
    precisionAccuracyPct: number; // 0.0 - 100.0
    reactionTimeMs: number;       // e.g. 195ms
    totalRepsCompleted: number;
  };
}

/**
 * Gamification algorithm: Computes XP and Attribute Progression
 */
function calculateVrDrillXp(session: VrTelemetryIngestRequest['sessionData']): {
  xpGained: number;
  attributeBoosts: { ritmo: number; tiro: number; reflejos: number; fisico: number };
} {
  const { durationSeconds, avgHeartRateBpm, precisionAccuracyPct, reactionTimeMs } = session;

  // Base XP: 0.5 XP per second of active VR training
  let xp = Math.round(durationSeconds * 0.5);

  // Precision multiplier
  if (precisionAccuracyPct >= 90) {
    xp = Math.round(xp * 1.35);
  } else if (precisionAccuracyPct >= 75) {
    xp = Math.round(xp * 1.15);
  }

  // Cardiovascular intensity bonus
  if (avgHeartRateBpm > 150) {
    xp += 75;
  } else if (avgHeartRateBpm > 130) {
    xp += 40;
  }

  // Superhuman reaction time bonus (< 220ms)
  if (reactionTimeMs > 0 && reactionTimeMs < 220) {
    xp += 50;
  }

  // Calculate attribute points awarded (scaled 1-3 points)
  const attributeBoosts = {
    ritmo: durationSeconds > 600 ? 1 : 0,
    tiro: session.drillType === 'PENALTY_SHOOTOUT' || session.drillType === 'FREE_THROW_BASKET' ? (precisionAccuracyPct > 80 ? 2 : 1) : 0,
    reflejos: reactionTimeMs < 230 ? 2 : 1,
    fisico: avgHeartRateBpm > 140 ? 2 : 1,
  };

  return { xpGained: Math.max(25, xp), attributeBoosts };
}

/**
 * POST /api/deporverso/heroes-vr/telemetry
 */
export async function ingestVrTelemetry(req: Request, res: Response) {
  try {
    const payload: VrTelemetryIngestRequest = req.body;
    const {
      tenantSubdomain,
      playerId,
      athleteFullName = 'Atleta VR',
      heroesAthleteId = `HERO-${playerId.substring(0, 8)}`,
      sessionData,
      deviceInfo,
    } = payload;

    if (!tenantSubdomain || !playerId || !sessionData) {
      return res.status(400).json({
        success: false,
        error: 'tenantSubdomain, playerId y sessionData son parámetros obligatorios.',
      });
    }

    // 1. Calculate XP and Attributes
    const { xpGained, attributeBoosts } = calculateVrDrillXp(sessionData);

    console.log(`[Heroes VR] Ingesting telemetry for Player ${playerId} in ${tenantSubdomain}. XP earned: ${xpGained}`);

    // 2. Persist in isolated PostgreSQL tenant schema
    await executeInTenant(
      tenantSubdomain,
      `INSERT INTO heroes_vr_telemetry (
        player_id, drill_type, duration_seconds, avg_heart_rate, calories_burned,
        precision_accuracy_pct, xp_gained, device_model, synced_with_heroes_del_deporte, synced_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, CURRENT_TIMESTAMP);`,
      [
        playerId,
        sessionData.drillType,
        sessionData.durationSeconds,
        sessionData.avgHeartRateBpm,
        sessionData.caloriesBurned,
        sessionData.precisionAccuracyPct,
        xpGained,
        deviceInfo?.headset || 'WebXR VR Simulator',
      ]
    );

    // 3. Update player XP and stats in tenant players table
    await executeInTenant(
      tenantSubdomain,
      `UPDATE players
       SET vr_player_xp = COALESCE(vr_player_xp, 0) + $1,
           stat_tiro = LEAST(99, COALESCE(stat_tiro, 65) + $2),
           stat_fisico = LEAST(99, COALESCE(stat_fisico, 70) + $3)
       WHERE id = $4;`,
      [xpGained, attributeBoosts.tiro, attributeBoosts.fisico, playerId]
    );

    // 4. Trigger Heroes del Deporte Bridge (Sync to Hall of Fame & Digital Trading Card)
    const bridgeResult = await HeroesBridgeService.syncAthletePerformance({
      heroesAthleteId,
      fullName: athleteFullName,
      tenantSubdomain,
      sportCode: sessionData.drillType.includes('BASKET') ? 'BALONCESTO' : 'FUTBOL',
      eventType: 'VR_TRAINING_FINISHED',
      xpGained,
      vrStats: {
        drillType: sessionData.drillType,
        durationMinutes: Math.round(sessionData.durationSeconds / 60),
        avgHeartRate: sessionData.avgHeartRateBpm,
        caloriesBurned: sessionData.caloriesBurned,
        precisionPct: sessionData.precisionAccuracyPct,
      },
    });

    // 5. Publish real-time training achievement to Cloud Firestore for Fan Zone
    try {
      const firestore = getFirestoreDb();
      if (firestore) {
        await firestore
          .collection('tenants')
          .doc(tenantSubdomain)
          .collection('fan_zone_feed')
          .add({
            type: 'HEROES_VR_ACHIEVEMENT',
            athleteName: athleteFullName,
            drillType: sessionData.drillType,
            xpEarned: xpGained,
            calories: sessionData.caloriesBurned,
            precision: sessionData.precisionAccuracyPct,
            timestamp: new Date().toISOString(),
          });
      }
    } catch (fsErr: any) {
      console.warn('[Heroes VR Telemetry] Realtime Firestore broadcast note:', fsErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Telemetría de entrenamiento VR procesada con éxito.',
      xpGained,
      attributeBoosts,
      heroesBridge: {
        synced: bridgeResult.synced,
        cardLevelUp: bridgeResult.cardLevelUp,
        newOverallRating: bridgeResult.newOverallRating,
        hallOfFamePosition: bridgeResult.hallOfFamePosition,
        transactionId: bridgeResult.bridgeTransactionId,
      },
      sessionSummary: {
        drill: sessionData.drillType,
        durationSeconds: sessionData.durationSeconds,
        caloriesBurned: sessionData.caloriesBurned,
        precisionAccuracy: `${sessionData.precisionAccuracyPct}%`,
        reactionTime: `${sessionData.reactionTimeMs}ms`,
      },
    });
  } catch (error: any) {
    console.error('[IngestVrTelemetry Error]', error);
    return res.status(500).json({
      success: false,
      error: 'Error al procesar la sesión de telemetría VR.',
      details: error.message,
    });
  }
}
