# AEM 替换方案讨论记录

> 讨论主题：使用自研低代码平台与 Next.js 中间层，逐步替换 AEM 页面渲染能力。
>
> 记录日期：2026-11-22

## 一、现状与目标

### 用户问题

目前有一套自研低代码平台，但只能配置静态页面，例如页面显示内容、样式等。希望使用这套系统替换 AEM 现有页面，需要补齐哪些能力？

### 结论

当前平台更接近“页面搭建器”或“静态内容配置系统”。要替换 AEM，需要补齐的不只是动态组件，还需要建立完整的内容管理、运营、发布交付、集成和企业级治理能力。

主要缺口包括：

- 结构化内容模型；
- 页面树和站点管理；
- 页面模板及组件体系；
- 外部数据源和 API 集成；
- 服务端渲染及动态交互；
- 条件显示和业务规则；
- 可视化编辑和内容运营体验；
- 审批、版本、定时发布和回滚；
- 多环境及发布管理；
- CDN、缓存和缓存失效；
- 数字资产管理（DAM）；
- 多语言和多站点；
- SEO 和站内搜索；
- 权限、身份认证和审计；
- 分析、个性化和营销能力；
- 开发扩展、测试、监控和运维；
- AEM 内容及资产迁移能力。

## 二、替换 AEM 所需能力

### 1. 内容模型和页面管理

平台需要支持页面、文章、产品、活动、FAQ、门店、作者、标签、多媒体资源、SEO 信息和表单等结构化内容，并支持字段类型、校验、引用关系、版本、状态、过期时间和复用。

还需要支持站点、国家、区域、语言、页面层级、页面排序、页面复制和移动、别名、导航、继承、权限、定时上线和下线。

### 2. 页面模板和组件

需要提供页面模板、布局区域、组件拖拽和排序、组件嵌套、可用组件限制、组件配置面板、组件版本、组件复用、全局组件和局部组件。

组件需要区分为：

- 内容组件：标题、正文、图片、卡片；
- 功能组件：搜索、筛选、登录、表单；
- 布局组件：容器、栅格、分栏、标签页；
- 业务组件：产品列表、价格、库存、推荐、门店。

### 3. 动态能力

需要支持 REST、GraphQL、Webhook、OAuth、JWT、文件接口、定时同步、增量同步、超时重试、熔断、缓存、限流和错误降级。

还需要支持 SSR、SSG、ISR、客户端渲染、动态路由、个性化、登录态、地域判断、表单提交、异步加载和错误页。

### 4. 内容作者体验

内容作者需要可视化编辑、所见即所得、拖拽、内联编辑、预览、多设备预览、草稿态和预览态区分，以及批量编辑、批量发布、内容搜索、引用查找、版本对比和回滚。

企业场景还需要作者、编辑、审核人、法务、品牌管理员和发布人等角色，以及多级审批、会签、驳回、定时发布、审批意见和通知。

### 5. 发布和交付

需要建立草稿、待审核、已审核、待发布、已发布、已下线和已归档等状态，并支持单页发布、站点发布、增量发布、定时发布、发布前校验、发布日志、失败重试和回滚。

生产交付需要支持 CDN、页面缓存、API 缓存、缓存失效、缓存预热、限流、高并发和多地域分发。

### 6. DAM、国际化、SEO 和搜索

数字资产管理需要支持图片、视频、PDF、字体、元数据、标签、版本、权限、预览、版权和有效期，并支持图片裁剪、响应式图片、压缩、格式转换和 CDN 分发。

多语言和多站点需要支持翻译版本关系、翻译流程、语言回退、站点模板继承、本地化覆盖、货币格式、多语言 SEO 和 `hreflang`。

SEO 需要支持 Title、Description、Canonical、Robots、Open Graph、结构化数据、Sitemap、Robots.txt、重定向、404 页面和 URL 规范化。

### 7. 安全、分析和运维

需要支持站点级、目录级、页面级、内容类型级、字段级、资产级和操作级权限，并集成 SSO、SAML、OAuth/OIDC、LDAP/AD、MFA 和 SCIM。

