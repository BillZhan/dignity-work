"use client";

import { useState, useEffect } from "react";
import {
  Lock,
  LogOut,
  LayoutDashboard,
  Building2,
  Inbox,
  Flag,
  Sparkles,
} from "lucide-react";
import {
  isAdminAuthed,
  adminLogin,
  adminLogout,
  getAdminPassword,
  useAdminCompanies,
  useAdminSubmissions,
  useAdminReports,
  adminUpdateCompany,
  adminDeleteCompany,
  adminUpdateSubmissionStatus,
  adminUpdateReportStatus,
} from "@/lib/data";
import type { Company, Submission, Report } from "@/lib/types";

type Tab = "dashboard" | "companies" | "submissions" | "reports";

export function AdminShell() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAuthed(isAdminAuthed());
  }, []);

  if (!mounted) return null;

  if (!authed) return <LoginPanel onOK={() => setAuthed(true)} />;

  return (
    <div className="container-page grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-20 lg:h-fit">
        <div className="rounded-2xl bg-white p-4 shadow-card">
          <p className="px-2 text-xs font-medium uppercase tracking-wider text-ink-400">
            后台
          </p>
          <nav className="mt-3 space-y-1">
            <NavTab
              icon={LayoutDashboard}
              active={tab === "dashboard"}
              onClick={() => setTab("dashboard")}
            >
              仪表板
            </NavTab>
            <NavTab
              icon={Building2}
              active={tab === "companies"}
              onClick={() => setTab("companies")}
            >
              企业管理
            </NavTab>
            <NavTab
              icon={Inbox}
              active={tab === "submissions"}
              onClick={() => setTab("submissions")}
            >
              用户提交
            </NavTab>
            <NavTab
              icon={Flag}
              active={tab === "reports"}
              onClick={() => setTab("reports")}
            >
              举报处理
            </NavTab>
          </nav>
          <button
            onClick={() => {
              adminLogout();
              setAuthed(false);
            }}
            className="mt-4 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink-500 hover:bg-ink-50 hover:text-ink-900"
          >
            <LogOut className="h-4 w-4" /> 退出登录
          </button>
        </div>
      </aside>

      <section>
        {tab === "dashboard" && <Dashboard onJump={setTab} />}
        {tab === "companies" && <CompaniesPanel />}
        {tab === "submissions" && <SubmissionsPanel />}
        {tab === "reports" && <ReportsPanel />}
      </section>
    </div>
  );
}

