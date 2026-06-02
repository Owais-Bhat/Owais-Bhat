-- ============================================================
-- CyberMilo ERP — Supabase PostgreSQL Schema
-- Multi-tenant: every table (except institutions & user_profiles)
-- carries institution_id as a foreign key.
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

-- 1. institutions
CREATE TABLE IF NOT EXISTS public.institutions (
  id                uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text         NOT NULL,
  type              text,
  address           text,
  phone             text,
  email             text,
  logo_url          text,
  subscription_plan text         NOT NULL DEFAULT 'free',
  subscription_status text       NOT NULL DEFAULT 'trialing',
  trial_ends_at     timestamptz,
  current_period_ends_at timestamptz,
  billing_email     text,
  settings          jsonb        NOT NULL DEFAULT '{}',
  created_at        timestamptz  NOT NULL DEFAULT now()
);

-- 2. user_profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id             uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid         UNIQUE NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  institution_id uuid         REFERENCES public.institutions ON DELETE SET NULL,
  role           text,
  first_name     text,
  last_name      text,
  phone          text,
  avatar_url     text,
  is_active      boolean      NOT NULL DEFAULT true,
  created_at     timestamptz  NOT NULL DEFAULT now()
);

-- 3. students
CREATE TABLE IF NOT EXISTS public.students (
  id             uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid         NOT NULL REFERENCES public.institutions ON DELETE CASCADE,
  admission_no   text,
  first_name     text         NOT NULL,
  last_name      text,
  email          text,
  phone          text,
  dob            date,
  gender         text,
  address        text,
  class_name     text,
  section        text,
  parent_name    text,
  parent_phone   text,
  parent_email   text,
  status         text         NOT NULL DEFAULT 'active',
  created_at     timestamptz  NOT NULL DEFAULT now()
);

-- 4. teachers
CREATE TABLE IF NOT EXISTS public.teachers (
  id             uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid         NOT NULL REFERENCES public.institutions ON DELETE CASCADE,
  employee_id    text,
  first_name     text         NOT NULL,
  last_name      text,
  email          text,
  phone          text,
  subjects       text[],
  qualification  text,
  status         text         NOT NULL DEFAULT 'active',
  created_at     timestamptz  NOT NULL DEFAULT now()
);

-- 5. classes
CREATE TABLE IF NOT EXISTS public.classes (
  id             uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid         NOT NULL REFERENCES public.institutions ON DELETE CASCADE,
  name           text         NOT NULL,
  section        text,
  teacher_id     uuid         REFERENCES public.teachers ON DELETE SET NULL,
  capacity       integer,
  created_at     timestamptz  NOT NULL DEFAULT now()
);

-- 6. attendance
CREATE TABLE IF NOT EXISTS public.attendance (
  id             uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid         NOT NULL REFERENCES public.institutions ON DELETE CASCADE,
  student_id     uuid         NOT NULL REFERENCES public.students ON DELETE CASCADE,
  class_name     text,
  date           date         NOT NULL,
  status         text         NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  marked_by      uuid         REFERENCES public.user_profiles ON DELETE SET NULL,
  created_at     timestamptz  NOT NULL DEFAULT now(),
  UNIQUE (institution_id, student_id, date)
);

-- 7. fee_structures
CREATE TABLE IF NOT EXISTS public.fee_structures (
  id             uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid         NOT NULL REFERENCES public.institutions ON DELETE CASCADE,
  name           text         NOT NULL,
  amount         numeric      NOT NULL DEFAULT 0,
  frequency      text,
  class_name     text,
  is_active      boolean      NOT NULL DEFAULT true,
  created_at     timestamptz  NOT NULL DEFAULT now()
);

-- 8. fee_payments
CREATE TABLE IF NOT EXISTS public.fee_payments (
  id             uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid         NOT NULL REFERENCES public.institutions ON DELETE CASCADE,
  student_id     uuid         NOT NULL REFERENCES public.students ON DELETE CASCADE,
  fee_type       text,
  total_amount   numeric      NOT NULL DEFAULT 0,
  paid_amount    numeric      NOT NULL DEFAULT 0,
  due_date       date,
  payment_date   date,
  status         text         NOT NULL DEFAULT 'pending',
  receipt_no     text,
  created_at     timestamptz  NOT NULL DEFAULT now()
);

-- 9. exams
CREATE TABLE IF NOT EXISTS public.exams (
  id             uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid         NOT NULL REFERENCES public.institutions ON DELETE CASCADE,
  title          text         NOT NULL,
  subject        text,
  class_name     text,
  exam_date      date,
  total_marks    integer,
  pass_marks     integer,
  status         text         NOT NULL DEFAULT 'upcoming',
  created_at     timestamptz  NOT NULL DEFAULT now()
);

-- 10. exam_results
CREATE TABLE IF NOT EXISTS public.exam_results (
  id              uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id         uuid         NOT NULL REFERENCES public.exams ON DELETE CASCADE,
  student_id      uuid         NOT NULL REFERENCES public.students ON DELETE CASCADE,
  marks_obtained  numeric,
  grade           text,
  remarks         text,
  created_at      timestamptz  NOT NULL DEFAULT now()
);

