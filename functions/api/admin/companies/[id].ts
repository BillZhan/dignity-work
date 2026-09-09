// /api/admin/companies/:id
// GET    : 单条详情
// PUT    : 更新（含 rights）
// DELETE : 删除

import type { D1Database } from "@cloudflare/workers-types";

interface Env { DB: D1Database }

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

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const id = (params as any).id as string;
  const row = await env.DB.prepare(`
    SELECT c.*,
      r.social_security, r.two_day_weekend, r.overtime_pay,
      r.labor_contract, r.employee_benefits, r.occupational_safety,
      r.verification_level, r.evidence
    FROM companies c
    LEFT JOIN labor_rights r ON r.company_id = c.id
    WHERE c.id = ?
  `).bind(id).first();
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(attachRights(row));
};

export const onRequestPut: PagesFunction<Env> = async ({ params, request, env }) => {
  const id = (params as any).id as string;
  let body: any;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  const now = Date.now();
  const rights = body.rights || {};

  const updates: any[] = [
    env.DB.prepare(`
      UPDATE companies SET
        slug = ?, name = ?, logo = ?, cover_image = ?, description = ?,
        industry = ?, products = ?, website = ?, status = ?,
        updated_at = ?
      WHERE id = ?
    `).bind(
      body.slug, body.name,
      body.logo ?? null, body.cover_image ?? null,
      body.description ?? null, body.industry ?? null,
      body.products ?? null, body.website ?? null,
      body.status ?? "published", now, id
    ),
  ];

  if (Object.keys(rights).length > 0) {
    updates.push(env.DB.prepare(`
      UPDATE labor_rights SET
        social_security = ?, two_day_weekend = ?, overtime_pay = ?,
        labor_contract = ?, employee_benefits = ?, occupational_safety = ?,
        verification_level = ?, evidence = ?, updated_at = ?
      WHERE company_id = ?
    `).bind(
      rights.social_security ? 1 : 0,
      rights.two_day_weekend ? 1 : 0,
      rights.overtime_pay ? 1 : 0,
      rights.labor_contract ? 1 : 0,
      rights.employee_benefits ? 1 : 0,
      rights.occupational_safety ? 1 : 0,
      rights.verification_level ?? 0,
      rights.evidence ?? null,
      now, id
    ));
  }

  await env.DB.batch(updates);
  return Response.json({ ok: true });
};

export const onRequestDelete: PagesFunction<Env> = async ({ params, env }) => {
  const id = (params as any).id as string;
  await env.DB.prepare(`DELETE FROM companies WHERE id = ?`).bind(id).run();
  return Response.json({ ok: true });
};