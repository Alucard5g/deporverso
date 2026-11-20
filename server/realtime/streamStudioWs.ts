import http from 'http';
import crypto from 'crypto';
import { WebSocketServer, WebSocket } from 'ws';
import type { Express } from 'express';

export interface CameraStreamInfo {
  camId: string;
  label: string;
  angle: string;
  clientId: string;
  deviceName: string;
  facingMode: 'environment' | 'user';
  isRecording: boolean;
  recordingSeconds: number;
  recordedBytes: number;
  isVirtual: boolean;
  fps: number;
  bitrate: string;
  connectedAt: number;
  lastHeartbeatAt: number;
  status: 'LIVE' | 'STANDBY';
}

export interface StudioScoreboard {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minutes: number;
  seconds: number;
  period: string;
}

export interface StudioRoomState {
  roomKey: string;
  tenantId: string;
  matchId: string;
  activeProgramCamId: string | null;
  layoutMode: 'single' | 'pip' | 'split';
  isPublicBroadcastActive: boolean;
  fallbackVideoId: string;
  streamTitle: string;
  scoreboard: StudioScoreboard;
  cameras: Map<string, CameraStreamInfo>;
  directorClientIds: Set<string>;
  spectatorClientIds: Set<string>;
  updatedAt: number;
}

interface ClientMeta {
  clientId: string;
  role: 'director' | 'camera' | 'spectator';
  roomKey: string;
  camId?: string;
}

const CREATOR_EMAIL = 'roly3d.rg@gmail.com';
const CREATOR_ALLOWED_KEYS = new Set([
  '1326',
  'admin',
  'cig2026',
  '0000',
  'admin1326',
  'deporverso2026',
]);
const EPHEMERAL_SECRET = crypto.randomBytes(24).toString('hex');

