# 象牙塔透视镜网站

收集 985 高校的转专业政策、二次选拔、培养计划、寝室上课实况、学习资料与校园视频，帮助高考生和家长看清大学之间的真实差异。内容结构已为 211 / 双一流 / 普通高校预留，后续可直接扩充。

## 本地运行

```bash
npm install
npm run dev
```

打开 http://localhost:4321 预览。构建生产版本：

```bash
npm run build
npm run preview
```

> Windows 下如果 `npm` 命令因执行策略被禁用，请使用 `npm.cmd`。

## 站点功能

- **大学库**：39 所 985 高校详情页，支持按省份/类型/层次筛选、搜索，卡片显示视频与资料数量，勾选 2-3 所可进入对比页 `/compare/`。
- **资料库**：文件资料（按大学 / 按类别）与视频资料分开；视频按学校分组，支持按“宣传片 / 宿舍生活 / 学习日常”筛选，三列网格布局。
- **选校测评 `/quiz/`**：12 题兴趣问卷 → 推荐专业方向 + 匹配高校 + AI 建议（规则引擎）。结果保存在浏览器 localStorage。
- **账号与登录**：手机号 + 验证码（开发模式展示演示码）/ 密码登录，QQ / 微信绑定入口（真实接入需开发者资质，当前为演示模式）；不登录也能浏览全部内容，登录后可进入个人中心（收藏 / 测评历史 / AI 对话聚合）、投稿自动带身份、AI 助手个性化问候。数据当前存储于本机（localStorage），云端同步待接入。
- **AI 小助手**：全站右下角 🤖 悬浮窗，可向 DeepSeek 提问（怎么用网站、怎么选方向、转专业等），回答结合站内栏目并给出页面路径，支持聊天历史与快捷问题。
- **首次访问引导**：身份/年级选择 + 三套趣味摸底问卷（高三/低年级/家长），完成后给出个性化使用推荐；首页另有可交互的新手介绍模块（点卡片看说明、可直接进入）。
- **站内搜索 `/search/`**：聚合搜索大学、文章与资料，关键词高亮。
- **收藏夹 `/favorites/`**：收藏学校、按省份/类型筛选、对比勾选、导出文本/JSON。
- **体验细节**：深色模式、对比页打印/差异摘要、首页 FAQ、测评历史、PWA 安装提示、全局 Toast 反馈、文章阅读进度条、标签筛选、提取码一键复制、排序记忆。
- **检索与筛选**：大学库大区筛选/视图切换、站内搜索高亮与空结果建议、资料库全类别展示。
- **其他**：详情页官方渠道入口、随机逛一所、测评进度恢复、对比无参回退本地选择、清空本地数据。
- **维护**：`scripts/check-links.mjs` 全站内链检查、`scripts/resize-logos.mjs` 校徽压缩、`scripts/restart-dev.ps1` 重启开发服务器。
- **无障碍/细节**：aria-live 结果区、对比表 caption/scope、跳过导航、文章 Article 结构化数据。
- **安全**：API Key 仅存 `.env`（不入库）；`/api/advice` 含同源校验与限流；提交前可用 `scripts/check-links.mjs` 检查内链。
- **专题文章**：转专业指南、培养方案阅读方法、宿舍视频甄别、测评使用说明等。

## 如何新增一所大学

1. 在 `src/content/universities/` 新建 Markdown 文件（文件名建议英文，如 `peking-university.md`）。
2. 参考已有文件填写 frontmatter：
   - `name` / `nameEn` / `slug` / `province` / `city` / `type` / `levels` / `tags`
   - `brief`（列表页摘要）、`featured`、`cover`（封面图放 `public/images/`）
   - 栏目：`transferPolicy`（转专业）、`secondarySelection`（二次选拔）、`trainingPlan`（培养计划）、`dorm`（寝室）、`classes`（上课）
   - `materials`（资料：title / description / type / link / code / category）
   - `videos`（视频：title / platform / id / url / source / description / tags）
3. 正文写学校概况。
4. 运行 `npm run build`，按报错补齐必填字段。

> `levels` 支持 `985` / `211` / `双一流` / `普通`，筛选页会自动适配。

## 如何添加视频与资料

- **视频**：支持 B 站嵌入。在 `videos` 里填 `platform: bilibili` 和 `id`（BV 号）即可；建议同时填写 `tags`（宣传片 / 宿舍生活 / 学习日常）与 `source`（官方账号或转载 UP 主）。
- **资料**：
  - 站内文件：放入 `public/resources/<学校简称>/`，`materials` 填站内路径；
  - 网盘链接：填外链与提取码（`code`）；
  - 每条资料必须填 `category`，取值见 `src/config.ts` 的 `RESOURCE_CATEGORIES`（培养方案 / 保研政策 / 奖学金与评优 / 选课与教学 / 新生指南 / 校园生活 / 竞赛）。
