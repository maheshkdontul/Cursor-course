-- CFMS Database Seed Data
-- This file populates the database with sample data for testing
-- Run this after creating the schema in Supabase SQL Editor

-- ============================================================================
-- SEED WAVES
-- Create 3 waves as specified in PRD (20 assets, 3 waves)
-- ============================================================================
INSERT INTO waves (id, name, start_date, end_date, region, customer_cohort, progress_status, progress_percentage) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Wave 1 - Lower Mainland Hospitals', '2024-01-05', '2024-01-20', 'Lower Mainland', 'Hospitals', 'In Progress', 65),
    ('550e8400-e29b-41d4-a716-446655440002', 'Wave 2 - Vancouver Island Government', '2024-01-21', '2024-02-10', 'Vancouver Island', 'Government', 'In Progress', 45),
    ('550e8400-e29b-41d4-a716-446655440003', 'Wave 3 - BC Interior Enterprises', '2024-02-11', '2024-03-01', 'Interior', 'Enterprise', 'Planning', 10)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SEED LOCATIONS
-- Create locations across BC regions
-- ============================================================================
INSERT INTO locations (id, address, region, coordinates, wave_id, fiber_status) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', '123 Main Street, Vancouver, BC', 'Lower Mainland', '{"lat": 49.2827, "lng": -123.1207}', '550e8400-e29b-41d4-a716-446655440001', 'Fiber Ready'),
    ('660e8400-e29b-41d4-a716-446655440002', '456 Government Way, Victoria, BC', 'Vancouver Island', '{"lat": 48.4284, "lng": -123.3656}', '550e8400-e29b-41d4-a716-446655440002', 'Fiber Ready'),
    ('660e8400-e29b-41d4-a716-446655440003', '789 Hospital Drive, Vancouver, BC', 'Lower Mainland', '{"lat": 49.2806, "lng": -123.1300}', '550e8400-e29b-41d4-a716-446655440001', 'Pending Feasibility'),
    ('660e8400-e29b-41d4-a716-446655440004', '321 Enterprise Blvd, Kelowna, BC', 'Interior', '{"lat": 49.8880, "lng": -119.4960}', '550e8400-e29b-41d4-a716-446655440003', 'Copper Only'),
    ('660e8400-e29b-41d4-a716-446655440005', '654 Agency Street, Victoria, BC', 'Vancouver Island', '{"lat": 48.4284, "lng": -123.3656}', '550e8400-e29b-41d4-a716-446655440002', 'Fiber Ready'),
    ('660e8400-e29b-41d4-a716-446655440006', '100 Tech Park Way, Burnaby, BC', 'Lower Mainland', '{"lat": 49.2663, "lng": -122.9663}', '550e8400-e29b-41d4-a716-446655440001', 'Fiber Ready'),
    ('660e8400-e29b-41d4-a716-446655440007', '200 Medical Center Ave, Surrey, BC', 'Lower Mainland', '{"lat": 49.1044, "lng": -122.8011}', '550e8400-e29b-41d4-a716-446655440001', 'Pending Feasibility'),
    ('660e8400-e29b-41d4-a716-446655440008', '300 Provincial Building, Nanaimo, BC', 'Vancouver Island', '{"lat": 49.1659, "lng": -123.9401}', '550e8400-e29b-41d4-a716-446655440002', 'Fiber Ready'),
    ('660e8400-e29b-41d4-a716-446655440009', '400 Corporate Center, Kamloops, BC', 'Interior', '{"lat": 50.6745, "lng": -120.3273}', '550e8400-e29b-41d4-a716-446655440003', 'Copper Only'),
    ('660e8400-e29b-41d4-a716-446655440010', '500 Healthcare Plaza, Richmond, BC', 'Lower Mainland', '{"lat": 49.1666, "lng": -123.1364}', '550e8400-e29b-41d4-a716-446655440001', 'Fiber Ready'),
    ('660e8400-e29b-41d4-a716-446655440011', '600 Campus Drive, Prince George, BC', 'North', '{"lat": 53.9144, "lng": -122.7728}', NULL, 'Pending Feasibility'),
    ('660e8400-e29b-41d4-a716-446655440012', '700 Downtown Core, New Westminster, BC', 'Lower Mainland', '{"lat": 49.2069, "lng": -122.9119}', '550e8400-e29b-41d4-a716-446655440001', 'Fiber Ready'),
    ('660e8400-e29b-41d4-a716-446655440013', '800 Harbour Front, Victoria, BC', 'Vancouver Island', '{"lat": 48.4284, "lng": -123.3656}', '550e8400-e29b-41d4-a716-446655440002', 'Fiber Ready'),
    ('660e8400-e29b-41d4-a716-446655440014', '900 Innovation Way, Abbotsford, BC', 'Lower Mainland', '{"lat": 49.0504, "lng": -122.3045}', '550e8400-e29b-41d4-a716-446655440001', 'Pending Feasibility'),
    ('660e8400-e29b-41d4-a716-446655440015', '1000 Mountain View, Vernon, BC', 'Interior', '{"lat": 50.2670, "lng": -119.2725}', '550e8400-e29b-41d4-a716-446655440003', 'Copper Only'),
    ('660e8400-e29b-41d4-a716-446655440016', '1100 Lakeside Drive, Penticton, BC', 'Interior', '{"lat": 49.5031, "lng": -119.5937}', '550e8400-e29b-41d4-a716-446655440003', 'Copper Only'),
    ('660e8400-e29b-41d4-a716-446655440017', '1200 University Blvd, Vancouver, BC', 'Lower Mainland', '{"lat": 49.2606, "lng": -123.2460}', '550e8400-e29b-41d4-a716-446655440001', 'Fiber Ready'),
    ('660e8400-e29b-41d4-a716-446655440018', '1300 Parliament Hill, Victoria, BC', 'Vancouver Island', '{"lat": 48.4284, "lng": -123.3656}', '550e8400-e29b-41d4-a716-446655440002', 'Fiber Ready'),
    ('660e8400-e29b-41d4-a716-446655440019', '1400 Business Park, Coquitlam, BC', 'Lower Mainland', '{"lat": 49.2841, "lng": -122.7937}', '550e8400-e29b-41d4-a716-446655440001', 'Pending Feasibility'),
    ('660e8400-e29b-41d4-a716-446655440020', '1500 Industrial Ave, Langley, BC', 'Lower Mainland', '{"lat": 49.1044, "lng": -122.6586}', '550e8400-e29b-41d4-a716-446655440001', 'Fiber Ready')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SEED TECHNICIANS
