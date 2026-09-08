"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Company,
  Submission,
  Report,
} from "./types";
import { MOCK_COMPANIES, MOCK_SUBMISSIONS, MOCK_REPORTS } from "./mock-data";
import { getSupabase } from "./supabase";

// ============================================================
//  浏览器侧 visitor 标识（防刷票用）
// ============================================================
const VISITOR_KEY = "dignity_visitor_id";

export function getVisitorId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = window.localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id =
      "v-" +
      Math.random().toString(36).slice(2, 10) +
      Date.now().toString(36);
    window.localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

// ============================================================
//  客户端 localStorage 辅助（仅 mock 模式下使用）
// ============================================================
function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function lsSet(key: string, val: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* ignore */
  }
}

// 支持记录的本地持久化（key = `${companyId}:${visitorId}`）
const SUPPORT_LS = "dignity_supports";
const SUPPORT_COUNT_LS = "dignity_support_counts";

// ============================================================
//  Companies — 列表 / 详情 / 支持
// ============================================================

export function useCompanies(opts?: {
  search?: string;
  industry?: string;
  rightKeys?: string[]; // 任一匹配
}) {
  const [data, setData] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rightKeysStr = (opts?.rightKeys || []).join("|");

  const refresh = useCallback(async () => {
    setLoading(true);
    const sb = getSupabase();
    if (sb) {
      let q = sb
        .from("companies")
        .select("*, labor_rights(*)")
        .eq("status", "published")
        .order("support_count", { ascending: false });
      if (opts?.industry) q = q.eq("industry", opts.industry);
      const { data: rows, error: err } = await q;
      if (err) {
        setError(err.message);
      } else {
        let list = (rows || []).map((r: any) => ({ ...r, rights: r.labor_rights }));
        if (opts?.search) {
          const s = opts.search.toLowerCase();
          list = list.filter(
            (c) =>
              c.name.toLowerCase().includes(s) ||
              (c.products || "").toLowerCase().includes(s) ||
              (c.description || "").toLowerCase().includes(s)
          );
        }
        if (opts?.rightKeys && opts.rightKeys.length > 0) {
          list = list.filter((c) =>
            opts.rightKeys!.every((k) => c.rights?.[k as keyof typeof c.rights])
          );
        }
        setData(list);
      }
    } else {
      // mock 模式
      const countDelta = lsGet<Record<string, number>>(SUPPORT_COUNT_LS, {});
      let list = MOCK_COMPANIES.filter((c) => c.status === "published").map(
        (c) => ({
          ...c,
          support_count: c.support_count + (countDelta[c.id] || 0),
        })
      );
      if (opts?.industry) list = list.filter((c) => c.industry === opts.industry);
      if (opts?.search) {
        const s = opts.search.toLowerCase();
        list = list.filter(
          (c) =>
            c.name.toLowerCase().includes(s) ||
            (c.products || "").toLowerCase().includes(s) ||
            (c.description || "").toLowerCase().includes(s)
        );
      }
      if (opts?.rightKeys && opts.rightKeys.length > 0) {
        list = list.filter((c) =>
          opts.rightKeys!.every((k) => c.rights?.[k as keyof typeof c.rights])
        );
      }
      setData(list);
    }
    setLoading(false);
  }, [opts?.search, opts?.industry, rightKeysStr]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}

export function useCompany(slug: string) {
  const [data, setData] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const sb = getSupabase();
    if (sb) {
      const { data: rows } = await sb
        .from("companies")
        .select("*, labor_rights(*)")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (rows) setData({ ...(rows as any), rights: (rows as any).labor_rights });
    } else {
      const base = MOCK_COMPANIES.find((c) => c.slug === slug);
      const countDelta = lsGet<Record<string, number>>(SUPPORT_COUNT_LS, {});
      if (base) {
        setData({
          ...base,
          support_count: base.support_count + (countDelta[base.id] || 0),
        });
      }
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}

// ============================================================
//  支持 — 支持 / 已支持？
// ============================================================

export function useHasSupported(companyId?: string) {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (!companyId) return;
    const sb = getSupabase();
    const visitor = getVisitorId();
    if (sb) {
      sb.from("supports")
        .select("id")
        .eq("company_id", companyId)
        .eq("visitor_id", visitor)
        .maybeSingle()
        .then(({ data }) => setSupported(!!data));
    } else {
      const map = lsGet<Record<string, string[]>>(SUPPORT_LS, {});
      setSupported((map[companyId] || []).includes(visitor));
    }
  }, [companyId]);

  return supported;
}

export async function supportCompany(companyId: string): Promise<boolean> {
  const sb = getSupabase();
  const visitor = getVisitorId();
  if (sb) {
    const { error } = await sb
      .from("supports")
      .insert({ company_id: companyId, visitor_id: visitor });
    if (error) {
      if (error.code === "23505") return false; // 已支持
      throw error;
    }
    return true;
  } else {
    const map = lsGet<Record<string, string[]>>(SUPPORT_LS, {});
    const list = map[companyId] || [];
    if (list.includes(visitor)) return false;
    map[companyId] = [...list, visitor];
    lsSet(SUPPORT_LS, map);

    const counts = lsGet<Record<string, number>>(SUPPORT_COUNT_LS, {});
    counts[companyId] = (counts[companyId] || 0) + 1;
    lsSet(SUPPORT_COUNT_LS, counts);
    return true;
  }
}