还需要完整审计：内容修改、审批、发布、权限变更、资产下载、API 调用和登录记录。

生产环境应监控页面可用性、接口错误率、首屏时间、Core Web Vitals、发布失败、缓存命中率、搜索服务、同步任务和内容发布延迟。

### 8. 内容迁移

AEM 替换需要处理页面、组件配置、富文本、DAM 资源、标签、用户和权限、多语言关系、页面引用、内部链接、重定向、SEO 元数据、搜索索引和历史内容。

建议先建立 AEM 组件到新组件的映射表，再做增量迁移、校验、灰度切换和回滚。

## 三、Next.js 中间平台方案

### 用户方案

计划使用 Next.js 搭建一套中间平台：

1. 将 AEM 导出的页面级 `identify.json` 转换成现有低代码平台的 JSON 结构；
2. 低代码平台增加动态获取数据的能力，自定义组件可以引入 JS 文件，执行类似 Sling Model 的逻辑；
3. Next.js 组装页面时执行数据加载逻辑，将数据注入组件；
4. AEM 现有后端功能作为 API 提供给 Next.js；
5. 缓存使用 Next.js 自带缓存能力。

### 方案判断

整体方案可行，并适合作为渐进式替换方案：

- AEM 继续作为过渡阶段的内容源和业务 API 来源；
- 低代码平台负责页面结构和内容配置；
- Next.js 负责页面运行时、SSR/SSG、数据编排、缓存和 SEO；
- 通过 Adapter 将 AEM 页面模型转换成低代码模型；
- 逐步减少前台页面对 AEM 渲染能力的依赖。

推荐的目标架构：

```text
AEM Author
  ├── 页面内容
  ├── DAM 资源
  ├── 内容审批和发布
  └── 现有业务 API
          │
          ▼
AEM Export / Migration Adapter
  ├── identify.json 解析
  ├── AEM 组件映射
  ├── 内容模型转换
  ├── URL 和引用转换
  └── 低代码 JSON 输出
          │
          ▼
Low-code Content Repository
  ├── 页面结构
  ├── 组件配置
  ├── 样式和布局
  ├── 数据源配置
  └── 页面版本
          │
          ▼
Next.js Runtime
  ├── 路由解析
  ├── 页面模型加载
  ├── 服务端渲染
  ├── 数据加载器执行
  ├── 权限和预览处理
  ├── 缓存
  └── SEO / HTML 输出
          │
          ▼
CDN / Browser
```

## 四、页面模型转换

不要直接把 AEM 原始 JSON 暴露给前端，建议增加独立的 Page Model Adapter，负责：

- AEM `resourceType` 到低代码 `componentType` 的映射；
- 页面节点转换成统一组件树；
- AEM 内容路径转换；
- DAM URL 转换；
- 富文本清理和转换；
- 页面模板映射；
- SEO 元数据转换；
- 多语言和站点信息转换；
- 不支持组件的降级处理；
- 保留 AEM 来源信息，方便排错和追溯。

建议的低代码模型：

```json
{
  "page": {
    "path": "/products/example",
    "template": "product-page",
    "seo": {
      "title": "Example Product"
    }
  },
  "regions": {
    "main": [
      {
        "id": "hero",
        "type": "Hero",
        "props": {
          "title": "Example Product",
          "image": "/assets/example/hero.jpg"
        },
        "dataSource": null
      }
    ]
  }
}
```

组件最好保留来源信息：

```json
{
  "id": "hero",
  "type": "Hero",
  "source": {
    "system": "aem",
    "path": "/content/site/en/products/example/jcr:content/root/hero",
    "resourceType": "project/components/hero"
  }
}
```

## 五、动态数据加载设计

不建议让低代码配置直接引用并执行任意服务端 JavaScript 文件。更推荐使用受控的 Data Loader / Resolver 机制。

组件模型可以设计为：

```json
{
  "id": "product-detail",
  "type": "ProductDetail",
  "props": {
    "productId": "P10001"
  },
  "dataSource": {
    "type": "product-detail",
    "params": {
      "productId": "$props.productId"
    },
    "cache": {
      "revalidate": 300,
      "tags": ["product:P10001"]
    }
  }
}
```

