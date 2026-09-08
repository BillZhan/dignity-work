"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { useCompanies } from "@/lib/data";
import { CompanyCard } from "@/components/CompanyCard";
import { INDUSTRIES, LABOR_RIGHT_KEYS, LABOR_RIGHT_META, LaborRightKey } from "@/lib/types";

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [rights, setRights] = useState<LaborRightKey[]>([]);

  const { data, loading } = useCompanies({
    search: search || undefined,
    industry: industry || undefined,
    rightKeys: rights.length ? rights : undefined,
  });

  const toggleRight = (k: LaborRightKey) => {
    setRights((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));
  };

  const reset = () => {
    setSearch("");
    setIndustry("");
    setRights([]);
  };

  const hasFilter = useMemo(
    () => search || industry || rights.length > 0,
    [search, industry, rights]
  );

  return (
    <div className="container-page">
      <header className="pb-8">
        <h1 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
          探索企业
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          善待劳动者的企业，值得被更多人看见。
        </p>
      </header>

      {/* 筛选区 */}
      <div className="sticky top-14 z-30 -mx-5 mb-8 border-b border-ink-100 bg-ink-50/85 px-5 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-3">
          {/* 搜索 */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索企业名称 / 主营产品"
              className="input-field pl-10"
            />
          </div>

          {/* 行业 chips */}
          <div className="flex flex-wrap gap-2">
            <Chip active={!industry} onClick={() => setIndustry("")}>
              全部行业
            </Chip>
            {INDUSTRIES.map((i) => (
              <Chip key={i} active={industry === i} onClick={() => setIndustry(i)}>
                {i}
              </Chip>
            ))}
          </div>

          {/* 权益 chips */}
          <div className="flex flex-wrap gap-2">
            {LABOR_RIGHT_KEYS.map((k) => (
              <Chip
                key={k}
                active={rights.includes(k)}
                onClick={() => toggleRight(k)}
                icon={LABOR_RIGHT_META[k].icon}
              >
                {LABOR_RIGHT_META[k].label}
              </Chip>
            ))}
            {hasFilter && (
              <button
                onClick={reset}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs text-ink-500 hover:text-ink-900"
              >
                <X className="h-3 w-3" /> 清空
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 结果 */}
      {loading ? (
        <div className="masonry">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-2xl bg-white shadow-card"
            />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-card">
          <p className="text-lg font-medium text-ink-900">没有找到匹配的企业</p>
          <p className="mt-2 text-sm text-ink-500">
            试试调整筛选条件，或
            <a href="/submit/" className="ml-1 text-ink-900 underline">
              推荐一家
            </a>
            。
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-xs text-ink-400">
            共 {data.length} 家企业
          </p>
          <div className="masonry">
            {data.map((c) => (
              <CompanyCard key={c.id} company={c} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  icon: _icon,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-ink-900 text-white"
          : "bg-white text-ink-600 ring-1 ring-ink-200 hover:bg-ink-100"
      }`}
    >
      {children}
    </button>
  );
}