function NavTab({
  icon: Icon,
  active,
  onClick,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-ink-900 text-white"
          : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
      }`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}

function LoginPanel({ onOK }: { onOK: () => void }) {
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(pwd)) {
      onOK();
    } else {
      setErr("密码错误");
    }
  };

  return (
    <div className="container-page max-w-md py-20">
      <div className="rounded-3xl bg-white p-10 text-center shadow-card">
        <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink-100">
          <Lock className="h-5 w-5 text-ink-700" />
        </div>
        <h1 className="font-serif text-2xl font-medium">后台管理</h1>
        <p className="mt-2 text-sm text-ink-500">请输入管理员密码以继续</p>
        <form onSubmit={submit} className="mt-6 space-y-3 text-left">
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="管理员密码"
            className="input-field"
            autoFocus
          />
          {err && <p className="text-xs text-accent">{err}</p>}
          <button type="submit" className="btn-primary w-full">
            登录
          </button>
          <p className="text-center text-xs text-ink-400">
            默认密码：<code className="rounded bg-ink-100 px-1.5 py-0.5">
              {getAdminPassword()}
            </code>
            <br />
            可通过环境变量 <code>NEXT_PUBLIC_ADMIN_PASSWORD</code> 修改
          </p>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ onJump }: { onJump: (t: Tab) => void }) {
  const { data: companies } = useAdminCompanies();
  const { data: submissions } = useAdminSubmissions();
  const { data: reports } = useAdminReports();

  const stats = [
    {
      label: "已发布企业",
      value: companies.filter((c) => c.status === "published").length,
      icon: Building2,
      jump: "companies" as Tab,
    },
    {
      label: "待审提交",
      value: submissions.filter((s) => s.status === "pending").length,
      icon: Inbox,
      jump: "submissions" as Tab,
    },
    {
      label: "待处理举报",
      value: reports.filter((r) => r.status === "pending").length,
      icon: Flag,
      jump: "reports" as Tab,
    },
  ];

  type FeedItem =
    | (Submission & { kind: "submission" })
    | (Report & { kind: "report" });

  const feed: FeedItem[] = [
    ...submissions.map((s) => ({ ...s, kind: "submission" as const })),
    ...reports.map((r) => ({ ...r, kind: "report" as const })),
  ]
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-ink-400" />
        <h1 className="font-serif text-2xl font-medium">仪表板</h1>
      </header>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => onJump(s.jump)}
            className="card-soft flex items-center gap-4 p-5 text-left"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink-100">
              <s.icon className="h-5 w-5 text-ink-700" />
            </span>
            <div>
              <p className="text-xs text-ink-500">{s.label}</p>
              <p className="text-2xl font-semibold text-ink-900">{s.value}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-card">
        <h2 className="text-sm font-semibold text-ink-900">最近活动</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {feed.length === 0 && (
            <li className="rounded-xl bg-ink-50 px-4 py-6 text-center text-ink-400">
              暂无活动
            </li>
          )}
          {feed.map((it) => (
            <li
              key={it.kind + ":" + it.id}
              className="flex items-center justify-between rounded-xl bg-ink-50 px-4 py-3"
            >
              <span className="truncate text-ink-700">
                {it.kind === "submission"
                  ? it.company_name
                  : `${it.reason} · ${it.id.slice(0, 6)}`}
              </span>
              <span className="text-xs text-ink-400">
                {new Date(it.created_at).toLocaleString("zh-CN")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CompaniesPanel() {
  const { data, refresh } = useAdminCompanies();
  const [editing, setEditing] = useState<Company | null>(null);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-medium">企业管理</h1>
      <div className="overflow-hidden rounded-2xl bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-xs uppercase tracking-wider text-ink-500">
            <tr>
              <th className="px-4 py-3 text-left">名称</th>
              <th className="px-4 py-3 text-left">行业</th>
              <th className="px-4 py-3 text-right">支持数</th>
              <th className="px-4 py-3 text-left">状态</th>
              <th className="px-4 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {data.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium text-ink-900">{c.name}</td>
                <td className="px-4 py-3 text-ink-600">{c.industry}</td>
                <td className="px-4 py-3 text-right text-ink-600">
                  {c.support_count.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setEditing(c)}
                    className="text-xs font-medium text-ink-700 hover:underline"
                  >
                    编辑
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`确定要删除 ${c.name} 吗？`)) {
                        await adminDeleteCompany(c.id);
                        refresh();
                      }
                    }}
                    className="ml-3 text-xs font-medium text-accent hover:underline"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditCompanyModal
          company={editing}
          onClose={() => setEditing(null)}
          onSaved={async (c) => {
            await adminUpdateCompany(c);
            setEditing(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}

function EditCompanyModal({
  company,
  onClose,
  onSaved,
}: {
  company: Company;
  onClose: () => void;
  onSaved: (c: Company) => void;
}) {
  const [draft, setDraft] = useState<Company>(company);
  const rights = draft.rights!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 shadow-soft">
        <h3 className="font-serif text-xl font-medium">编辑：{company.name}</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Input label="名称" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
          <Input label="行业" value={draft.industry} onChange={(v) => setDraft({ ...draft, industry: v })} />
          <Input
            label="主营产品"
            className="sm:col-span-2"
            value={draft.products}
            onChange={(v) => setDraft({ ...draft, products: v })}
          />
          <Textarea
            label="企业介绍"
            className="sm:col-span-2"
            value={draft.description}
            onChange={(v) => setDraft({ ...draft, description: v })}
          />
          <Input
            label="官网"
            value={draft.website || ""}
            onChange={(v) => setDraft({ ...draft, website: v })}
          />
          <Select
            label="状态"
            value={draft.status}
            onChange={(v) => setDraft({ ...draft, status: v as Company["status"] })}
            options={[
              { v: "published", l: "已发布" },
              { v: "draft", l: "草稿" },
              { v: "hidden", l: "隐藏" },
            ]}
          />
          <div className="sm:col-span-2">
            <p className="mb-2 text-sm font-medium text-ink-700">劳动者权益</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  "social_security",
                  "two_day_weekend",
                  "overtime_pay",
                  "labor_contract",
                  "employee_benefits",
                  "occupational_safety",
                ] as const
              ).map((k) => (
                <label
                  key={k}
                  className="flex items-center gap-2 rounded-xl bg-ink-50 p-2.5 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={rights[k]}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        rights: { ...rights, [k]: e.target.checked },
                      })
                    }
                  />
                  <span className="text-ink-700">{k}</span>
                </label>
              ))}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Input
                label="验证等级 (0-4)"
                type="number"
                min={0}
                max={4}
                value={String(rights.verification_level)}
                onChange={(v) =>
                  setDraft({
                    ...draft,
                    rights: {
                      ...rights,
                      verification_level: Math.max(
                        0,
                        Math.min(4, Number(v) || 0)
                      ) as 0 | 1 | 2 | 3 | 4,
                    },
                  })
                }
              />
              <Input
                label="证据 / 来源"
                value={rights.evidence || ""}
                onChange={(v) =>
                  setDraft({ ...draft, rights: { ...rights, evidence: v } })
                }
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="btn-ghost">
            取消
          </button>
          <button onClick={() => onSaved(draft)} className="btn-primary">
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

function SubmissionsPanel() {
  const { data, refresh } = useAdminSubmissions();

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-medium">用户提交</h1>
      <div className="space-y-3">
        {data.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-ink-500 shadow-card">
            暂无提交
          </div>
        )}
        {data.map((s) => (
          <SubmissionRow
            key={s.id}
            s={s}
            onUpdate={async (status) => {
              await adminUpdateSubmissionStatus(s.id, status);
              refresh();
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SubmissionRow({
  s,
  onUpdate,
}: {
  s: Submission;
  onUpdate: (status: Submission["status"]) => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-medium text-ink-900">{s.company_name}</p>
          <p className="mt-0.5 text-xs text-ink-500">
            {new Date(s.created_at).toLocaleString("zh-CN")}
          </p>
          {s.products && (
            <p className="mt-2 text-sm text-ink-600">主营：{s.products}</p>
          )}
          {s.reason && (
            <p className="mt-2 text-sm text-ink-600">推荐理由：{s.reason}</p>
          )}
          {s.website && (
            <a
              href={s.website}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-xs text-ink-500 hover:underline"
            >
              {s.website}
            </a>
          )}
        </div>
        <StatusBadge status={s.status} />
      </div>
      {s.status === "pending" && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onUpdate("approved")}
            className="rounded-full bg-ink-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-ink-700"
          >
            通过
          </button>
          <button
            onClick={() => onUpdate("rejected")}
            className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-50"
          >
            驳回
          </button>
        </div>
      )}
    </div>
  );
}

function ReportsPanel() {
  const { data, refresh } = useAdminReports();

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-medium">举报处理</h1>
      <div className="space-y-3">
        {data.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-ink-500 shadow-card">
            暂无举报
          </div>
        )}
        {data.map((r) => (
          <div key={r.id} className="rounded-2xl bg-white p-5 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-ink-900">{r.reason}</p>
                <p className="mt-1 text-xs text-ink-500">
                  {new Date(r.created_at).toLocaleString("zh-CN")}
                </p>
                {r.description && (
                  <p className="mt-2 text-sm text-ink-600">{r.description}</p>
                )}
              </div>
              <StatusBadge status={r.status} />
            </div>
            {r.status === "pending" && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={async () => {
                    await adminUpdateReportStatus(r.id, "resolved");
                    refresh();
                  }}
                  className="rounded-full bg-ink-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-ink-700"
                >
                  已处理
                </button>
                <button
                  onClick={async () => {
                    await adminUpdateReportStatus(r.id, "ignored");
                    refresh();
                  }}
                  className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-50"
                >
                  忽略
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending:   { label: "待处理", cls: "bg-amber-50 text-amber-700" },
    approved:  { label: "已通过", cls: "bg-emerald-50 text-emerald-700" },
    rejected:  { label: "已驳回", cls: "bg-rose-50 text-rose-700" },
    published: { label: "已发布", cls: "bg-emerald-50 text-emerald-700" },
    draft:     { label: "草稿",   cls: "bg-ink-100 text-ink-700" },
    hidden:    { label: "已隐藏", cls: "bg-ink-100 text-ink-700" },
    resolved:  { label: "已处理", cls: "bg-emerald-50 text-emerald-700" },
    ignored:   { label: "已忽略", cls: "bg-ink-100 text-ink-700" },
  };
  const cfg = map[status] || { label: status, cls: "bg-ink-100 text-ink-700" };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cfg.cls}`}
    >
      {cfg.label}
    </span>
  );
}

function Input({
  label,
  value,
  onChange,
  className = "",
  type = "text",
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  type?: string;
  min?: number;
  max?: number;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium text-ink-700">{label}</span>
      <input
        type={type}
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium text-ink-700">{label}</span>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field resize-none"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { v: string; l: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
      >
        {options.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
    </label>
  );
}