-- 11. courses
CREATE TABLE IF NOT EXISTS public.courses (
  id             uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid         NOT NULL REFERENCES public.institutions ON DELETE CASCADE,
  title          text         NOT NULL,
  description    text,
  subject        text,
  class_name     text,
  teacher_id     uuid         REFERENCES public.teachers ON DELETE SET NULL,
  thumbnail_url  text,
  is_published   boolean      NOT NULL DEFAULT false,
  created_at     timestamptz  NOT NULL DEFAULT now()
);

-- 12. lessons
CREATE TABLE IF NOT EXISTS public.lessons (
  id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id     uuid         NOT NULL REFERENCES public.courses ON DELETE CASCADE,
  title         text         NOT NULL,
  content       text,
  video_url     text,
  file_url      text,
  lesson_order  integer      NOT NULL DEFAULT 0,
  created_at    timestamptz  NOT NULL DEFAULT now()
);

-- 13. announcements
CREATE TABLE IF NOT EXISTS public.announcements (
  id              uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id  uuid         NOT NULL REFERENCES public.institutions ON DELETE CASCADE,
  title           text         NOT NULL,
  content         text,
  priority        text         NOT NULL DEFAULT 'normal',
  target_audience text         NOT NULL DEFAULT 'all',
  created_by      uuid         REFERENCES public.user_profiles ON DELETE SET NULL,
  created_at      timestamptz  NOT NULL DEFAULT now()
);

-- 14. messages
CREATE TABLE IF NOT EXISTS public.messages (
  id             uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid         NOT NULL REFERENCES public.institutions ON DELETE CASCADE,
  sender_id      uuid         REFERENCES public.user_profiles ON DELETE SET NULL,
  recipient_id   uuid         REFERENCES public.user_profiles ON DELETE SET NULL,
  subject        text,
  body           text,
  is_read        boolean      NOT NULL DEFAULT false,
  created_at     timestamptz  NOT NULL DEFAULT now()
);

-- 15. transport_routes
CREATE TABLE IF NOT EXISTS public.transport_routes (
  id             uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid         NOT NULL REFERENCES public.institutions ON DELETE CASCADE,
  route_name     text         NOT NULL,
  driver_name    text,
  driver_phone   text,
  vehicle_no     text,
  capacity       integer,
  stops          text[],
  is_active      boolean      NOT NULL DEFAULT true,
  created_at     timestamptz  NOT NULL DEFAULT now()
);

-- 16. student_routes
CREATE TABLE IF NOT EXISTS public.student_routes (
  id          uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id    uuid         NOT NULL REFERENCES public.transport_routes ON DELETE CASCADE,
  student_id  uuid         NOT NULL REFERENCES public.students ON DELETE CASCADE,
  pickup_stop text,
  created_at  timestamptz  NOT NULL DEFAULT now()
);

-- 17. admissions
CREATE TABLE IF NOT EXISTS public.admissions (
  id              uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id  uuid         NOT NULL REFERENCES public.institutions ON DELETE CASCADE,
  applicant_name  text         NOT NULL,
  email           text,
  phone           text,
  dob             date,
  class_applying  text,
  parent_name     text,
  parent_phone    text,
  address         text,
  status          text         NOT NULL DEFAULT 'pending',
  remarks         text,
  applied_at      timestamptz  NOT NULL DEFAULT now()
);

-- 18. activity_log
CREATE TABLE IF NOT EXISTS public.activity_log (
  id             uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid         NOT NULL REFERENCES public.institutions ON DELETE CASCADE,
  user_id        uuid,
  action         text         NOT NULL,
  description    text,
  entity_type    text,
  entity_id      uuid,
  severity       text         NOT NULL DEFAULT 'info',
  ip_address     text,
  user_agent     text,
  metadata       jsonb        NOT NULL DEFAULT '{}',
  created_at     timestamptz  NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_log ADD COLUMN IF NOT EXISTS severity text NOT NULL DEFAULT 'info';
ALTER TABLE public.activity_log ADD COLUMN IF NOT EXISTS ip_address text;
ALTER TABLE public.activity_log ADD COLUMN IF NOT EXISTS user_agent text;
ALTER TABLE public.activity_log ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}';

