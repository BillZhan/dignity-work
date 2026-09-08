import {
  Shield,
  Calendar,
  Wallet,
  FileText,
  Heart,
  HardHat,
  type LucideIcon,
} from "lucide-react";
import {
  LABOR_RIGHT_META,
  LABOR_RIGHT_KEYS,
  LaborRightKey,
} from "@/lib/types";

const ICON_MAP: Record<string, LucideIcon> = {
  Shield,
  Calendar,
  Wallet,
  FileText,
  Heart,
  HardHat,
};

export function RightBadge({
  k,
  size = "md",
  showLabel = true,
  short = false,
}: {
  k: LaborRightKey;
  size?: "sm" | "md";
  showLabel?: boolean;
  short?: boolean; // 使用短标签（社保/双休/合同…），适合卡片
}) {
  const meta = LABOR_RIGHT_META[k];
  const Icon = ICON_MAP[meta.icon];
  const label = short ? meta.short : meta.label;

  const sizing =
    size === "sm"
      ? "gap-1 px-2 py-1 text-[11px]"
      : "gap-1.5 px-3 py-1.5 text-xs";

  return (
    <span
      title={meta.hint}
      className={`inline-flex items-center whitespace-nowrap rounded-full bg-ink-100 text-ink-700 ${sizing}`}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {showLabel && <span className="font-medium leading-none">{label}</span>}
    </span>
  );
}

export function RightBadges({
  rights,
  max,
  size = "md",
  short = false,
}: {
  rights: Partial<Record<LaborRightKey, boolean>> | undefined;
  max?: number;
  size?: "sm" | "md";
  short?: boolean; // 透传给每个 badge
}) {
  if (!rights) return null;
  const active = LABOR_RIGHT_KEYS.filter((k) => rights[k]);
  const visible = typeof max === "number" ? active.slice(0, max) : active;
  const extra = active.length - visible.length;
  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((k) => (
        <RightBadge key={k} k={k} size={size} short={short} />
      ))}
      {extra > 0 && (
        <span className="inline-flex items-center whitespace-nowrap rounded-full bg-ink-100 px-2 py-1 text-[11px] font-medium text-ink-500">
          +{extra}
        </span>
      )}
    </div>
  );
}