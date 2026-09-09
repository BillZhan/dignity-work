-- ============================================================
--  Dignity Work — 让每一份劳动，都有尊严
--  Cloudflare D1 (SQLite) Schema
--  注意：鉴权移到 Pages Functions 应用层（D1 没有 RLS）
-- ============================================================

PRAGMA foreign_keys = ON;

-- ------------------------------------------------------------
-- 1. companies : 企业表
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS companies (
  id              TEXT PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  logo            TEXT,
  cover_image     TEXT,
  description     TEXT,
  industry        TEXT,
  products        TEXT,
  website         TEXT,
  status          TEXT DEFAULT 'published'
                  CHECK (status IN ('draft','published','hidden')),
  support_count   INTEGER DEFAULT 0,
  created_at      INTEGER,
  updated_at      INTEGER
);
CREATE INDEX IF NOT EXISTS idx_companies_status   ON companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);

-- ------------------------------------------------------------
-- 2. labor_rights : 劳动者权益标签
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS labor_rights (
  id                    TEXT PRIMARY KEY,
  company_id            TEXT UNIQUE NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  social_security       INTEGER DEFAULT 0,
  two_day_weekend       INTEGER DEFAULT 0,
  overtime_pay          INTEGER DEFAULT 0,
  labor_contract        INTEGER DEFAULT 0,
  employee_benefits     INTEGER DEFAULT 0,
  occupational_safety   INTEGER DEFAULT 0,
  verification_level    INTEGER DEFAULT 0
                        CHECK (verification_level BETWEEN 0 AND 4),
  evidence              TEXT,
  updated_at            INTEGER
);

-- ------------------------------------------------------------
-- 3. submissions : 用户推荐/提交的企业
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS submissions (
  id              TEXT PRIMARY KEY,
  company_name    TEXT NOT NULL,
  products        TEXT,
  reason          TEXT,
  website         TEXT,
  image           TEXT,
  status          TEXT DEFAULT 'pending'
                  CHECK (status IN ('pending','approved','rejected')),
  created_at      INTEGER
);

-- ------------------------------------------------------------
-- 4. supports : 用户支持记录（去重靠 visitor_id）
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS supports (
  id              TEXT PRIMARY KEY,
  company_id      TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  visitor_id      TEXT NOT NULL,
  created_at      INTEGER,
  UNIQUE (company_id, visitor_id)
);
CREATE INDEX IF NOT EXISTS idx_supports_company ON supports(company_id);

-- ------------------------------------------------------------
-- 5. reports : 用户举报 / 纠错
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reports (
  id              TEXT PRIMARY KEY,
  company_id      TEXT REFERENCES companies(id) ON DELETE SET NULL,
  reason          TEXT NOT NULL,
  description     TEXT,
  status          TEXT DEFAULT 'pending'
                  CHECK (status IN ('pending','resolved','ignored')),
  created_at      INTEGER
);