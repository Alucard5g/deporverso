-- ====================================================================
-- SPORTIA - BASE DE DATOS EMPRESARIAL Y MULTIDEPORTE GLOBAL
-- Creado para: Rolando Guerra
-- Plataforma: SportIA SaaS Multi-Tenant Global
-- ====================================================================

-- 0. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ENUMS Y TIPOS DE DATOS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'SUPER_ADMIN',
        'LEAGUE_ADMIN',
        'TEAM_DELEGATE',
        'REFEREE',
        'PLAYER'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE sport_code AS ENUM (
        'FUTBOL',
        'BALONCESTO',
        'ECUAVOLEY',
        'VOLEIBOL',
        'PADEL',
        'FUTSAL',
        'BEISBOL',
        'OTROS'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE match_status AS ENUM (
        'SCHEDULED',
        'IN_PROGRESS',
        'HALF_TIME',
        'FINISHED',
        'SUSPENDED',
        'CANCELLED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE var_status AS ENUM (
        'PENDING',
        'APPROVED',
        'REJECTED',
        'COMPLETED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM (
        'NEW',
        'IN_REVIEW',
        'MIGRATING',
        'RESOLVED',
        'CLOSED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE sub_status AS ENUM (
        'ACTIVE',
        'PAST_DUE',
        'CANCELLED',
        'TRIALING'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ====================================================================
-- 2. TABLAS DE LA PLATAFORMA
-- ====================================================================

-- 2.1 TABLA SPORTS (Catálogo de Disciplinas con Reglas Dinámicas JSONB)
CREATE TABLE IF NOT EXISTS public.sports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code sport_code UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    description TEXT,
    sport_rules JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.2 TABLA TENANTS (Ligas / Torneos Organizados por Deporte)
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

-- 2.3 TABLA PROFILES (Perfiles de Usuario con Roles y Vínculo Multi-Tenant)
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

-- 2.4 TABLA CATEGORIES (Categorías/Divisiones por Liga)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(20) DEFAULT 'MASCULINO',
    min_age INT,
    max_age INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.5 TABLA TEAMS (Equipos / Clubes)
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

-- 2.6 TABLA PLAYERS (Jugadores Carnetizados)
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

-- 2.7 TABLA MATCHES (Encuentros Deportivos)
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
    match_data JSONB DEFAULT '{}'::jsonb, -- Estructura de sets/puntos/faltas/periodos por deporte
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.8 TABLA MATCH_EVENTS (Vocalía Digital - Registro de Eventos en Vivo)
CREATE TABLE IF NOT EXISTS public.match_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    player_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL, -- 'GOAL', 'BASKET_1', 'BASKET_2', 'BASKET_3', 'ECU_POINT', 'ECU_CAMBIO', 'YELLOW_CARD', 'RED_CARD', 'FOUL', 'TIMEOUT'
    period VARCHAR(20) DEFAULT '1ST_HALF',
    timestamp_seconds INT DEFAULT 0,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.9 TABLA VAR_REQUESTS (Módulo VAR A la Carta)
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

-- 2.10 TABLA MIGRATION_TICKETS (Ingesta de Datos Antiguos SADCAF / PDF / Excel)
CREATE TABLE IF NOT EXISTS public.migration_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    source_system VARCHAR(100) DEFAULT 'SADCAF / OTRO',
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    file_urls JSONB DEFAULT '[]'::jsonb,
    status ticket_status DEFAULT 'NEW',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.11 TABLA SUBSCRIPTIONS (Planes Mensuales $3, $5, $8 y Licencias)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    plan_tier VARCHAR(50) NOT NULL DEFAULT 'PRO_5', -- 'BASIC_3', 'PRO_5', 'ENTERPRISE_8'
    price_monthly NUMERIC(10,2) DEFAULT 5.00,
    status sub_status DEFAULT 'ACTIVE',
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_period_end TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 year'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- 3. FUNCIONES AUXILIARES PARA SEGURIDAD RLS
-- ====================================================================

-- Función para verificar si el usuario logueado es SUPER_ADMIN
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener el tenant_id del usuario logueado
CREATE OR REPLACE FUNCTION public.get_user_tenant_id()
RETURNS UUID AS $$
DECLARE
    tid UUID;
BEGIN
    SELECT tenant_id INTO tid FROM public.profiles WHERE id = auth.uid();
    RETURN tid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- 4. ROW LEVEL SECURITY (RLS) & POLITICAS
-- ====================================================================

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

-- POLITICAS PARA SPORTS (Lectura pública, edición SuperAdmin)
CREATE POLICY "Sports visible para todos" ON public.sports FOR SELECT USING (true);
CREATE POLICY "Sports editable por SuperAdmin" ON public.sports FOR ALL USING (public.is_super_admin());

-- POLITICAS PARA TENANTS
CREATE POLICY "SuperAdmin acceso total a Tenants" ON public.tenants FOR ALL USING (public.is_super_admin());
CREATE POLICY "Tenants visibles públicamente por slug" ON public.tenants FOR SELECT USING (is_active = true);
CREATE POLICY "LeagueAdmin actualiza su propio Tenant" ON public.tenants FOR UPDATE USING (id = public.get_user_tenant_id());

-- POLITICAS PARA PROFILES
CREATE POLICY "SuperAdmin acceso total a Profiles" ON public.profiles FOR ALL USING (public.is_super_admin());
CREATE POLICY "Usuarios leen perfiles de su tenant" ON public.profiles FOR SELECT USING (tenant_id = public.get_user_tenant_id() OR id = auth.uid());
CREATE POLICY "Usuarios editan su propio perfil" ON public.profiles FOR UPDATE USING (id = auth.uid());

-- POLITICAS PARA CATEGORIES, TEAMS, PLAYERS, MATCHES, MATCH_EVENTS, VAR, MIGRATION, SUBS
-- A. SUPER_ADMIN Acceso ilimitado global:
CREATE POLICY "SuperAdmin Categories" ON public.categories FOR ALL USING (public.is_super_admin());
CREATE POLICY "SuperAdmin Teams" ON public.teams FOR ALL USING (public.is_super_admin());
CREATE POLICY "SuperAdmin Players" ON public.players FOR ALL USING (public.is_super_admin());
CREATE POLICY "SuperAdmin Matches" ON public.matches FOR ALL USING (public.is_super_admin());
CREATE POLICY "SuperAdmin MatchEvents" ON public.match_events FOR ALL USING (public.is_super_admin());
CREATE POLICY "SuperAdmin VarRequests" ON public.var_requests FOR ALL USING (public.is_super_admin());
CREATE POLICY "SuperAdmin MigrationTickets" ON public.migration_tickets FOR ALL USING (public.is_super_admin());
CREATE POLICY "SuperAdmin Subscriptions" ON public.subscriptions FOR ALL USING (public.is_super_admin());

-- B. Aislamiento por Tenant para lectura y escritura de cada Liga:
CREATE POLICY "Tenant Categories Read" ON public.categories FOR SELECT USING (tenant_id = public.get_user_tenant_id() OR true);
CREATE POLICY "Tenant Categories Manage" ON public.categories FOR ALL USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Tenant Teams Read" ON public.teams FOR SELECT USING (tenant_id = public.get_user_tenant_id() OR true);
CREATE POLICY "Tenant Teams Manage" ON public.teams FOR ALL USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Tenant Players Read" ON public.players FOR SELECT USING (tenant_id = public.get_user_tenant_id() OR true);
CREATE POLICY "Tenant Players Manage" ON public.players FOR ALL USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Tenant Matches Read" ON public.matches FOR SELECT USING (tenant_id = public.get_user_tenant_id() OR true);
CREATE POLICY "Tenant Matches Manage" ON public.matches FOR ALL USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Tenant MatchEvents Read" ON public.match_events FOR SELECT USING (tenant_id = public.get_user_tenant_id() OR true);
CREATE POLICY "Tenant MatchEvents Manage" ON public.match_events FOR ALL USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Tenant VarRequests Read" ON public.var_requests FOR SELECT USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "Tenant VarRequests Manage" ON public.var_requests FOR ALL USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Tenant MigrationTickets ReadWrite" ON public.migration_tickets FOR ALL USING (tenant_id = public.get_user_tenant_id() OR true);

CREATE POLICY "Tenant Subscriptions Read" ON public.subscriptions FOR SELECT USING (tenant_id = public.get_user_tenant_id());

-- ====================================================================
-- 5. DATOS SEMILLA (SEEDS) DE DEPORTES Y REGLAS DEFAULT
-- ====================================================================

INSERT INTO public.sports (code, name, icon, description, sport_rules)
VALUES 
('FUTBOL', 'Fútbol 11 / 7', 'futbol', 'Reglamento FIFA adaptable para torneos comunitarios y profesionales', '{
    "periods": 2,
    "period_duration_minutes": 45,
    "players_per_team": 11,
    "scoring_modes": [{"type": "GOAL", "points": 1, "label": "Gol"}],
    "foul_cards": ["YELLOW", "RED"],
    "has_overtime": true
}'::jsonb),

('BALONCESTO', 'Baloncesto', 'basketball', 'Sistema de anotación de 1, 2 y 3 puntos con control de faltas por cuarto', '{
    "periods": 4,
    "period_duration_minutes": 10,
    "players_per_team": 5,
    "scoring_modes": [
        {"type": "FREE_THROW", "points": 1, "label": "Tiro Libre"},
        {"type": "FIELD_GOAL_2", "points": 2, "label": "Doble (2 pts)"},
        {"type": "THREE_POINTER", "points": 3, "label": "Triple (3 pts)"}
    ],
    "max_personal_fouls": 5,
    "has_overtime": true
}'::jsonb),

('ECUAVOLEY', 'Ecuavoley', 'volleyball', 'Reglas tradicionales de Ecuavoley: 3 jugadores, Puntos y Cambios, 12 o 15 puntos por set', '{
    "periods": 3,
    "sets_to_win": 2,
    "points_per_set": 12,
    "players_per_team": 3,
    "scoring_modes": [
        {"type": "ECU_POINT", "points": 1, "label": "Punto Directo"},
        {"type": "ECU_CAMBIO", "points": 0, "label": "Cambio de Servida"}
    ],
    "positions": ["Colocador", "Servidor", "Volador"],
    "batida_mode": "TRADICIONAL"
}'::jsonb),

('VOLEIBOL', 'Voleibol', 'volleyball', 'Sistema Rally Point por sets a 25 puntos con tie-break a 15', '{
    "periods": 5,
    "sets_to_win": 3,
    "points_per_set": 25,
    "tiebreak_points": 15,
    "players_per_team": 6,
    "scoring_modes": [{"type": "POINT", "points": 1, "label": "Punto Rally"}]
}'::jsonb),

('PADEL', 'Pádel', 'activity', 'Formato de juegos (15, 30, 40, Juego) y sets a 6 juegos con Tie-Break', '{
    "periods": 3,
    "sets_to_win": 2,
    "games_per_set": 6,
    "players_per_team": 2,
    "scoring_modes": [{"type": "GAME", "points": 1, "label": "Juego Ganado"}]
}'::jsonb),

('FUTSAL', 'Fútsal / Microfútbol', 'shield', 'Reglas de 5 contra 5 con acumulación de faltas directas', '{
    "periods": 2,
    "period_duration_minutes": 20,
    "players_per_team": 5,
    "scoring_modes": [{"type": "GOAL", "points": 1, "label": "Gol"}],
    "accumulated_fouls_limit": 5
}'::jsonb),

('BEISBOL', 'Béisbol / Sófbol', 'disc', 'Gestión de Innings, Carreras, Hits y Errores', '{
    "periods": 9,
    "players_per_team": 9,
    "scoring_modes": [{"type": "RUN", "points": 1, "label": "Carrera"}]
}'::jsonb),

('OTROS', 'Otras Disciplinas', 'trophy', 'Esquema libre adaptable para Artes Marciales, Tenis, etc.', '{
    "periods": 2,
    "scoring_modes": [{"type": "POINT", "points": 1, "label": "Punto"}]
}'::jsonb)
ON CONFLICT (code) DO NOTHING;

-- Demo Tenant para Rolando Guerra
INSERT INTO public.tenants (id, name, slug, sport_code, country, currency, domain, is_active)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Liga Barrial Pichincha - SportIA Demo', 'liga-pichincha', 'FUTBOL', 'Ecuador', 'USD', 'pichincha.sportia.app', true)
ON CONFLICT (slug) DO NOTHING;

COMMENT ON TABLE public.tenants IS 'Almacena las ligas organizadoras bajo la arquitectura multi-tenant de SportIA';
COMMENT ON TABLE public.sports IS 'Catálogo dinámico de deportes con configuraciones en JSONB';