Next.js 根据 `dataSource.type` 选择对应的 Loader：

```text
dataSource.type = product-detail
                 │
                 ▼
ProductDetailLoader
                 │
                 ▼
AEM Product API
                 │
                 ▼
normalized product data
                 │
                 ▼
ProductDetail component
```

### 推荐的 Loader 方式

#### 1. 代码注册型 Loader

Loader 作为代码部署到 Next.js，通过注册表管理。优点是类型安全、可测试、可监控、可审计，最适合生产环境。

#### 2. 声明式 API 配置

对简单接口，低代码平台配置 API、参数和字段映射，由 Next.js 统一执行。优点是灵活，但复杂逻辑需要独立代码实现。

#### 3. 受控插件型 Loader

允许开发团队编写插件，但插件必须纳入构建、审核、版本控制和权限控制，不能随意读取环境变量或访问任意内网地址。

### 不建议直接执行任意 JS 的原因

- 存在服务端任意代码执行风险；
- 可能访问环境变量和内部网络；
- 构建和部署产物不可预测；
- Serverless 和 Edge Runtime 兼容性较差；
- 难以做类型检查、测试、监控和回滚；
- 容易形成不可治理的脚本平台。

## 六、AEM API 和 BFF

AEM 后端功能可以作为 API 提供，但建议不要让每个页面组件直接调用 AEM 或多个底层系统，最好增加 BFF/Data Loader 层：

```text
Next.js Component
        │
        ▼
Data Loader / BFF
        │
        ├── AEM Content API
        ├── Product API
        ├── Search API
        ├── CRM API
        └── Other Backend API
```

BFF 负责：

- 隐藏后端系统细节；
- 聚合多个 API；
- 统一鉴权；
- 统一错误处理；
- 转换数据结构；
- 控制返回字段；
- 统一缓存；
- 降低页面组件与 AEM 的耦合。

Sling Model 不建议机械地一一转换成 API。应根据业务边界设计稳定的数据契约，例如将 `ProductModel` 的多个属性统一设计为：

```text
GET /api/products/{productId}
```

而不是拆成多个属性接口。

## 七、Next.js 缓存设计

Next.js 的缓存能力可以使用，但不能只依赖单个 Next.js 实例的本地或进程内缓存。需要区分：

- 页面缓存；
- 数据缓存；
- CDN 缓存；
- 业务缓存。

还需要解决：

- 多实例缓存一致性；
- Serverless 环境缓存持久性；
- 登录态和个性化数据不能误缓存；
- 缓存 Key 的语言、站点、区域和用户维度；
- Next.js 缓存与 CDN 缓存的关系；
- 预览模式不能命中公共缓存。

建议使用缓存标签：

```text
product:P10001
page:/products/example
site:en-us
campaign:C10001
```

内容发布后通过 Webhook 或事件通知执行：

```text
AEM Publish Event
        │
        ▼
Webhook / Event Adapter
        │
        ├── invalidate page:/products/example
        ├── invalidate product:P10001
        └── purge CDN URL
```

必须支持按 URL、按标签、全站失效、失败重试、缓存预热和失效日志。

## 八、低代码运行时契约

建议为低代码 JSON 增加以下能力：

- `component type`；
- `component version`；
- `props`；
- `dataSource`；
- `data dependencies`；
- `cache policy`；
- `error policy`；
- `loading policy`；
- `visibility rule`；
- `seo metadata`；
- `analytics metadata`；
- `source metadata`。

动态组件还需要定义 `loading`、`success`、`empty`、`error`、`timeout`、`unauthorized` 和 `stale` 等状态。

不能因为一个推荐或营销组件调用失败就导致整页返回 500，应支持组件级兜底、隐藏、旧缓存或 fallback 内容。

## 九、AEM 页面、HTL 和 Sling Model 分析

### 用户问题

如何统计现有 AEM 页面，找出页面使用的 HTL，将 HTL 转成 UI 组件，同时找出 HTL 中的 Sling Model，并转成 Java API 接口？

### 核心结论

需要拆成两个问题：

