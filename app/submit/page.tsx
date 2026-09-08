"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { submitCompany, submitReport } from "@/lib/data";

function SubmitInner() {
  const params = useSearchParams();
  const initialType = params.get("type") === "report" ? "report" : "submit";
  const companySlug = params.get("company") || "";
  const [type, setType] = useState<"submit" | "report">(initialType);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setType(params.get("type") === "report" ? "report" : "submit");
  }, [params]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const fd = new FormData(e.currentTarget);
    try {
      if (type === "submit") {
        await submitCompany({
          company_name: String(fd.get("company_name") || "").trim(),
          products: String(fd.get("products") || "").trim() || undefined,
          reason: String(fd.get("reason") || "").trim() || undefined,
          website: String(fd.get("website") || "").trim() || undefined,
          image: String(fd.get("image") || "").trim() || undefined,
        });
      } else {
        await submitReport({
          company_id: companySlug || undefined,
          reason: String(fd.get("reason") || "").trim(),
          description:
            String(fd.get("description") || "").trim() || undefined,
        });
      }
      setDone(true);
    } catch (e) {
      setErr("提交失败，请稍后再试");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="container-page max-w-xl py-16 text-center">
        <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-ink-100">
          <CheckCircle2 className="h-7 w-7 text-ink-700" />
        </div>
        <h2 className="font-serif text-2xl font-medium">
          {type === "submit" ? "推荐已提交" : "纠错已提交"}
        </h2>
        <p className="mt-3 text-sm text-ink-500">
          {type === "submit"
            ? "感谢你的推荐。我们将在审核后把它加入目录。"
            : "感谢你的反馈。我们会在 1-3 个工作日内处理。"}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn-ghost">
            返回首页
          </Link>
          <button
            onClick={() => {
              setDone(false);
            }}
            className="btn-primary"
          >
            再提交一个
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page max-w-2xl">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" /> 返回首页
      </Link>

      <div className="mb-8 flex items-center gap-1.5 rounded-full bg-ink-100 p-1 text-ink-600">
        <Tab active={type === "submit"} onClick={() => setType("submit")}>
          推荐企业
        </Tab>
        <Tab active={type === "report"} onClick={() => setType("report")}>
          提交纠错
        </Tab>
      </div>

      <h1 className="font-serif text-3xl font-medium tracking-tight">
        {type === "submit" ? "推荐一家值得支持的企业" : "提交纠错"}
      </h1>
      <p className="mt-2 text-sm text-ink-500">
        {type === "submit"
          ? "无需注册。告诉我们它的名字、为什么值得推荐。"
          : "如果你发现企业信息有误，或情况已变化，请告诉我们。"}
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        {type === "submit" ? (
          <>
            <Field label="企业名称 *" name="company_name" required />
            <Field
              label="主营产品"
              name="products"
              placeholder="例如：手工面包 / 简餐"
            />
            <Field
              label="为什么值得推荐？"
              name="reason"
              as="textarea"
              placeholder="例如：全员缴纳社保，每周双休，老板亲力亲为……"
            />
            <Field label="企业网站" name="website" type="url" placeholder="https://" />
            <Field label="图片链接" name="image" placeholder="可选，门店或产品图" />
          </>
        ) : (
          <>
            <Field label="关联企业" name="company" value={companySlug} disabled />
            <FieldSelect
              label="纠错类型 *"
              name="reason"
              required
              options={["信息错误", "标签错误", "企业情况发生变化", "虚假信息"]}
            />
            <Field
              label="详细描述"
              name="description"
              as="textarea"
              placeholder="请描述问题及可能的来源"
            />
          </>
        )}

        {err && (
          <p className="flex items-center gap-2 rounded-xl bg-accent-soft px-3 py-2 text-sm text-accent">
            <AlertCircle className="h-4 w-4" /> {err}
          </p>
        )}

        <div className="flex items-center justify-end gap-3">
          <Link href="/" className="btn-ghost">
            取消
          </Link>
          <button type="submit" disabled={busy} className="btn-primary">
            {busy ? "提交中..." : "提交"}
          </button>
        </div>

        <p className="rounded-2xl bg-ink-50 p-4 text-xs leading-relaxed text-ink-500">
          提交的内容将进入后台审核。
          请确保信息真实、不包含商业广告或人身攻击内容。
          平台保留修改、删除或不予展示的权利。
        </p>
      </form>
    </div>
  );
}

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-white text-ink-900 shadow-card" : "text-ink-500"
      }`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  name,
  required,
  type = "text",
  placeholder,
  as = "input",
  value,
  disabled,
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  as?: "input" | "textarea";
  value?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-700">{label}</span>
      {as === "textarea" ? (
        <textarea
          name={name}
          required={required}
          placeholder={placeholder}
          rows={4}
          disabled={disabled}
          defaultValue={value}
          className="input-field resize-none"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          defaultValue={value}
          className="input-field"
        />
      )}
    </label>
  );
}

function FieldSelect({
  label,
  name,
  required,
  options,
}: {
  label: string;
  name: string;
  required?: boolean;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-700">{label}</span>
      <select
        name={name}
        required={required}
        className="input-field"
      >
        <option value="">请选择…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function SubmitPage() {
  return (
    <Suspense fallback={<div className="container-page py-16" />}>
      <SubmitInner />
    </Suspense>
  );
}