-- Create field service personnel
-- ============================================================================
INSERT INTO technicians (id, name, phone, assigned_jobs) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', 'John Smith', '604-555-0101', 5),
    ('770e8400-e29b-41d4-a716-446655440002', 'Sarah Johnson', '604-555-0102', 3),
    ('770e8400-e29b-41d4-a716-446655440003', 'Mike Chen', '250-555-0103', 7),
    ('770e8400-e29b-41d4-a716-446655440004', 'Emily Davis', '604-555-0104', 2),
    ('770e8400-e29b-41d4-a716-446655440005', 'David Wilson', '250-555-0105', 4)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SEED CUSTOMERS
-- Create business clients
-- ============================================================================
INSERT INTO customers (id, name, phone, address, consent_status) VALUES
    ('880e8400-e29b-41d4-a716-446655440001', 'Vancouver General Hospital', '604-555-0201', '123 Main Street, Vancouver, BC', 'Consented'),
    ('880e8400-e29b-41d4-a716-446655440002', 'BC Ministry Office', '250-555-0202', '456 Government Way, Victoria, BC', 'Pending'),
    ('880e8400-e29b-41d4-a716-446655440003', 'St. Paul''s Hospital', '604-555-0203', '789 Hospital Drive, Vancouver, BC', 'Consented'),
    ('880e8400-e29b-41d4-a716-446655440004', 'TechCorp Industries', '250-555-0204', '321 Enterprise Blvd, Kelowna, BC', 'Declined'),
    ('880e8400-e29b-41d4-a716-446655440005', 'Metro Health Center', '604-555-0205', '500 Healthcare Plaza, Richmond, BC', 'Consented')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SEED ASSETS (20 assets as per requirement)
