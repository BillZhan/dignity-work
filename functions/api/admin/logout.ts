// functions/api/admin/logout.ts
// POST → 清除 session cookie

export const onRequestPost: PagesFunction = async () => {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": "session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
    },
  });
};

export const onRequestGet: PagesFunction = () =>
  new Response("Method Not Allowed", { status: 405 });