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
NEXT_PUBLIC_ADMIN_PASSWORD=你的密码
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

访问 `/admin`，密码为 `.env.local` 中的 `NEXT_PUBLIC_ADMIN_PASSWORD`，默认是 `dignity2026`。

**生产环境务必修改！**

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