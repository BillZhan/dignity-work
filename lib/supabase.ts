"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * 静态导出模式下，process.env 在构建时被静态替换。
 * 如果两个环境变量都填写，则使用真实 Supabase；
 * 否则退回到本地 mock 模式（用 localStorage 持久化提交与支持）。
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (!_client) {
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _client;
}

export const isSupabaseEnabled = () => !!getSupabase();