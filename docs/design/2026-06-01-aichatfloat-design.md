# AIChatFloat 设计文档（v1 开源版）

- **日期**：2026-06-01
- **状态**：已确认，待转入实现计划
- **仓库**：https://github.com/FrankJunhaoYe/AIChatFloat
- **一句话**：A floating workspace for AI prompts, conversations, and exports.

---

## 1. 项目愿景与商业模式

AIChatFloat 是一个**悬浮在 AI 聊天网页右侧的浏览器扩展侧边栏**，帮助用户管理提示词、并把对话导出。

- **开源版（本文档范围，免费）**：纯前端、零服务器、零成本、隐私好（数据只存本地）。
- **收费版（以后，不在本文档范围）**：在开源版基础上新增云同步、多站点支持、团队共享、高级导出等。架构需为此**预留扩展点**，但 v1 不实现任何收费功能。
- **双语**：界面支持 English / 中文。

## 2. v1 目标功能（Goals）

注入到 `chatgpt.com` 页面右侧的悬浮侧边栏，提供：

1. **提示词库**：保存 / 搜索 / 管理常用 prompt（本地 CRUD + 搜索）。
2. **一键复制** prompt 到剪贴板。
3. **一键插入** prompt 到 ChatGPT 输入框（操作页面 DOM）。
4. **导出当前对话**为 Markdown / JSON（抓取对话 DOM → 转换 → 下载）。
5. **双语界面**（EN / 中文），应用内可切换。

**关键架构事实**：本扩展**不调用任何 AI 接口**——"AI" 就是 ChatGPT 网页本身。因此 v1 **无需服务器、无需 API Key、无需登录**，纯前端：内容脚本 + 本地存储。

## 3. 非目标（Non-Goals，v1 明确不做）

无账号/登录、无服务器、无云同步、不调 AI 接口、只支持 `chatgpt.com`、只导出 Markdown/JSON、无提示词分享/市场。

## 4. 技术选型（已确认）

- **框架**：WXT（Vite 驱动的 MV3 扩展框架，跨 Chrome/Edge/Firefox，内置内容脚本 Shadow DOM 隔离）。
- **UI**：React + TypeScript + Tailwind。
- **存储**：`chrome.storage.local`（v1 不上 IndexedDB）。
- **i18n**：react-i18next。
- **开源协议**：MIT。
- **v1 浏览器目标**：Chrome + Edge 优先，Firefox 紧随其后。

## 5. 架构总览

纯前端 MV3 扩展，三个核心层 + 若干独立模块：

```
┌─ chatgpt.com 页面 ─────────────────────────────┐
│   [ChatGPT 自己的 UI]            ┌─ Shadow DOM ─┐│
│                                 │  悬浮侧边栏   ││  ← 内容脚本注入，样式隔离
│                                 │ (React UI)   ││
│                                 │  · 提示词库   ││
│                                 │  · 搜索       ││
│                                 │  · 复制/插入  ││
│                                 │  · 导出       ││
│                                 │  · 设置/语言  ││
│                                 └──────────────┘│
└────────────────┬───────────────────────────────┘
                 │ 调用
   ┌─────────────┼──────────────┬─────────────────┐
   ▼             ▼              ▼                 ▼
PromptRepository  ChatGPT        Exporters        i18n
(chrome.storage)  SiteAdapter    (md / json)      (en / zh-CN)
                  ↑ 唯一接触 ChatGPT DOM 的地方
```

| 模块 | 职责 | 边界理由 |
|------|------|---------|
| Content Script | 在 `chatgpt.com` 注入 Shadow DOM 容器，挂载侧边栏，提供折叠手柄 | Shadow DOM 隔离样式 |
| Sidebar UI (React) | 提示词库、搜索、复制/插入、导出、设置 | 纯展示层，不直接碰页面 DOM |
| PromptRepository | prompt 增删改查/搜索，存 `chrome.storage.local` | Repository 模式 → 换云同步只改这层 |
| ChatGPT SiteAdapter | **唯一**懂 ChatGPT DOM 的模块：填输入框、抓对话 | 隔离最易碎代码；多站点扩展点 |
| Exporters | 纯函数 `toMarkdown()` / `toJson()` + 下载 | 纯逻辑，最好测 |
| Background（极简） | 点扩展图标 → 通知内容脚本开关侧边栏 | MV3 要求，尽量薄 |

## 6. 数据流

```
打开 chatgpt.com → 内容脚本注入 → Shadow DOM 挂载侧边栏(默认收起手柄)
点手柄 → 展开 → PromptRepository.findAll() → 渲染列表
搜索 → 内存过滤
点"插入" → SiteAdapter.insertPrompt(text) → 填入 ChatGPT 输入框
点"复制" → clipboard.writeText(text)
增/改/删 → repo.create/update/delete → 持久化 → UI 以不可变更新刷新
点"导出 MD/JSON" → SiteAdapter.extractConversation() → toMarkdown/Json() → 下载
```

