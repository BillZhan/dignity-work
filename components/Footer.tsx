import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-ink-50 py-10">
      <div className="container-page grid gap-8 text-sm text-ink-600 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-base font-semibold text-ink-900">
            让每一份劳动，都有尊严
          </p>
          <p className="mt-2 max-w-md leading-relaxed text-ink-500">
            我们是一个非营利性的消费者驱动项目，致力于发现并支持善待劳动者的企业。
            不发布企业黑名单，只用消费表达态度。
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-ink-400">
            浏览
          </p>
          <ul className="space-y-2">
            <li>
              <Link href="/companies/" className="hover:text-ink-900">
                探索企业
              </Link>
            </li>
            <li>
              <Link href="/submit/" className="hover:text-ink-900">
                推荐企业
              </Link>
            </li>
            <li>
              <Link href="/about/" className="hover:text-ink-900">
                关于我们
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-ink-400">
            项目
          </p>
          <ul className="space-y-2">
            <li>
              <Link href="/admin/" className="hover:text-ink-900">
                后台管理
              </Link>
            </li>
            <li>
              <Link href="/about/#disclaimer" className="hover:text-ink-900">
                免责声明
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-page mt-10 flex flex-col items-center justify-between gap-3 border-t border-ink-100 pt-6 text-xs text-ink-400 sm:flex-row">
        <p>© {new Date().getFullYear()} Dignity·Work. All rights reserved.</p>
        <p>Made with care · Non-Profit Project</p>
      </div>
    </footer>
  );
}