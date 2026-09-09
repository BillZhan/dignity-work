// scripts/generate-d1-seed.mjs
// 把 data/companies.json 转成 D1 (SQLite) 兼容的 INSERT 语句
// 输出到 supabase/d1-seed.sql

import fs from "fs";

const data = JSON.parse(fs.readFileSync("data/companies.json", "utf-8"));

function esc(v) {
  if (v === null || v === undefined) return "NULL";
  return "'" + String(v).replace(/'/g, "''") + "'";
}

function b(b) {
  return b ? 1 : 0;
}

function ms(iso) {
  if (!iso) return "NULL";
  return new Date(iso).getTime();
}

let sql = "";
for (const c of data) {
  const createdAt = ms(c.created_at);
  const updatedAt = ms(c.updated_at);
  sql += `INSERT INTO companies (id, slug, name, logo, cover_image, description, industry, products, website, status, support_count, created_at, updated_at) VALUES (${esc(c.id)}, ${esc(c.slug)}, ${esc(c.name)}, ${esc(c.logo)}, ${esc(c.cover_image)}, ${esc(c.description)}, ${esc(c.industry)}, ${esc(c.products)}, ${esc(c.website)}, ${esc(c.status)}, ${c.support_count || 0}, ${createdAt}, ${updatedAt});\n`;

  if (c.rights) {
    const r = c.rights;
    sql += `INSERT INTO labor_rights (id, company_id, social_security, two_day_weekend, overtime_pay, labor_contract, employee_benefits, occupational_safety, verification_level, evidence, updated_at) VALUES ('lr-${c.id}', ${esc(c.id)}, ${b(r.social_security)}, ${b(r.two_day_weekend)}, ${b(r.overtime_pay)}, ${b(r.labor_contract)}, ${b(r.employee_benefits)}, ${b(r.occupational_safety)}, ${r.verification_level || 0}, ${esc(r.evidence)}, ${updatedAt});\n`;
  }
}

fs.writeFileSync("supabase/d1-seed.sql", sql);
console.log(`已生成 ${data.length} 家公司 + labor_rights 的 INSERT 语句 → supabase/d1-seed.sql`);