-- 19. feature_usage_events
CREATE TABLE IF NOT EXISTS public.feature_usage_events (
  id             uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid         NOT NULL REFERENCES public.institutions ON DELETE CASCADE,
  user_id        uuid,
  feature_key    text         NOT NULL,
  event_type     text         NOT NULL DEFAULT 'view',
  metadata       jsonb        NOT NULL DEFAULT '{}',
  created_at     timestamptz  NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- institution_id indexes for fast tenant filtering
CREATE INDEX IF NOT EXISTS idx_students_institution_id         ON public.students (institution_id);
CREATE INDEX IF NOT EXISTS idx_teachers_institution_id         ON public.teachers (institution_id);
CREATE INDEX IF NOT EXISTS idx_classes_institution_id          ON public.classes (institution_id);
CREATE INDEX IF NOT EXISTS idx_attendance_institution_id       ON public.attendance (institution_id);
CREATE INDEX IF NOT EXISTS idx_fee_structures_institution_id   ON public.fee_structures (institution_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_institution_id     ON public.fee_payments (institution_id);
CREATE INDEX IF NOT EXISTS idx_exams_institution_id            ON public.exams (institution_id);
CREATE INDEX IF NOT EXISTS idx_courses_institution_id          ON public.courses (institution_id);
CREATE INDEX IF NOT EXISTS idx_announcements_institution_id    ON public.announcements (institution_id);
CREATE INDEX IF NOT EXISTS idx_messages_institution_id         ON public.messages (institution_id);
CREATE INDEX IF NOT EXISTS idx_transport_routes_institution_id ON public.transport_routes (institution_id);
CREATE INDEX IF NOT EXISTS idx_admissions_institution_id       ON public.admissions (institution_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_institution_id     ON public.activity_log (institution_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at         ON public.activity_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_action             ON public.activity_log (action);
CREATE INDEX IF NOT EXISTS idx_feature_usage_institution_id    ON public.feature_usage_events (institution_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_feature_key       ON public.feature_usage_events (feature_key);
CREATE INDEX IF NOT EXISTS idx_feature_usage_created_at        ON public.feature_usage_events (created_at);

-- Attendance-specific indexes
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON public.attendance (student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date       ON public.attendance (date);

-- user_profiles lookup
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id        ON public.user_profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_institution_id ON public.user_profiles (institution_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Helper: returns the institution_id of the calling user
-- This is evaluated once per query via a stable function.
CREATE OR REPLACE FUNCTION public.auth_institution_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT institution_id
  FROM public.user_profiles
  WHERE user_id = auth.uid()
    AND is_active = true
  LIMIT 1;
$$;

-- Helper: returns the active role for the calling user.
CREATE OR REPLACE FUNCTION public.auth_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_profiles
  WHERE user_id = auth.uid()
    AND is_active = true
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.auth_has_any_role(allowed_roles text[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(public.auth_role() = ANY(allowed_roles), false);
$$;

CREATE OR REPLACE FUNCTION public.auth_is_tenant_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.auth_has_any_role(ARRAY['super_admin', 'institution_admin', 'principal']);
$$;

CREATE OR REPLACE FUNCTION public.auth_can_write_academics()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.auth_has_any_role(ARRAY['institution_admin', 'principal', 'teacher']);
$$;

CREATE OR REPLACE FUNCTION public.auth_can_write_operations()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.auth_has_any_role(ARRAY['institution_admin', 'principal', 'staff']);
$$;

CREATE OR REPLACE FUNCTION public.auth_can_write_finance()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.auth_has_any_role(ARRAY['institution_admin', 'principal', 'staff']);
$$;

-- ── institutions ─────────────────────────────────────────────
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "institutions: members can select own institution"
  ON public.institutions
  FOR SELECT
  TO authenticated
  USING (id = public.auth_institution_id());

-- ── user_profiles ─────────────────────────────────────────────
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_profiles: own row"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "user_profiles: same institution select"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (institution_id = public.auth_institution_id());

CREATE POLICY "user_profiles: own row insert"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_profiles: own row update"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- ── Macro to generate full CRUD policies for tenant tables ───
-- (Repeated per table for clarity; Supabase does not support
--  dynamic policy creation in migrations.)

-- ── students ──────────────────────────────────────────────────
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "students: tenant select"   ON public.students FOR SELECT    TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "students: tenant insert"   ON public.students FOR INSERT    TO authenticated WITH CHECK (institution_id = public.auth_institution_id());
CREATE POLICY "students: tenant update"   ON public.students FOR UPDATE    TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "students: tenant delete"   ON public.students FOR DELETE    TO authenticated USING (institution_id = public.auth_institution_id());

-- ── teachers ─────────────────────────────────────────────────
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "teachers: tenant select"   ON public.teachers FOR SELECT    TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "teachers: tenant insert"   ON public.teachers FOR INSERT    TO authenticated WITH CHECK (institution_id = public.auth_institution_id());
CREATE POLICY "teachers: tenant update"   ON public.teachers FOR UPDATE    TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "teachers: tenant delete"   ON public.teachers FOR DELETE    TO authenticated USING (institution_id = public.auth_institution_id());

-- ── classes ───────────────────────────────────────────────────
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "classes: tenant select"    ON public.classes FOR SELECT     TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "classes: tenant insert"    ON public.classes FOR INSERT     TO authenticated WITH CHECK (institution_id = public.auth_institution_id());
CREATE POLICY "classes: tenant update"    ON public.classes FOR UPDATE     TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "classes: tenant delete"    ON public.classes FOR DELETE     TO authenticated USING (institution_id = public.auth_institution_id());

-- ── attendance ────────────────────────────────────────────────
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "attendance: tenant select" ON public.attendance FOR SELECT  TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "attendance: tenant insert" ON public.attendance FOR INSERT  TO authenticated WITH CHECK (institution_id = public.auth_institution_id());
CREATE POLICY "attendance: tenant update" ON public.attendance FOR UPDATE  TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "attendance: tenant delete" ON public.attendance FOR DELETE  TO authenticated USING (institution_id = public.auth_institution_id());

-- ── fee_structures ────────────────────────────────────────────
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fee_structures: tenant select" ON public.fee_structures FOR SELECT  TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "fee_structures: tenant insert" ON public.fee_structures FOR INSERT  TO authenticated WITH CHECK (institution_id = public.auth_institution_id());
CREATE POLICY "fee_structures: tenant update" ON public.fee_structures FOR UPDATE  TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "fee_structures: tenant delete" ON public.fee_structures FOR DELETE  TO authenticated USING (institution_id = public.auth_institution_id());

-- ── fee_payments ──────────────────────────────────────────────
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fee_payments: tenant select" ON public.fee_payments FOR SELECT   TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "fee_payments: tenant insert" ON public.fee_payments FOR INSERT   TO authenticated WITH CHECK (institution_id = public.auth_institution_id());
CREATE POLICY "fee_payments: tenant update" ON public.fee_payments FOR UPDATE   TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "fee_payments: tenant delete" ON public.fee_payments FOR DELETE   TO authenticated USING (institution_id = public.auth_institution_id());

-- ── exams ─────────────────────────────────────────────────────
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "exams: tenant select"      ON public.exams FOR SELECT       TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "exams: tenant insert"      ON public.exams FOR INSERT       TO authenticated WITH CHECK (institution_id = public.auth_institution_id());
CREATE POLICY "exams: tenant update"      ON public.exams FOR UPDATE       TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "exams: tenant delete"      ON public.exams FOR DELETE       TO authenticated USING (institution_id = public.auth_institution_id());

-- ── exam_results ──────────────────────────────────────────────
-- exam_results has no direct institution_id; access is controlled
-- via the parent exam's institution_id using a subquery.
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "exam_results: tenant select" ON public.exam_results FOR SELECT
  TO authenticated
  USING (
    exam_id IN (
      SELECT id FROM public.exams WHERE institution_id = public.auth_institution_id()
    )
  );
CREATE POLICY "exam_results: tenant insert" ON public.exam_results FOR INSERT
  TO authenticated
  WITH CHECK (
    exam_id IN (
      SELECT id FROM public.exams WHERE institution_id = public.auth_institution_id()
    )
  );
CREATE POLICY "exam_results: tenant update" ON public.exam_results FOR UPDATE
  TO authenticated
  USING (
    exam_id IN (
      SELECT id FROM public.exams WHERE institution_id = public.auth_institution_id()
    )
  );
CREATE POLICY "exam_results: tenant delete" ON public.exam_results FOR DELETE
  TO authenticated
  USING (
    exam_id IN (
      SELECT id FROM public.exams WHERE institution_id = public.auth_institution_id()
    )
  );

-- ── courses ───────────────────────────────────────────────────
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "courses: tenant select"    ON public.courses FOR SELECT     TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "courses: tenant insert"    ON public.courses FOR INSERT     TO authenticated WITH CHECK (institution_id = public.auth_institution_id());
CREATE POLICY "courses: tenant update"    ON public.courses FOR UPDATE     TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "courses: tenant delete"    ON public.courses FOR DELETE     TO authenticated USING (institution_id = public.auth_institution_id());

-- ── lessons ───────────────────────────────────────────────────
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lessons: tenant select"    ON public.lessons FOR SELECT
  TO authenticated
  USING (
    course_id IN (
      SELECT id FROM public.courses WHERE institution_id = public.auth_institution_id()
    )
  );
CREATE POLICY "lessons: tenant insert"    ON public.lessons FOR INSERT
  TO authenticated
  WITH CHECK (
    course_id IN (
      SELECT id FROM public.courses WHERE institution_id = public.auth_institution_id()
    )
  );
CREATE POLICY "lessons: tenant update"    ON public.lessons FOR UPDATE
  TO authenticated
  USING (
    course_id IN (
      SELECT id FROM public.courses WHERE institution_id = public.auth_institution_id()
    )
  );
CREATE POLICY "lessons: tenant delete"    ON public.lessons FOR DELETE
  TO authenticated
  USING (
    course_id IN (
      SELECT id FROM public.courses WHERE institution_id = public.auth_institution_id()
    )
  );

-- ── announcements ─────────────────────────────────────────────
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "announcements: tenant select" ON public.announcements FOR SELECT  TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "announcements: tenant insert" ON public.announcements FOR INSERT  TO authenticated WITH CHECK (institution_id = public.auth_institution_id());
CREATE POLICY "announcements: tenant update" ON public.announcements FOR UPDATE  TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "announcements: tenant delete" ON public.announcements FOR DELETE  TO authenticated USING (institution_id = public.auth_institution_id());

-- ── messages ──────────────────────────────────────────────────
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages: tenant select"   ON public.messages FOR SELECT    TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "messages: tenant insert"   ON public.messages FOR INSERT    TO authenticated WITH CHECK (institution_id = public.auth_institution_id());
CREATE POLICY "messages: tenant update"   ON public.messages FOR UPDATE    TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "messages: tenant delete"   ON public.messages FOR DELETE    TO authenticated USING (institution_id = public.auth_institution_id());

-- ── transport_routes ──────────────────────────────────────────
ALTER TABLE public.transport_routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "transport_routes: tenant select" ON public.transport_routes FOR SELECT  TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "transport_routes: tenant insert" ON public.transport_routes FOR INSERT  TO authenticated WITH CHECK (institution_id = public.auth_institution_id());
CREATE POLICY "transport_routes: tenant update" ON public.transport_routes FOR UPDATE  TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "transport_routes: tenant delete" ON public.transport_routes FOR DELETE  TO authenticated USING (institution_id = public.auth_institution_id());

-- ── student_routes ────────────────────────────────────────────
ALTER TABLE public.student_routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "student_routes: tenant select" ON public.student_routes FOR SELECT
  TO authenticated
  USING (
    route_id IN (
      SELECT id FROM public.transport_routes WHERE institution_id = public.auth_institution_id()
    )
  );
CREATE POLICY "student_routes: tenant insert" ON public.student_routes FOR INSERT
  TO authenticated
  WITH CHECK (
    route_id IN (
      SELECT id FROM public.transport_routes WHERE institution_id = public.auth_institution_id()
    )
  );
CREATE POLICY "student_routes: tenant update" ON public.student_routes FOR UPDATE
  TO authenticated
  USING (
    route_id IN (
      SELECT id FROM public.transport_routes WHERE institution_id = public.auth_institution_id()
    )
  );
CREATE POLICY "student_routes: tenant delete" ON public.student_routes FOR DELETE
  TO authenticated
  USING (
    route_id IN (
      SELECT id FROM public.transport_routes WHERE institution_id = public.auth_institution_id()
    )
  );

-- ── admissions ────────────────────────────────────────────────
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admissions: tenant select"  ON public.admissions FOR SELECT  TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "admissions: tenant insert"  ON public.admissions FOR INSERT  TO authenticated WITH CHECK (institution_id = public.auth_institution_id());
CREATE POLICY "admissions: tenant update"  ON public.admissions FOR UPDATE  TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "admissions: tenant delete"  ON public.admissions FOR DELETE  TO authenticated USING (institution_id = public.auth_institution_id());

-- ── activity_log ──────────────────────────────────────────────
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity_log: tenant select" ON public.activity_log FOR SELECT  TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "activity_log: tenant insert" ON public.activity_log FOR INSERT  TO authenticated WITH CHECK (institution_id = public.auth_institution_id());
CREATE POLICY "activity_log: tenant update" ON public.activity_log FOR UPDATE  TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "activity_log: tenant delete" ON public.activity_log FOR DELETE  TO authenticated USING (institution_id = public.auth_institution_id());

-- ── feature_usage_events ──────────────────────────────────────
ALTER TABLE public.feature_usage_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "feature_usage_events: tenant select" ON public.feature_usage_events FOR SELECT TO authenticated USING (institution_id = public.auth_institution_id());
CREATE POLICY "feature_usage_events: tenant insert" ON public.feature_usage_events FOR INSERT TO authenticated WITH CHECK (institution_id = public.auth_institution_id());

-- ============================================================
-- ROLE-AWARE RLS OVERRIDES
-- Keep tenant-wide reads, but restrict writes by account role.
-- These drops make the schema safe to re-run as a migration.
-- ============================================================

DROP POLICY IF EXISTS "user_profiles: safe own row insert" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles: safe own row update" ON public.user_profiles;
DROP POLICY IF EXISTS "students: operations insert" ON public.students;
DROP POLICY IF EXISTS "students: operations update" ON public.students;
DROP POLICY IF EXISTS "students: operations delete" ON public.students;
DROP POLICY IF EXISTS "teachers: tenant admin insert" ON public.teachers;
DROP POLICY IF EXISTS "teachers: tenant admin update" ON public.teachers;
DROP POLICY IF EXISTS "teachers: tenant admin delete" ON public.teachers;
DROP POLICY IF EXISTS "classes: academics insert" ON public.classes;
DROP POLICY IF EXISTS "classes: academics update" ON public.classes;
DROP POLICY IF EXISTS "classes: tenant admin delete" ON public.classes;
DROP POLICY IF EXISTS "attendance: academics insert" ON public.attendance;
DROP POLICY IF EXISTS "attendance: academics update" ON public.attendance;
DROP POLICY IF EXISTS "attendance: tenant admin delete" ON public.attendance;
DROP POLICY IF EXISTS "fee_structures: finance insert" ON public.fee_structures;
DROP POLICY IF EXISTS "fee_structures: finance update" ON public.fee_structures;
DROP POLICY IF EXISTS "fee_structures: finance delete" ON public.fee_structures;
DROP POLICY IF EXISTS "fee_payments: finance insert" ON public.fee_payments;
DROP POLICY IF EXISTS "fee_payments: finance update" ON public.fee_payments;
DROP POLICY IF EXISTS "fee_payments: finance delete" ON public.fee_payments;
DROP POLICY IF EXISTS "exams: academics insert" ON public.exams;
DROP POLICY IF EXISTS "exams: academics update" ON public.exams;
DROP POLICY IF EXISTS "exams: tenant admin delete" ON public.exams;
DROP POLICY IF EXISTS "exam_results: academics insert" ON public.exam_results;
DROP POLICY IF EXISTS "exam_results: academics update" ON public.exam_results;
DROP POLICY IF EXISTS "exam_results: tenant admin delete" ON public.exam_results;
DROP POLICY IF EXISTS "courses: academics insert" ON public.courses;
DROP POLICY IF EXISTS "courses: academics update" ON public.courses;
DROP POLICY IF EXISTS "courses: tenant admin delete" ON public.courses;
DROP POLICY IF EXISTS "lessons: academics insert" ON public.lessons;
DROP POLICY IF EXISTS "lessons: academics update" ON public.lessons;
DROP POLICY IF EXISTS "lessons: tenant admin delete" ON public.lessons;
DROP POLICY IF EXISTS "announcements: staff insert" ON public.announcements;
DROP POLICY IF EXISTS "announcements: staff update" ON public.announcements;
DROP POLICY IF EXISTS "announcements: staff delete" ON public.announcements;
DROP POLICY IF EXISTS "transport_routes: operations insert" ON public.transport_routes;
DROP POLICY IF EXISTS "transport_routes: operations update" ON public.transport_routes;
DROP POLICY IF EXISTS "transport_routes: operations delete" ON public.transport_routes;
DROP POLICY IF EXISTS "student_routes: operations insert" ON public.student_routes;
DROP POLICY IF EXISTS "student_routes: operations update" ON public.student_routes;
DROP POLICY IF EXISTS "student_routes: operations delete" ON public.student_routes;
DROP POLICY IF EXISTS "admissions: operations insert" ON public.admissions;
DROP POLICY IF EXISTS "admissions: operations update" ON public.admissions;
DROP POLICY IF EXISTS "admissions: operations delete" ON public.admissions;
DROP POLICY IF EXISTS "activity_log: tenant admin update" ON public.activity_log;
DROP POLICY IF EXISTS "activity_log: tenant admin delete" ON public.activity_log;

DROP POLICY IF EXISTS "institutions: tenant admin update" ON public.institutions;
CREATE POLICY "institutions: tenant admin update"
  ON public.institutions
  FOR UPDATE
  TO authenticated
  USING (id = public.auth_institution_id() AND public.auth_is_tenant_admin())
  WITH CHECK (id = public.auth_institution_id() AND public.auth_is_tenant_admin());

DROP POLICY IF EXISTS "user_profiles: own row insert" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles: own row update" ON public.user_profiles;
CREATE POLICY "user_profiles: safe own row insert"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND COALESCE(role, 'student') <> 'super_admin'
  );
CREATE POLICY "user_profiles: safe own row update"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    AND role = public.auth_role()
    AND COALESCE(institution_id, '00000000-0000-0000-0000-000000000000'::uuid)
      = COALESCE(public.auth_institution_id(), '00000000-0000-0000-0000-000000000000'::uuid)
    AND is_active = true
  );

DROP POLICY IF EXISTS "students: tenant insert" ON public.students;
DROP POLICY IF EXISTS "students: tenant update" ON public.students;
DROP POLICY IF EXISTS "students: tenant delete" ON public.students;
CREATE POLICY "students: operations insert" ON public.students FOR INSERT TO authenticated
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_can_write_operations());
CREATE POLICY "students: operations update" ON public.students FOR UPDATE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_can_write_operations())
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_can_write_operations());
CREATE POLICY "students: operations delete" ON public.students FOR DELETE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_can_write_operations());

DROP POLICY IF EXISTS "teachers: tenant insert" ON public.teachers;
DROP POLICY IF EXISTS "teachers: tenant update" ON public.teachers;
DROP POLICY IF EXISTS "teachers: tenant delete" ON public.teachers;
CREATE POLICY "teachers: tenant admin insert" ON public.teachers FOR INSERT TO authenticated
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_is_tenant_admin());
CREATE POLICY "teachers: tenant admin update" ON public.teachers FOR UPDATE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_is_tenant_admin())
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_is_tenant_admin());
CREATE POLICY "teachers: tenant admin delete" ON public.teachers FOR DELETE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_is_tenant_admin());

