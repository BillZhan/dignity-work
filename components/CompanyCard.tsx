"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import type { Company } from "@/lib/types";
import { RightBadges } from "./RightBadge";
import { useHasSupported } from "@/lib/data";

export function CompanyCard({
  company,
  variant: _variant = "default",
}: {
  company: Company;
  variant?: "default" | "featured" | "compact";
}) {
  const supported = useHasSupported(company.id);
  const cover = company.cover_image || company.logo;

  return (
    <Link
      href={`/companies/${company.slug}/`}
      className="card-soft group block overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-100">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={company.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-300">
            {company.name}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-ink-900">
              {company.name}
            </h3>
            <p className="mt-0.5 truncate text-xs text-ink-500">
              {company.industry} · {company.products}
            </p>
          </div>
          {company.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={company.logo}
              alt=""
              className="h-9 w-9 shrink-0 rounded-full border border-ink-100 object-cover"
            />
          )}
        </div>

        <RightBadges rights={company.rights} size="sm" max={3} short />

        <div className="flex items-center justify-between border-t border-ink-100 pt-3 text-sm">
          <span className="inline-flex items-center gap-1.5 text-ink-500">
            <Heart
              className={`h-4 w-4 ${supported ? "fill-accent text-accent" : ""}`}
            />
            <span className="font-medium text-ink-700">
              {company.support_count.toLocaleString()}
            </span>
          </span>
          <span className="text-xs text-ink-400 group-hover:text-ink-600">
            查看 →
          </span>
        </div>
      </div>
    </Link>
  );
}