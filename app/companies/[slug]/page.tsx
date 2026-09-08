import { CompanyDetailClient } from "./CompanyDetailClient";
import { MOCK_COMPANIES } from "@/lib/mock-data";

// 静态导出时为每个 mock 企业预生成路径
export function generateStaticParams() {
  return MOCK_COMPANIES.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = true;

export default function Page({ params }: { params: { slug: string } }) {
  return <CompanyDetailClient slug={params.slug} />;
}