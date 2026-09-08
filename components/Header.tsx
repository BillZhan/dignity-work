import Link from "next/link";
import { Search } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-ink-50/80 backdrop-blur-md">
      <div className="container-page flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink-900 text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </span>
          <span className="font-semibold tracking-tight text-ink-900">
            Dignity<span className="text-ink-400">·</span>Work
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-ink-600 md:flex">
          <Link href="/companies/" className="hover:text-ink-900">
            探索企业
          </Link>
          <Link href="/submit/" className="hover:text-ink-900">
            推荐企业
          </Link>
          <Link href="/about/" className="hover:text-ink-900">
            关于
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/companies/" className="hidden sm:inline-flex">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-600 hover:bg-ink-100 hover:text-ink-900">
              <Search className="h-4 w-4" />
            </span>
          </Link>
          <Link href="/submit/" className="btn-primary !py-2 !text-xs">
            推荐企业
          </Link>
        </div>
      </div>
    </header>
  );
}