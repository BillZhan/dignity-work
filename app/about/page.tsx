import Link from "next/link";
import { Heart, ShieldCheck, Users, Sparkles } from "lucide-react";

export const metadata = {
  title: "关于我们 — 让每一份劳动，都有尊严",
};

export default function AboutPage() {
  return (
    <div className="container-page max-w-3xl">
      <header className="py-10 text-center sm:py-16">
        <p className="mx-auto mb-4 inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1 text-xs font-medium text-ink-600">
          <Sparkles className="h-3 w-3" /> 关于这个项目
        </p>
        <h1 className="font-serif text-4xl font-medium leading-tight tracking-tightest text-ink-900 sm:text-5xl">
          让每一份劳动，<br />
          都有尊严。
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-500">
          一个由消费者共同维护的劳动者友好企业目录。
          <br />
          我们不发布企业黑名单，只用消费表达态度。
        </p>
      </header>

      <section className="prose-section space-y-6 leading-relaxed text-ink-700">
        <h2 className="font-serif text-2xl font-medium text-ink-900">为什么做这件事</h2>
        <p>
          我们每天都在工作，也每天都在消费。
          我们可能无法决定一家企业如何管理员工，
          但我们可以决定把钱花在哪里。
          如果一家企业愿意尊重员工，
          我们愿意让更多人知道它。
        </p>
        <p>
          这是一个由消费者共同维护的目录。
          我们相信市场的力量：当消费者愿意为「善待员工」买单，
          善待员工就会从成本，变成品牌价值的一部分。
        </p>
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Heart,
            t: "正向激励",
            d: "我们只展示值得支持的企业，不发布企业黑名单。",
          },
          {
            icon: ShieldCheck,
            t: "透明可信",
            d: "每条信息都注明来源与验证等级，不夸大不虚构。",
          },
          {
            icon: Users,
            t: "社区驱动",
            d: "由消费者共同维护，每一份支持都是真实的反馈。",
          },
        ].map((x) => (
          <div key={x.t} className="rounded-2xl bg-white p-6 shadow-card">
            <x.icon className="h-5 w-5 text-ink-700" />
            <p className="mt-3 text-base font-semibold text-ink-900">{x.t}</p>
            <p className="mt-1 text-sm text-ink-500">{x.d}</p>
          </div>
        ))}
      </section>

      <section className="prose-section mt-14 space-y-6 leading-relaxed text-ink-700">
        <h2 className="font-serif text-2xl font-medium text-ink-900">我们如何验证信息</h2>
        <p>
          为了避免不实信息对任何企业造成伤害，我们采用分级验证机制：
        </p>
        <ul className="space-y-3 text-sm">
          <li className="flex gap-3 rounded-xl bg-white p-4 shadow-card">
            <span className="font-mono text-ink-400">L0</span>
            <div>
              <p className="font-medium text-ink-900">用户推荐</p>
              <p className="text-ink-500">由消费者主动推荐，未经核实。</p>
            </div>
          </li>
          <li className="flex gap-3 rounded-xl bg-white p-4 shadow-card">
            <span className="font-mono text-ink-400">L1</span>
            <div>
              <p className="font-medium text-ink-900">社区反馈</p>
              <p className="text-ink-500">有员工或前员工在公开渠道分享过工作体验。</p>
            </div>
          </li>
          <li className="flex gap-3 rounded-xl bg-white p-4 shadow-card">
            <span className="font-mono text-ink-400">L2</span>
            <div>
              <p className="font-medium text-ink-900">公开资料</p>
              <p className="text-ink-500">招聘网站、公司公告、年报等公开信息可佐证。</p>
            </div>
          </li>
          <li className="flex gap-3 rounded-xl bg-white p-4 shadow-card">
            <span className="font-mono text-ink-400">L3</span>
            <div>
              <p className="font-medium text-ink-900">企业自证</p>
              <p className="text-ink-500">企业提供员工手册、社保凭证等内部资料。</p>
            </div>
          </li>
          <li className="flex gap-3 rounded-xl bg-white p-4 shadow-card">
            <span className="font-mono text-ink-400">L4</span>
            <div>
              <p className="font-medium text-ink-900">平台核验</p>
              <p className="text-ink-500">平台团队线下走访、抽样访谈工资条后发布。</p>
            </div>
          </li>
        </ul>
      </section>

      <section
        id="disclaimer"
        className="mt-14 rounded-3xl border border-ink-200 bg-white p-8 sm:p-10"
      >
        <h2 className="font-serif text-2xl font-medium text-ink-900">免责声明</h2>
        <p className="mt-4 text-sm leading-relaxed text-ink-600">
          本平台旨在收集和展示与企业劳动者权益相关的公开信息及社区反馈。
          平台信息不构成对任何企业劳动关系状况的最终认定。
          对于用户提交的信息，平台将根据平台规则进行审核、修改或删除。
          平台保留对任何涉嫌违法、虚假或人身攻击内容进行处理的权利。
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">
          平台不会向企业收费以提升劳动者权益评级；
          任何商业合作都将明确标识，且不影响平台客观性。
        </p>
      </section>

      <section className="mt-14 text-center">
        <p className="font-serif text-xl text-ink-900">
          让我们一起，让善待员工成为值得骄傲的事。
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/submit/" className="btn-primary">
            推荐一家企业
          </Link>
          <Link href="/companies/" className="btn-ghost">
            探索企业
          </Link>
        </div>
      </section>
    </div>
  );
}