## 7. 数据模型

```ts
interface Prompt {
  id: string;        // uuid
  title: string;
  body: string;      // prompt 正文
  tags?: string[];   // 预留：分类/过滤
  createdAt: number;
  updatedAt: number;
}
// 存储键：aicf:prompts（数组） + aicf:schemaVersion（迁移用）

interface ChatMessage { role: 'user' | 'assistant'; content: string; }
interface Conversation {
  title?: string;
  url: string;
  capturedAt: number;
  messages: ChatMessage[];
}
```

## 8. 最关键风险：与 ChatGPT 页面打交道 ⚠️

ChatGPT 的 DOM **不是公开 API**，OpenAI 会不定期改页面结构，可能导致"插入/导出"失效。缓解策略：

- **全部隔离进 `ChatGPTSiteAdapter` 一个模块**——选择器、事件派发只在这里出现，页面变了只改一处。
- **插入输入框**：ChatGPT 使用 ProseMirror contenteditable（如 `#prompt-textarea`）。不能简单 `.value =`，需派发真实的 `beforeinput`/`input` 事件让其 React 状态更新。封装为健壮工具函数。
- **抓取对话**：优先用语义属性（如 `[data-message-author-role]`、`[data-message-id]`）定位，比 class 名稳定。
- **优雅降级**：选择器找不到时弹友好提示，绝不崩溃白屏。
- ⚠️ **具体选择器须在实现时去真实页面核实**（本文档中的选择器示例可能过时）。不变的是设计原则：隔离 + 派发真事件 + 降级。

## 9. 双语 i18n（EN / 中文）

- react-i18next + `en.json` / `zh-CN.json` 两份词典，所有 UI 文案从一开始就外置。
- 应用内语言切换开关（存设置），默认跟随浏览器语言，用户可手动覆盖。
- 商店上架描述用标准 `_locales/`。

## 10. 错误处理

存储失败、剪贴板失败、插入/导出 DOM 找不到 → 全部捕获，在侧边栏弹**非阻塞 toast**，同时 `console` 记详细上下文。绝不静默吞掉。

## 11. 测试策略

| 层级 | 工具 | 测什么 |
|------|------|--------|
| 单元 | Vitest | 导出器(md/json)、PromptRepository(mock storage)、搜索过滤、i18n |
| 适配器 | Vitest + jsdom | 喂保存好的 ChatGPT DOM 快照(fixture) → 验证 `extractConversation()` 输出 |
| E2E | Playwright | 加载扩展，对**本地仿造的 ChatGPT 页面**测插入+导出+侧边栏（可选） |

⚠️ **不在 CI 里测真实 chatgpt.com**（要登录、违反 ToS、太脆）。用"本地仿造页面 + DOM 快照"覆盖逻辑并降低第 8 节风险。目标覆盖率 80%（集中在纯逻辑层）。

## 12. 项目结构（WXT 约定，多个小文件）

```
src/
  entrypoints/
    content.tsx        # 注入 Shadow DOM + 挂载侧边栏
    background.ts       # 极简：图标点击 → 开关侧边栏
    popup/              # 可选的极简弹窗
  components/           # Sidebar, PromptList, PromptEditor, ExportPanel, Settings
  features/
    prompts/            # PromptRepository, types, 搜索
    export/             # exporters(md/json) + 下载
    sites/
      SiteAdapter.ts    # 接口（扩展点）
      chatgpt/          # ChatGPT 适配器（所有选择器在此）
  i18n/                 # react-i18next 配置 + en.json / zh-CN.json
  storage/              # chrome.storage 封装
  lib/                  # uuid、dom 工具、toast
tests/                  # 单元测试 + ChatGPT DOM 快照 fixtures
docs/
```

## 13. 收费版扩展点（v1 只留缝，不实现）

- `PromptRepository` 接口 → 以后换「云同步实现」。
- `SiteAdapter` 接口 → 以后加 `ClaudeAdapter` / `GeminiAdapter`（多站点）。
- 导出器注册表 → 以后加 PDF / Notion 导出。
- 极薄的 `tier` 概念，开源版全开；收费门禁以后做成薄薄一层。

## 14. 待办（转入 writing-plans 后细化）

按此设计生成详细实现计划：脚手架 → 存储层 → 提示词 CRUD/搜索 → 侧边栏 UI → ChatGPT 适配器（插入/抓取）→ 导出器 → i18n → 测试。
