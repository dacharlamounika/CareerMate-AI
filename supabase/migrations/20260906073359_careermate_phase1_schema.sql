/*
# CareerMate AI — Phase 1 Database Schema

1. Overview
   CareerMate AI is a personalized career guidance platform. Phase 1 implements
   authentication, user career profiles, the Resume Builder, and ATS analysis.
   The schema is designed to support future modules (job recommendations, skill
   gap analysis, mock interviews, learning roadmaps, coding assessments) without
   rewriting existing tables.

2. New Tables
   - `profiles` — each user's master career profile (education, skills, projects,
     interests, career preferences). One row per auth user.
   - `job_roles` — configurable target job roles. IT roles are seeded; NON-IT roles
     are managed through this table so they are configurable via the database.
   - `resumes` — a resume created by a user. Stores career type, target role,
     status (draft/published), and all section content as JSONB (content). Using
     JSONB for resume sections keeps the builder flexible and avoids 14-way joins
     on every load while remaining fully queryable.
   - `ats_analyses` — ATS analysis results for a resume (score, keywords, gaps,
     suggestions). One-to-many with resumes so re-analyses are preserved.

3. Columns
   profiles:
     id (uuid PK, == auth.users.id), full_name, avatar_url, career_type,
     target_role, profile_data (JSONB for education/skills/projects/etc.),
     completion_pct, created_at, updated_at
   job_roles:
     id (uuid PK), name, category (IT/NON-IT), is_active, sort_order, created_at
   resumes:
     id (uuid PK), user_id (uuid FK -> auth.users, default auth.uid()),
     title, career_type (IT/NON-IT), target_role, status (draft/published),
     content (JSONB — all resume sections), current_step (int), created_at, updated_at
   ats_analyses:
     id (uuid PK), resume_id (uuid FK -> resumes), score (int), result (JSONB),
     created_at

4. Security (RLS)
   - profiles: owner-scoped CRUD (authenticated, auth.uid() = id).
   - job_roles: public read (anon + authenticated) so the role list loads before
     login if needed; writes restricted to authenticated (future admin).
   - resumes: owner-scoped CRUD via auth.uid() = user_id.
   - ats_analyses: owner-scoped through resume_id -> resumes.user_id ownership check.

5. Notes
   - user_id columns default to auth.uid() so frontend inserts that omit user_id
     still satisfy INSERT WITH CHECK policies.
   - All tables have ON DELETE CASCADE from auth.users where appropriate.
*/

-- ============ PROFILES ============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  career_type text DEFAULT 'IT',
  target_role text,
  profile_data jsonb DEFAULT '{}'::jsonb,
  completion_pct int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- ============ JOB ROLES ============
CREATE TABLE IF NOT EXISTS job_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'IT',
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE job_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_job_roles" ON job_roles;
CREATE POLICY "read_job_roles" ON job_roles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_job_roles" ON job_roles;
CREATE POLICY "insert_job_roles" ON job_roles FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_job_roles" ON job_roles;
CREATE POLICY "update_job_roles" ON job_roles FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Seed IT roles
INSERT INTO job_roles (name, category, sort_order) VALUES
  ('Software Developer', 'IT', 1),
  ('Java Developer', 'IT', 2),
  ('Python Developer', 'IT', 3),
  ('Full Stack Developer', 'IT', 4),
  ('Frontend Developer', 'IT', 5),
  ('Backend Developer', 'IT', 6),
  ('Data Analyst', 'IT', 7),
  ('Data Scientist', 'IT', 8),
  ('AI/ML Engineer', 'IT', 9),
  ('Cloud Engineer', 'IT', 10),
  ('DevOps Engineer', 'IT', 11),
  ('Cybersecurity Analyst', 'IT', 12),
  ('Database Developer', 'IT', 13),
  ('Other', 'IT', 14)
ON CONFLICT DO NOTHING;

-- Seed a few NON-IT role placeholders (configurable via DB)
INSERT INTO job_roles (name, category, sort_order) VALUES
  ('Marketing Associate', 'NON-IT', 1),
  ('Business Analyst', 'NON-IT', 2),
  ('Human Resources Executive', 'NON-IT', 3),
  ('Operations Associate', 'NON-IT', 4),
  ('Other', 'NON-IT', 5)
ON CONFLICT DO NOTHING;

-- ============ RESUMES ============
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text DEFAULT 'Untitled Resume',
  career_type text DEFAULT 'IT',
  target_role text,
  status text DEFAULT 'draft',
  content jsonb DEFAULT '{}'::jsonb,
  current_step int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_resumes" ON resumes;
CREATE POLICY "select_own_resumes" ON resumes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_resumes" ON resumes;
CREATE POLICY "insert_own_resumes" ON resumes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_resumes" ON resumes;
CREATE POLICY "update_own_resumes" ON resumes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_resumes" ON resumes;
CREATE POLICY "delete_own_resumes" ON resumes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);

-- ============ ATS ANALYSES ============
CREATE TABLE IF NOT EXISTS ats_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  score int DEFAULT 0,
  result jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ats_analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_ats" ON ats_analyses;
CREATE POLICY "select_own_ats" ON ats_analyses FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM resumes WHERE resumes.id = ats_analyses.resume_id AND resumes.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_ats" ON ats_analyses;
CREATE POLICY "insert_own_ats" ON ats_analyses FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM resumes WHERE resumes.id = ats_analyses.resume_id AND resumes.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_ats" ON ats_analyses;
CREATE POLICY "delete_own_ats" ON ats_analyses FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM resumes WHERE resumes.id = ats_analyses.resume_id AND resumes.user_id = auth.uid())
  );

CREATE INDEX IF NOT EXISTS idx_ats_resume_id ON ats_analyses(resume_id);

-- ============ updated_at trigger ============
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_resumes_updated_at ON resumes;
CREATE TRIGGER trg_resumes_updated_at BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
