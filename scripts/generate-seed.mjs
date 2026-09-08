#!/usr/bin/env node
// 一次性脚本：从 data/companies.json 生成 Supabase seed.sql
// 运行: node scripts/generate-seed.mjs
import { readFileSync, writeFileSync } from "node:fs";

const companies = JSON.parse(readFileSync("data/companies.json", "utf8"));

const escape = (s) => (s == null ? "NULL" : `'${String(s).replace(/'/g, "''")}'`);
const bool = (v) => (v ? "true" : "false");

const lines = [];
lines.push("-- ============================================================");
lines.push("--  自动生成：seed.sql — 26 家示例企业");
lines.push("--  在 Supabase SQL Editor 中先跑 schema.sql，再跑这个文件");
lines.push("--  数据来源: data/companies.json（由 lib/mock-data.ts 引用）");
lines.push("-- ============================================================");
lines.push("");

for (const c of companies) {
  const r = c.rights;
  const compId = c.id;
  const rightsId = `lr-${c.id}`;

  lines.push(
    `insert into public.companies (id, slug, name, logo, cover_image, description, industry, products, website, status, support_count, created_at, updated_at) values (` +
      `'${compId}', ${escape(c.slug)}, ${escape(c.name)}, ${escape(c.logo)}, ${escape(c.cover_image)}, ` +
      `${escape(c.description)}, ${escape(c.industry)}, ${escape(c.products)}, ${escape(c.website)}, ` +
      `${escape(c.status)}, ${c.support_count}, '${c.created_at}', '${c.updated_at}');`
  );

  lines.push(
    `insert into public.labor_rights (id, company_id, social_security, two_day_weekend, overtime_pay, labor_contract, employee_benefits, occupational_safety, verification_level, evidence, updated_at) values (` +
      `'${rightsId}', '${compId}', ${bool(r.social_security)}, ${bool(r.two_day_weekend)}, ` +
      `${bool(r.overtime_pay)}, ${bool(r.labor_contract)}, ${bool(r.employee_benefits)}, ${bool(r.occupational_safety)}, ` +
      `${r.verification_level}, ${escape(r.evidence)}, '${c.updated_at}');`
  );
  lines.push("");
}

writeFileSync("supabase/seed.sql", lines.join("\n"), "utf8");
console.log(`✅ supabase/seed.sql 生成完成，共 ${companies.length} 家企业`);