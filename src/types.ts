export type UserRole = 'SUPER_ADMIN' | 'LEAGUE_ADMIN' | 'TEAM_DELEGATE' | 'REFEREE' | 'PLAYER';

export type SportCode = 'FUTBOL' | 'BALONCESTO' | 'ECUAVOLEY' | 'VOLEIBOL' | 'PADEL' | 'FUTSAL' | 'BEISBOL' | 'OTROS';

export type MatchStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'HALF_TIME' | 'FINISHED' | 'SUSPENDED' | 'CANCELLED';

export type VarStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export type TicketStatus = 'NEW' | 'IN_REVIEW' | 'MIGRATING' | 'RESOLVED' | 'CLOSED';

export type SubStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'TRIALING';

export interface SportRuleScoringMode {
  type: string;
  points: number;
  label: string;
}

export interface SportRules {
  periods?: number;
  period_duration_minutes?: number;
  players_per_team?: number;
  scoring_modes?: SportRuleScoringMode[];
  foul_cards?: string[];
  sets_to_win?: number;
  points_per_set?: number;
  has_overtime?: boolean;
  max_personal_fouls?: number;
  accumulated_fouls_limit?: number;
  games_per_set?: number;
  positions?: string[];
  batida_mode?: string;
  [key: string]: any;
}

export interface Sport {
  id: string;
  code: SportCode;
  name: string;
  icon: string;
  description: string;
  sport_rules: SportRules;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  sport_code: SportCode;
  country: string;
  currency: string;
  domain: string;
  admin_key?: string; // Clave secreta administrativa para entrega al administrador de la liga
  logo_url?: string;
  is_active: boolean;
  annual_license_fee: number;
  created_at: string;
  plan_tier?: 'BASIC_3' | 'PRO_5' | 'ENTERPRISE_8';
}

export interface Profile {
  id: string;
  tenant_id?: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string;
  national_id?: string;
  avatar_url?: string;
}

export interface Category {
  id: string;
  tenant_id: string;
  name: string;
  gender: string;
  min_age?: number;
  max_age?: number;
}

export interface Team {
  id: string;
  tenant_id: string;
  category_id?: string;
  delegate_id?: string;
  name: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
}

export interface Player {
  id: string;
  tenant_id: string;
  team_id?: string;
  user_id?: string;
  full_name: string;
  cedula?: string;
  jersey_number?: number;
  position?: string;
  photo_url?: string;
  qr_code: string;
  is_active: boolean;
}

export interface PlayerMatchStat {
  player_id: string;
  jersey_number: number;
  player_name: string;
  team_id: string;
  goals: number;
  yellow_cards: number;
  red_cards: number;
  assists?: number;
  minutes_played?: number;
  is_starter?: boolean;
}

export interface CaptainApproval {
  captain_name: string;
  captain_number?: number;
  approved: boolean;
  approved_at?: string;
  comments?: string;
}

export interface VocalReport {
  vocal_name: string;
  vocal_cedula?: string;
  observations: string;
  status: 'CONFORME' | 'CON_NOVEDAD' | 'OBSERVADO';
  start_time?: string;
  end_time?: string;
  signed: boolean;
  ball_conditions?: string;
  uniforms_status?: string;
  saved_at?: string;
}

export interface RefereeReport {
  main_referee: string;
  assistant_1?: string;
  assistant_2?: string;
  fourth_official?: string;
  disciplinary_notes: string;
  incidents?: string;
  signatures_verified: boolean;
  pitch_conditions?: string;
  saved_at?: string;
}

export interface MatchData {
  sets_home?: number[];
  sets_away?: number[];
  current_set?: number;
  current_period?: string;
  fouls_home?: number;
  fouls_away?: number;
  timeouts_home?: number;
  timeouts_away?: number;
  serving_team_id?: string;
  cambios_count?: number;
  player_stats?: Record<string, PlayerMatchStat>;
  vocal_report?: VocalReport;
  referee_report?: RefereeReport;
  home_captain_approval?: CaptainApproval;
  away_captain_approval?: CaptainApproval;
  is_public_published?: boolean;
  firebase_doc_id?: string;
  last_synced_at?: string;
  round?: string;
  venue_name?: string;
  referee_name?: string;
  vocal_name?: string;
  court_surface?: string;
  weather_temp?: string;
  ticket_status?: string;
  stream_url?: string;
}

export interface Match {
  id: string;
  tenant_id: string;
  category_id?: string;
  home_team_id: string;
  away_team_id: string;
  referee_id?: string;
  sport_code: SportCode;
  match_date: string;
  field_location: string;
  status: MatchStatus;
  home_score: number;
  away_score: number;
  match_data: MatchData;
  created_at: string;
  home_team?: Team;
  away_team?: Team;
}

export interface MatchEvent {
  id: string;
  tenant_id: string;
  match_id: string;
  team_id?: string;
  player_id?: string;
  event_type: string;
  period: string;
  timestamp_seconds: number;
  details?: Record<string, any>;
  created_at: string;
  player_name?: string;
  team_name?: string;
}

export interface VarRequest {
  id: string;
  tenant_id: string;
  match_id: string;
  requested_by?: string;
  fee_amount: number;
  status: VarStatus;
  camera_angle?: string;
  video_url?: string;
  result_notes?: string;
  created_at: string;
  match_title?: string;
}

export interface MigrationTicket {
  id: string;
  tenant_id?: string;
  source_system: string;
  contact_email: string;
  contact_phone?: string;
  file_urls: string[];
  status: TicketStatus;
  notes?: string;
  created_at: string;
}

export interface ScoutingMetadata {
  id: string;
  player_id: string;
  tenant_id: string;
  sportia_index: number; // 1.0 to 10.0 rating
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  goals_count: number;
  assists_count: number;
  matches_played: number;
  rating_history: number[];
  scout_notes: string;
  market_value_usd: number;
}

export interface B2CSubscription {
  id: string;
  user_id: string;
  plan_type: 'FAN_PASS' | 'SCOUT_PRO' | 'EXECUTIVE_ACADEMY';
  price_monthly: number;
  status: SubStatus;
  current_period_end: string;
}

export interface Subscription {
  id: string;
  tenant_id: string;
  plan_tier: 'BASIC_3' | 'PRO_5' | 'ENTERPRISE_8';
  price_monthly: number;
  status: SubStatus;
  current_period_start: string;
  current_period_end: string;
}

export interface AiChronicle {
  match_id: string;
  headline: string;
  body: string;
  key_moments: string[];
  tactical_notes: string;
  generated_at: string;
}

export type CrmStage = 'NUEVO_LEAD' | 'CONTACTADO' | 'DEMO_AGENDADA' | 'EN_NEGOCIACION' | 'PAGADO_ACTIVO' | 'RENOVACION';

export interface CrmActivity {
  id: string;
  type: 'LLAMADA' | 'WHATSAPP' | 'EMAIL' | 'DEMO' | 'PAGO_REGISTRADO';
  date: string;
  notes: string;
  agentName: string;
}

export interface CrmLead {
  id: string;
  organizationName: string;
  contactName: string;
  contactRole: string;
  email: string;
  phone: string;
  sportCode: SportCode;
  country: string;
  city: string;
  stage: CrmStage;
  estimatedValueUsd: number;
  planTier: 'BASIC_3' | 'PRO_5' | 'ENTERPRISE_8' | 'LICENCIA_25';
  priority: 'ALTA' | 'MEDIA' | 'BAJA';
  nextFollowUpDate?: string;
  notes: string;
  activities: CrmActivity[];
  createdAt: string;
}