1. 页面实际使用了哪些 HTL 组件；
2. 这些 HTL 组件依赖了哪些 Sling Model，以及哪些 Model 需要转成 API。

不能只扫描 HTL 文件。需要结合：

```text
AEM 页面内容树 / identify.json
        +
AEM 组件代码仓库
        +
运行时访问和渲染数据
```

### 1. 建立 AEM 组件清单

扫描 `ui.apps` 中的组件目录和 `core` 中的 Java 代码，提取：

- `resourceType`；
- 组件路径；
- HTL 文件；
- `sling:resourceSuperType`；
- Dialog 字段；
- Clientlib；
- Sling Model；
- 子组件；
- 页面组件、容器组件或内容组件类型；
- 是否已废弃。

组件的唯一标识应使用 `resourceType`，而不是组件展示名称。

### 2. 从页面 JSON 统计实际使用情况

递归扫描所有页面级 JSON，识别：

- `sling:resourceType`；
- `resourceType`；
- `:type`；
- `cq:template`；
- `sling:resourceSuperType`。

输出至少包括：

- 使用组件的页面数；
- 组件实例总数；
- 站点和语言；
- 页面模板；
- 最近发现时间；
- 是否已发布；
- 未知或缺失组件。

示例：

```text
resourceType                                      pageCount  instanceCount  locales
------------------------------------------------------------------------------------
project/components/content/hero                  1240       3810           en,zh
project/components/content/teaser                 820       2440           en,zh
project/components/content/product-detail         310        310           en
project/components/legacy/old-banner               12         18            en
```

### 3. 从 HTL 查找 Sling Model

扫描以下 HTL 用法：

- `data-sly-use`；
- `data-sly-resource`；
- `data-sly-include`；
- `data-sly-template`；
- `data-sly-call`；
- `${model.xxx}`；
- `${model.getXxx}`；
- `${properties.xxx}`；
- `${currentPage.xxx}`；
- `${inheritedPageProperties.xxx}`。

需要建立：

```text
Page
  -> resourceType
      -> HTL files
          -> Sling Models
              -> Model properties/methods
                  -> Injected services
                      -> External APIs / repositories
```

除了 Sling Model，还需要识别 Use-API Java 类、JavaScript Use-API、WCM Core Model、Resource、Page、OSGi 服务、Servlet、GraphQL 和外部 HTTP 服务。

### 4. 分析 Sling Model

重点分析：

- `@ValueMapValue`；
- `@ChildResource`；
- `@Self`；
- `@OSGiService`；
- `@SlingObject`；
- `@ScriptVariable`；
- `@ResourcePath`；
- `@RequestAttribute`；
- `@Via`；
- `@Inject`。

同时分析 HTL 实际访问的属性和方法、外部请求、Repository 查询、用户上下文、语言和地区判断、权限、缓存、业务计算和返回结构。

### 5. Sling Model 分类和迁移策略

| 类型 | 处理方式 |
|---|---|
| 只读取组件或页面属性 | 进入页面 JSON，通常不需要独立 API |
| 页面组合型 | 放入页面转换层或统一页面模型 |
| 外部系统动态查询 | 设计 API、BFF 或 Data Loader |
| 复杂业务计算 | 提取为领域 API 或后端服务 |
| 页面上下文 | 由 Next.js 页面上下文提供 |
| 表单和写操作 | 独立设计安全的 POST/PUT 接口 |

判断标准包括：是否跨系统、是否依赖用户、是否需要实时数据、是否需要独立缓存、是否被多个页面复用、是否有独立权限和错误处理。

### 6. HTL 到新 UI 组件的映射

不应简单地将 HTL 文件一对一转换。可能存在：

- 一对一：AEM Hero 转新 Hero；
- 多对一：多个 Teaser 组件统一为 Card；
- 一对多：复杂 Product 组件拆为 ProductSummary、ProductPrice 和 ProductAvailability；
- 组合转换：AEM Container 转新平台 Section 及其子组件。

需要建立组件迁移矩阵：