DROP POLICY IF EXISTS "classes: tenant insert" ON public.classes;
DROP POLICY IF EXISTS "classes: tenant update" ON public.classes;
DROP POLICY IF EXISTS "classes: tenant delete" ON public.classes;
CREATE POLICY "classes: academics insert" ON public.classes FOR INSERT TO authenticated
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_can_write_academics());
CREATE POLICY "classes: academics update" ON public.classes FOR UPDATE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_can_write_academics())
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_can_write_academics());
CREATE POLICY "classes: tenant admin delete" ON public.classes FOR DELETE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_is_tenant_admin());

DROP POLICY IF EXISTS "attendance: tenant insert" ON public.attendance;
DROP POLICY IF EXISTS "attendance: tenant update" ON public.attendance;
DROP POLICY IF EXISTS "attendance: tenant delete" ON public.attendance;
CREATE POLICY "attendance: academics insert" ON public.attendance FOR INSERT TO authenticated
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_can_write_academics());
CREATE POLICY "attendance: academics update" ON public.attendance FOR UPDATE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_can_write_academics())
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_can_write_academics());
CREATE POLICY "attendance: tenant admin delete" ON public.attendance FOR DELETE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_is_tenant_admin());

DROP POLICY IF EXISTS "fee_structures: tenant insert" ON public.fee_structures;
DROP POLICY IF EXISTS "fee_structures: tenant update" ON public.fee_structures;
DROP POLICY IF EXISTS "fee_structures: tenant delete" ON public.fee_structures;
CREATE POLICY "fee_structures: finance insert" ON public.fee_structures FOR INSERT TO authenticated
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_can_write_finance());
CREATE POLICY "fee_structures: finance update" ON public.fee_structures FOR UPDATE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_can_write_finance())
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_can_write_finance());
CREATE POLICY "fee_structures: finance delete" ON public.fee_structures FOR DELETE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_can_write_finance());

