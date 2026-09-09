// POST /api/companies/:slug/support
// 公开接口：用户对某企业点支持（按 visitor_id 去重）
// body: { visitor_id: string }

import type { D1Database } from "@cloudflare/workers-types";

interface Env { DB: D1Database }

function uuid(): string {
  // Cloudflare Workers 没有 crypto.randomUUID 旧版支持，自己生成
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ params, request, env }) => {
  const slug = (params as any).slug as string;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }
  const visitorId = (body.visitor_id || "").trim();
  if (!visitorId) {
    return new Response(JSON.stringify({ error: "visitor_id required" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  // 查找公司 id
  const company = await env.DB.prepare(
    `SELECT id FROM companies WHERE slug = ? AND status = 'published'`
  ).bind(slug).first();
  if (!company) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404, headers: { "Content-Type": "application/json" },
    });
  }

  // 检查是否已支持
  const existing = await env.DB.prepare(
    `SELECT id FROM supports WHERE company_id = ? AND visitor_id = ?`
  ).bind((company as any).id, visitorId).first();

  if (existing) {
    return Response.json({ ok: false, reason: "already_supported" }, { status: 200 });
  }

  // 插入支持记录 + 增加 support_count
  const now = Date.now();
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO supports (id, company_id, visitor_id, created_at) VALUES (?, ?, ?, ?)`
    ).bind(uuid(), (company as any).id, visitorId, now),
    env.DB.prepare(
      `UPDATE companies SET support_count = support_count + 1, updated_at = ? WHERE id = ?`
    ).bind(now, (company as any).id),
  ]);

  return Response.json({ ok: true });
};