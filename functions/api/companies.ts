// GET /api/companies
// 公开接口：列出已发布企业（可按行业/搜索/权益筛选）

import type { D1Database } from "@cloudflare/workers-types";

interface Env {
  DB: D1Database;
}

const BASE_SELECT = `
  SELECT
    c.id, c.slug, c.name, c.logo, c.cover_image, c.description,
    c.industry, c.products, c.website, c.status, c.support_count,
    c.created_at, c.updated_at,
    r.social_security, r.two_day_weekend, r.overtime_pay,
    r.labor_contract, r.employee_benefits, r.occupational_safety,
    r.verification_level, r.evidence
  FROM companies c
  LEFT JOIN labor_rights r ON r.company_id = c.id
  WHERE c.status = 'published'
`;

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

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const industry = url.searchParams.get("industry");
  const search = url.searchParams.get("search")?.toLowerCase();
  const rightKeys = (url.searchParams.get("rightKeys") || "")
    .split(",").map(s => s.trim()).filter(Boolean);

  let sql = BASE_SELECT;
  const params: any[] = [];
  if (industry) {
    sql += ` AND c.industry = ?`;
    params.push(industry);
  }
  if (search) {
    sql += ` AND (LOWER(c.name) LIKE ? OR LOWER(IFNULL(c.products,'')) LIKE ? OR LOWER(IFNULL(c.description,'')) LIKE ?)`;
    const like = `%${search}%`;
    params.push(like, like, like);
  }
  sql += ` ORDER BY c.support_count DESC`;

  const stmt = env.DB.prepare(sql);
  const { results } = await (params.length ? stmt.bind(...params) : stmt).all();

  let list = (results || []).map(attachRights);

  if (rightKeys.length > 0) {
    list = list.filter((c: any) =>
      rightKeys.every(k => c.rights[k as keyof typeof c.rights])
    );
  }

  return Response.json(list);
};