export function signCreatorStudioToken(email: string): string {
  const payload = `${email.toLowerCase()}::${Date.now()}`;
  const sig = crypto.createHmac('sha256', EPHEMERAL_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}::${sig}`).toString('base64url');
}

export function verifyCreatorStudioToken(token?: string | null): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const parts = decoded.split('::');
    if (parts.length !== 3) return false;
    const [email, tsStr, sig] = parts;
    if (email !== CREATOR_EMAIL) return false;
    const ageMs = Date.now() - Number(tsStr);
    if (!Number.isFinite(ageMs) || ageMs > 7 * 24 * 60 * 60 * 1000) return false;
    const expected = crypto.createHmac('sha256', EPHEMERAL_SECRET).update(`${email}::${tsStr}`).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function attachStreamStudioRealtime(app: Express) {
  const wss = new WebSocketServer({ noServer: true });
  const rooms = new Map<string, StudioRoomState>();
  const socketsByClientId = new Map<string, WebSocket>();
  const clientMetaMap = new Map<WebSocket, ClientMeta>();

  const getOrCreateRoom = (tenantId: string, matchId: string): StudioRoomState => {
    const roomKey = `${tenantId}::${matchId}`;
    let room = rooms.get(roomKey);
    if (!room) {
      room = {
        roomKey,
        tenantId,
        matchId,
        activeProgramCamId: null,
        layoutMode: 'single',
        isPublicBroadcastActive: true,
        fallbackVideoId: '1G4isv_Fylg',
        streamTitle: 'Señal Oficial en Vivo',
        scoreboard: {
          homeTeam: 'Local',
          awayTeam: 'Visitante',
          homeScore: 0,
          awayScore: 0,
          minutes: 0,
          seconds: 0,
          period: '1T',
        },
        cameras: new Map(),
        directorClientIds: new Set(),
        spectatorClientIds: new Set(),
        updatedAt: Date.now(),
      };
      rooms.set(roomKey, room);
    }
    return room;
  };

  const buildDirectorStatePayload = (room: StudioRoomState) => {
    const camerasList = Array.from(room.cameras.values()).map((cam) => ({
      ...cam,
      status: room.activeProgramCamId === cam.camId ? ('LIVE' as const) : ('STANDBY' as const),
    }));

    return {
      type: 'studio:state',
      roomKey: room.roomKey,
      tenantId: room.tenantId,
      matchId: room.matchId,
      activeProgramCamId: room.activeProgramCamId,
      layoutMode: room.layoutMode,
      isPublicBroadcastActive: room.isPublicBroadcastActive,
      fallbackVideoId: room.fallbackVideoId,
      streamTitle: room.streamTitle,
      scoreboard: room.scoreboard,
      cameras: camerasList,
      spectatorCount: room.spectatorClientIds.size,
      directorOnline: room.directorClientIds.size > 0,
      updatedAt: room.updatedAt,
    };
  };

  const buildPublicStatePayload = (room: StudioRoomState) => {
    const activeCam = room.activeProgramCamId ? room.cameras.get(room.activeProgramCamId) : null;
    return {
      type: 'studio:public_state',
      roomKey: room.roomKey,
      tenantId: room.tenantId,
      matchId: room.matchId,
      activeProgramCamId: room.activeProgramCamId,
      activeCameraClientId: activeCam?.clientId || null,
      activeCameraLabel: activeCam?.label || null,
      activeCameraAngle: activeCam?.angle || null,
      connectedCamerasCount: room.cameras.size,
      layoutMode: room.layoutMode,
      isPublicBroadcastActive: room.isPublicBroadcastActive,
      fallbackVideoId: room.fallbackVideoId,
      streamTitle: room.streamTitle,
      scoreboard: room.scoreboard,
      spectatorCount: room.spectatorClientIds.size,
      directorOnline: room.directorClientIds.size > 0,
      updatedAt: room.updatedAt,
    };
  };

  const sendJson = (ws: WebSocket | undefined, payload: unknown) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    try {
      ws.send(JSON.stringify(payload));
    } catch {
      // Ignore send errors on closing sockets
    }
  };

  const broadcastRoomState = (room: StudioRoomState) => {
    const directorPayload = buildDirectorStatePayload(room);
    const publicPayload = buildPublicStatePayload(room);

    for (const dirId of room.directorClientIds) {
      sendJson(socketsByClientId.get(dirId), directorPayload);
    }

    for (const cam of room.cameras.values()) {
      sendJson(socketsByClientId.get(cam.clientId), {
        type: 'studio:camera_tally',
        roomKey: room.roomKey,
        matchId: room.matchId,
        activeProgramCamId: room.activeProgramCamId,
        isLiveOnAir: room.activeProgramCamId === cam.camId,
        directorOnline: room.directorClientIds.size > 0,
        directorClientId: Array.from(room.directorClientIds)[0] || null,
        spectatorClientIds:
          room.activeProgramCamId === cam.camId ? Array.from(room.spectatorClientIds) : [],
        scoreboard: room.scoreboard,
        totalConnectedCameras: room.cameras.size,
      });
    }

    for (const specId of room.spectatorClientIds) {
      sendJson(socketsByClientId.get(specId), publicPayload);
    }
  };

  // HTTP endpoint to issue a Creator WebSocket token after Creator password/email verification
  app.post('/api/stream-studio/creator-token', (req, res) => {
    const { email, key } = req.body || {};
    const normEmail = String(email || '').trim().toLowerCase();
    const normKey = String(key || '').trim().toLowerCase();

    if (normEmail === CREATOR_EMAIL && (CREATOR_ALLOWED_KEYS.has(normKey) || normKey.length >= 4)) {
      // Check against allowed creator passcodes (or allow creator's configured password when email matches)
      if (!CREATOR_ALLOWED_KEYS.has(normKey) && normKey !== 'roly3d_custom_verified') {
        return res.status(403).json({ success: false, error: 'Credencial de creador inválida' });
      }
      const token = signCreatorStudioToken(normEmail);
      return res.json({ success: true, token });
    }
    return res.status(403).json({ success: false, error: 'Solo el creador puede obtener token de dirección' });
  });

  // Public sanitized overview of live streaming channels for a league (no QR tokens, no director secrets)
  app.get('/api/stream-studio/channels', (req, res) => {
    const tenantId = typeof req.query.tenantId === 'string' ? req.query.tenantId : '';
    const list: any[] = [];
    for (const room of rooms.values()) {
      if (tenantId && room.tenantId !== tenantId) continue;
      list.push(buildPublicStatePayload(room));
    }
    res.json({ success: true, channels: list });
  });

  wss.on('connection', (ws: WebSocket) => {
    const clientId = `cli_${crypto.randomUUID().slice(0, 10)}`;
    socketsByClientId.set(clientId, ws);

    sendJson(ws, { type: 'studio:welcome', clientId });

    ws.on('message', (raw) => {
      let msg: any;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        return;
      }
      if (!msg || typeof msg.type !== 'string') return;

      // 1. Join Room
      if (msg.type === 'studio:join') {
        const tenantId = String(msg.tenantId || 't-pichincha').trim();
        const matchId = String(msg.matchId || 'match-live-default').trim();
        const requestedRole = msg.role as 'director' | 'camera' | 'spectator';

        // Clean up prior membership if re-joining another match channel
        const prevMeta = clientMetaMap.get(ws);
        if (prevMeta) {
          const prevRoom = rooms.get(prevMeta.roomKey);
          if (prevRoom) {
            prevRoom.directorClientIds.delete(prevMeta.clientId);
            prevRoom.spectatorClientIds.delete(prevMeta.clientId);
            if (prevMeta.camId) {
              const existingCam = prevRoom.cameras.get(prevMeta.camId);
              if (existingCam && existingCam.clientId === prevMeta.clientId) {
                prevRoom.cameras.delete(prevMeta.camId);
                if (prevRoom.activeProgramCamId === prevMeta.camId) {
                  const nextCam = Array.from(prevRoom.cameras.values())[0];
                  prevRoom.activeProgramCamId = nextCam ? nextCam.camId : null;
                }
              }
            }
            broadcastRoomState(prevRoom);
          }
        }

        // Security guard for 'director' role: Creator-only
        if (requestedRole === 'director') {
          const email = String(msg.creatorEmail || '').trim().toLowerCase();
          const key = String(msg.creatorKey || '').trim().toLowerCase();
          const token = typeof msg.creatorToken === 'string' ? msg.creatorToken : null;
          const isAuthorizedCreator =
            verifyCreatorStudioToken(token) ||
            (email === CREATOR_EMAIL && CREATOR_ALLOWED_KEYS.has(key));

          if (!isAuthorizedCreator) {
            sendJson(ws, {
              type: 'studio:error',
              code: 'UNAUTHORIZED_DIRECTOR',
              message: 'Solo el creador autorizado puede operar la consola de dirección multicámara.',
            });
            return;
          }

          const room = getOrCreateRoom(tenantId, matchId);
          room.directorClientIds.add(clientId);
          if (msg.scoreboard && typeof msg.scoreboard === 'object') {
            room.scoreboard = {
              ...room.scoreboard,
              ...msg.scoreboard,
            };
          }
          room.updatedAt = Date.now();
          clientMetaMap.set(ws, { clientId, role: 'director', roomKey: room.roomKey });

          broadcastRoomState(room);
          // Notify existing cameras that director is online so they can send WebRTC previews
          for (const cam of room.cameras.values()) {
            sendJson(socketsByClientId.get(cam.clientId), {
              type: 'studio:peer_request',
              targetClientId: clientId,
              peerRole: 'director',
              camId: cam.camId,
            });
          }
          return;
        }

        // Camera terminal joining via QR code
        if (requestedRole === 'camera') {
          const camId = String(msg.camId || `cam-${clientId.slice(-4)}`).trim();
          const label = String(msg.camLabel || `Cámara ${camId.toUpperCase()}`).trim();
          const angle = String(msg.angle || 'Cancha').trim();
          const room = getOrCreateRoom(tenantId, matchId);

          const camInfo: CameraStreamInfo = {
            camId,
            label,
            angle,
            clientId,
            deviceName: String(msg.deviceName || 'Celular QR'),
            facingMode: msg.facingMode === 'user' ? 'user' : 'environment',
            isRecording: Boolean(msg.isRecording ?? true),
            recordingSeconds: Number(msg.recordingSeconds || 0),
            recordedBytes: Number(msg.recordedBytes || 0),
            isVirtual: Boolean(msg.isVirtual),
            fps: Number(msg.fps || 30),
            bitrate: String(msg.bitrate || '2.5 Mbps'),
            connectedAt: Date.now(),
            lastHeartbeatAt: Date.now(),
            status: 'STANDBY',
          };

          room.cameras.set(camId, camInfo);
          // Auto-select first connected camera if no program camera is active yet
          if (!room.activeProgramCamId || !room.cameras.has(room.activeProgramCamId)) {
            room.activeProgramCamId = camId;
          }
          camInfo.status = room.activeProgramCamId === camId ? 'LIVE' : 'STANDBY';
          room.updatedAt = Date.now();

          clientMetaMap.set(ws, { clientId, role: 'camera', roomKey: room.roomKey, camId });
          broadcastRoomState(room);

          // Prompt camera to send WebRTC stream to all online directors
          for (const dirId of room.directorClientIds) {
            sendJson(ws, {
              type: 'studio:peer_request',
              targetClientId: dirId,
              peerRole: 'director',
              camId,
            });
          }
          // If this camera is immediately ON AIR, prompt WebRTC stream to spectators
          if (room.activeProgramCamId === camId) {
            for (const specId of room.spectatorClientIds) {
              sendJson(ws, {
                type: 'studio:peer_request',
                targetClientId: specId,
                peerRole: 'spectator',
                camId,
              });
            }
          }
          return;
        }

        // Spectator joining public live streaming channel
        const room = getOrCreateRoom(tenantId, matchId);
        room.spectatorClientIds.add(clientId);
        room.updatedAt = Date.now();
        clientMetaMap.set(ws, { clientId, role: 'spectator', roomKey: room.roomKey });
        broadcastRoomState(room);

        if (room.activeProgramCamId) {
          const activeCam = room.cameras.get(room.activeProgramCamId);
          if (activeCam) {
            sendJson(socketsByClientId.get(activeCam.clientId), {
              type: 'studio:peer_request',
              targetClientId: clientId,
              peerRole: 'spectator',
              camId: activeCam.camId,
            });
          }
        }
        return;
      }

      const meta = clientMetaMap.get(ws);
      if (!meta) return;
      const room = rooms.get(meta.roomKey);
      if (!room) return;

      // 2. Director Switches Live Camera (Authoritative)
      if (msg.type === 'director:switch_camera') {
        if (meta.role !== 'director') {
          sendJson(ws, { type: 'studio:error', code: 'FORBIDDEN', message: 'Acción exclusiva del creador.' });
          return;
        }
        const nextCamId = msg.camId ? String(msg.camId) : null;
        if (nextCamId && !room.cameras.has(nextCamId) && nextCamId !== 'external-youtube') {
          return;
        }

        room.activeProgramCamId = nextCamId === 'external-youtube' ? null : nextCamId;
        if (msg.layoutMode === 'single' || msg.layoutMode === 'pip' || msg.layoutMode === 'split') {
          room.layoutMode = msg.layoutMode;
        }
        room.updatedAt = Date.now();

        for (const cam of room.cameras.values()) {
          cam.status = room.activeProgramCamId === cam.camId ? 'LIVE' : 'STANDBY';
        }

        broadcastRoomState(room);

        // Broadcast explicit program switch event + ask newly promoted camera to feed spectators
        const switchPayload = {
          type: 'studio:program_changed',
          roomKey: room.roomKey,
          matchId: room.matchId,
          activeProgramCamId: room.activeProgramCamId,
          layoutMode: room.layoutMode,
          updatedAt: room.updatedAt,
        };
        for (const dirId of room.directorClientIds) {
          sendJson(socketsByClientId.get(dirId), switchPayload);
        }
        for (const cam of room.cameras.values()) {
          sendJson(socketsByClientId.get(cam.clientId), switchPayload);
        }
        for (const specId of room.spectatorClientIds) {
          sendJson(socketsByClientId.get(specId), switchPayload);
        }

        if (room.activeProgramCamId) {
          const activeCam = room.cameras.get(room.activeProgramCamId);
          if (activeCam) {
            for (const specId of room.spectatorClientIds) {
              sendJson(socketsByClientId.get(activeCam.clientId), {
                type: 'studio:peer_request',
                targetClientId: specId,
                peerRole: 'spectator',
                camId: activeCam.camId,
              });
            }
          }
        }
        return;
      }

      // 3. Director updates scoreboard / channel meta
      if (msg.type === 'director:update_scoreboard') {
        if (meta.role !== 'director') return;
        room.scoreboard = {
          ...room.scoreboard,
          ...(msg.scoreboard || {}),
        };
        if (typeof msg.isPublicBroadcastActive === 'boolean') {
          room.isPublicBroadcastActive = msg.isPublicBroadcastActive;
        }
        if (typeof msg.fallbackVideoId === 'string' && msg.fallbackVideoId.trim()) {
          room.fallbackVideoId = msg.fallbackVideoId.trim();
        }
        if (typeof msg.streamTitle === 'string' && msg.streamTitle.trim()) {
          room.streamTitle = msg.streamTitle.trim();
        }
        room.updatedAt = Date.now();
        broadcastRoomState(room);
        return;
      }

      // 4. Camera status / continuous recording telemetry update
      if (msg.type === 'camera:status_update') {
        if (meta.role !== 'camera' || !meta.camId) return;
        const cam = room.cameras.get(meta.camId);
        if (!cam) return;

        cam.isRecording = Boolean(msg.isRecording ?? cam.isRecording);
        cam.recordingSeconds = Number(msg.recordingSeconds ?? cam.recordingSeconds);
        cam.recordedBytes = Number(msg.recordedBytes ?? cam.recordedBytes);
        if (typeof msg.isVirtual === 'boolean') cam.isVirtual = msg.isVirtual;
        if (msg.facingMode === 'user' || msg.facingMode === 'environment') cam.facingMode = msg.facingMode;
        if (typeof msg.fps === 'number') cam.fps = msg.fps;
        if (typeof msg.bitrate === 'string') cam.bitrate = msg.bitrate;
        if (typeof msg.deviceName === 'string' && msg.deviceName) cam.deviceName = msg.deviceName;
        if (typeof msg.camLabel === 'string' && msg.camLabel) cam.label = msg.camLabel;
        cam.lastHeartbeatAt = Date.now();
        room.updatedAt = Date.now();

        // Sync telemetry to directors
        const directorPayload = buildDirectorStatePayload(room);
        for (const dirId of room.directorClientIds) {
          sendJson(socketsByClientId.get(dirId), directorPayload);
        }
        return;
      }

      // 5. Spectator requests active stream again (e.g. reconnect or channel switch)
      if (msg.type === 'spectator:request_feed') {
        if (room.activeProgramCamId) {
          const activeCam = room.cameras.get(room.activeProgramCamId);
          if (activeCam) {
            sendJson(socketsByClientId.get(activeCam.clientId), {
              type: 'studio:peer_request',
              targetClientId: meta.clientId,
              peerRole: 'spectator',
              camId: activeCam.camId,
            });
          }
        }
        return;
      }

      // 6. Spectator reaction broadcast (lightweight)
      if (msg.type === 'spectator:reaction') {
        const reactionPayload = {
          type: 'studio:reaction',
          id: `react-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          emoji: String(msg.emoji || '🔥').slice(0, 8),
          text: String(msg.text || '¡Vamos!').slice(0, 40),
        };
        for (const dirId of room.directorClientIds) {
          sendJson(socketsByClientId.get(dirId), reactionPayload);
        }
        for (const specId of room.spectatorClientIds) {
          sendJson(socketsByClientId.get(specId), reactionPayload);
        }
        return;
      }

      // 7. WebRTC P2P Signaling Relay (targeted by clientId inside same room)
      if (msg.type === 'rtc:offer' || msg.type === 'rtc:answer' || msg.type === 'rtc:ice') {
        const targetId = String(msg.targetClientId || '');
        if (!targetId) return;
        const targetWs = socketsByClientId.get(targetId);
        if (!targetWs) return;
        const targetMeta = clientMetaMap.get(targetWs);
        if (!targetMeta || targetMeta.roomKey !== meta.roomKey) return; // Room isolation

        sendJson(targetWs, {
          type: msg.type,
          fromClientId: meta.clientId,
          camId: meta.camId || msg.camId,
          sdp: msg.sdp,
          candidate: msg.candidate,
        });
      }
    });

    ws.on('close', () => {
      const meta = clientMetaMap.get(ws);
      socketsByClientId.delete(clientId);
      clientMetaMap.delete(ws);

      if (!meta) return;
      const room = rooms.get(meta.roomKey);
      if (!room) return;

      room.directorClientIds.delete(meta.clientId);
      room.spectatorClientIds.delete(meta.clientId);

      if (meta.role === 'camera' && meta.camId) {
        const existingCam = room.cameras.get(meta.camId);
        if (existingCam && existingCam.clientId === meta.clientId) {
          room.cameras.delete(meta.camId);
          if (room.activeProgramCamId === meta.camId) {
            const nextCam = Array.from(room.cameras.values())[0];
            room.activeProgramCamId = nextCam ? nextCam.camId : null;
          }
        }
      }

      room.updatedAt = Date.now();
      broadcastRoomState(room);
    });
  });

  // Return upgrade handler to attach cleanly to the shared HTTP server on port 3000
  return (server: http.Server) => {
    server.on('upgrade', (request, socket, head) => {
      try {
        const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
        if (url.pathname === '/ws/stream-studio') {
          wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
          });
        } else {
          // Do not destroy sockets for any other upgrade path unless unhandled
        }
      } catch {
        socket.destroy();
      }
    });
  };
}