-- Create infrastructure assets
-- ============================================================================
INSERT INTO assets (id, type, location_id, status, installation_date, technician_id) VALUES
    ('990e8400-e29b-41d4-a716-446655440001', 'copper', '660e8400-e29b-41d4-a716-446655440001', 'active', '2020-01-15', NULL),
    ('990e8400-e29b-41d4-a716-446655440002', 'fiber', '660e8400-e29b-41d4-a716-446655440002', 'completed', '2023-06-20', '770e8400-e29b-41d4-a716-446655440002'),
    ('990e8400-e29b-41d4-a716-446655440003', 'ONT', '660e8400-e29b-41d4-a716-446655440003', 'pending', NULL, '770e8400-e29b-41d4-a716-446655440001'),
    ('990e8400-e29b-41d4-a716-446655440004', 'copper', '660e8400-e29b-41d4-a716-446655440004', 'active', '2019-03-10', NULL),
    ('990e8400-e29b-41d4-a716-446655440005', 'fiber', '660e8400-e29b-41d4-a716-446655440005', 'completed', '2023-08-15', '770e8400-e29b-41d4-a716-446655440003'),
    ('990e8400-e29b-41d4-a716-446655440006', 'ONT', '660e8400-e29b-41d4-a716-446655440006', 'pending', NULL, '770e8400-e29b-41d4-a716-446655440001'),
    ('990e8400-e29b-41d4-a716-446655440007', 'copper', '660e8400-e29b-41d4-a716-446655440007', 'active', '2018-05-22', NULL),
    ('990e8400-e29b-41d4-a716-446655440008', 'fiber', '660e8400-e29b-41d4-a716-446655440008', 'completed', '2023-07-10', '770e8400-e29b-41d4-a716-446655440004'),
    ('990e8400-e29b-41d4-a716-446655440009', 'ONT', '660e8400-e29b-41d4-a716-446655440009', 'pending', NULL, '770e8400-e29b-41d4-a716-446655440005'),
    ('990e8400-e29b-41d4-a716-446655440010', 'copper', '660e8400-e29b-41d4-a716-446655440010', 'active', '2020-11-30', NULL),
    ('990e8400-e29b-41d4-a716-446655440011', 'fiber', '660e8400-e29b-41d4-a716-446655440011', 'completed', '2023-09-05', '770e8400-e29b-41d4-a716-446655440002'),
    ('990e8400-e29b-41d4-a716-446655440012', 'ONT', '660e8400-e29b-41d4-a716-446655440012', 'pending', NULL, '770e8400-e29b-41d4-a716-446655440003'),
    ('990e8400-e29b-41d4-a716-446655440013', 'copper', '660e8400-e29b-41d4-a716-446655440013', 'active', '2019-08-14', NULL),
    ('990e8400-e29b-41d4-a716-446655440014', 'fiber', '660e8400-e29b-41d4-a716-446655440014', 'completed', '2023-10-12', '770e8400-e29b-41d4-a716-446655440004'),
    ('990e8400-e29b-41d4-a716-446655440015', 'ONT', '660e8400-e29b-41d4-a716-446655440015', 'pending', NULL, '770e8400-e29b-41d4-a716-446655440001'),
    ('990e8400-e29b-41d4-a716-446655440016', 'copper', '660e8400-e29b-41d4-a716-446655440016', 'active', '2021-02-18', NULL),
    ('990e8400-e29b-41d4-a716-446655440017', 'fiber', '660e8400-e29b-41d4-a716-446655440017', 'completed', '2023-11-20', '770e8400-e29b-41d4-a716-446655440005'),
    ('990e8400-e29b-41d4-a716-446655440018', 'ONT', '660e8400-e29b-41d4-a716-446655440018', 'pending', NULL, '770e8400-e29b-41d4-a716-446655440002'),
    ('990e8400-e29b-41d4-a716-446655440019', 'copper', '660e8400-e29b-41d4-a716-446655440019', 'active', '2020-07-09', NULL),
    ('990e8400-e29b-41d4-a716-446655440020', 'fiber', '660e8400-e29b-41d4-a716-446655440020', 'completed', '2023-12-01', '770e8400-e29b-41d4-a716-446655440003')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SEED WORK ORDERS
-- Create technician assignments
-- ============================================================================
INSERT INTO work_orders (id, location_id, technician_id, status, start_time, end_time) VALUES
    ('aa0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'In Progress', '2024-01-10 09:00:00+00', NULL),
    ('aa0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 'Assigned', NULL, NULL),
    ('aa0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 'Completed', '2024-01-08 08:00:00+00', '2024-01-08 14:30:00+00'),
    ('aa0e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440003', 'In Progress', '2024-01-11 10:00:00+00', NULL),
    ('aa0e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440004', 'Completed', '2024-01-09 07:30:00+00', '2024-01-09 13:15:00+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SEED CONSENT LOGS
-- Create customer engagement records
-- ============================================================================
INSERT INTO consent_logs (id, customer_id, agent_name, status, timestamp, notes) VALUES
    ('bb0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'Alice Agent', 'Consented', '2024-01-05 10:30:00+00', 'Customer confirmed availability for migration'),
    ('bb0e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'Bob Agent', 'Pending', '2024-01-06 14:15:00+00', 'Left voicemail, awaiting callback'),
    ('bb0e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', 'Alice Agent', 'Consented', '2024-01-07 09:00:00+00', 'Scheduled for next week'),
    ('bb0e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', 'Bob Agent', 'Declined', '2024-01-08 11:45:00+00', 'Deferred to next quarter'),
    ('bb0e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440005', 'Alice Agent', 'Consented', '2024-01-09 08:30:00+00', 'Ready to proceed immediately')
ON CONFLICT (id) DO NOTHING;