- 大文件建议优先使用网盘（参考东北大学 29 份资料迁移至夸克网盘的先例），避免撑大 Git 仓库。

## 选校测评与 AI 建议

- 问卷与推荐引擎：`src/lib/recommender.ts`（纯 TS，可在浏览器运行）。学校画像与各维度推荐学校均在此维护。
- AI 建议：`src/lib/ai.ts` 提供规则引擎兜底；`/api/advice` 服务端接口已接入 **DeepSeek** 大模型（见下）。

### DeepSeek 大模型接入（当前已启用）

1. 复制 `.env.example` 为 `.env`，填入 `AI_API_KEY`（DeepSeek 或任意 OpenAI 兼容接口的 Key）。
2. 站点通过 `@astrojs/node` 适配器在服务端调用大模型，**Key 只存在服务端，不会暴露给浏览器**。
3. 测评结果页会先展示规则引擎建议，随后自动升级为 DeepSeek 生成的分点建议；接口异常时自动回退规则引擎。
4. 更换模型：修改 `.env` 中的 `AI_BASE_URL` 与 `AI_MODEL`（如 OpenAI 兼容服务）。

> 安全提醒：`.env` 已被 .gitignore 忽略，请勿提交或外传 API Key。

## 部署指南

本站为 Astro 站点，已接入 `@astrojs/cloudflare` 适配器：普通页面预渲染为静态文件，`/api/advice` 为 Cloudflare Pages 云函数（读取 `AI_API_KEY` 调用 DeepSeek）。

### Cloudflare Pages（推荐）

1. 把代码推送到 GitHub 仓库（`.env` 不会上传）。
2. 在 Cloudflare 控制台 → Workers & Pages → Create → Pages → 连接 GitHub 仓库。
3. 构建设置：
   - Build command：`npm run build`
   - Build output directory：`dist`
   - 如默认 Node 版本过低，添加环境变量 `NODE_VERSION=22`。
4. 在 Pages 项目 Settings → Environment variables 中添加：
   - `AI_API_KEY`（必填，DeepSeek Key，勾选 Encrypt）
   - `AI_BASE_URL=https://api.deepseek.com`（可选）
   - `AI_MODEL=deepseek-chat`（可选）
   - `PUBLIC_SITE_URL`（可选，见下方“站点地址”说明）
5. 部署完成后，验证首页与 `/quiz/` 的 AI 建议接口。
6. 绑定自定义域名（可选）：Pages 项目 → Custom domains。

> **站点地址（canonical / OG / sitemap / robots）**：代码中默认写的是 `https://ivory-tower-xray.pages.dev`。
> 若你创建 Pages 项目时用的就是这个名称，无需任何额外配置；
> 若用了其他名称，二选一：① 在环境变量中设置 `PUBLIC_SITE_URL=https://你的项目名.pages.dev`；② 修改 `src/config.ts` 与 `astro.config.mjs` 中的地址后重新部署。
> 绑定自定义域名后，把 `PUBLIC_SITE_URL` 改成正式域名即可。

### 本机开发 / 预览

- 开发：`npm run dev`（默认 http://localhost:4321）。
- 生产构建：`npm run build`，产物在 `dist/`（含 `_worker.js` 与 `_routes.json`，可直接用 `wrangler pages deploy dist` 上传）。

部署前把 `src/config.ts` 中的 `CONTACT` 改为真实联系方式。

## 目录结构

```
src/
  config.ts             # 站点名称、联系方式、栏目、层次、资料类别
  content.config.ts     # 内容数据校验规则（schema）
  content/
    universities/       # 每所大学一个 Markdown 文件
    articles/           # 专题文章
  lib/
    recommender.ts      # 选校测评推荐引擎
    ai.ts               # AI 建议（规则版 + 预留 LLM 接口）
  layouts/              # 页面布局（含 SEO meta）
  components/           # 卡片、视频嵌入、导航等组件
  pages/                # 首页、大学库、对比、测评、资料库、文章、投稿、关于
  styles/global.css     # 全站样式
public/                 # 静态资源（图标、封面、robots.txt）
```

## 内容声明

- 校内政策类信息请以各高校官方发布为准。
- 学习资料仅收录拥有或已获授权的内容，转载需标注来源。
- 视频来源均已标注官方账号或转载 UP 主，欢迎举报失效/错误链接。
