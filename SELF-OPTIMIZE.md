# 自检自优化日志（5 轮 × 20 项）

> 由 Codex 按用户要求逐轮自定目标、实现、验证并提交。

## 第 1 轮：安全与基础加固（已提交）

- [x] 新增 public/security.txt 安全联系页
- [x] _headers 增加基础 CSP（限制脚本/样式/图片/媒体/iframe 来源，object-src none）
- [x] _headers 增加 Cross-Origin-Opener-Policy / Cross-Origin-Resource-Policy
- [x] 搜索页 noindex（查询页不进索引）
- [x] 收藏页 noindex（个人数据页）
- [x] 测评页 noindex（结果含个人偏好）
- [x] 对比页 noindex（URL 状态页）
- [x] 引导弹窗支持 Esc 关闭（等价于跳过）
- [x] prefers-reduced-motion：引导/首页引导/帮助菜单/全局动画降级
- [x] 全局 :focus-visible 键盘焦点样式
- [x] 投稿表单友好中文校验提示（oninvalid/oninput）
- [x] 测评步骤条 aria-live
- [x] BaseLayout 增加 noscript 提示
- [x] PWA 移动端 meta（mobile-web-app-capable / apple / format-detection）
- [x] 收藏/测评动态图片 decoding=async
- [x] 验证：导航 aria-expanded 正常
- [x] 验证：404 自定义页正常
- [x] 验证：搜索页 esc() 转义安全
- [x] 验证：外链均带 rel=noopener
- [x] 验证：/api/advice 不再泄露 keySet


## 第 2 轮：界面 AI 小助手（已提交）

- [x] 新增 /api/assistant 服务端接口（DeepSeek，带站内栏目上下文）
- [x] 同源校验（拒绝跨站调用）
- [x] 进程内限流（每 IP 60 秒 15 次）
- [x] 载荷校验（messages 数量/角色/内容长度）
- [x] 友好中文错误提示，不泄露堆栈
- [x] AI 悬浮按钮 🤖（左下角，全站）
- [x] 聊天面板：消息气泡 + 输入框 + 发送
- [x] 4 个快捷问题 chips
- [x] 欢迎语 + 底部免责声明
- [x] 输入中三点闪烁动画
- [x] 出错时提供「重试」按钮
- [x] 聊天记录 localStorage 持久化（最多 20 条）
- [x] 「清空对话」按钮
- [x] 移动端面板自适应
- [x] 深色模式适配（CSS 变量）
- [x] Esc 关闭面板
- [x] Enter 发送 / Shift+Enter 换行
- [x] 无障碍：role=dialog、aria-live、aria-expanded
- [x] 全站接入（BaseLayout）
- [x] 回复支持 Markdown 粗体与站内链接渲染

## 第 3 轮：UI/UX 打磨（已提交）

- [x] 全局 Toast 轻提示组件（role=status + aria-live）
- [x] 测评复制结果 / 分享接入 Toast
- [x] 收藏导出接入 Toast
- [x] 详情页复制链接接入 Toast
- [x] 帮助菜单新增「问问 AI 小助手」入口
- [x] AI 面板支持 ai:open 事件联动打开
- [x] 关于页 AI 描述更新（实际已接入 DeepSeek）
- [x] 关于页新增「数据来源」板块
- [x] 投稿页新增「填入示例」一键填充按钮
- [x] 页脚新增数据来源与免责声明折叠块
- [x] 首页 FAQ 新增 AI 小助手说明
- [x] 详情页校徽图片 fetchpriority=high
- [x] 全局 touch-action: manipulation（消除移动端点击延迟）
- [x] 移动端导航点击菜单项后自动收起
- [x] Toast 自动消失（2 秒）与移动端适配
- [x] 深色模式适配（沿用 CSS 变量）
- [x] 验证：对比页空状态提示正常
- [x] 验证：搜索空结果提示正常
- [x] 验证：文章页返回列表链接存在
- [x] 验证：资料库分类描述正常
