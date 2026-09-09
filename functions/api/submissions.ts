// POST /api/submissions
// 公开接口：用户推荐/提交企业
// body: { company_name, products?, reason?, website?, image? }

import type { D1Database } from "@cloudflare/workers-types";

interface Env { DB: D1Database }

function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const companyName = (body.company_name || "").trim();
  if (!companyName) {
    return Response.json({ error: "company_name required" }, { status: 400 });
  }

  const id = uuid();
  const now = Date.now();
  await env.DB.prepare(`
    INSERT INTO submissions (id, company_name, products, reason, website, image, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
  `).bind(
    id, companyName,
    body.products || null,
    body.reason || null,
    body.website || null,
    body.image || null,
    now
  ).run();

  return Response.json({ ok: true, id });
};