// ============================================================
//  Submissions / Reports — 用户提交
// ============================================================

export async function submitCompany(payload: {
  company_name: string;
  products?: string;
  reason?: string;
  website?: string;
  image?: string;
}): Promise<void> {
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from("submissions").insert(payload);
    if (error) throw error;
  } else {
    const list = lsGet<Submission[]>("dignity_submissions", [
      ...MOCK_SUBMISSIONS,
    ]);
    list.unshift({
      id: "local-" + Date.now(),
      ...payload,
      status: "pending",
      created_at: new Date().toISOString(),
    });
    lsSet("dignity_submissions", list);
  }
}

export async function submitReport(payload: {
  company_id?: string;
  reason: string;
  description?: string;
}): Promise<void> {
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from("reports").insert(payload);
    if (error) throw error;
  } else {
    const list = lsGet<Report[]>("dignity_reports", [...MOCK_REPORTS]);
    list.unshift({
      id: "local-" + Date.now(),
      ...payload,
      status: "pending",
      created_at: new Date().toISOString(),
    });
    lsSet("dignity_reports", list);
  }
}

// ============================================================
//  Admin — 仅用于后台（mock 模式靠 localStorage 持久化）
// ============================================================

export function getAdminPassword(): string {
  return process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "dignity2026";
}

export const ADMIN_SESSION_KEY = "dignity_admin_session";

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
}

export function adminLogin(password: string): boolean {
  if (password !== getAdminPassword()) return false;
  window.sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
  return true;
}

export function adminLogout() {
  window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

export function useAdminCompanies() {
  const [data, setData] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isAdminAuthed()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const sb = getSupabase();
    if (sb) {
      const { data: rows } = await sb
        .from("companies")
        .select("*, labor_rights(*)")
        .order("created_at", { ascending: false });
      setData(
        (rows || []).map((r: any) => ({ ...r, rights: r.labor_rights }))
      );
    } else {
      setData(
        lsGet<Company[]>("dignity_admin_companies", [...MOCK_COMPANIES])
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}

export function useAdminSubmissions() {
  const [data, setData] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isAdminAuthed()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const sb = getSupabase();
    if (sb) {
      const { data: rows } = await sb
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });
      setData(rows || []);
    } else {
      setData(
        lsGet<Submission[]>("dignity_submissions", [...MOCK_SUBMISSIONS])
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}

export function useAdminReports() {
  const [data, setData] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isAdminAuthed()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const sb = getSupabase();
    if (sb) {
      const { data: rows } = await sb
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });
      setData(rows || []);
    } else {
      setData(lsGet<Report[]>("dignity_reports", [...MOCK_REPORTS]));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}

export async function adminUpdateCompany(c: Company): Promise<void> {
  const sb = getSupabase();
  if (sb) {
    const { id, rights, ...rest } = c;
    await sb.from("companies").update(rest).eq("id", id);
    if (rights) {
      await sb.from("labor_rights").upsert({ company_id: id, ...rights });
    }
  } else {
    const list = lsGet<Company[]>(
      "dignity_admin_companies",
      [...MOCK_COMPANIES]
    );
    const idx = list.findIndex((x) => x.id === c.id);
    if (idx >= 0) list[idx] = c;
    lsSet("dignity_admin_companies", list);
  }
}

export async function adminDeleteCompany(id: string): Promise<void> {
  const sb = getSupabase();
  if (sb) {
    await sb.from("companies").delete().eq("id", id);
  } else {
    const list = lsGet<Company[]>(
      "dignity_admin_companies",
      [...MOCK_COMPANIES]
    );
    lsSet(
      "dignity_admin_companies",
      list.filter((x) => x.id !== id)
    );
  }
}

export async function adminUpdateSubmissionStatus(
  id: string,
  status: Submission["status"]
): Promise<void> {
  const sb = getSupabase();
  if (sb) {
    await sb.from("submissions").update({ status }).eq("id", id);
  } else {
    const list = lsGet<Submission[]>(
      "dignity_submissions",
      [...MOCK_SUBMISSIONS]
    );
    const idx = list.findIndex((x) => x.id === id);
    if (idx >= 0) list[idx].status = status;
    lsSet("dignity_submissions", list);
  }
}

export async function adminUpdateReportStatus(
  id: string,
  status: Report["status"]
): Promise<void> {
  const sb = getSupabase();
  if (sb) {
    await sb.from("reports").update({ status }).eq("id", id);
  } else {
    const list = lsGet<Report[]>("dignity_reports", [...MOCK_REPORTS]);
    const idx = list.findIndex((x) => x.id === id);
    if (idx >= 0) list[idx].status = status;
    lsSet("dignity_reports", list);
  }
}