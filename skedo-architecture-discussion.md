# Skedo 架构与低代码替换 AEM 讨论纪要

> 导出时间：2026-11-16  
> 范围：Skedo 项目架构梳理、JSON/YML 渲染链路、是否可替代 AEM、个人网银低代码方案、ISR / cacheTag 设计

---

## 1. Skedo 项目架构概览

**Skedo** 是一套低代码可视化搭建平台的 monorepo（实际代码在 `skedo-master/skedo-master/`），核心是「元数据驱动的页面编辑 + 渲染运行时 + 微服务」。

### 1.1 整体分层

```
编辑器 UI (@skedo/ui)
    ↓
Meta / Node 树 (@skedo/meta) + Loader + Render
    ↓
HTTP (@skedo/request)
    ↓
微服务：doc / upload / packager / faas / runtime
    ↓
DAO (Sequelize + SQLite/MySQL) + Redis
```

### 1.2 仓库结构

| 目录 | 作用 |
|------|------|
| `packages/` | 主产品：编辑器、元数据、渲染、后端服务、CLI |
| `coursewares/` | 教学课件（Vue3 / TS / DSL 等），相对独立 |
| `scripts/bootstrap/` | 自定义包管理：扫描、link、build、统一启动 |

包用 `skedo.type` 区分：`app` / `lib` / `service` / `cli`。

### 1.3 核心包职责

**前端 / 运行时**

| 包 | 职责 |
|----|------|
| `skedo-ui` | React 编辑器（拖拽、属性面板、预览、Codeless/FaaS 页） |
| `skedo-meta` | 领域核心 — `ComponentMeta` / `Node` / `Page` / `Bridge` |
| `skedo-render` | `NodeRender`，编辑预览与独立 runtime 共用 |
| `skedo-loader` | 本地 YAML + 远程组件元数据加载 |
| `skedo-runtime` | 页面脚本 API（`SkedoContext` 操作节点） |
| `skedo-request` | 调各微服务的客户端 |
| `skedo-code` / `code-tools` | Codeless/FaaS 工程模型与构建执行 |

**后端服务**

| 包 | 端口(dev) | 职责 |
|----|-----------|------|
| `skedo-svc-doc` | 7002 | 页面 / 组件 / 代码工程 CRUD |
| `skedo-svc-upload` | 7001 | 文件上传（Egg.js） |
| `skedo-svc-packager` | 7004 | 代码工程构建 |
| `skedo-svc-faas` | 7005 | FaaS 函数执行 |
| `skedo-svc-runtime` | 3003 | 独立运行时前端 |
| `skedo-dao` + `svc-config` | — | Sequelize 文档存储（dev 默认 SQLite）+ Redis |

**工具链**：`skedo-cli`（组件发布）、`skedo-creator`（脚手架）、`externals/`（示例外挂组件）

### 1.4 技术栈

- 编辑器：React 17 + Ant Design + Webpack
- 领域层：Immutable.js
- 后端：Express / Egg
- 存储：Sequelize（SQLite/MySQL）+ Redis
- 打包：Rollup / Webpack

### 1.5 启动方式

```shell
yarn install
npm run reinstall
ts-node packages/skedo-dao/src/force_build_db.ts
npm start
```

`npm start` 由 bootstrap 并行启动所有 `service` + `app`。

**一句话：** YAML/远程 Meta → Node 树 → UI 编辑或 Render 渲染 → 微服务存取 → 可选 Codeless/FaaS 脚本驱动页面。

---

## 2. Editor 产出的 JSON / YML 如何 Render 成页面

### 2.1 总览

```
编辑器 Node 树
    → PageExporter → JsonPage JSON
    → fileRemote + pageRemote → 文档服务

组件 YML
    → ComponentsLoader → ComponentMeta

加载时：
    JsonPage + ComponentMeta
    → new Page(json, loader) → Page / Node 树
    → NodeRender + Bridge → 浏览器 DOM
```

有两套产物：

- **页面 JSON（`JsonPage`）**：编辑器拖出来的结构
- **组件 YML**：组件怎么渲染、有哪些 props（内置 + 远程）

### 2.2 编辑器产出什么

页面序列化结构：

```ts
JsonPage = {
  links: Record<number, JsonNode>,  // 可复用原型（如列表项）
  page: JsonNode                     // 页面根子树
}
```

