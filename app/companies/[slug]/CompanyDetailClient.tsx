"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ExternalLink, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";
import { useCompany, supportCompany, useHasSupported } from "@/lib/data";
import { RightBadge } from "@/components/RightBadge";
import {
  LABOR_RIGHT_KEYS,
  LABOR_RIGHT_META,
  VERIFICATION_LABELS,
  LaborRightKey,
} from "@/lib/types";

export function CompanyDetailClient({ slug }: { slug: string }) {
  const { data: company, loading, refresh } = useCompany(slug);
  const supported = useHasSupported(company?.id);
  const [supporting, setSupporting] = useState(false);
  const [supportMsg, setSupportMsg] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="container-page">
        <div className="h-80 animate-pulse rounded-3xl bg-white shadow-card" />
      </div>
    );
  }
  if (!company) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-lg font-medium text-ink-900">未找到该企业</p>
        <Link href="/companies/" className="mt-3 inline-block text-sm text-ink-500 underline">
          返回企业列表
        </Link>
      </div>
    );
  }

  const handleSupport = async () => {
    if (supporting) return;
    setSupporting(true);
    setSupportMsg(null);
    try {
      const ok = await supportCompany(company.id, company.slug);
      setSupportMsg(ok ? "感谢你的支持 ❤️" : "你已经支持过这家企业了");
      refresh();
    } catch {
      setSupportMsg("支持失败，请稍后再试");
    } finally {
      setSupporting(false);
    }
  };

  return (
    <div className="container-page">
      {/* 返回 */}
      <Link
        href="/companies/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" /> 返回企业列表
      </Link>

      {/* Cover */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-card">
        <div className="relative h-56 bg-ink-100 sm:h-80">
          {company.cover_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={company.cover_image}
              alt={company.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="space-y-6 p-6 sm:p-10">
          {/* header */}
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {company.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={company.logo}
                  alt=""
                  className="h-14 w-14 rounded-2xl border border-ink-100 object-cover"
                />
              )}
              <div>
                <h1 className="font-serif text-3xl font-medium tracking-tightest text-ink-900 sm:text-4xl">
                  {company.name}
                </h1>
                <p className="mt-1 text-sm text-ink-500">
                  {company.industry} · {company.products}
                </p>
              </div>
            </div>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost !py-2 !text-xs"
              >
                <ExternalLink className="h-3.5 w-3.5" /> 官网
              </a>
            )}
          </div>

          {/* support button */}
          <div className="flex flex-col items-start gap-3 rounded-2xl bg-ink-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <Heart
                  className={`h-5 w-5 ${supported ? "fill-accent text-accent" : "text-ink-700"}`}
                />
              </span>
              <div>
                <p className="text-sm font-medium text-ink-900">
                  {company.support_count.toLocaleString()} 人支持
                </p>
                <p className="text-xs text-ink-500">用你的支持，鼓励更多企业善待员工</p>
              </div>
            </div>
            <button
              onClick={handleSupport}
              disabled={supported || supporting}
              className={`btn-support ${supported ? "opacity-60" : ""}`}
            >
              {supported ? "已支持" : supporting ? "处理中..." : "❤️ 支持这家企业"}
            </button>
          </div>
          {supportMsg && (
            <p className="-mt-2 text-center text-sm text-accent">{supportMsg}</p>
          )}

          {/* description */}
          <div>
            <h2 className="mb-3 text-lg font-semibold">关于这家企业</h2>
            <p className="leading-relaxed text-ink-700">{company.description}</p>
          </div>

          {/* 权益 */}
          <div>
            <h2 className="mb-3 text-lg font-semibold">劳动者权益</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {LABOR_RIGHT_KEYS.map((k) => (
                <RightRow
                  key={k}
                  k={k}
                  enabled={!!company.rights?.[k]}
                  verificationLevel={company.rights?.verification_level ?? 0}
                />
              ))}
            </div>
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-ink-50 p-3 text-xs text-ink-500">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                当前验证等级：
                <strong className="ml-1 text-ink-700">
                  {VERIFICATION_LABELS[company.rights?.verification_level ?? 0]}
                </strong>
                。平台信息不构成对任何企业劳动关系的最终认定。
              </span>
            </p>
            {company.rights?.evidence && (
              <p className="mt-3 text-xs text-ink-500">
                <span className="font-medium text-ink-700">信息来源：</span>
                {company.rights.evidence}
              </p>
            )}
          </div>

          {/* products */}
          <div>
            <h2 className="mb-3 text-lg font-semibold">主营产品</h2>
            <div className="flex flex-wrap gap-2">
              {company.products.split(/[、,，]/).map((p) => (
                <span key={p} className="badge">
                  {p.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* 纠错入口 */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-200 bg-white p-5 text-sm">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 text-ink-400" />
              <p className="text-ink-600">
                发现信息错误或企业情况发生变化？
              </p>
            </div>
            <Link
              href={`/submit/?type=report&company=${company.slug}`}
              className="text-sm font-medium text-ink-900 underline"
            >
              提交纠错
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function RightRow({
  k,
  enabled,
  verificationLevel,
}: {
  k: LaborRightKey;
  enabled: boolean;
  verificationLevel: 0 | 1 | 2 | 3 | 4;
}) {
  const meta = LABOR_RIGHT_META[k];
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border p-3 ${
        enabled
          ? "border-ink-200 bg-white"
          : "border-dashed border-ink-200 bg-ink-50/50 text-ink-400"
      }`}
    >
      <RightBadge k={k} showLabel={false} size="md" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink-900">{meta.label}</p>
        <p className="truncate text-xs text-ink-500">{meta.hint}</p>
      </div>
      {enabled && (
        <span className="shrink-0 rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-medium text-ink-700">
          {VERIFICATION_LABELS[verificationLevel]}
        </span>
      )}
    </div>
  );
}