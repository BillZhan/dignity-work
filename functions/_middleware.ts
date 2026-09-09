// functions/_middleware.ts
// 保护 /api/admin/* 下的所有端点（login/logout 除外）
// /admin/ 页面本身公开（只显示登录表单），真正鉴权在 API 层完成

import { parseCookie, verifySessionCookie, getSessionSecret } from "./utils/auth";

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // 公开端点
  if (path === "/api/admin/login" || path === "/api/admin/logout" || path === "/api/admin/me") {
    return context.next();
  }

  // 保护所有其他 /api/admin/* 端点
  if (path.startsWith("/api/admin/")) {
    const cookieHeader = context.request.headers.get("Cookie") || "";
    const session = parseCookie(cookieHeader, "session");
    const secret = getSessionSecret(context.env as any);
    const ok = session ? await verifySessionCookie(session, secret) : false;

    if (!ok) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return context.next();
};