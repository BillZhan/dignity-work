# Dignity·Work — 让每一份劳动，都有尊严

> 用消费，支持善待劳动者的企业。
> 一个由消费者共同维护的劳动者友好企业目录。

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)]()

---

## 📖 文档索引

- 🚀 [QUICKSTART.md](./QUICKSTART.md) — 5 分钟跑起来
- 🌐 [DEPLOY.md](./DEPLOY.md) — Cloudflare Pages / GitHub Pages 部署
- 🗄 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) — Supabase 接入 + 建表 + 导入示例数据

## ✨ 项目愿景

这不是一个企业黑名单网站。
这是一个**正向激励平台**：

- 🔍 **发现**善待劳动者的企业
- 🖼 **展示**他们的品牌与产品
- ❤️ **让消费者通过点赞表达态度**
- 🌱 **鼓励更多企业改善劳动者待遇**
- 📈 **让"善待员工"成为企业品牌价值的一部分**

---

## 🧱 技术栈

| 模块        | 选型                                          |
| ----------- | --------------------------------------------- |
| Framework   | [Next.js 14](https://nextjs.org/) (App Router) |
| Language    | TypeScript                                    |
| UI          | Tailwind CSS + [lucide-react](https://lucide.dev) |
| Backend     | [Supabase](https://supabase.com)（可选）       |
| Database    | PostgreSQL（Supabase）                        |
| 部署        | Cloudflare Pages / GitHub Pages（静态导出）    |
| Repository  | GitHub                                        |

**零服务器成本**：默认情况下使用本地 mock 数据（浏览器 localStorage 持久化），上传到任意静态托管即可上线。

---

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 本地开发
npm run dev
# → 打开 http://localhost:3000

# 3. 静态导出（部署用）
npm run export
# → 生成在 ./out/ 目录
```

---

## 📁 项目结构

```
.
├── app/                        # Next.js App Router 页面
│   ├── layout.tsx              # 全站 layout
│   ├── globals.css             # Tailwind + 设计系统
│   ├── page.tsx                # 首页
│   ├── companies/
│   │   ├── page.tsx            # 企业列表
│   │   └── [slug]/
│   │       ├── page.tsx        # 动态路由外壳（generateStaticParams）
│   │       └── CompanyDetailClient.tsx
│   ├── submit/page.tsx         # 推荐企业 / 纠错
│   ├── about/page.tsx          # 关于我们
│   └── admin/page.tsx          # 后台管理
├── components/                 # 公共组件
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── CompanyCard.tsx
│   ├── RightBadge.tsx
│   └── AdminShell.tsx
├── lib/
│   ├── types.ts                # 全站类型定义
│   ├── mock-data.ts            # 8 家示例企业
│   ├── supabase.ts             # Supabase 客户端封装
│   └── data.ts                 # 数据 hooks：useCompanies / submit / support...
├── supabase/
│   └── schema.sql              # PostgreSQL 表 + RLS + 触发器
├── next.config.js              # 静态导出配置
├── tailwind.config.ts          # 设计 token
└── .env.example                # 环境变量样例
```

---

## 🎨 设计系统

- **风格**：Apple 极简 + Pinterest 卡片 + 独立杂志气质
- **色板**：黑/白/灰为主 + 一抹温暖的强调色（`#d9483a` ❤️）
- **字体**：Inter（西文）+ 系统中文回退（PingFang / Microsoft YaHei）
- **布局**：Masonry 卡片 + 大量留白 + 圆角 + 柔和阴影

详见 [`tailwind.config.ts`](./tailwind.config.ts)。

---

## 🗄 数据模型

详见 [`supabase/schema.sql`](./supabase/schema.sql)：

| 表              | 作用                            |
| --------------- | ------------------------------- |
| `companies`     | 企业基本信息 + 支持数冗余         |
| `labor_rights`  | 6 项劳动者权益 + 验证等级 + 证据 |
| `submissions`   | 用户推荐/提交（待审 → 通过/驳回）|
| `supports`      | 用户支持记录（去重）             |
| `reports`       | 用户举报/纠错                    |
| `admin_users`   | 管理员                           |

### 验证等级

| Level | 含义               |
| ----- | ------------------ |
| L0    | 用户推荐           |
| L1    | 社区反馈           |
| L2    | 公开资料           |
| L3    | 企业自证           |
| L4    | 平台核验           |

每个权益标签都带验证等级，企业页必须显示"信息来源"。

---

## ⚙️ 环境变量

复制 `.env.example` 为 `.env.local`：

```bash
# Supabase 配置（留空 → 使用本地 mock 数据）
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# 后台管理员密码（默认 dignity2026，建议部署前修改）
NEXT_PUBLIC_ADMIN_PASSWORD=
```

**未配置 Supabase？** 完全没问题！所有数据走 `lib/mock-data.ts`，用户操作通过 localStorage 持久化。适合纯静态部署。

---

## 🌐 部署

### 方案 A — Cloudflare Pages（推荐，免费 + 全球 CDN）

1. 把代码推到 GitHub
2. 登录 [Cloudflare Pages](https://pages.cloudflare.com/) → "Create a project" → "Connect to Git"
3. 配置：
   - **Build command**：`npm run export`
   - **Build output directory**：`out`
   - **Node version**：`22`
4. 等待首次部署完成 ✅
5. （可选）配置环境变量 `NEXT_PUBLIC_SUPABASE_URL` 等

### 方案 B — GitHub Pages

1. 在 `next.config.js` 中添加 `basePath: '/your-repo-name'`（如果是 project page）
2. 推送代码
3. GitHub Actions 自动构建：

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run export
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out
  deploy:
    needs: build
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

4. 仓库 Settings → Pages → Source 选择 "GitHub Actions"

---

## 🛡 法律风险设计

> 我们不发布企业黑名单。

- ✅ 平台只展示"值得支持的企业"
- ✅ 信息带验证等级 + 来源
- ✅ 提供"举报/纠错"入口
- ✅ 页面底部统一免责声明
- ❌ 不使用 "黑心 / 违法 / 压榨" 等标签
- ❌ 付费不能购买更高劳动者权益评级

---

## 🗺 路线图

### V1（当前 MVP）
- [x] 首页 / 企业列表 / 企业详情
- [x] 推荐企业 + 纠错
- [x] 关于我们
- [x] 后台管理（密码登录）
- [x] 静态部署 + Supabase 双模式
- [x] 验证等级 + 信息来源
- [x] 支持去重（visitor_id）

### V2（暂未开始）
- [ ] 真实账户体系
- [ ] 企业付费认证
- [ ] 评论 / 用户故事
- [ ] 微信小程序
- [ ] 多语言
- [ ] SEO sitemap 自动生成

---

## 📜 许可

MIT License — 但请记得，**这是一个以社会价值为初衷的项目**。
请勿用于：
- 抹黑 / 攻击任何企业
- 制造虚假信息
- 任何违反你所在地法律的用途

---

<p align="center">
  Made with care · 让每一份劳动，都有尊严
</p>