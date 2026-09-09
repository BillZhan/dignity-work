"use client";

import { Fragment } from "react";
import Link from "next/link";
import { ArrowRight, ArrowDown, Sparkles, Heart } from "lucide-react";
import { useCompanies } from "@/lib/data";
import { CompanyCard } from "@/components/CompanyCard";

export default function HomePage() {
  const { data, loading } = useCompanies();

  const popular = [...data]
    .sort((a, b) => b.support_count - a.support_count)
    .slice(0, 6);

  return (
    <div>
      {/* ============================================ */}
      {/* SECTION 1 · WHY                              */}
      {/* ============================================ */}
      <section className="container-page pt-10 pb-16 sm:pt-16 sm:pb-24">
        {/* 主标题块 */}
        <div className="text-center">
          <p className="mx-auto mb-6 inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1 text-xs font-medium text-ink-600">
            <Sparkles className="h-3 w-3" /> 一个由消费者共同维护的目录
          </p>
          <p className="text-xs font-medium uppercase tracking-widest text-ink-400">
            Why
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium leading-[1.1] tracking-tightest text-ink-900 sm:text-6xl">
            你今天花的钱，<br />
            正在决定我们明天的
            <span className="text-ink-500">生活。</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base font-medium leading-relaxed text-ink-700 sm:text-lg">
            我们都是劳动者，也都是消费者。
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/companies/" className="btn-primary px-6 py-3 text-sm">
              探索好企业 <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/submit/" className="btn-ghost px-6 py-3 text-sm">
              推荐一家企业
            </Link>
          </div>
        </div>

        {/* 1.1 问题解释 */}
        <div className="mx-auto mt-20 max-w-2xl">
          <p className="text-base leading-relaxed text-ink-600 sm:text-lg">
            当企业为了获得更低的价格，不断压缩成本，
            最容易被压缩的，往往是劳动者的收入、时间和保障。
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink-600 sm:text-lg">
            与此同时，为了维持低价，
            产品质量和服务质量也可能不断被压缩。
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink-600 sm:text-lg">
            我们得到的，也许是越来越便宜的商品，
            却可能拥有越来越疲惫的劳动者，
            以及越来越没有活力的消费市场。
          </p>
        </div>

        {/* 1.2 突出事实 */}
        <div className="mt-20 text-center">
          <h2 className="font-serif text-3xl font-medium leading-tight text-ink-900 sm:text-5xl">
            但劳动者，<br />也是消费者。
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">
            一个没有时间、没有收入、没有安全感的人，
            很难成为一个有能力、有意愿的消费者。
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">
            当越来越多人只能工作，却没有时间生活，
            整个消费市场最终都会受到影响。
          </p>
        </div>

        {/* 1.3 恶性循环 */}
        <div className="mt-20">
          <p className="mb-8 text-center text-xs font-medium uppercase tracking-widest text-ink-400">
            一个恶性循环
          </p>
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-1.5">
            {[
              "低价竞争",
              "压缩成本",
              "压缩劳动",
              "消费下降",
              "更激烈的低价竞争",
            ].map((step, i, arr) => (
              <Fragment key={step}>
                <div className="flex-1 rounded-2xl bg-ink-50 py-5 px-4 text-center">
                  <p className="text-sm font-semibold text-ink-900">{step}</p>
                </div>
                {i < arr.length - 1 && (
                  <span
                    aria-hidden
                    className="flex shrink-0 items-center justify-center text-ink-400"
                  >
                    <ArrowDown className="h-4 w-4 sm:hidden" />
                    <ArrowRight className="hidden h-4 w-4 sm:block" />
                  </span>
                )}
              </Fragment>
            ))}
          </div>
        </div>

        {/* 1.4 区分竞争 vs 无效内卷 */}
        <div className="mt-20">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-2xl font-medium leading-tight text-ink-900 sm:text-4xl">
              我们不是反对竞争。
            </h2>
            <h2 className="mt-2 font-serif text-2xl font-medium leading-tight text-ink-500 sm:text-4xl">
              我们反对让所有人一起变差的竞争。
            </h2>
          </div>
          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-ink-100 bg-white p-6">
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-ink-400">
                健康的竞争
              </p>
              <ul className="space-y-2.5 text-sm text-ink-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-ink-400" />
                  更好的产品
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-ink-400" />
                  更好的服务
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-ink-400" />
                  更高的效率
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-ink-400" />
                  更好的创新
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-ink-100 bg-ink-50/60 p-6">
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-ink-400">
                无效内卷
              </p>
              <ul className="space-y-2.5 text-sm text-ink-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-ink-400" />
                  更低的工资
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-ink-400" />
                  更长的工时
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-ink-400" />
                  更少的保障
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-ink-400" />
                  更低的产品质量
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 1.5 正向循环 */}
        <div className="mt-20">
          <p className="mb-8 text-center text-xs font-medium uppercase tracking-widest text-ink-400">
            我们希望看到的正向循环
          </p>
          <div className="grid gap-3 sm:grid-cols-5 sm:gap-4">
            {[
              "更好的劳动待遇",
              "更多收入 + 时间 + 保障",
              "更有能力的消费者",
              "更健康的市场",
              "更好的产品与服务",
            ].map((step) => (
              <div
                key={step}
                className="rounded-2xl border border-ink-100 bg-white p-5 text-center"
              >
                <p className="text-sm font-semibold text-ink-900">{step}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center font-serif text-2xl font-medium leading-tight text-ink-900 sm:text-3xl">
            更好的劳动 → 更好的产品 → 更好的消费 → 更好的生活
          </p>
        </div>

        {/* 1.6 结论 */}
        <div className="mx-auto mt-20 max-w-2xl">
          <blockquote className="border-l-2 border-ink-900 pl-6">
            <p className="text-base leading-relaxed text-ink-700 sm:text-lg">
              我们相信，健康的市场不应该依靠牺牲劳动者来获得低价。
            </p>
            <p className="mt-3 text-base leading-relaxed text-ink-700 sm:text-lg">
              企业应该通过更好的产品、更好的服务、更高的效率和真正的创新来竞争。
            </p>
            <p className="mt-3 text-base leading-relaxed text-ink-700 sm:text-lg">
              劳动者应该因为创造价值，而拥有更好的生活。
            </p>
          </blockquote>
          <div className="mt-12 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-ink-400">
              Action
            </p>
            <h2 className="mt-3 font-serif text-3xl font-medium leading-tight text-ink-900 sm:text-5xl">
              所以，我们选择行动。
            </h2>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 2 · ACTION（解释具体做什么）            */}
      {/* ============================================ */}
      <section className="container-page pb-16 sm:pb-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-ink-100 bg-white p-8 text-center sm:p-12">
          <h2 className="font-serif text-2xl font-medium leading-tight text-ink-900 sm:text-3xl">
            从消费者能做的事开始。
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ink-600 sm:text-lg">
            我们不批评、也不审判任何企业。
            <br />
            我们<strong className="text-ink-900">发现、核实、推荐</strong>
            那些善待劳动者的企业。
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink-600 sm:text-lg">
            我们希望让更多消费者看见这些企业、了解这些企业，
            并在消费时拥有更好的选择。
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink-600 sm:text-lg">
            当好的企业获得更多消费者，
            市场就会收到一个清晰的信号：
          </p>
          <p className="mt-4 font-serif text-lg font-medium text-ink-900 sm:text-xl">
            善待劳动者，也可以成为企业真正的竞争力。
          </p>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 3 · RECOMMENDED（推荐企业瀑布流）        */}
      {/* ============================================ */}
      <section className="container-page pb-16 sm:pb-20">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-ink-400">
              Recommended
            </p>
            <h2 className="mt-2 font-serif text-3xl font-medium leading-tight text-ink-900 sm:text-4xl">
              好的企业，值得被看见。
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500 sm:text-base">
              我们不建立黑名单。
              <br />
              我们寻找、核实并推荐那些善待劳动者的企业。
              <br />
              <strong className="text-ink-700">
                让好的企业获得更多关注，让消费者拥有更好的选择。
              </strong>
            </p>
          </div>
          <Link
            href="/companies/"
            className="hidden whitespace-nowrap text-sm text-ink-500 hover:text-ink-900 sm:block"
          >
            查看全部 →
          </Link>
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
        <div className="mt-6 text-center sm:hidden">
          <Link href="/companies/" className="text-sm text-ink-500 hover:text-ink-900">
            查看全部 →
          </Link>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 4 · IMPACT（长期目标与影响）            */}
      {/* ============================================ */}
      <section className="container-page pb-16 sm:pb-20">
        <div className="rounded-3xl bg-ink-900 p-8 text-white sm:p-14">
          <p className="text-xs font-medium uppercase tracking-widest text-ink-400">
            Impact
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium leading-tight sm:text-5xl">
            让市场奖励更好的企业。
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-200 sm:text-base">
            我们的目标不是建立一个新的企业批判平台。
            我们希望做的是：
          </p>
          <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-white sm:text-base">
            发现好企业 → 验证好企业 → 推荐好企业 → 消费者支持好企业
          </p>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-200 sm:text-base">
            当越来越多消费者选择善待劳动者的企业，
            企业就会看到真实的市场回报。
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-200 sm:text-base">
            其他企业也会开始意识到：
            <strong className="text-white">
              善待劳动者不是竞争的负担
            </strong>
            ，它可以成为更好的产品、更好的服务、更稳定的团队和更健康的企业。
          </p>

          {/* 6 步正向流程 */}
          <div className="mt-10 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {[
              "消费者选择好企业",
              "好企业获得回报",
              "更多企业改善待遇",
              "产品和服务提升",
              "消费市场更健康",
              "减少牺牲劳动者的内卷",
            ].map((step) => (
              <div
                key={step}
                className="rounded-xl border border-white/10 bg-white/5 p-4 text-center text-sm text-white"
              >
                {step}
              </div>
            ))}
          </div>

          {/* 从 → 走向 */}
          <div className="mt-10 max-w-2xl">
            <p className="text-sm text-ink-300">最终，我们希望推动市场从</p>
            <p className="mt-2 text-sm text-ink-400 line-through">
              「牺牲劳动者的低价竞争」
            </p>
            <p className="mt-2 text-sm text-ink-300">走向</p>
            <p className="mt-2 font-serif text-xl font-medium text-white sm:text-2xl">
              创造真正价值的良性竞争。
            </p>
          </div>

          {/* 政府和法律：不攻击，重在消费者选择 */}
          <div className="mt-12 max-w-2xl border-t border-white/10 pt-10">
            <p className="text-sm leading-relaxed text-ink-200 sm:text-base">
              劳动法和公平竞争规则是保护市场健康运行的重要基础。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-200 sm:text-base">
              但制度之外，我们作为消费者，也拥有自己的选择。
            </p>
            <p className="mt-3 font-serif text-lg font-medium text-white sm:text-xl">
              我们可以决定支持什么样的企业。
            </p>
          </div>

          {/* 收尾金句 */}
          <div className="mt-12 max-w-2xl border-t border-white/10 pt-10">
            <p className="font-serif text-2xl font-medium leading-tight text-white sm:text-3xl">
              改变，不一定要从别人开始。
            </p>
            <p className="mt-2 font-serif text-2xl font-medium leading-tight text-white sm:text-3xl">
              可以从我们自己开始。
            </p>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 5 · FINAL STATEMENT（情感收束）         */}
      {/* ============================================ */}
      <section className="container-page pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-medium leading-tight text-ink-900 sm:text-5xl">
            我们都是劳动者。
          </h2>
          <h2 className="mt-2 font-serif text-3xl font-medium leading-tight text-ink-500 sm:text-5xl">
            我们都是消费者。
          </h2>
          <div className="mt-12">
            <p className="font-serif text-xl text-ink-700 sm:text-2xl">我在乎。</p>
            <p className="font-serif text-xl text-ink-700 sm:text-2xl">所以我选择。</p>
            <p className="mt-4 text-xs tracking-widest text-ink-400 sm:text-sm">
              I CARE. SO I CHOOSE.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Link href="/companies/" className="btn-primary px-6 py-3 text-sm">
              看看好企业 <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/submit/" className="btn-ghost px-6 py-3 text-sm">
              推荐一家企业
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* 底部 CTA（推荐入口）                            */}
      {/* ============================================ */}
      <section className="container-page pb-16 sm:pb-20">
        <div className="rounded-3xl bg-ink-50 p-10 text-center sm:p-14">
          <Heart className="mx-auto h-7 w-7 fill-accent text-accent" />
          <h2 className="mt-4 font-serif text-2xl font-medium leading-tight text-ink-900 sm:text-3xl">
            你知道一家善待员工的好企业？
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-500">
            无需注册。告诉我们它的名字、为什么值得推荐。
            通过审核后，它将出现在首页。
          </p>
          <div className="mt-6">
            <Link
              href="/submit/"
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white hover:bg-ink-700"
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
