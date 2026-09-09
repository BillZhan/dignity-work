# Supabase 接入指南

> 预计耗时：**10-15 分钟** · 完全免费（Supabase 免费额度：500 MB 数据库 + 1 GB 存储 + 50k MAU）

---

## 为什么需要 Supabase？

当前项目使用本地 mock 数据，所有用户提交 / 支持都存在浏览器 localStorage 里。
接入 Supabase 后，数据会持久化到云端，**所有用户共享一份真实数据**，
并且支持人数、支持去重、提交审核都在后端生效。

---

## Step 1 · 注册 + 创建项目

1. 打开 https://supabase.com/dashboard/sign-up
2. 用邮箱注册（建议用项目邮箱）
3. 登录后点击 **"New Project"**
4. 填写：
   - **Name**：`dignity-work`（或你喜欢的名字）
   - **Database Password**：点 "Generate a password" 并**保存到密码管理器**
   - **Region**：选离你最近的区域（对中国用户建议 `Singapore` 或 `Tokyo`，延迟更低）
   - **Plan**：选 **Free**
5. 点击 "Create new project"，等待 ~2 分钟项目初始化完成

---

## Step 2 · 跑数据库 Schema

项目初始化完成后：

1. 左侧菜单 → **SQL Editor**
2. 点击 "New query"
3. 复制本仓库 `supabase/schema.sql` 的**全部内容**粘贴进去
4. 点击右下角 **"Run"**（或按 Ctrl+Enter）

预期结果：`Success. No rows returned`（建表语句不返回行）

这条 SQL 会创建：
- 6 张表（companies / labor_rights / submissions / supports / reports / admin_users）
- RLS 策略（公共读 published + 公开写提交 / 支持 / 举报）
- `support_count` 自增触发器

---

## Step 3 · （可选）导入示例数据

如果想直接有数据可看：

1. 左侧菜单 → **SQL Editor** → "New query"
2. 粘贴 `supabase/seed.sql` 的内容（下一节会生成）
3. 运行

预期：`Success. 25 rows inserted` 之类的输出。

---

## Step 4 · 获取 API 凭据

1. 左侧菜单 → **Project Settings** → **API**
2. 复制：
   - **Project URL**（形如 `https://xxxxx.supabase.co`）
   - **anon / public** key（一长串以 `eyJ` 开头的 JWT）
3. ⚠️ **不要** 复制 `service_role` key，那个有写权限的，只能在服务端使用

---

## Step 5 · 配置环境变量

### 本地开发

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

填入：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_PASSWORD=你的新后台密码（至少12位）
SESSION_SECRET=独立的强随机字符串
```

重启 `npm run dev`，打开控制台确认：

```bash
# 浏览器 Console 应该没有 Supabase 报错
# 第一次访问 /companies/ 时，应能看到从云端拉取的数据
```

### Cloudflare Pages（部署后）

1. Cloudflare Dashboard → Pages → 你的项目 → **Settings** → **Environment variables**
2. 添加两条：
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://xxxxx.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJ...`
   - `ADMIN_PASSWORD` = 你的新密码（不带 NEXT_PUBLIC_ 前缀！）
   - `SESSION_SECRET` = 独立的强随机字符串
3. 保存 → 触发一次重新部署（Deployments → 最新一次 → "Retry deployment"）

---

## Step 6 · 验证

部署完成后，访问你的网站：

1. **首页**：应正常显示企业（从 Supabase 读取）
2. **点击 ❤️ 支持**：去 `supabase.com/dashboard` → Table Editor → `supports` 表新增一条，`companies.support_count` 应自动 +1
3. **/submit 提交**：submissions 表新增一条，status = `pending`
4. **/admin 登录**：用你设置的密码登录，可审核 submissions / 修改 companies

---

## 数据安全 / RLS 说明

我们的 RLS 策略：

| 操作 | 谁能做 |
|------|--------|
| 读已发布企业 | 任何人 |
| 读企业权益 | 任何人 |
| 提交企业（submissions）| 任何人 |
| 点赞支持（supports）| 任何人（visitor_id 去重） |
| 举报纠错（reports）| 任何人 |
| **修改 / 删除企业** | ❌ 仅 service_role（即后台登录后用） |

由于本 MVP 的后台是用密码登录而非 Supabase Auth，
管理操作（编辑 / 删除企业、修改提交状态）需要通过 service_role key。
**安全建议**：把后台放到一个独立页面（如 `/_admin`），
仅当你需要管理功能时才输入 service_role key（不要硬编码到前端）。

> **V2 路线**：把后台改造为 Supabase Auth（魔法链接登录），
> 这样管理员的 RLS 写权限自动按角色控制，无需在前端持有 service_role key。

---

## 故障排查

| 现象 | 排查 |
|------|------|
| 页面一直 loading | 控制台检查 `NEXT_PUBLIC_SUPABASE_URL` 是否以 `https://` 开头、没有尾斜杠 |
| 提交后没有写入 | SQL Editor 检查 `submissions` 表 RLS 策略是否成功创建（运行 `select * from pg_policies;`） |
| 报错 401 Unauthorized | anon key 不对，重新复制 |
| 报错 "permission denied for table companies" | RLS 未生效，重新跑 schema.sql |
| Cloudflare 上看不到数据 | 环境变量没生效，触发重新部署 |

---

## 限额参考（免费额度）

| 项目 | 额度 |
|------|------|
| 数据库 | 500 MB |
| 存储 | 1 GB |
| 月活用户 MAU | 50,000 |
| 出站流量 | 5 GB |
| Edge Functions | 500k 请求 / 月 |

对 MVP 来说完全够用。等达到上限前迁移到 Pro Plan（$25/月）即可无缝升级。

---

完成以上 6 步后，你的网站就拥有了真实云端数据 + 持久化能力。
下一步：去 Cloudflare Pages 部署吧！详见 `DEPLOY.md`。