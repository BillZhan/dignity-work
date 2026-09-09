// functions/api/admin/login.ts
// POST { password } → 验证通过则下发签名 HttpOnly cookie

import { createSessionCookie, getSessionSecret } from "../../utils/auth";

export const onRequestPost: PagesFunction = async (context) => {
  const env = context.env as { ADMIN_PASSWORD?: string };

  if (!env.ADMIN_PASSWORD) {
    return new Response(
      JSON.stringify({ ok: false, error: "服务端未配置 ADMIN_PASSWORD 环境变量" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { password?: string };
  try {
    body = (await context.request.json()) as { password?: string };
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: "请求体格式错误" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (typeof body.password !== "string" || body.password !== env.ADMIN_PASSWORD) {
    // 防时序攻击：固定延时
    await new Promise((r) => setTimeout(r, 250));
    return new Response(
      JSON.stringify({ ok: false, error: "密码错误" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const session = await createSessionCookie(getSessionSecret(env));
  const cookie = `session=${session}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`;

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": cookie,
    },
  });
};

// 拒绝其他方法
export const onRequestGet: PagesFunction = () =>
  new Response("Method Not Allowed", { status: 405 });