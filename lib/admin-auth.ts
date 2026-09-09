// lib/admin-auth.ts
// 客户端：admin 鉴权走 Pages Functions（密码永远不进前端 JS bundle）

export async function adminLogin(password: string): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      credentials: "same-origin",
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { ok?: boolean };
    return data?.ok === true;
  } catch {
    return false;
  }
}

export async function adminLogout(): Promise<void> {
  try {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "same-origin",
    });
  } catch {
    /* ignore */
  }
}

export async function checkAdminAuth(): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/me", {
      method: "GET",
      credentials: "same-origin",
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { authed?: boolean };
    return data?.authed === true;
  } catch {
    return false;
  }
}