DROP POLICY IF EXISTS "fee_payments: tenant insert" ON public.fee_payments;
DROP POLICY IF EXISTS "fee_payments: tenant update" ON public.fee_payments;
DROP POLICY IF EXISTS "fee_payments: tenant delete" ON public.fee_payments;
CREATE POLICY "fee_payments: finance insert" ON public.fee_payments FOR INSERT TO authenticated
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_can_write_finance());
CREATE POLICY "fee_payments: finance update" ON public.fee_payments FOR UPDATE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_can_write_finance())
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_can_write_finance());
CREATE POLICY "fee_payments: finance delete" ON public.fee_payments FOR DELETE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_can_write_finance());

DROP POLICY IF EXISTS "exams: tenant insert" ON public.exams;
DROP POLICY IF EXISTS "exams: tenant update" ON public.exams;
DROP POLICY IF EXISTS "exams: tenant delete" ON public.exams;
CREATE POLICY "exams: academics insert" ON public.exams FOR INSERT TO authenticated
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_can_write_academics());
CREATE POLICY "exams: academics update" ON public.exams FOR UPDATE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_can_write_academics())
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_can_write_academics());
CREATE POLICY "exams: tenant admin delete" ON public.exams FOR DELETE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_is_tenant_admin());

DROP POLICY IF EXISTS "exam_results: tenant insert" ON public.exam_results;
DROP POLICY IF EXISTS "exam_results: tenant update" ON public.exam_results;
DROP POLICY IF EXISTS "exam_results: tenant delete" ON public.exam_results;
CREATE POLICY "exam_results: academics insert" ON public.exam_results FOR INSERT TO authenticated
  WITH CHECK (
    public.auth_can_write_academics()
    AND exam_id IN (SELECT id FROM public.exams WHERE institution_id = public.auth_institution_id())
  );
