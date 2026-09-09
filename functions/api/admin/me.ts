// functions/api/admin/me.ts
// GET → { authed: bool }  （公开端点，仅返回认证状态）

import { parseCookie, verifySessionCookie, getSessionSecret } from "../../utils/auth";

export const onRequestGet: PagesFunction = async (context) => {
  const env = context.env as { ADMIN_PASSWORD?: string; SESSION_SECRET?: string };
  const cookieHeader = context.request.headers.get("Cookie") || "";
  const session = parseCookie(cookieHeader, "session");
  const authed = session
    ? await verifySessionCookie(session, getSessionSecret(env))
    : false;

  return new Response(JSON.stringify({ authed }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const onRequestPost: PagesFunction = () =>
  new Response("Method Not Allowed", { status: 405 });