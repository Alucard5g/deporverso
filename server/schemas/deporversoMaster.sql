-- ==============================================================================
-- DEPORVERSO (deporverso.com) - ENTERPRISE MULTI-TENANT ARCHITECTURE
-- Targeted for PostgreSQL 15+ running on Google Cloud SQL / Supabase / Neon
-- Dynamic Schema Isolation: Each club or league gets its own "tenant_<subdomain>" schema
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PUBLIC MASTER SCHEMA (GLOBAL PLATFORM CONTROL & ONBOARDING REGISTRY)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subdomain VARCHAR(64) UNIQUE NOT NULL,            -- e.g. "ligaprolocal" -> ligaprolocal.deporverso.com
    custom_domain VARCHAR(255) UNIQUE,                -- e.g. "campeonatooficial.com"
    name VARCHAR(150) NOT NULL,
    sport_type VARCHAR(32) NOT NULL DEFAULT 'FUTBOL', -- FUTBOL, BALONCESTO, ECUAVOLEY, PADEL, FUTSAL, VOLEIBOL
    schema_name VARCHAR(64) UNIQUE NOT NULL,          -- e.g. "tenant_ligaprolocal"
    tier VARCHAR(32) NOT NULL DEFAULT 'PRO_5',        -- BASIC_3, PRO_5, ENTERPRISE_8
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',     -- PENDING_PAYMENT, ACTIVE, SUSPENDED
    onboarding_fee_paid BOOLEAN NOT NULL DEFAULT FALSE,
    onboarding_payment_reference VARCHAR(100),
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    cloud_run_region VARCHAR(50) DEFAULT 'us-central1',
    firestore_namespace VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.tenant_onboarding_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    subdomain VARCHAR(64) NOT NULL,
    amount_usd NUMERIC(10, 2) NOT NULL DEFAULT 25.00,  -- $25 per club installation
    payment_method VARCHAR(50) DEFAULT 'STRIPE_CHECKOUT',
    transaction_id VARCHAR(128) UNIQUE NOT NULL,
    payment_status VARCHAR(32) NOT NULL DEFAULT 'COMPLETED', -- COMPLETED, REFUNDED, FAILED
    payer_email VARCHAR(255) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.global_athletes (
    global_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    national_id VARCHAR(64) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE,
    heroes_del_deporte_id VARCHAR(64) UNIQUE,          -- Bridge key with heroesdeldeporte.com
    total_xp_score INT DEFAULT 0,
    hall_of_fame_rank VARCHAR(32) DEFAULT 'RISING_STAR',
    current_vr_tier VARCHAR(32) DEFAULT 'NOVICE_RUNNER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 2. DYNAMIC TENANT PROVISIONING PROCEDURE / DDL TEMPLATE
-- Executes inside isolated schema: tenant_<subdomain>
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.provision_tenant_schema(p_subdomain TEXT, p_sport_type TEXT)
RETURNS VOID AS $$
DECLARE
    v_schema TEXT := 'tenant_' || lower(regexp_replace(p_subdomain, '[^a-zA-Z0-9_]', '', 'g'));
BEGIN
    -- Create isolated schema
    EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I;', v_schema);

    -- Teams table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I.teams (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(100) NOT NULL,
            short_name VARCHAR(10),
            logo_url TEXT,
            captain_name VARCHAR(100),
            captain_phone VARCHAR(50),
            primary_color VARCHAR(20) DEFAULT ''#10b981'',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    ', v_schema);

    -- Players table with biometric and Heroes VR integration
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I.players (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            team_id UUID REFERENCES %I.teams(id) ON DELETE SET NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            dorsal INT,
            national_id VARCHAR(64) NOT NULL,
            position VARCHAR(50),
            photo_url TEXT,
            qr_credential_token VARCHAR(128) UNIQUE,
            heroes_athlete_id VARCHAR(64),
            vr_player_xp INT DEFAULT 0,
            stat_ritmo INT DEFAULT 70,
            stat_tiro INT DEFAULT 65,
            stat_pase INT DEFAULT 72,
            stat_defensa INT DEFAULT 60,
            stat_fisico INT DEFAULT 75,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    ', v_schema, v_schema);

    -- Tournaments table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I.tournaments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(150) NOT NULL,
            sport_type VARCHAR(32) NOT NULL DEFAULT %L,
            season VARCHAR(32) DEFAULT ''2026'',
            rules_config JSONB DEFAULT ''{}''::jsonb,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    ', v_schema, p_sport_type);

    -- Fixtures / Matches table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I.fixtures (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            tournament_id UUID REFERENCES %I.tournaments(id) ON DELETE CASCADE,
            round_number INT DEFAULT 1,
            home_team_id UUID REFERENCES %I.teams(id) ON DELETE CASCADE,
            away_team_id UUID REFERENCES %I.teams(id) ON DELETE CASCADE,
            scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
            venue_field VARCHAR(100),
            home_score INT DEFAULT 0,
            away_score INT DEFAULT 0,
            match_status VARCHAR(32) DEFAULT ''SCHEDULED'', -- SCHEDULED, IN_PROGRESS, FINISHED, POSTPONED
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    ', v_schema, v_schema, v_schema, v_schema);

    -- Referee Acts (Vocalía Digital)
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I.referee_acts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            fixture_id UUID UNIQUE REFERENCES %I.fixtures(id) ON DELETE CASCADE,
            referee_name VARCHAR(100) NOT NULL,
            home_captain_signature TEXT,
            away_captain_signature TEXT,
            act_pdf_url TEXT,
            notes TEXT,
            finalized_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    ', v_schema, v_schema);

    -- Match Events (Goals, Points, Yellow/Red Cards, Substitutions)
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I.match_events (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            fixture_id UUID REFERENCES %I.fixtures(id) ON DELETE CASCADE,
            player_id UUID REFERENCES %I.players(id) ON DELETE SET NULL,
            team_id UUID REFERENCES %I.teams(id) ON DELETE CASCADE,
            period VARCHAR(32) NOT NULL,
            minute INT NOT NULL,
            event_type VARCHAR(32) NOT NULL,
            metadata JSONB DEFAULT ''{}''::jsonb,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    ', v_schema, v_schema, v_schema, v_schema);

    -- VAR On-Demand Reviews
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I.var_reviews (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            fixture_id UUID REFERENCES %I.fixtures(id) ON DELETE CASCADE,
            review_minute INT NOT NULL,
            camera_angle VARCHAR(64) DEFAULT ''MAIN_CAM'',
            disputed_action VARCHAR(64) NOT NULL,
            referee_ruling VARCHAR(64) NOT NULL,  -- CONFIRMED, OVERTURNED, INCONCLUSIVE
            clip_video_url TEXT,
            duration_seconds INT DEFAULT 18,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    ', v_schema, v_schema);

    -- Heroes VR Telemetry & At-Home Career Training Sessions
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I.heroes_vr_telemetry (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            player_id UUID REFERENCES %I.players(id) ON DELETE CASCADE,
            drill_type VARCHAR(64) NOT NULL,
            duration_seconds INT NOT NULL,
            avg_cadence_spm NUMERIC(6, 2),
            avg_heart_rate INT,
            calories_burned INT,
            precision_accuracy_pct NUMERIC(5, 2),
            xp_gained INT NOT NULL DEFAULT 0,
            device_model VARCHAR(64) DEFAULT ''Meta Quest 3 / Vision Pro WebXR'',
            synced_with_heroes_del_deporte BOOLEAN DEFAULT FALSE,
            synced_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    ', v_schema, v_schema);

    -- Merchandising & Fan Zone E-Commerce
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I.merchandise_products (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title VARCHAR(150) NOT NULL,
            description TEXT,
            price_usd NUMERIC(10, 2) NOT NULL,
            stock_quantity INT DEFAULT 100,
            image_url TEXT,
            category VARCHAR(50) DEFAULT ''JERSEYS'',
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    ', v_schema);

    -- Indices for high concurrency queries
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_fixtures_sched ON %I.fixtures (scheduled_at);', p_subdomain, v_schema);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_players_team ON %I.players (team_id);', p_subdomain, v_schema);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_vr_player ON %I.heroes_vr_telemetry (player_id);', p_subdomain, v_schema);

END;
$$ LANGUAGE plpgsql;
