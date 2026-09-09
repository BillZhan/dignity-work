// /api/admin/companies
// GET  : 列出全部企业（所有状态，含未发布）
// POST : 新增企业（含 labor_rights）

import type { D1Database } from "@cloudflare/workers-types";

interface Env { DB: D1Database }

function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function attachRights(row: any) {
  const { social_security, two_day_weekend, overtime_pay,
          labor_contract, employee_benefits, occupational_safety,
          verification_level, evidence, ...rest } = row;
  return {
    ...rest,
    rights: {
      social_security: !!social_security,
      two_day_weekend: !!two_day_weekend,
      overtime_pay: !!overtime_pay,
      labor_contract: !!labor_contract,
      employee_benefits: !!employee_benefits,
      occupational_safety: !!occupational_safety,
      verification_level: verification_level ?? 0,
      evidence: evidence ?? "",
    },
  };
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare(`
    SELECT
      c.*,
      r.social_security, r.two_day_weekend, r.overtime_pay,
      r.labor_contract, r.employee_benefits, r.occupational_safety,
      r.verification_level, r.evidence
    FROM companies c
    LEFT JOIN labor_rights r ON r.company_id = c.id
    ORDER BY c.created_at DESC
  `).all();
  return Response.json((results || []).map(attachRights));
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: any;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (!body.slug || !body.name) {
    return Response.json({ error: "slug and name required" }, { status: 400 });
  }

  const id = uuid();
  const now = Date.now();
  const rights = body.rights || {};

  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO companies (id, slug, name, logo, cover_image, description, industry, products, website, status, support_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    `).bind(
      id, body.slug, body.name,
      body.logo || null, body.cover_image || null,
      body.description || null, body.industry || null,
      body.products || null, body.website || null,
      body.status || "published",
      now, now
    ),
    env.DB.prepare(`
      INSERT INTO labor_rights (id, company_id, social_security, two_day_weekend, overtime_pay, labor_contract, employee_benefits, occupational_safety, verification_level, evidence, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      "lr-" + id, id,
      rights.social_security ? 1 : 0,
      rights.two_day_weekend ? 1 : 0,
      rights.overtime_pay ? 1 : 0,
      rights.labor_contract ? 1 : 0,
      rights.employee_benefits ? 1 : 0,
      rights.occupational_safety ? 1 : 0,
      rights.verification_level ?? 0,
      rights.evidence || null,
      now
    ),
  ]);

  return Response.json({ ok: true, id });
};