每个 `JsonNode` 大致是：`group` + `name` + `box` + `passProps` + `children`（可选 `linkedId`）。

保存链路（`UIModel.save`）：

1. `PageExporter.exportToJSON(pageNode)` → `Node.toJSON`
2. `fileRemote.post1` 上传 JSON 文件（内容寻址 URL）
3. `pageRemote.put(user, pageName, url)` 记下这个 URL

YML 不随页面一起存；页面节点只记 `group.name`，渲染时再查 Meta。

### 2.3 YML → ComponentMeta

`ComponentsLoader`：

- 打包时 `require.context` 加载 `skedo-loader/yml/*.yml`（如 `button.yml` 的 `url: local.Button`）
- 再拉远程组件 YML，合并进同一套 `loadByName(group, name)`

YML 提供：布局 `box`、默认 props、样式、`url`（本地组件名或外挂 JS）、`componentType`（react/vue）、属性面板配置等 → 建成 `ComponentMeta`。

### 2.4 JSON + Meta → 内存 Node 树

1. `ComponentsLoader.load()` 就绪
2. `pageRemote.get` → `fileRemote.get(url)` → `JSON.parse` 得 `JsonPage`
3. `new Page(name, json, loader)`

`Page` 构造里：

1. 先建画布 `root`（`container.root`）
2. 还原 `links`
3. `fromJson(json.page)` 递归建树并挂到 `root`

`fromJson` 关键：用 `json.group` / `json.name` 取 Meta，再用 `createDataFromJson` / `createData` 生成 Immutable 实例数据，new 出 `Node`（或 `LinkedNode`），再递归 children。

### 2.5 Node 树 → 浏览器页面

预览入口：`Preview.tsx` → `<NodeRender node={page.getRoot()} />`（来自 `@skedo/render`）。

`NodeRender` 对每个节点：

1. 若是 `root`，剥掉，只渲染真正的 page 子节点
2. 看 `node.meta.url`：
   - `local.*` → 内置 React 组件（Button、Page、Div…）
   - 否则 → `ExternalComponent` 拉 JS、`eval`/`define` 挂载 React 或 Vue
3. `InnerRender` 创建 `Bridge(node, page, "render")`，把 props 从 `passProps` 传给组件
4. `Styled` 用 `box` + style 写成定位/尺寸的外层 `div`，并 `node.mount(dom)`
5. 容器组件通过 `bridge.render('react', child)` 递归再进 `NodeRender`

### 2.6 两条渲染入口对照

| | 编辑器画布 | Preview / svc-runtime |
|--|--|--|
| 渲染器 | `skedo-ui` 的 `NodeRender` | `@skedo/render` 的 `NodeRender` |
| Bridge | `"editor"` | `"render"` |
| 交互壳 | Draggable / Selectable | 无，只 Styled + 组件 |
| 数据 | 内存里的 `UIModel.page` | 从服务拉 JSON 再 `new Page` |

**一句话：** 编辑器把 Node 树存成 `JsonPage`；渲染时先用 YML 注册组件 Meta，再把 JSON hydrate 成带 Meta 的 Node 树，最后 `NodeRender` 按 `meta.url` 解析本地/外挂组件，用 `Bridge` 递归把子树刷进 DOM。

---

## 3. 浏览器最终拿到的是静态 HTML 吗？

**不是静态 HTML 页面。**

浏览器首包大致是：

1. 一个几乎空的 `index.html`（挂载点 + JS/CSS）
2. React 运行时（`@skedo/render` / 编辑器里的 Preview）
3. 再请求拿到的 **页面 JSON** + **组件 Meta（YML）**，以及可能的外挂组件 JS

然后在浏览器里：

`JSON → Page/Node 树 → NodeRender 递归挂组件 → 动态生成 DOM`

服务端（`skedo-svc-runtime`）目前也只是把 `index.html` 发出去；SSR（`renderToString`）相关代码是注释掉的，没有真正把页面预渲染成完整 HTML。

所以最终看到的「页面」是 **客户端根据 JSON 动态渲染出来的**，不是编辑器导出的一份写死的静态 HTML。

---

## 4. 能否用 Skedo 淘汰 AEM？

