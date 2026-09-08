// ============================================================
//  全站数据类型定义
// ============================================================

export type VerificationLevel = 0 | 1 | 2 | 3 | 4;

export const VERIFICATION_LABELS: Record<VerificationLevel, string> = {
  0: "用户推荐",
  1: "社区反馈",
  2: "公开资料",
  3: "企业自证",
  4: "平台核验",
};

export const INDUSTRIES = [
  "餐饮",
  "科技",
  "零售",
  "物流",
  "制造",
  "金融",
  "教育",
  "医疗",
  "其他",
] as const;
export type Industry = (typeof INDUSTRIES)[number];

/** 6 个劳动者权益标签 */
export const LABOR_RIGHT_KEYS = [
  "social_security",       // 🛡 社保
  "two_day_weekend",       // 📅 双休
  "overtime_pay",          // 💰 加班费
  "labor_contract",        // 📄 劳动合同
  "employee_benefits",     // 🏥 员工福利
  "occupational_safety",   // ⚠️ 职业安全
] as const;
export type LaborRightKey = (typeof LABOR_RIGHT_KEYS)[number];

export const LABOR_RIGHT_META: Record<
  LaborRightKey,
  { label: string; short: string; icon: string; hint: string }
> = {
  social_security:     { label: "社会保险", short: "社保", icon: "Shield",   hint: "依法缴纳五险一金" },
  two_day_weekend:     { label: "双休/工时", short: "双休", icon: "Calendar", hint: "标准工时、保证双休" },
  overtime_pay:        { label: "加班费",   short: "加班费", icon: "Wallet",   hint: "依法支付加班工资" },
  labor_contract:      { label: "劳动合同", short: "合同", icon: "FileText",  hint: "全员签订书面劳动合同" },
  employee_benefits:   { label: "员工福利", short: "福利", icon: "Heart",     hint: "体检/补贴/培训等" },
  occupational_safety: { label: "职业安全", short: "安全", icon: "HardHat",   hint: "安全培训与劳动保护" },
};

export interface LaborRights {
  social_security: boolean;
  two_day_weekend: boolean;
  overtime_pay: boolean;
  labor_contract: boolean;
  employee_benefits: boolean;
  occupational_safety: boolean;
  verification_level: VerificationLevel;
  evidence?: string;
}

export type CompanyStatus = "draft" | "published" | "hidden";

export interface Company {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  cover_image?: string;
  description: string;
  industry: string;
  products: string;
  website?: string;
  status: CompanyStatus;
  support_count: number;
  created_at: string;
  updated_at: string;
  rights?: LaborRights;
}

export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface Submission {
  id: string;
  company_name: string;
  products?: string;
  reason?: string;
  website?: string;
  image?: string;
  status: SubmissionStatus;
  created_at: string;
}

export type ReportStatus = "pending" | "resolved" | "ignored";

export interface Report {
  id: string;
  company_id?: string;
  reason: string;
  description?: string;
  status: ReportStatus;
  created_at: string;
}