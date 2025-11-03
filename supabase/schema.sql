-- CFMS Database Schema
-- This file contains the SQL schema for all tables in the Supabase database
-- Run this in Supabase SQL Editor to create all tables and relationships

-- Enable UUID extension (for generating unique IDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- WAVES TABLE
-- Stores migration wave groups (regions and customer cohorts)
-- ============================================================================
CREATE TABLE IF NOT EXISTS waves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    region TEXT NOT NULL CHECK (region IN ('Vancouver Island', 'Lower Mainland', 'Interior', 'North')),
    customer_cohort TEXT NOT NULL CHECK (customer_cohort IN ('Hospitals', 'Government', 'Enterprise')),
    progress_status TEXT NOT NULL DEFAULT 'Planning' CHECK (progress_status IN ('Planning', 'In Progress', 'Completed', 'On Hold')),
    progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- LOCATIONS TABLE
-- Stores physical addresses and fiber readiness status
-- ============================================================================
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    address TEXT NOT NULL,
    region TEXT NOT NULL CHECK (region IN ('Vancouver Island', 'Lower Mainland', 'Interior', 'North')),
    coordinates JSONB NOT NULL, -- Stores {lat: number, lng: number}
    wave_id UUID REFERENCES waves(id) ON DELETE SET NULL,
    fiber_status TEXT NOT NULL DEFAULT 'Pending Feasibility' CHECK (fiber_status IN ('Fiber Ready', 'Pending Feasibility', 'Copper Only')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TECHNICIANS TABLE
-- Stores field service personnel
-- ============================================================================
CREATE TABLE IF NOT EXISTS technicians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    assigned_jobs INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CUSTOMERS TABLE
-- Stores business clients
-- ============================================================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    consent_status TEXT NOT NULL DEFAULT 'Pending' CHECK (consent_status IN ('Consented', 'Pending', 'Declined')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ASSETS TABLE
-- Stores infrastructure assets (copper, fiber, ONT)
-- ============================================================================
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('copper', 'fiber', 'ONT')),
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'completed', 'failed')),
    installation_date DATE,
    technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- WORK ORDERS TABLE
-- Stores technician job assignments
-- ============================================================================
CREATE TABLE IF NOT EXISTS work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'Assigned' CHECK (status IN ('Assigned', 'In Progress', 'Completed', 'Failed')),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CONSENT LOGS TABLE
-- Audit trail for customer consent records
-- ============================================================================
CREATE TABLE IF NOT EXISTS consent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    agent_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Consented', 'Pending', 'Declined')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- Improve query performance
-- ============================================================================

-- Location indexes
CREATE INDEX IF NOT EXISTS idx_locations_region ON locations(region);
CREATE INDEX IF NOT EXISTS idx_locations_wave_id ON locations(wave_id);
CREATE INDEX IF NOT EXISTS idx_locations_fiber_status ON locations(fiber_status);

-- Asset indexes
CREATE INDEX IF NOT EXISTS idx_assets_location_id ON assets(location_id);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_technician_id ON assets(technician_id);

-- Work order indexes
CREATE INDEX IF NOT EXISTS idx_work_orders_location_id ON work_orders(location_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_technician_id ON work_orders(technician_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(status);

-- Consent log indexes
CREATE INDEX IF NOT EXISTS idx_consent_logs_customer_id ON consent_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_consent_logs_timestamp ON consent_logs(timestamp);

-- Wave indexes
CREATE INDEX IF NOT EXISTS idx_waves_region ON waves(region);
CREATE INDEX IF NOT EXISTS idx_waves_customer_cohort ON waves(customer_cohort);

-- ============================================================================
-- TRIGGERS
-- Automatically update updated_at timestamp
-- ============================================================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_waves_updated_at BEFORE UPDATE ON waves
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technicians_updated_at BEFORE UPDATE ON technicians
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON work_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Enable RLS for MVP with basic public access
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE waves ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_logs ENABLE ROW LEVEL SECURITY;

-- For MVP: Allow public read/write access (will be restricted in production)
-- This allows the app to work without authentication for now
CREATE POLICY "Allow public read access" ON waves FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON waves FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON waves FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON waves FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON locations FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON locations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON locations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON locations FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON technicians FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON technicians FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON technicians FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON technicians FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON customers FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON customers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON customers FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON assets FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON assets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON assets FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON assets FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON work_orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON work_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON work_orders FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON work_orders FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON consent_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON consent_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON consent_logs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON consent_logs FOR DELETE USING (true);

