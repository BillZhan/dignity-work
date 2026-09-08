# 部署指南

> 完整流程：**本地 git 初始化 → GitHub 推送 → Cloudflare Pages 自动部署**

预计耗时：**15-20 分钟** · 完全免费

---

## 方案 A · Cloudflare Pages（推荐，免费 + 全球 CDN + 自动 HTTPS）

### Step 1 · 把代码推到 GitHub

#### 1.1 在 GitHub 创建仓库

1. 打开 https://github.com/new
2. 填写：
   - **Repository name**：`dignity-work`（或你喜欢的名字）
   - **Description**：「让每一份劳动，都有尊严」公益 Web MVP
   - **Public / Private**：选 **Public**（方便分享）
   - **⚠️ 不要勾选** Add a README / .gitignore / license（我们已有）
3. 点击 "Create repository"
4. **保留打开的页面**，下一步要复制里面的命令

#### 1.2 本地初始化 git 并推送

回到项目根目录（`C:\Users\shizh\WorkBuddy\2026-09-08-10-10-06`），依次执行：

```bash
# 进入项目目录
cd "C:\Users\shizh\WorkBuddy\2026-09-08-10-10-06"

# 初始化 git
git init

# 配置身份（如果没配过）
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"

# 添加所有文件
git add .

# 首次提交
git commit -m "feat: initial MVP — 让每一份劳动，都有尊严"

# 连接 GitHub 仓库（替换 YOUR_USERNAME 和 YOUR_REPO）
git remote add origin https://github.com/YOUR_USERNAME/dignity-work.git

# 推送到 main 分支
git branch -M main
git push -u origin main
```

如果 GitHub 提示登录认证，按提示完成 Personal Access Token 流程即可。

> **Windows 凭据提示**：用 HTTPS 推送时，GitHub 不再支持密码登录。
> 需要在 https://github.com/settings/tokens 生成一个 **Personal Access Token (classic)**，
> 勾选 `repo` 权限。推送时用户名填 GitHub 用户名，密码填这个 token。

---

### Step 2 · 在 Cloudflare Pages 连接 GitHub

1. 登录 https://dash.cloudflare.com/
2. 左侧菜单 → **Workers & Pages** → **Pages**
3. 点击 **"Create application"** → **"Pages"** → **"Connect to Git"**
4. 选择 **GitHub** → 授权 Cloudflare 访问你的 GitHub 账号
5. 选择刚创建的 `dignity-work` 仓库 → "Begin setup"
6. 填写构建配置：
   - **Project name**：`dignity-work`（将作为你的子域名 `dignity-work.pages.dev`）
   - **Production branch**：`main`
   - **Framework preset**：选 **"Next.js"**（Cloudflare 自动识别）
   - **Build command**：`npm run export`（⚠️ 必须填写，CF 默认是 `next build`）
   - **Build output directory**：`out`
   - **Node version**：`22`（点击 "Add variable"，设置 `NODE_VERSION=22`）

---

### Step 3 · 配置环境变量（重要！）

点击页面下方 **"Environment variables"** → "Add variable"，分别添加：

| 名称 | 值 | 适用环境 |
|------|----|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Production + Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...`（你的 anon key）| Production + Preview |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | 你的强密码（不要用默认 `dignity2026`）| Production + Preview |
| `NODE_VERSION` | `22` | Production + Preview |

> ⚠️ 如果暂时不接入 Supabase，留空即可，网站会用本地 mock 模式运行。
> 但用户的提交和支持数据不会跨设备共享。

---

### Step 4 · 部署

1. 点击 **"Save and Deploy"**
2. Cloudflare 会自动：
   - 拉取代码
   - 安装依赖
   - 运行 `npm run export`
   - 部署到全球 CDN
3. 等待 1-3 分钟，看到 **"Success 🎉"** 即部署完成
4. 点击页面顶部的链接（如 `https://dignity-work.pages.dev`）即可访问

> **自定义域名**（可选）：
> Cloudflare Pages → 你的项目 → **Custom domains** → "Set up a custom domain"
> 跟着向导把 `yourdomain.com` 解析到 Cloudflare，约 5-10 分钟生效。

---

### Step 5 · 配置自动部署

默认情况下，**每次 push 到 main 分支都会自动部署**。

```bash
# 日常开发流程
git add .
git commit -m "feat: 增加 5 家新企业"
git push
# → Cloudflare 自动部署，约 1-2 分钟
```

预览分支（如 `dev`）的部署会生成 `xxx.dignity-work.pages.dev` 预览链接。

---

## 方案 B · GitHub Pages（免费）

> 适合想把代码直接放在 GitHub 的用户。注意 GitHub Pages 没有 Cloudflare 的全球 CDN，速度可能略慢。

### Step 1 · 修改 basePath

如果使用 **项目页**（不是用户/组织页），需要 `next.config.js` 加 `basePath`：

```js
const nextConfig = {
  output: "export",
  basePath: "/dignity-work",   // ← 替换成你的仓库名
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};
moduleUser = nextConfig;
```

### Step 2 · GitHub Actions 已就绪

本仓库已包含 `.github/workflows/deploy.yml`，配置如下：

```yaml
# 已配置好，无需修改
# - 监听 push 到 main
# - Node 22 + npm ci + npm run export
# - 部署到 GitHub Pages
```

只需在仓库 **Settings → Pages**：
- **Source**：选 **"GitHub Actions"**

下次 push 代码即自动部署。

---

## 部署后必做清单

- [ ] 在 Cloudflare Pages 设置 `NEXT_PUBLIC_ADMIN_PASSWORD` 为强密码
- [ ] （可选）接入 Supabase，让数据持久化
- [ ] 测试 ❤️ 支持按钮：刷新页面看是否依然显示"已支持"
- [ ] 测试 /submit 表单提交
- [ ] 测试 /admin 后台登录
- [ ] 在 Cloudflare 启用 **Web Analytics**（免费）
- [ ] 提交搜索引擎收录：Google Search Console + 百度站长平台

---

## 性能优化（可选）

项目已经做了基础优化：
- ✅ 图片懒加载
- ✅ 字体系统级回退
- ✅ 静态导出，首屏快速
- ✅ 路由级代码分割

如果你想进一步优化：
1. 用 [Cloudflare Images](https://developers.cloudflare.com/images/) 替换 Unsplash 链接
2. 接入 [Plausible Analytics](https://plausible.io/) 替代 Google Analytics（隐私友好）
3. 用 [Tailwind CSS PurgeCSS](https://tailwindcss.com/docs/optimizing-for-production) 已经自动开启

---

## 故障排查

| 现象 | 排查 |
|------|------|
| Cloudflare 构建失败 | 查看 build log，通常是 Node 版本不对，添加 `NODE_VERSION=22` 环境变量 |
| 404 页面找不到 | 检查 `next.config.js` 的 `trailingSlash: true` 是否设置 |
| 数据不显示 | 控制台检查 Supabase URL 是否可访问（浏览器打开应该返回 401 或 JSON） |
| /admin 一直跳回登录 | 检查 `NEXT_PUBLIC_ADMIN_PASSWORD` 是否在 Cloudflare 环境变量中 |
| 首页空白 | 大概率是环境变量未生效，触发 "Retry deployment" 重新部署 |
| GitHub 推送失败 | 检查 Personal Access Token 是否过期，或用 SSH key |

---

## 回滚

Cloudflare Pages → 你的项目 → **Deployments** → 找到上一个成功的版本 → "..." → **"Rollback to this deploy"**

---

部署完成后，把你的链接发到社区/朋友圈，让更多消费者一起用消费支持善待劳动者的企业 ❤️