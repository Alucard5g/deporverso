export const FULL_SUPABASE_SQL_SCRIPT = `-- ====================================================================
-- SPORTIA - BASE DE DATOS EMPRESARIAL Y MULTIDEPORTE GLOBAL
-- Creado para: Rolando Guerra
-- Plataforma: SportIA SaaS Multi-Tenant Global
-- ====================================================================

-- 0. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ENUMS Y TIPOS DE DATOS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'LEAGUE_ADMIN', 'TEAM_DELEGATE', 'REFEREE', 'PLAYER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE sport_code AS ENUM ('FUTBOL', 'BALONCESTO', 'ECUAVOLEY', 'VOLEIBOL', 'PADEL', 'FUTSAL', 'BEISBOL', 'OTROS');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE match_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'HALF_TIME', 'FINISHED', 'SUSPENDED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE var_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM ('NEW', 'IN_REVIEW', 'MIGRATING', 'RESOLVED', 'CLOSED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE sub_status AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELLED', 'TRIALING');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. TABLAS DE LA PLATAFORMA
CREATE TABLE IF NOT EXISTS public.sports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code sport_code UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    description TEXT,
    sport_rules JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    sport_code sport_code NOT NULL DEFAULT 'FUTBOL',
    country VARCHAR(100) DEFAULT 'Ecuador',
    currency VARCHAR(10) DEFAULT 'USD',
    domain VARCHAR(255),
    logo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    annual_license_fee NUMERIC(10,2) DEFAULT 25.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
    role user_role NOT NULL DEFAULT 'PLAYER',
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    national_id VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(20) DEFAULT 'MASCULINO',
    min_age INT,
    max_age INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    delegate_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    logo_url TEXT,
    primary_color VARCHAR(20) DEFAULT '#000000',
    secondary_color VARCHAR(20) DEFAULT '#ffffff',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    jersey_number INT,
    position VARCHAR(50),
    photo_url TEXT,
    qr_code VARCHAR(255) UNIQUE DEFAULT gen_random_uuid()::text,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    home_team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    away_team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    referee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    sport_code sport_code NOT NULL DEFAULT 'FUTBOL',
    match_date TIMESTAMP WITH TIME ZONE NOT NULL,
    field_location VARCHAR(255),
    status match_status DEFAULT 'SCHEDULED',
    home_score INT DEFAULT 0,
    away_score INT DEFAULT 0,
    match_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.match_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    player_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    period VARCHAR(20) DEFAULT '1ST_HALF',
    timestamp_seconds INT DEFAULT 0,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.var_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    requested_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    fee_amount NUMERIC(10,2) DEFAULT 12.00,
    status var_status DEFAULT 'PENDING',
    camera_angle VARCHAR(100),
    video_url TEXT,
    result_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.migration_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    source_system VARCHAR(100) DEFAULT 'SISTEMA_ANTERIOR / OTRO',
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    file_urls JSONB DEFAULT '[]'::jsonb,
    status ticket_status DEFAULT 'NEW',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    plan_tier VARCHAR(50) NOT NULL DEFAULT 'PRO_5',
    price_monthly NUMERIC(10,2) DEFAULT 5.00,
    status sub_status DEFAULT 'ACTIVE',
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_period_end TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 year'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.scouting_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    sportia_index NUMERIC(3,1) DEFAULT 7.5,
    pace INT DEFAULT 70,
    shooting INT DEFAULT 70,
    passing INT DEFAULT 70,
    dribbling INT DEFAULT 70,
    defending INT DEFAULT 70,
    physical INT DEFAULT 70,
    goals_count INT DEFAULT 0,
    assists_count INT DEFAULT 0,
    matches_played INT DEFAULT 0,
    rating_history JSONB DEFAULT '[7.0, 7.2, 7.5]'::jsonb,
    scout_notes TEXT,
    market_value_usd NUMERIC(10,2) DEFAULT 500.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) NOT NULL DEFAULT 'SCOUT_PRO', -- FAN_PASS ($3.99), SCOUT_PRO ($12.99), EXECUTIVE_ACADEMY ($19.99)
    price_monthly NUMERIC(10,2) DEFAULT 12.99,
    status sub_status DEFAULT 'ACTIVE',
    current_period_end TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 month'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS & FUNCIONES DE SEGURIDAD
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_tenant_id()
RETURNS UUID AS $$
DECLARE tid UUID;
BEGIN
    SELECT tenant_id INTO tid FROM public.profiles WHERE id = auth.uid();
    RETURN tid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.var_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.migration_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scouting_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SuperAdmin ScoutingMetadata" ON public.scouting_metadata FOR ALL USING (public.is_super_admin());
CREATE POLICY "Public Read ScoutingMetadata" ON public.scouting_metadata FOR SELECT USING (true);

CREATE POLICY "SuperAdmin UserSubscriptions" ON public.user_subscriptions FOR ALL USING (public.is_super_admin());
CREATE POLICY "Own UserSubscriptions" ON public.user_subscriptions FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Sports visible para todos" ON public.sports FOR SELECT USING (true);
CREATE POLICY "SuperAdmin Sports" ON public.sports FOR ALL USING (public.is_super_admin());

CREATE POLICY "SuperAdmin Tenants" ON public.tenants FOR ALL USING (public.is_super_admin());
CREATE POLICY "Tenants visibles públicamente" ON public.tenants FOR SELECT USING (is_active = true);

CREATE POLICY "SuperAdmin Profiles" ON public.profiles FOR ALL USING (public.is_super_admin());
CREATE POLICY "Tenant Profiles Read" ON public.profiles FOR SELECT USING (tenant_id = public.get_user_tenant_id() OR id = auth.uid());

CREATE POLICY "SuperAdmin Categories" ON public.categories FOR ALL USING (public.is_super_admin());
CREATE POLICY "Tenant Categories Manage" ON public.categories FOR ALL USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "SuperAdmin Teams" ON public.teams FOR ALL USING (public.is_super_admin());
CREATE POLICY "Tenant Teams Manage" ON public.teams FOR ALL USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "SuperAdmin Players" ON public.players FOR ALL USING (public.is_super_admin());
CREATE POLICY "Tenant Players Manage" ON public.players FOR ALL USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "SuperAdmin Matches" ON public.matches FOR ALL USING (public.is_super_admin());
CREATE POLICY "Tenant Matches Manage" ON public.matches FOR ALL USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "SuperAdmin MatchEvents" ON public.match_events FOR ALL USING (public.is_super_admin());
CREATE POLICY "Tenant MatchEvents Manage" ON public.match_events FOR ALL USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "SuperAdmin VarRequests" ON public.var_requests FOR ALL USING (public.is_super_admin());
CREATE POLICY "Tenant VarRequests Manage" ON public.var_requests FOR ALL USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "SuperAdmin MigrationTickets" ON public.migration_tickets FOR ALL USING (public.is_super_admin());
CREATE POLICY "Tenant MigrationTickets" ON public.migration_tickets FOR ALL USING (tenant_id = public.get_user_tenant_id() OR true);

CREATE POLICY "SuperAdmin Subscriptions" ON public.subscriptions FOR ALL USING (public.is_super_admin());

-- 4. SEMILLAS DE REGISTROS DE DEPORTES
INSERT INTO public.sports (code, name, icon, description, sport_rules) VALUES
('FUTBOL', 'Fútbol 11 / 7', 'futbol', 'Reglamento FIFA adaptable para torneos comunitarios', '{"periods":2,"period_duration_minutes":45,"players_per_team":11,"scoring_modes":[{"type":"GOAL","points":1,"label":"Gol"}]}'::jsonb),
('BALONCESTO', 'Baloncesto', 'basketball', 'Anotación 1, 2 y 3 pts con control de faltas', '{"periods":4,"period_duration_minutes":10,"players_per_team":5,"scoring_modes":[{"type":"FREE_THROW","points":1,"label":"Tiro Libre"},{"type":"FIELD_GOAL_2","points":2,"label":"Doble"},{"type":"THREE_POINTER","points":3,"label":"Triple"}]}'::jsonb),
('ECUAVOLEY', 'Ecuavoley', 'volleyball', '3 Jugadores, Puntos y Cambios, Sets a 12 o 15 pts', '{"periods":3,"sets_to_win":2,"points_per_set":12,"players_per_team":3,"scoring_modes":[{"type":"ECU_POINT","points":1,"label":"Punto Directo"},{"type":"ECU_CAMBIO","points":0,"label":"Cambio"}]}'::jsonb),
('VOLEIBOL', 'Voleibol', 'volleyball', 'Rally Point por sets a 25 puntos', '{"periods":5,"sets_to_win":3,"points_per_set":25,"players_per_team":6,"scoring_modes":[{"type":"POINT","points":1,"label":"Punto"}]}'::jsonb),
('PADEL', 'Pádel', 'activity', 'Formato de juegos y sets a 6 con Tie-Break', '{"periods":3,"sets_to_win":2,"games_per_set":6,"players_per_team":2,"scoring_modes":[{"type":"GAME","points":1,"label":"Juego"}]}'::jsonb)
ON CONFLICT (code) DO NOTHING;
`;