**不能当 AEM 的直接替代品直接上；只能覆盖 AEM 里「可视化搭页面」那一小块，而且还要大量补齐。**

### 4.1 重合的部分

Skedo 和 AEM 有一点相似：都是「非开发人员在画布上搭页面 → 按组件元数据渲染」。

若淘汰 AEM 的目标**仅限于**：

- 内部运营页 / 活动落地页
- 组件拖拽搭建
- React/Vue 自定义组件接入
- 简单预览发布

那这套思路（Meta + JSON + 运行时渲染）可以当**自研低代码底座的参考或起点**。

### 4.2 AEM 有、Skedo 基本没有的

| AEM 能力 | Skedo 现状 |
|----------|------------|
| 内容仓库 / 站点树 / 多站点 | 基本是按 `user/pageName` 存一份 JSON |
| 审批流、定时发布、回滚版本 | 未见工作流；文档模型很薄 |
| DAM 数字资产管理 | 只有上传服务，不是资产库 |
| 权限、组织、SSO、审计 | `x-user` 级别，非企业鉴权 |
| 多语言 / Live Copy / MSM | 无 |
| 个性化、Target 类能力 | 无 |
| 企业级运维、集群、合规 | 教学/原型级微服务 |
| SSR/SEO/CDN 发布管线 | 客户端动态渲染；SSR 仍是注释状态 |

从仓库气质看，它更像**低代码教学/原型工程**，不是生产级 CMS/DXP。

### 4.3 结论

1. **「用现成 Skedo 直接换掉 AEM」→ 不建议。**
2. **「借鉴这套架构自研轻量搭建平台，替代 AEM 里一部分落地页场景」→ 可以评估。**
3. **若 AEM 承载官网、多品牌站、合规内容、复杂工作流** → 应看成熟 CMS/DXP 或自研 headless + 自建编辑器，而不是直接押这套仓库。

**一句话：** Skedo 证明了「JSON/YML → 运行时渲染」这条路；要淘汰 AEM，缺的是整套企业内容平台，不是这一层渲染器本身。

---

## 5. 个人网银场景：数据 + 低代码 JSON 如何组成最终页面

### 5.1 业务背景

- 目标：淘汰 AEM，使用自研低代码平台
- 做法：将 AEM 中的组件打包成 JS / CSS 放到 S3，作为低代码平台组件
- 待解决问题：如何动态地将 **业务数据** 和 **低代码生成的 JSON** 组合成最终页面

### 5.2 三件事拆开

1. **页面结构 JSON**（低代码产出）
2. **组件资产**（AEM 拆出来的 JS/CSS，放 S3）
3. **业务数据**（账户、卡列表、交易等，接口返回）

最终页面 = **结构 JSON 描述树 → 按节点加载 S3 组件 → 把数据按约定灌进组件**。

### 5.3 推荐的组合模型

```text
低代码 JSON（布局/组件树/绑定声明）
        +
S3 上的组件包（JS/CSS，带稳定组件名）
        +
运行时 Data Context（接口/聚合层）
        ↓
Page Runtime：递归渲染节点
  - 解析 type → 加载对应 S3 组件
  - 按 bind / props 从 Data Context 取值
  - 把 props 传给组件实例
```

页面 JSON 建议只存「结构 + 绑定」，**不要**把接口里的业务大对象写死进 JSON：

```json
{
  "type": "AccountCard",
  "props": { "title": "我的账户" },
  "bind": {
    "balance": "$.accounts.primary.balance",
    "currency": "$.accounts.primary.currency"
  },
  "children": []
}
```

运行时伪流程：

```ts
function renderNode(node, data) {
  const Comp = registry.load(node.type) // 从 S3 按名加载已注册组件
  const props = {
    ...node.props,
    ...resolveBind(node.bind, data), // JSONPath / 自研路径解析
  }
  return <Comp {...props}>{node.children?.map(c => renderNode(c, data))}</Comp>
}
```

与 Skedo 同构：JSON → Node 树 → 按 `meta.url` 找组件 → `Bridge`/`passProps` 灌数据；差别是把「外挂组件」换成 **S3 上的 AEM 遗产组件**，把「passProps」升级成明确的 **bind + Data Context**。

### 5.4 数据怎么进页面（三种，建议组合用）

