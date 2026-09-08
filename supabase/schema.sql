-- ============================================================
--  Dignity Work — 让每一份劳动，都有尊严
--  Supabase / PostgreSQL Schema (MVP)
--  在 Supabase SQL Editor 中执行即可建表 + RLS 策略
-- ============================================================

-- 启用 UUID 扩展
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- 1. companies : 企业表
-- ------------------------------------------------------------
create table if not exists public.companies (
  id              uuid primary key default uuid_generate_v4(),
  slug            text unique not null,
  name            text not null,
  logo            text,                       -- 远程 URL 或 Storage path
  cover_image     text,                       -- 详情页大图
  description     text,                       -- 企业介绍
  industry        text,                       -- 行业
  products        text,                       -- 主营产品
  website         text,                       -- 官方网址
  status          text default 'published'    -- draft | published | hidden
                  check (status in ('draft','published','hidden')),
  support_count   integer default 0,          -- 冗余统计，避免 join
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index if not exists idx_companies_status on public.companies(status);
create index if not exists idx_companies_industry on public.companies(industry);

-- ------------------------------------------------------------
-- 2. labor_rights : 劳动者权益标签
-- ------------------------------------------------------------
create table if not exists public.labor_rights (
  id                    uuid primary key default uuid_generate_v4(),
  company_id            uuid unique references public.companies(id) on delete cascade,
  social_security       boolean default false,   -- 社会保险
  two_day_weekend       boolean default false,   -- 双休/标准工时
  overtime_pay          boolean default false,   -- 加班费
  labor_contract        boolean default false,   -- 劳动合同
  employee_benefits     boolean default false,   -- 员工福利
  occupational_safety   boolean default false,   -- 职业安全
  verification_level    integer default 0
                        check (verification_level between 0 and 4),
  evidence              text,                    -- 证据 / 来源 / 链接 / 备注
  updated_at            timestamptz default now()
);

-- ------------------------------------------------------------
-- 3. submissions : 用户推荐/提交的企业
-- ------------------------------------------------------------
create table if not exists public.submissions (
  id              uuid primary key default uuid_generate_v4(),
  company_name    text not null,
  products        text,
  reason          text,
  website         text,
  image           text,
  status          text default 'pending'
                  check (status in ('pending','approved','rejected')),
  created_at      timestamptz default now()
);

-- ------------------------------------------------------------
-- 4. supports : 用户支持记录（去重靠 visitor_id）
-- ------------------------------------------------------------
create table if not exists public.supports (
  id              uuid primary key default uuid_generate_v4(),
  company_id      uuid not null references public.companies(id) on delete cascade,
  visitor_id      text not null,         -- 浏览器 fingerprint / IP hash
  created_at      timestamptz default now(),
  unique (company_id, visitor_id)
);
create index if not exists idx_supports_company on public.supports(company_id);

-- ------------------------------------------------------------
-- 5. reports : 用户举报 / 纠错
-- ------------------------------------------------------------
create table if not exists public.reports (
  id              uuid primary key default uuid_generate_v4(),
  company_id      uuid references public.companies(id) on delete set null,
  reason          text not null,         -- 信息错误 / 标签错误 / 情况变化 / 虚假信息
  description     text,
  status          text default 'pending'
                  check (status in ('pending','resolved','ignored')),
  created_at      timestamptz default now()
);

-- ------------------------------------------------------------
-- 6. admin_users : 后台管理员
-- ------------------------------------------------------------
create table if not exists public.admin_users (
  id              uuid primary key default uuid_generate_v4(),
  email           text unique,
  role            text default 'admin',
  created_at      timestamptz default now()
);

-- ============================================================
-- Row Level Security (RLS)
--  默认禁止所有写，匿名仅能读取 published 内容；
--  写入由 service_role 在后台页面 / Edge Function 完成。
-- ============================================================
alter table public.companies       enable row level security;
alter table public.labor_rights    enable row level security;
alter table public.submissions     enable row level security;
alter table public.supports        enable row level security;
alter table public.reports         enable row level security;
alter table public.admin_users     enable row level security;

-- 公共读：已发布的企业 + 其权益
drop policy if exists "public read companies" on public.companies;
create policy "public read companies"
  on public.companies for select
  using (status = 'published');

drop policy if exists "public read labor_rights" on public.labor_rights;
create policy "public read labor_rights"
  on public.labor_rights for select
  using (exists (
    select 1 from public.companies c
    where c.id = labor_rights.company_id and c.status = 'published'
  ));

-- 公共写：用户可以提交 submissions / supports / reports
drop policy if exists "anon insert submissions" on public.submissions;
create policy "anon insert submissions"
  on public.submissions for insert
  with check (true);

drop policy if exists "anon insert supports" on public.supports;
create policy "anon insert supports"
  on public.supports for insert
  with check (true);

drop policy if exists "anon insert reports" on public.reports;
create policy "anon insert reports"
  on public.reports for insert
  with check (true);

-- 支持后聚合：每次插入支持，companies.support_count 自增
create or replace function public.bump_support_count()
returns trigger language plpgsql as $$
begin
  update public.companies
     set support_count = support_count + 1
   where id = new.company_id;
  return new;
end $$;

drop trigger if exists trg_bump_support_count on public.supports;
create trigger trg_bump_support_count
  after insert on public.supports
  for each row execute function public.bump_support_count();