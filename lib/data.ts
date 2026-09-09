"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Company,
  Submission,
  Report,
} from "./types";

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
//  通用 fetch 辅助
// ============================================================
async function api<T = any>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    credentials: "include", // 携带 admin cookie
  });
  if (!res.ok) {
    let msg = res.statusText;
    try { msg = ((await res.json()) as any).error || msg; } catch {}
    throw new Error(`${res.status} ${msg}`);
  }
  return res.json() as Promise<T>;
}

// 把 D1 整数时间戳（Unix ms）转换为 ISO 字符串
function toIso(v: any): string {
  if (typeof v === "number") return new Date(v).toISOString();
  if (typeof v === "string") return v;
  return new Date().toISOString();
}

function normalizeCompany(c: any): Company {
  return {
    ...c,
    created_at: toIso(c.created_at),
    updated_at: toIso(c.updated_at),
  };
}

function normalizeSubmission(s: any): Submission {
  return { ...s, created_at: toIso(s.created_at) };
}

function normalizeReport(r: any): Report {
  return { ...r, created_at: toIso(r.created_at) };
}

// ============================================================
//  Companies — 列表 / 详情 / 支持
// ============================================================

export function useCompanies(opts?: {
  search?: string;
  industry?: string;
  rightKeys?: string[];
}) {
  const [data, setData] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rightKeysStr = (opts?.rightKeys || []).join("|");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (opts?.industry) params.set("industry", opts.industry);
      if (opts?.search) params.set("search", opts.search);
      if (rightKeysStr) params.set("rightKeys", rightKeysStr);
      const qs = params.toString();
      const url = `/api/companies${qs ? `?${qs}` : ""}`;
      const rows = await api<Company[]>(url);
      setData(rows.map(normalizeCompany));
      setError(null);
    } catch (e: any) {
      setError(e.message || "加载失败");
    } finally {
      setLoading(false);
    }
  }, [opts?.search, opts?.industry, rightKeysStr]);

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
    try {
      const row = await api<Company>(`/api/companies/${encodeURIComponent(slug)}`);
      setData(normalizeCompany(row));
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}

// ============================================================
//  支持
// ============================================================

export function useHasSupported(companyId?: string) {
  // 简化版：每个 (companyId, visitorId) 在 supports 表里唯一，客户端通过 local 记忆
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (!companyId || typeof window === "undefined") return;
    const visitor = getVisitorId();
    const key = `dignity_supported:${visitor}`;
    try {
      const list = JSON.parse(window.localStorage.getItem(key) || "[]") as string[];
      setSupported(list.includes(companyId));
    } catch {
      setSupported(false);
    }
  }, [companyId]);

  return supported;
}

export async function supportCompany(companyId: string, slug: string): Promise<boolean> {
  const visitor = getVisitorId();
  try {
    const res = await api<{ ok: boolean; reason?: string }>(
      `/api/companies/${encodeURIComponent(slug)}/support`,
      { method: "POST", body: JSON.stringify({ visitor_id: visitor }) }
    );
    if (res.ok) {
      // 本地记录已支持
      const key = `dignity_supported:${visitor}`;
      try {
        const list = JSON.parse(window.localStorage.getItem(key) || "[]") as string[];
        if (!list.includes(companyId)) list.push(companyId);
        window.localStorage.setItem(key, JSON.stringify(list));
      } catch {}
    }
    return res.ok;
  } catch {
    return false;
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
  await api(`/api/submissions`, { method: "POST", body: JSON.stringify(payload) });
}

export async function submitReport(payload: {
  company_id?: string;
  reason: string;
  description?: string;
}): Promise<void> {
  await api(`/api/reports`, { method: "POST", body: JSON.stringify(payload) });
}

// ============================================================
//  Admin — 仅用于后台（鉴权由 /api/admin/* 中间件保护）
// ============================================================

export function useAdminCompanies() {
  const [data, setData] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await api<Company[]>(`/api/admin/companies`);
      setData(rows.map(normalizeCompany));
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { data, loading, refresh };
}

export function useAdminSubmissions() {
  const [data, setData] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await api<Submission[]>(`/api/admin/submissions`);
      setData(rows.map(normalizeSubmission));
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { data, loading, refresh };
}

export function useAdminReports() {
  const [data, setData] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await api<Report[]>(`/api/admin/reports`);
      setData(rows.map(normalizeReport));
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { data, loading, refresh };
}

export async function adminUpdateCompany(c: Company): Promise<void> {
  await api(`/api/admin/companies/${encodeURIComponent(c.id)}`, {
    method: "PUT",
    body: JSON.stringify(c),
  });
}

export async function adminDeleteCompany(id: string): Promise<void> {
  await api(`/api/admin/companies/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function adminUpdateSubmissionStatus(
  id: string,
  status: Submission["status"]
): Promise<void> {
  await api(`/api/admin/submissions/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function adminUpdateReportStatus(
  id: string,
  status: Report["status"]
): Promise<void> {
  await api(`/api/admin/reports/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}