// GET /api/companies/:slug
// 公开接口：按 slug 查单家企业详情

import type { D1Database } from "@cloudflare/workers-types";

interface Env { DB: D1Database }

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const slug = (params as any).slug as string;
  const row = await env.DB.prepare(`
    SELECT
      c.id, c.slug, c.name, c.logo, c.cover_image, c.description,
      c.industry, c.products, c.website, c.status, c.support_count,
      c.created_at, c.updated_at,
      r.social_security, r.two_day_weekend, r.overtime_pay,
      r.labor_contract, r.employee_benefits, r.occupational_safety,
      r.verification_level, r.evidence
    FROM companies c
    LEFT JOIN labor_rights r ON r.company_id = c.id
    WHERE c.slug = ? AND c.status = 'published'
  `).bind(slug).first();

  if (!row) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404, headers: { "Content-Type": "application/json" },
    });
  }

  const { social_security, two_day_weekend, overtime_pay,
          labor_contract, employee_benefits, occupational_safety,
          verification_level, evidence, ...rest } = row as any;

  return Response.json({
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
  });
};