| 方式 | 适用 | 做法 |
|------|------|------|
| **页面级注入** | 首屏关键数据（客户信息、账户摘要） | 进页先调 BFF/聚合接口 → `DataContext` → 整树按 `bind` 取值 |
| **组件内自取** | 局部、可懒加载（近期交易、广告位） | 组件 mount 后自己调 API；JSON 只配 `apiKey` / 查询参数 |
| **事件驱动刷新** | 转账成功后刷新余额 | 组件 `emit('refresh', 'accounts')` → Runtime 重拉对应数据切片再 re-render |

个人网银建议：**首屏用页面级聚合数据 + bind**；列表/次要模块允许组件自取。

### 5.5 落地时必须定的 4 个契约

1. **组件契约**：每个 S3 组件的 `name`、`props schema`、`events`、依赖 CSS
2. **JSON schema**：节点字段固定：`type` / `props` / `bind` / `children` /（可选）`visibleWhen`、`style`
3. **Data Context 形状**：BFF 返回稳定结构；`bind` 路径都相对于这份 Context
4. **加载与版本**：S3 组件带版本号，页面 JSON 锁定版本

### 5.6 结合现状的路径

```text
AEM 组件 → 打包 JS/CSS → S3
                ↓
低代码编辑器：拖组件 → 配 props/bind → 存页面 JSON
                ↓
网银容器 App：进路由 → 拉 JSON + 拉页面数据 → Runtime 渲染
```

### 5.7 建议避免

- 把接口响应整份塞进低代码 JSON 再「生成页面」
- 每个组件自己拼完整 URL 和鉴权（应走统一 BFF / 网关）
- Runtime 里 `eval` 任意脚本（应用白名单 + 已签名组件包）

**一句话：** 低代码 JSON 只描述「用哪些组件、怎么排、数据从哪取」；S3 提供组件实现；运行时用 Data Context 按 `bind` 把数据和组件 props 拼起来渲染。

---

## 6. ISR 缓存策略与类似 cacheTag 的失效

### 6.1 先定：ISR 缓存什么

| 层 | 能不能 ISR | 建议 |
|----|------------|------|
| 页面结构 JSON | 能 | 强缓存 + tag |
| 组件 JS/CSS（S3） | 能 | 版本化 URL，少靠 purge |
| **组装后的页面产物**（HTML / RSC payload / 渲染指令） | 能 | 这才是 ISR 主体 |
| 用户账户/交易等业务数据 | **不要进页面 ISR** | 运行时拉取，或极短 TTL + 私有缓存 |

推荐产物形态：

```text
Cached Page Artifact = {
  pageId, pageVersion,
  tree,                    // 已解析的结构（可含 resolved 组件版本）
  componentRefs: [...],    // 本页用到的组件及版本
  htmlOrRenderPlan,        // 静态壳 / 流式指令（占位数据槽）
  dataSlots: [...]         // 哪些位运行时灌数，不进公共缓存
}
```

公共 CDN/边缘缓存的是 **Artifact**；登录后数据在浏览器或 BFF 私有通道补齐。

### 6.2 cacheTag 怎么设计

每个缓存条目挂一组 tag：

```text
page:{pageId}
page-ver:{pageId}@{pageVersion}
component:{componentName}
component-ver:{componentName}@{version}
route:{/transfer}
tenant:{xx}          // 若有多法人/多品牌
```

写入缓存时：

```ts
await cache.set(cacheKey, artifact, {
  tags: [
    `page:${pageId}`,
    ...usedComponents.map(c => `component:${c.name}`),
    ...usedComponents.map(c => `component-ver:${c.name}@${c.version}`),
  ],
  revalidate: 60, // ISR 时间窗口，可按路由配置
})
```

**组件更新 → 失效相关页：**

```text
发布 AccountCard@1.3.0
  → purge tag: component:AccountCard
  → 所有引用该组件的页面 Artifact 失效
  → 下次请求触发 regenerate（或后台预热）
```

**页面 JSON 更新：**

```text
编辑器发布 page:home
  → purge tag: page:home
```

这与 Next.js `revalidateTag` / Fastly Surrogate-Key / Cloudflare Cache-Tag 同一类模型。

### 6.3 依赖图：如何知道「谁用了这个组件」

