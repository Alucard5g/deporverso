export interface RemoteCameraInfo {
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

export interface StudioStateSnapshot {
  roomKey: string;
  tenantId: string;
  matchId: string;
  activeProgramCamId: string | null;
  layoutMode: 'single' | 'pip' | 'split';
  isPublicBroadcastActive: boolean;
  fallbackVideoId: string;
  streamTitle: string;
  scoreboard: StudioScoreboard;
  cameras: RemoteCameraInfo[];
  spectatorCount: number;
  directorOnline: boolean;
  updatedAt: number;
}

export interface PublicStudioStateSnapshot {
  roomKey: string;
  tenantId: string;
  matchId: string;
  activeProgramCamId: string | null;
  activeCameraClientId: string | null;
  activeCameraLabel: string | null;
  activeCameraAngle: string | null;
  connectedCamerasCount: number;
  layoutMode: 'single' | 'pip' | 'split';
  isPublicBroadcastActive: boolean;
  fallbackVideoId: string;
  streamTitle: string;
  scoreboard: StudioScoreboard;
  spectatorCount: number;
  directorOnline: boolean;
  updatedAt: number;
}

export interface CameraSlotPreset {
  camId: string;
  label: string;
  angle: string;
}

export const DEFAULT_CAMERA_SLOTS: CameraSlotPreset[] = [
  { camId: 'cam-1', label: 'CAM 1 · Principal', angle: 'Medio Campo' },
  { camId: 'cam-2', label: 'CAM 2 · Arco Local', angle: 'Portería Norte' },
  { camId: 'cam-3', label: 'CAM 3 · Arco Visita', angle: 'Portería Sur' },
  { camId: 'cam-4', label: 'CAM 4 · Táctica', angle: 'Lateral Alta' },
];

export const CREATOR_STUDIO_KEY_STORAGE = 'deporverso_creator_studio_key';

export function setCreatorStudioKey(key: string): void {
  try {
    sessionStorage.setItem(CREATOR_STUDIO_KEY_STORAGE, key);
    localStorage.setItem(CREATOR_STUDIO_KEY_STORAGE, key);
  } catch {
    // Ignore storage restriction
  }
}

export function getCreatorStudioKey(): string {
  try {
    return (
      sessionStorage.getItem(CREATOR_STUDIO_KEY_STORAGE) ||
      localStorage.getItem(CREATOR_STUDIO_KEY_STORAGE) ||
      ''
    );
  } catch {
    return '';
  }
}

export function clearCreatorStudioKey(): void {
  try {
    sessionStorage.removeItem(CREATOR_STUDIO_KEY_STORAGE);
    localStorage.removeItem(CREATOR_STUDIO_KEY_STORAGE);
  } catch {
    // Ignore
  }
}

export function getStreamStudioWsUrl(): string {
  if (typeof window === 'undefined') return 'ws://localhost:3000/ws/stream-studio';
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/ws/stream-studio`;
}

export function buildQrCameraUrl(params: {
  origin?: string;
  tenantId: string;
  matchId: string;
  camId: string;
  camLabel: string;
  angle: string;
}): string {
  const baseOrigin =
    params.origin ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://deporverso.app');
  const query = new URLSearchParams({
    mode: 'terminal-camera',
    tenantId: params.tenantId,
    matchId: params.matchId,
    camId: params.camId,
    camLabel: params.camLabel,
    angle: params.angle,
  });
  return `${baseOrigin}/?${query.toString()}`;
}

export function createRtcPeerConnection(): RTCPeerConnection | null {
  if (typeof window === 'undefined' || typeof RTCPeerConnection === 'undefined') {
    return null;
  }
  return new RTCPeerConnection({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  });
}

export async function fetchPublicChannels(tenantId?: string): Promise<PublicStudioStateSnapshot[]> {
  try {
    const qs = tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : '';
    const res = await fetch(`/api/stream-studio/channels${qs}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.channels) ? data.channels : [];
  } catch {
    return [];
  }
}
