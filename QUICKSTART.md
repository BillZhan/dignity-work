# 快速开始

> 5 分钟让网站跑起来。

## 一、本地运行（无需任何配置）

```bash
cd "C:\Users\shizh\WorkBuddy\2026-09-08-10-10-06"
npm install
npm run dev
# → 打开 http://localhost:3000
```

立即能看到首页 + 26 家示例企业。数据来自 `data/companies.json`。

所有用户提交 / 支持会保存到浏览器 localStorage，刷新仍在。

---

## 二、上线到 Cloudflare Pages（免费）

```bash
# 1. 创建 GitHub 仓库
# 2. 推送代码
git init
git add .
git commit -m "feat: initial MVP"
git remote add origin https://github.com/YOUR_USERNAME/dignity-work.git
git push -u origin main

# 3. Cloudflare Pages 连接 GitHub → 自动部署
#    Build command: npm run export
#    Output: out
```

详见 [`DEPLOY.md`](./DEPLOY.md)。

---

## 三、接入 Supabase（让所有用户数据互通）

1. https://supabase.com/ 注册 → 新建项目
2. SQL Editor → 粘贴 `supabase/schema.sql` 运行
3. SQL Editor → 粘贴 `supabase/seed.sql` 运行（导入 26 家示例）
4. Settings → API → 复制 URL 和 anon key
5. 创建 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
ADMIN_PASSWORD=你的密码（至少12位）
SESSION_SECRET=独立的强随机字符串（推荐）
```

6. 重启 `npm run dev`

详见 [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)。

---

## 四、修改数据

编辑 `data/companies.json` → 运行：

```bash
npm run seed   # 重新生成 supabase/seed.sql
npm run dev    # 重启看效果
```

---

## 五、后台登录

访问 `/admin`，输入你在 Cloudflare Pages / `.env.local` 中设置的 `ADMIN_PASSWORD`。

**注意**：这是服务端环境变量（不带 `NEXT_PUBLIC_` 前缀），密码不会出现在前端 JS bundle 中。

---

## 项目结构速览

```
.
├── app/             # 页面（Next.js App Router）
├── components/      # 公共组件
├── lib/             # 数据层 + 类型
├── data/            # 示例企业数据（单一来源）
├── scripts/         # 工具脚本
├── supabase/        # SQL Schema + seed
├── public/          # 静态资源
└── .github/         # GitHub Actions 部署
```

更多细节见 [`README.md`](./README.md)。