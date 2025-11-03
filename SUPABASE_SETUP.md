# Supabase Setup Guide

This guide will help you set up Supabase for the CFMS project.

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - **Name**: CFMS (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you (e.g., US West for BC)
5. Click "Create new project"
6. Wait for project to finish setting up (2-3 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** (gear icon) → **API**
2. Find these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
3. Copy both values - you'll need them for the `.env` file

## Step 3: Create Environment File

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

3. **Important**: `.env` is already in `.gitignore` - your credentials won't be committed

## Step 4: Create Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL Editor
5. Click "Run" (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

**What this creates:**
- All 7 tables (waves, locations, technicians, customers, assets, work_orders, consent_logs)
- Foreign key relationships
- Indexes for performance
- Triggers for automatic timestamp updates
- Row Level Security policies (public access for MVP)

## Step 5: Seed Database with Sample Data

1. Still in SQL Editor, create a new query
2. Copy the entire contents of `supabase/seed.sql`
3. Paste and run it
4. You should see multiple "INSERT" success messages

**What this creates:**
- 3 waves (as per PRD)
- 20 locations
- 5 technicians
- 5 customers
- 20 assets (as required)
- 5 work orders
- 5 consent logs

## Step 6: Verify Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see all 7 tables listed
3. Click on any table (e.g., "waves") to see the seeded data
4. Check that:
   - `waves` table has 3 rows
   - `locations` table has 20 rows
   - `assets` table has 20 rows

## Step 7: Test Connection in Application

1. Make sure your `.env` file is configured
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open browser console (F12)
4. Check for any Supabase connection errors

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` file exists in project root
- Verify variable names: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after creating `.env`

### "Failed to fetch" or connection errors
- Check that your Supabase project is active
- Verify URL and key are correct (no extra spaces)
- Check browser console for detailed error messages

### Schema errors
- Make sure you run `schema.sql` before `seed.sql`
- Check SQL Editor for error messages
- Verify all tables were created in Table Editor

### Row Level Security errors
- The schema includes public access policies for MVP
- If you get permission errors, check the policies in SQL Editor:
  ```sql
  SELECT * FROM pg_policies WHERE tablename = 'your_table_name';
  ```

## Next Steps

Once Supabase is set up:
1. The application can read/write to database
2. Replace mock data with Supabase API calls (Phase 3)
3. Implement authentication if needed (future phase)

## Security Note

**Current Setup (MVP):**
- Public read/write access enabled for development
- No authentication required

**For Production:**
- Implement proper authentication
- Restrict Row Level Security policies
- Use service role key only on server-side (never expose in frontend)