CREATE POLICY "exam_results: academics update" ON public.exam_results FOR UPDATE TO authenticated
  USING (
    public.auth_can_write_academics()
    AND exam_id IN (SELECT id FROM public.exams WHERE institution_id = public.auth_institution_id())
  )
  WITH CHECK (
    public.auth_can_write_academics()
    AND exam_id IN (SELECT id FROM public.exams WHERE institution_id = public.auth_institution_id())
  );
CREATE POLICY "exam_results: tenant admin delete" ON public.exam_results FOR DELETE TO authenticated
  USING (
    public.auth_is_tenant_admin()
    AND exam_id IN (SELECT id FROM public.exams WHERE institution_id = public.auth_institution_id())
  );

DROP POLICY IF EXISTS "courses: tenant insert" ON public.courses;
DROP POLICY IF EXISTS "courses: tenant update" ON public.courses;
DROP POLICY IF EXISTS "courses: tenant delete" ON public.courses;
CREATE POLICY "courses: academics insert" ON public.courses FOR INSERT TO authenticated
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_can_write_academics());
CREATE POLICY "courses: academics update" ON public.courses FOR UPDATE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_can_write_academics())
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_can_write_academics());
CREATE POLICY "courses: tenant admin delete" ON public.courses FOR DELETE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_is_tenant_admin());

