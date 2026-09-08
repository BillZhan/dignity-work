import type { Company, Submission, Report } from "./types";

// ============================================================
//  示例数据 — 用于本地 mock 模式 + Supabase 种子导入
//
//  ⚠️ 重要：以下品牌名称为真实存在的品牌，但「善待员工」信息
//    仅基于公开资料整理（招聘网站 / 媒体报道 / 用户社区反馈）。
//    平台上线后必须由人工审核升级验证等级。
//    验证等级 L0-L2 的数据不构成对该企业的最终认定。
// ============================================================

// 单一数据源：从 JSON 加载（同时被脚本 scripts/generate-seed.mjs 读取生成 seed.sql）
import companiesJson from "@/data/companies.json";

export const MOCK_COMPANIES = companiesJson as unknown as Company[];

export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: "s-001",
    company_name: "晨光早餐铺",
    products: "包子 / 豆浆",
    reason: "老板亲自做早餐三年，对员工非常好。",
    status: "pending",
    created_at: "2026-03-01T08:00:00Z",
  },
  {
    id: "s-002",
    company_name: "云水书店",
    products: "二手书籍 / 咖啡",
    reason: "店员均缴纳社保，提供阅读假。",
    status: "pending",
    created_at: "2026-03-05T08:00:00Z",
  },
  {
    id: "s-003",
    company_name: "云上花艺",
    products: "鲜花 / 花艺课程",
    reason: "本地小品牌，对员工非常好，提供花艺课补贴。",
    status: "approved",
    created_at: "2026-02-25T08:00:00Z",
  },
];

export const MOCK_REPORTS: Report[] = [
  {
    id: "r-001",
    company_id: "c-001",
    reason: "信息错误",
    description: "近期门店似乎营业时间有调整，请核实。",
    status: "pending",
    created_at: "2026-03-04T08:00:00Z",
  },
];