"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Heart } from "lucide-react";
import { useCompanies } from "@/lib/data";
import { CompanyCard } from "@/components/CompanyCard";

export default function HomePage() {
  const { data, loading } = useCompanies();

  const featured = data.slice(0, 1);
  const popular = [...data].sort((a, b) => b.support_count - a.support_count).slice(0, 6);
  const latest = [...data]
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, 4);

  return (
    <div>
      {/* ===== Hero ===== */}
      <section className="container-page pt-10 pb-16 text-center sm:pt-20 sm:pb-24">
        <p className="mx-auto mb-6 inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1 text-xs font-medium text-ink-600">
          <Sparkles className="h-3 w-3" /> 一个由消费者共同维护的目录
        </p>
        <h1 className="font-serif text-4xl font-medium leading-[1.1] tracking-tightest text-ink-900 sm:text-6xl">
          让每一份劳动，<br />
          <span className="text-ink-500">都有尊严。</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg">
          用消费，支持善待劳动者的企业。
          <br />
          我们不发布企业黑名单，只展示值得支持的品牌。
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/companies/" className="btn-primary px-6 py-3 text-sm">
            探索好企业 <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/submit/" className="btn-ghost px-6 py-3 text-sm">
            推荐一家企业
          </Link>
        </div>
      </section>

      {/* ===== 编辑推荐 / 热门 ===== */}
      <section className="container-page pb-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">编辑推荐</h2>
          <Link href="/companies/" className="text-sm text-ink-500 hover:text-ink-900">
            查看全部 →
          </Link>
        </div>
        {loading ? (
          <SkeletonRow />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.concat(popular).slice(0, 3).map((c) => (
              <CompanyCard key={c.id} company={c} />
            ))}
          </div>
        )}
      </section>

      {/* ===== 热门企业 ===== */}
      <section className="container-page pb-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">热门支持</h2>
          <p className="text-sm text-ink-500">
            <Heart className="inline h-3.5 w-3.5 fill-accent text-accent" /> 越多消费者支持，越值得信赖
          </p>
        </div>
        {loading ? (
          <SkeletonRow />
        ) : (
          <div className="masonry">
            {popular.map((c) => (
              <CompanyCard key={c.id} company={c} />
            ))}
          </div>
        )}
      </section>

      {/* ===== 最新加入 ===== */}
      <section className="container-page pb-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">最新加入</h2>
          <p className="text-sm text-ink-500">社区推荐后审核发布</p>
        </div>
        {loading ? (
          <SkeletonRow />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((c) => (
              <CompanyCard key={c.id} company={c} />
            ))}
          </div>
        )}
      </section>

      {/* ===== Why ===== */}
      <section className="container-page pb-16">
        <div className="rounded-3xl border border-ink-100 bg-white p-8 sm:p-12">
          <p className="text-xs font-medium uppercase tracking-widest text-ink-400">
            Why
          </p>
          <h2 className="mt-2 max-w-2xl font-serif text-3xl font-medium leading-tight text-ink-900 sm:text-4xl">
            我们每天都在工作，<br />
            也每天都在消费。
          </h2>
          <p className="mt-6 max-w-2xl leading-relaxed text-ink-600">
            我们可能无法决定一家企业如何管理员工，
            但我们可以决定把钱花在哪里。
            如果一家企业愿意尊重员工，我们愿意让更多人知道它。
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { t: "公开透明", d: "每条信息都注明来源与验证等级。" },
              { t: "正向激励", d: "只展示值得支持的企业，不发布黑名单。" },
              { t: "社区驱动", d: "由消费者共同维护，每一份支持都算数。" },
            ].map((x) => (
              <div key={x.t} className="rounded-2xl bg-ink-50 p-5">
                <p className="text-sm font-semibold text-ink-900">{x.t}</p>
                <p className="mt-1 text-sm text-ink-500">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="container-page pb-8">
        <div className="rounded-3xl bg-ink-900 p-10 text-center text-white sm:p-16">
          <h2 className="font-serif text-3xl font-medium leading-tight sm:text-4xl">
            你知道一家善待员工的好企业？
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-ink-300">
            无需注册。告诉我们它的名字、为什么值得推荐。
            通过审核后，它将出现在首页。
          </p>
          <div className="mt-8">
            <Link
              href="/submit/"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-ink-900 hover:bg-ink-100"
            >
              推荐一家企业 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-72 animate-pulse rounded-2xl bg-white shadow-card"
        />
      ))}
    </div>
  );
}