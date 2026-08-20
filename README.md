# 大学信息差网站

收集 985 高校的转专业政策、二次选拔、培养计划、寝室上课实况、学习资料与视频，帮助高考生和家长看清大学之间的真实差异。内容结构已为 211 / 双一流 / 普通高校预留，后续可直接扩充。

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

> Windows 下如果 `npm` 命令因执行策略被禁止，请使用 `npm.cmd`。

## 如何新增一所大学

1. 在 `src/content/universities/` 下新建一个 Markdown 文件（文件名建议用英文，如 `peking-university.md`）。
2. 按已有文件复制 frontmatter（YAML 头部），修改：
   - `name` / `nameEn` / `slug` / `province` / `city` / `type` / `levels` / `tags`
   - `brief`（列表页摘要）、`featured`（是否在首页重点展示）
   - `cover`（封面图，放在 `public/images/` 下）
   - 各栏目：`transferPolicy`（转专业）、`secondarySelection`（二次选拔）、`trainingPlan`（培养计划）、`dorm`（寝室）、`classes`（上课）
   - `materials`（资料：title / description / type / link / code）
   - `videos`（视频：platform / id / url / source / description）
3. 正文写学校概况。
4. 必填字段缺失时构建会报错，可按报错提示补齐。

> 层次 `levels` 支持 `985`、`211`、`双一流`、`普通`，筛选页会自动适配，无需改代码。

## 如何添加视频与资料

- **视频**：目前支持 B 站嵌入。在 `videos` 里填 `platform: bilibili` 和 `id`（B 站 BV 号）即可；优酷/腾讯可在 `src/components/VideoEmbed.astro` 中扩展。
- **资料**：把文件上传到网盘，在 `materials` 里填链接与提取码。

## 投稿与联系方式

投稿页与页脚联系方式集中在 `src/config.ts` 的 `CONTACT` 中，把 `email` 和 `wechat` 换成真实信息即可。投稿页目前用“生成邮件”的方式提交。

## 目录结构

```
src/
  config.ts                 # 站点名称、联系方式、栏目、层次配置
  content.config.ts         # 内容数据校验规则（字段 schema）
  content/
    universities/           # 每所大学一个 Markdown 文件
    articles/               # 专题文章
  layouts/                  # 页面布局
  components/               # 卡片、视频嵌入、栏目区块等组件
  pages/                    # 首页、大学库、详情页、文章、投稿、关于
  styles/global.css         # 全站样式
public/                     # 静态资源（图标、封面图）
```

## 内容声明

- 当前站内大学内容均为**示例数据**，正式上线前需逐条核实。
- 政策类信息请以各高校官方发布为准。
- 学习资料仅收录拥有或已获授权的内容，转载需标注来源。
