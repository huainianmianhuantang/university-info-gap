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