DROP POLICY IF EXISTS "lessons: tenant insert" ON public.lessons;
DROP POLICY IF EXISTS "lessons: tenant update" ON public.lessons;
DROP POLICY IF EXISTS "lessons: tenant delete" ON public.lessons;
CREATE POLICY "lessons: academics insert" ON public.lessons FOR INSERT TO authenticated
  WITH CHECK (
    public.auth_can_write_academics()
    AND course_id IN (SELECT id FROM public.courses WHERE institution_id = public.auth_institution_id())
  );
CREATE POLICY "lessons: academics update" ON public.lessons FOR UPDATE TO authenticated
  USING (
    public.auth_can_write_academics()
    AND course_id IN (SELECT id FROM public.courses WHERE institution_id = public.auth_institution_id())
  )
  WITH CHECK (
    public.auth_can_write_academics()
    AND course_id IN (SELECT id FROM public.courses WHERE institution_id = public.auth_institution_id())
  );
CREATE POLICY "lessons: tenant admin delete" ON public.lessons FOR DELETE TO authenticated
  USING (
    public.auth_is_tenant_admin()
    AND course_id IN (SELECT id FROM public.courses WHERE institution_id = public.auth_institution_id())
  );

DROP POLICY IF EXISTS "announcements: tenant insert" ON public.announcements;
DROP POLICY IF EXISTS "announcements: tenant update" ON public.announcements;
DROP POLICY IF EXISTS "announcements: tenant delete" ON public.announcements;
CREATE POLICY "announcements: staff insert" ON public.announcements FOR INSERT TO authenticated
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_has_any_role(ARRAY['institution_admin', 'principal', 'teacher', 'staff']));
CREATE POLICY "announcements: staff update" ON public.announcements FOR UPDATE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_has_any_role(ARRAY['institution_admin', 'principal', 'teacher', 'staff']))
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_has_any_role(ARRAY['institution_admin', 'principal', 'teacher', 'staff']));
CREATE POLICY "announcements: staff delete" ON public.announcements FOR DELETE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_has_any_role(ARRAY['institution_admin', 'principal', 'teacher', 'staff']));

