// POST /api/reports
// 公开接口：用户举报/纠错
// body: { company_id?, reason, description? }

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
  const reason = (body.reason || "").trim();
  if (!reason) {
    return Response.json({ error: "reason required" }, { status: 400 });
  }

  const id = uuid();
  const now = Date.now();
  await env.DB.prepare(`
    INSERT INTO reports (id, company_id, reason, description, status, created_at)
    VALUES (?, ?, ?, ?, 'pending', ?)
  `).bind(
    id,
    body.company_id || null,
    reason,
    body.description || null,
    now
  ).run();

  return Response.json({ ok: true, id });
};