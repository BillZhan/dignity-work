// GET /api/admin/reports
// 列出全部用户举报

import type { D1Database } from "@cloudflare/workers-types";

interface Env { DB: D1Database }

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare(
    `SELECT * FROM reports ORDER BY created_at DESC`
  ).all();
  return Response.json(results || []);
};