DROP POLICY IF EXISTS "transport_routes: tenant insert" ON public.transport_routes;
DROP POLICY IF EXISTS "transport_routes: tenant update" ON public.transport_routes;
DROP POLICY IF EXISTS "transport_routes: tenant delete" ON public.transport_routes;
CREATE POLICY "transport_routes: operations insert" ON public.transport_routes FOR INSERT TO authenticated
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_can_write_operations());
CREATE POLICY "transport_routes: operations update" ON public.transport_routes FOR UPDATE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_can_write_operations())
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_can_write_operations());
CREATE POLICY "transport_routes: operations delete" ON public.transport_routes FOR DELETE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_can_write_operations());

DROP POLICY IF EXISTS "student_routes: tenant insert" ON public.student_routes;
DROP POLICY IF EXISTS "student_routes: tenant update" ON public.student_routes;
DROP POLICY IF EXISTS "student_routes: tenant delete" ON public.student_routes;
CREATE POLICY "student_routes: operations insert" ON public.student_routes FOR INSERT TO authenticated
  WITH CHECK (
    public.auth_can_write_operations()
    AND route_id IN (SELECT id FROM public.transport_routes WHERE institution_id = public.auth_institution_id())
  );
CREATE POLICY "student_routes: operations update" ON public.student_routes FOR UPDATE TO authenticated
  USING (
    public.auth_can_write_operations()
    AND route_id IN (SELECT id FROM public.transport_routes WHERE institution_id = public.auth_institution_id())
  )
  WITH CHECK (
    public.auth_can_write_operations()
    AND route_id IN (SELECT id FROM public.transport_routes WHERE institution_id = public.auth_institution_id())
  );
CREATE POLICY "student_routes: operations delete" ON public.student_routes FOR DELETE TO authenticated
  USING (
    public.auth_can_write_operations()
    AND route_id IN (SELECT id FROM public.transport_routes WHERE institution_id = public.auth_institution_id())
  );

DROP POLICY IF EXISTS "admissions: tenant insert" ON public.admissions;
DROP POLICY IF EXISTS "admissions: tenant update" ON public.admissions;
DROP POLICY IF EXISTS "admissions: tenant delete" ON public.admissions;
CREATE POLICY "admissions: operations insert" ON public.admissions FOR INSERT TO authenticated
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_can_write_operations());
CREATE POLICY "admissions: operations update" ON public.admissions FOR UPDATE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_can_write_operations())
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_can_write_operations());
CREATE POLICY "admissions: operations delete" ON public.admissions FOR DELETE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_can_write_operations());

DROP POLICY IF EXISTS "activity_log: tenant update" ON public.activity_log;
DROP POLICY IF EXISTS "activity_log: tenant delete" ON public.activity_log;
CREATE POLICY "activity_log: tenant admin update" ON public.activity_log FOR UPDATE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_is_tenant_admin())
  WITH CHECK (institution_id = public.auth_institution_id() AND public.auth_is_tenant_admin());
CREATE POLICY "activity_log: tenant admin delete" ON public.activity_log FOR DELETE TO authenticated
  USING (institution_id = public.auth_institution_id() AND public.auth_is_tenant_admin());

-- ============================================================
-- TRIGGER: auto-create user_profiles row after auth.users insert
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', '')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop trigger first in case it already exists (idempotent migration)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