单靠 tag purge 时，CDN 按 tag 删条目即可，**不必**先查出所有 pageId。  
若要做「组件发布后主动预生成」，才需要依赖索引：

```text
component:AccountCard → [page:home, page:overview, page:transfer]
page:home → [AccountCard@1.2, Header@3.0, ...]
```

来源建议都做：

1. **编译期**：保存/发布页面 JSON 时解析整棵树，写入依赖表
2. **生成期**：`generatePage(pageId)` 时扫描 `type` 字段，写入 `componentRefs` 并打 tag

组件发布流水线：

```text
S3 上传新组件
  → 写组件注册表（name, version, s3Url）
  → revalidateTag(`component:${name}`)
  → （可选）查依赖表 → queue 预热 regenerate(pageId)
```

### 6.4 ISR 再生流程

```text
请求 /app/overview
  → 查 Artifact 缓存
     ├─ HIT 且未过期 → 直接返回
     ├─ HIT 但 stale（ISR）→ 先返回旧的，后台 regenerate
     └─ MISS / 被 tag 打掉 → await regenerate 再返回
```

`regenerate(pageId)`：

1. 拉最新页面 JSON
2. 按节点解析组件（锁定版本或升到 latest，策略要明确）
3. 组装 Artifact（仍留 dataSlots，不把用户数据烘焙进去）
4. `cache.set` + 重新打 tag

**组件版本策略建议（网银更稳妥）：**

- 页面 JSON **锁定** `AccountCard@1.2.0`
- 可选：组件发版时「强制失效引用页」
- 避免默认「组件一发、所有页自动跟 latest」导致大面积不可控变更

### 6.5 与动态数据并存

```text
边缘/ISR：Artifact（结构 + 组件引用 + 空数据槽）
    ↓
浏览器/BFF：带登录态拉 data
    ↓
Runtime：Artifact.tree + data → 最终 UI
```

- 组件更新 → 只打结构层缓存
- 余额变化 → **不**走 `cacheTag`，走接口缓存或干脆不缓存

### 6.6 实现选型

| 能力 | 可选 |
|------|------|
| Tag 失效 | CDN Surrogate-Key、Cloudflare Cache-Tag、自建 Redis（key→tags 倒排）、Next `revalidateTag` |
| ISR | stale-while-revalidate + 后台队列 regenerate |
| 存储 | Redis/CDN 存 Artifact；S3 仍只存组件静态资源 |
| 预热 | 组件发布后按依赖表丢进生成队列 |

自研不一定要上 Next；自己做 `get/set/purgeByTag/regenerate` 四件套即可。

### 6.7 网银注意点

1. 缓存键不要带 `userId` 进公共 ISR；个性化放私有层
2. Tag purge 是「按依赖失效」，不是「全站刷」
3. 组件 CSS/JS 用内容哈希或版本路径；Artifact 失效后自然指到新 URL
4. 失效要幂等 + 可观测，避免一次组件发布打爆生成队列

**一句话：** 把「可缓存的页面 Artifact」和「用户数据」拆开；用 `page:*` / `component:*` 做 cacheTag；组件发布时 `purge(component:X)` 并 ISR 式再生 Artifact；运行时再把数据和 Artifact 拼成最终页。

---

## 7. 对话结论速览

| 问题 | 结论 |
|------|------|
| Skedo 是什么 | 低代码可视化搭建 monorepo（偏教学/原型） |
| JSON/YML 怎么变页面 | Meta 注册 + JSON hydrate 成 Node 树 + NodeRender 递归挂组件 |
| 是不是静态 HTML | 否，CSR 动态渲染；SSR 未启用 |
| 能否直接淘汰 AEM | 不能直接替换；可借鉴渲染模型自研窄场景平台 |
| 网银数据怎么合进页面 | JSON（结构+bind）+ S3 组件 + Data Context 运行时组装 |
| 如何做 ISR / cacheTag | 缓存 Artifact 而非用户数据；按 `page:*`/`component:*` tag 失效并再生 |

---

## 8. 可选后续

1. 定一版页面 JSON schema + Data Context + 组件 loader 接口（兼容 AEM 迁出组件）
2. 定 Artifact 字段与「组件锁定版本 vs 自动跟随」策略
3. 设计依赖表 + 发布流水线（S3 上传 → tag purge → 预热 regenerate）