| AEM Resource Type | HTL | 页面数 | 实例数 | Sling Model | 动态依赖 | 新组件 | API | 优先级 |
|---|---|---:|---:|---|---|---|---|---|
| `content/hero` | `hero.html` | 1240 | 3810 | `HeroModel` | 无 | `Hero` | 无 | 高 |
| `content/teaser` | `teaser.html` | 820 | 2440 | `TeaserModel` | 标签服务 | `Card` | Tag API | 高 |
| `content/product` | `product.html` | 310 | 310 | `ProductModel` | Product Service | `ProductDetail` | Product API | 高 |
| `content/search` | `search.html` | 65 | 65 | `SearchModel` | Search Service | `Search` | Search API | 高 |

## 十、自动化分析流水线

建议建设离线分析流水线：

```text
AEM Code Repository
  ├── 扫描 HTL
  ├── 扫描 Dialog
  ├── 扫描 Java Sling Model
  ├── 扫描 OSGi Service
  └── 建立代码依赖关系

AEM Exported Pages
  ├── 扫描页面 JSON
  ├── 递归提取 resourceType
  ├── 统计使用次数
  ├── 建立页面到组件关系
  └── 建立页面到模板关系

Analysis Engine
  ├── 组件匹配
  ├── HTL 与 Model 关联
  ├── 动态依赖识别
  ├── API 候选识别
  ├── 迁移复杂度评估
  └── 生成迁移矩阵

Output
  ├── 组件清单
  ├── 页面使用报告
  ├── Sling Model 清单
  ├── API 候选清单
  ├── 映射矩阵
  └── 风险报告
```

静态分析需要结合运行时数据，包括 AEM 请求日志、页面访问日志、组件渲染日志、API 访问日志、Dispatcher 日志和生产页面抓取结果。这样才能识别真正被访问的页面、组件和动态 API。

## 十一、推荐的实施阶段

### 阶段一：静态页面转换

范围：一个页面模板、3～5 个常用组件、页面 JSON 转换、Next.js 路由、SSR/SSG、基础 SEO 和错误页。

目标：验证结构、样式、URL、SEO 和页面性能。

### 阶段二：动态数据

范围：一个动态组件、一个 AEM API、一个 Data Loader、服务端数据注入、超时、空数据、错误降级和数据缓存。

目标：验证数据注入、请求数量、API 失败隔离和缓存效果。

### 阶段三：发布和缓存失效

范围：低代码发布、Webhook、Next.js 缓存失效、CDN 刷新、页面预览和回滚。

目标：验证内容发布后可见时间、按页面失效、回滚和多实例一致性。

### 阶段四：真实页面迁移

范围：真实业务页面、DAM、SEO、多语言、权限和生产流量。

目标：验证完整迁移闭环后再扩大范围。

## 十二、最终建议

推荐的目标架构是：

```text
低代码平台
  = 页面模型 + 内容配置 + 组件配置

Next.js
  = 页面运行时 + SSR/SSG + 数据编排 + 缓存 + SEO

Data Loader / BFF
  = API 聚合 + 数据转换 + 鉴权 + 错误处理

AEM
  = 过渡阶段的内容源和后端能力

Webhook / Event Bus
  = 发布通知 + 缓存失效 + 搜索索引更新
```

这个方案可落地的前提是遵守以下原则：

1. 使用自己的标准页面模型，不让低代码平台永久绑定 AEM 私有 JSON；
2. 使用受控的 Data Loader，不执行任意服务端 JavaScript；
3. 通过 BFF 或 API Gateway 治理 AEM 和其他后端接口；
4. 对页面缓存、数据缓存和 CDN 缓存分别设计；
5. 建立发布事件和缓存失效机制；
6. 不把所有 Sling Model 机械转换成 API，只提炼真正的业务数据契约；
7. 通过页面 JSON、代码静态分析和运行时日志共同统计实际使用情况；
8. 先按页面类型或业务边界渐进式迁移，不要一开始全量替换 AEM。

最核心的目标不是“把所有 Sling Model 都改成 Java API”，而是：

> 找出真正需要运行时数据的组件，提炼稳定的业务数据契约，并让新的 UI 组件依赖这些契约，而不是依赖 AEM 的内部渲染模型。
