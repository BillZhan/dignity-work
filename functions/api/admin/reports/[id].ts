// PATCH /api/admin/reports/:id
// body: { status: 'pending' | 'resolved' | 'ignored' }

import type { D1Database } from "@cloudflare/workers-types";

interface Env { DB: D1Database }

export const onRequestPatch: PagesFunction<Env> = async ({ params, request, env }) => {
  const id = (params as any).id as string;
  let body: any;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  const status = body.status;
  if (!["pending", "resolved", "ignored"].includes(status)) {
    return Response.json({ error: "invalid status" }, { status: 400 });
  }

  await env.DB.prepare(`UPDATE reports SET status = ? WHERE id = ?`)
    .bind(status, id).run();
  return Response.json({ ok: true });
};