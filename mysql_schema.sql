-- ============================================================
-- CyberMilo ERP — MySQL Schema (for Hostinger / any MySQL host)
-- Converted from supabase_schema.sql (PostgreSQL) on 2026-07-12
--
-- Requirements: MySQL 8.0.13+ or MariaDB 10.2+
--   (needed for DEFAULT (UUID()) expression defaults)
--
-- IMPORTANT differences from the Supabase version:
--   1. Supabase's built-in auth.users is replaced by the `users`
--      table below. Your backend must handle registration/login
--      (bcrypt password hashing + JWT sessions).
--   2. PostgreSQL Row Level Security does NOT exist in MySQL.
--      Tenant isolation MUST be enforced by the backend API:
--      every query must filter by institution_id.
--   3. Supabase Realtime does not exist. Use polling or
--      socket.io from the backend for live features.
--
-- Import on Hostinger: hPanel -> Databases -> phpMyAdmin ->
--   select your database -> Import -> choose this file.
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 0. users (replaces Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            CHAR(36)     NOT NULL DEFAULT (UUID()),
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified_at TIMESTAMP NULL,
  last_login_at TIMESTAMP    NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 1. institutions
-- ============================================================
CREATE TABLE IF NOT EXISTS institutions (
  id                     CHAR(36)     NOT NULL DEFAULT (UUID()),
  name                   VARCHAR(255) NOT NULL,
  type                   VARCHAR(50),
  address                TEXT,
  phone                  VARCHAR(30),
  email                  VARCHAR(255),
  logo_url               VARCHAR(500),
  subscription_plan      VARCHAR(50)  NOT NULL DEFAULT 'free',
  subscription_status    VARCHAR(50)  NOT NULL DEFAULT 'trialing',
  trial_ends_at          TIMESTAMP    NULL,
  current_period_ends_at TIMESTAMP    NULL,
  billing_email          VARCHAR(255),
  settings               JSON         NOT NULL DEFAULT (JSON_OBJECT()),
  created_at             TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. user_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id             CHAR(36)     NOT NULL DEFAULT (UUID()),
  user_id        CHAR(36)     NOT NULL,
  institution_id CHAR(36)     NULL,
  role           VARCHAR(50),
  first_name     VARCHAR(100),
  last_name      VARCHAR(100),
  phone          VARCHAR(30),
  avatar_url     VARCHAR(500),
  is_active      TINYINT(1)   NOT NULL DEFAULT 1,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_profiles_user_id (user_id),
  KEY idx_user_profiles_institution_id (institution_id),
  CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_profiles_institution FOREIGN KEY (institution_id) REFERENCES institutions (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. students
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
  id             CHAR(36)     NOT NULL DEFAULT (UUID()),
  institution_id CHAR(36)     NOT NULL,
  admission_no   VARCHAR(50),
  first_name     VARCHAR(100) NOT NULL,
  last_name      VARCHAR(100),
  email          VARCHAR(255),
  phone          VARCHAR(30),
  dob            DATE,
  gender         VARCHAR(20),
  address        TEXT,
  class_name     VARCHAR(50),
  section        VARCHAR(20),
  parent_name    VARCHAR(200),
  parent_phone   VARCHAR(30),
  parent_email   VARCHAR(255),
  status         VARCHAR(30)  NOT NULL DEFAULT 'active',
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_students_institution_id (institution_id),
  CONSTRAINT fk_students_institution FOREIGN KEY (institution_id) REFERENCES institutions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. teachers  (subjects: text[] -> JSON array)
-- ============================================================
CREATE TABLE IF NOT EXISTS teachers (
  id             CHAR(36)     NOT NULL DEFAULT (UUID()),
  institution_id CHAR(36)     NOT NULL,
  employee_id    VARCHAR(50),
  first_name     VARCHAR(100) NOT NULL,
  last_name      VARCHAR(100),
  email          VARCHAR(255),
  phone          VARCHAR(30),
  subjects       JSON         NULL,
  qualification  VARCHAR(255),
  status         VARCHAR(30)  NOT NULL DEFAULT 'active',
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_teachers_institution_id (institution_id),
  CONSTRAINT fk_teachers_institution FOREIGN KEY (institution_id) REFERENCES institutions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. classes
-- ============================================================
CREATE TABLE IF NOT EXISTS classes (
  id             CHAR(36)     NOT NULL DEFAULT (UUID()),
  institution_id CHAR(36)     NOT NULL,
  name           VARCHAR(100) NOT NULL,
  section        VARCHAR(20),
  teacher_id     CHAR(36)     NULL,
  capacity       INT,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_classes_institution_id (institution_id),
  CONSTRAINT fk_classes_institution FOREIGN KEY (institution_id) REFERENCES institutions (id) ON DELETE CASCADE,
  CONSTRAINT fk_classes_teacher FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. attendance
-- ============================================================
CREATE TABLE IF NOT EXISTS attendance (
  id             CHAR(36)    NOT NULL DEFAULT (UUID()),
  institution_id CHAR(36)    NOT NULL,
  student_id     CHAR(36)    NOT NULL,
  class_name     VARCHAR(50),
  date           DATE        NOT NULL,
  status         VARCHAR(20) NOT NULL,
  marked_by      CHAR(36)    NULL,
  created_at     TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_attendance_day (institution_id, student_id, date),
  KEY idx_attendance_institution_id (institution_id),
  KEY idx_attendance_student_id (student_id),
  KEY idx_attendance_date (date),
  CONSTRAINT chk_attendance_status CHECK (status IN ('present', 'absent', 'late')),
  CONSTRAINT fk_attendance_institution FOREIGN KEY (institution_id) REFERENCES institutions (id) ON DELETE CASCADE,
  CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
  CONSTRAINT fk_attendance_marker FOREIGN KEY (marked_by) REFERENCES user_profiles (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. fee_structures
-- ============================================================
CREATE TABLE IF NOT EXISTS fee_structures (
  id             CHAR(36)      NOT NULL DEFAULT (UUID()),
  institution_id CHAR(36)      NOT NULL,
  name           VARCHAR(255)  NOT NULL,
  amount         DECIMAL(12,2) NOT NULL DEFAULT 0,
  frequency      VARCHAR(30),
  class_name     VARCHAR(50),
  is_active      TINYINT(1)    NOT NULL DEFAULT 1,
  created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_fee_structures_institution_id (institution_id),
  CONSTRAINT fk_fee_structures_institution FOREIGN KEY (institution_id) REFERENCES institutions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. fee_payments
-- ============================================================
CREATE TABLE IF NOT EXISTS fee_payments (
  id             CHAR(36)      NOT NULL DEFAULT (UUID()),
  institution_id CHAR(36)      NOT NULL,
  student_id     CHAR(36)      NOT NULL,
  fee_type       VARCHAR(100),
  total_amount   DECIMAL(12,2) NOT NULL DEFAULT 0,
  paid_amount    DECIMAL(12,2) NOT NULL DEFAULT 0,
  due_date       DATE,
  payment_date   DATE,
  status         VARCHAR(30)   NOT NULL DEFAULT 'pending',
  receipt_no     VARCHAR(50),
  created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_fee_payments_institution_id (institution_id),
  KEY idx_fee_payments_student_id (student_id),
  CONSTRAINT fk_fee_payments_institution FOREIGN KEY (institution_id) REFERENCES institutions (id) ON DELETE CASCADE,
  CONSTRAINT fk_fee_payments_student FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. exams
-- ============================================================
CREATE TABLE IF NOT EXISTS exams (
  id             CHAR(36)     NOT NULL DEFAULT (UUID()),
  institution_id CHAR(36)     NOT NULL,
  title          VARCHAR(255) NOT NULL,
  subject        VARCHAR(100),
  class_name     VARCHAR(50),
  exam_date      DATE,
  total_marks    INT,
  pass_marks     INT,
  status         VARCHAR(30)  NOT NULL DEFAULT 'upcoming',
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_exams_institution_id (institution_id),
  CONSTRAINT fk_exams_institution FOREIGN KEY (institution_id) REFERENCES institutions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. exam_results
-- ============================================================
CREATE TABLE IF NOT EXISTS exam_results (
  id             CHAR(36)      NOT NULL DEFAULT (UUID()),
  exam_id        CHAR(36)      NOT NULL,
  student_id     CHAR(36)      NOT NULL,
  marks_obtained DECIMAL(8,2),
  grade          VARCHAR(10),
  remarks        TEXT,
  created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_exam_results_exam_id (exam_id),
  KEY idx_exam_results_student_id (student_id),
  CONSTRAINT fk_exam_results_exam FOREIGN KEY (exam_id) REFERENCES exams (id) ON DELETE CASCADE,
  CONSTRAINT fk_exam_results_student FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. courses
-- ============================================================
CREATE TABLE IF NOT EXISTS courses (
  id             CHAR(36)     NOT NULL DEFAULT (UUID()),
  institution_id CHAR(36)     NOT NULL,
  title          VARCHAR(255) NOT NULL,
  description    TEXT,
  subject        VARCHAR(100),
  class_name     VARCHAR(50),
  teacher_id     CHAR(36)     NULL,
  thumbnail_url  VARCHAR(500),
  is_published   TINYINT(1)   NOT NULL DEFAULT 0,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_courses_institution_id (institution_id),
  CONSTRAINT fk_courses_institution FOREIGN KEY (institution_id) REFERENCES institutions (id) ON DELETE CASCADE,
  CONSTRAINT fk_courses_teacher FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. lessons
-- ============================================================
CREATE TABLE IF NOT EXISTS lessons (
  id           CHAR(36)     NOT NULL DEFAULT (UUID()),
  course_id    CHAR(36)     NOT NULL,
  title        VARCHAR(255) NOT NULL,
  content      TEXT,
  video_url    VARCHAR(500),
  file_url     VARCHAR(500),
  lesson_order INT          NOT NULL DEFAULT 0,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_lessons_course_id (course_id),
  CONSTRAINT fk_lessons_course FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 13. announcements
-- ============================================================
CREATE TABLE IF NOT EXISTS announcements (
  id              CHAR(36)     NOT NULL DEFAULT (UUID()),
  institution_id  CHAR(36)     NOT NULL,
  title           VARCHAR(255) NOT NULL,
  content         TEXT,
  priority        VARCHAR(20)  NOT NULL DEFAULT 'normal',
  target_audience VARCHAR(30)  NOT NULL DEFAULT 'all',
  created_by      CHAR(36)     NULL,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_announcements_institution_id (institution_id),
  CONSTRAINT fk_announcements_institution FOREIGN KEY (institution_id) REFERENCES institutions (id) ON DELETE CASCADE,
  CONSTRAINT fk_announcements_creator FOREIGN KEY (created_by) REFERENCES user_profiles (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 14. messages
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id             CHAR(36)    NOT NULL DEFAULT (UUID()),
  institution_id CHAR(36)    NOT NULL,
  sender_id      CHAR(36)    NULL,
  recipient_id   CHAR(36)    NULL,
  subject        VARCHAR(255),
  body           TEXT,
  is_read        TINYINT(1)  NOT NULL DEFAULT 0,
  created_at     TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_messages_institution_id (institution_id),
  KEY idx_messages_recipient_id (recipient_id),
  CONSTRAINT fk_messages_institution FOREIGN KEY (institution_id) REFERENCES institutions (id) ON DELETE CASCADE,
  CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES user_profiles (id) ON DELETE SET NULL,
  CONSTRAINT fk_messages_recipient FOREIGN KEY (recipient_id) REFERENCES user_profiles (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 15. transport_routes  (stops: text[] -> JSON array)
-- ============================================================
CREATE TABLE IF NOT EXISTS transport_routes (
  id             CHAR(36)     NOT NULL DEFAULT (UUID()),
  institution_id CHAR(36)     NOT NULL,
  route_name     VARCHAR(255) NOT NULL,
  driver_name    VARCHAR(200),
  driver_phone   VARCHAR(30),
  vehicle_no     VARCHAR(50),
  capacity       INT,
  stops          JSON         NULL,
  is_active      TINYINT(1)   NOT NULL DEFAULT 1,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_transport_routes_institution_id (institution_id),
  CONSTRAINT fk_transport_routes_institution FOREIGN KEY (institution_id) REFERENCES institutions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 16. student_routes
-- ============================================================
CREATE TABLE IF NOT EXISTS student_routes (
  id          CHAR(36)     NOT NULL DEFAULT (UUID()),
  route_id    CHAR(36)     NOT NULL,
  student_id  CHAR(36)     NOT NULL,
  pickup_stop VARCHAR(255),
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_student_routes_route_id (route_id),
  KEY idx_student_routes_student_id (student_id),
  CONSTRAINT fk_student_routes_route FOREIGN KEY (route_id) REFERENCES transport_routes (id) ON DELETE CASCADE,
  CONSTRAINT fk_student_routes_student FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 17. admissions
-- ============================================================
CREATE TABLE IF NOT EXISTS admissions (
  id             CHAR(36)     NOT NULL DEFAULT (UUID()),
  institution_id CHAR(36)     NOT NULL,
  applicant_name VARCHAR(200) NOT NULL,
  email          VARCHAR(255),
  phone          VARCHAR(30),
  dob            DATE,
  class_applying VARCHAR(50),
  parent_name    VARCHAR(200),
  parent_phone   VARCHAR(30),
  address        TEXT,
  status         VARCHAR(30)  NOT NULL DEFAULT 'pending',
  remarks        TEXT,
  applied_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_admissions_institution_id (institution_id),
  CONSTRAINT fk_admissions_institution FOREIGN KEY (institution_id) REFERENCES institutions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 18. activity_log
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_log (
  id             CHAR(36)     NOT NULL DEFAULT (UUID()),
  institution_id CHAR(36)     NOT NULL,
  user_id        CHAR(36)     NULL,
  action         VARCHAR(100) NOT NULL,
  description    TEXT,
  entity_type    VARCHAR(50),
  entity_id      CHAR(36)     NULL,
  severity       VARCHAR(20)  NOT NULL DEFAULT 'info',
  ip_address     VARCHAR(45),
  user_agent     VARCHAR(500),
  metadata       JSON         NOT NULL DEFAULT (JSON_OBJECT()),
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_activity_log_institution_id (institution_id),
  KEY idx_activity_log_created_at (created_at DESC),
  KEY idx_activity_log_action (action),
  CONSTRAINT fk_activity_log_institution FOREIGN KEY (institution_id) REFERENCES institutions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 19. feature_usage_events
-- ============================================================
CREATE TABLE IF NOT EXISTS feature_usage_events (
  id             CHAR(36)     NOT NULL DEFAULT (UUID()),
  institution_id CHAR(36)     NOT NULL,
  user_id        CHAR(36)     NULL,
  feature_key    VARCHAR(100) NOT NULL,
  event_type     VARCHAR(50)  NOT NULL DEFAULT 'view',
  metadata       JSON         NOT NULL DEFAULT (JSON_OBJECT()),
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_feature_usage_institution_id (institution_id),
  KEY idx_feature_usage_feature_key (feature_key),
  KEY idx_feature_usage_created_at (created_at),
  CONSTRAINT fk_feature_usage_institution FOREIGN KEY (institution_id) REFERENCES institutions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 20. notifications (in-app notification center)
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id             CHAR(36)     NOT NULL DEFAULT (UUID()),
  institution_id CHAR(36)     NOT NULL,
  user_id        CHAR(36)     NOT NULL,
  title          VARCHAR(255) NOT NULL,
  body           TEXT,
  type           VARCHAR(30)  NOT NULL DEFAULT 'info',
  link           VARCHAR(500),
  read_at        TIMESTAMP    NULL,
  created_by     CHAR(36)     NULL,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notifications_user_created (user_id, created_at DESC),
  CONSTRAINT fk_notifications_institution FOREIGN KEY (institution_id) REFERENCES institutions (id) ON DELETE CASCADE,
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES user_profiles (id) ON DELETE CASCADE,
  CONSTRAINT fk_notifications_creator FOREIGN KEY (created_by) REFERENCES user_profiles (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- Post-import notes
-- ============================================================
-- 1. Create the first super admin (replace the hash with a real
--    bcrypt hash generated by your backend):
--
--    INSERT INTO users (id, email, password_hash)
--    VALUES (UUID(), 'admin@example.com', '$2b$10$REPLACE_WITH_BCRYPT_HASH');
--
--    INSERT INTO user_profiles (user_id, role, first_name, last_name)
--    SELECT id, 'super_admin', 'Platform', 'Owner' FROM users
--    WHERE email = 'admin@example.com';
--
-- 2. Tenant isolation: EVERY backend query must include
--    WHERE institution_id = ? — MySQL has no Row Level Security.
--
-- 3. text[] columns (teachers.subjects, transport_routes.stops)
--    are JSON arrays here, e.g. '["Math", "Physics"]'.
