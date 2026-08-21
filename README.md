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
- **站内搜索 `/search/`**：聚合搜索大学、文章与资料，关键词高亮。
- **收藏夹 `/favorites/`**：收藏学校、按省份/类型筛选、对比勾选、导出文本/JSON。
- **体验细节**：深色模式、对比页打印/差异摘要、首页 FAQ、测评历史、PWA 安装提示。
- **检索与筛选**：大学库大区筛选/视图切换、站内搜索高亮与空结果建议、资料库全类别展示。
- **其他**：详情页官方渠道入口、随机逛一所、测评进度恢复、对比无参回退本地选择、清空本地数据。
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

本站为 Astro 站点，已接入 `@astrojs/node`（standalone）适配器：普通页面构建为静态文件，`/api/advice` 为服务端接口。因此部署需要能运行 Node 的环境：

- **本机生产预览**：`npm run build` 后执行 `node dist/server/entry.mjs`（默认端口 4321，可用环境变量 `PORT`/`HOST` 调整）。
- **VPS / 云服务器 / 容器**：构建后以 Node 运行 `dist/server/entry.mjs`，用 Nginx/Caddy 反代；配置 `PORT`、`HOST`、`PUBLIC_SITE_URL` 与 `.env` 中的 `AI_API_KEY`。
- **Vercel / Netlify / Cloudflare Pages**：导入仓库即可，构建命令 `npm run build`，输出目录 `dist`；如需在边缘函数中调用 AI，可后续替换为对应平台的适配器（如 `@astrojs/vercel`）。

部署前设置环境变量 `PUBLIC_SITE_URL` 为正式域名，并把 `src/config.ts` 中的 `CONTACT` 改为真实联系方式。

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
