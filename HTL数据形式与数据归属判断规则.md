# HTL 数据形式与数据归属判断规则

> 用于 AEM 页面迁移到低代码平台和 Next.js 时，识别 HTL 数据来源，并判断数据应进入低代码 JSON 还是 Next.js Loader。
>
> 记录日期：2026-11-22

## 一、核心原则

> 低代码 JSON 描述“页面应该是什么样”，Next.js Loader 负责“页面运行时需要从哪里拿数据、如何计算以及如何处理异常”。

可以将职责理解为：

```text
低代码 JSON = 声明式页面模型
Next.js Loader = 运行时数据和业务编排
```

### 低代码 JSON 负责

- 页面结构；
- 组件类型；
- 组件顺序和嵌套；
- 运营人员编辑的内容；
- 样式和布局配置；
- 静态资源引用；
- 页面 SEO 配置；
- 业务数据的引用 ID；
- 数据源类型的声明；
- 简单的展示行为配置。

### Next.js Loader 负责

- 外部系统数据读取；
- 用户和请求上下文；
- 实时数据；
- API 鉴权；
- 多接口聚合；
- 业务计算；
- 复杂规则判断；
- 缓存和缓存失效；
- 超时、重试和错误降级；
- 数据转换和标准化。

## 二、数据归属决策树

```text
这个内容或逻辑是否需要在请求时执行？
        │
        ├── 否
        │    ├── 是否属于页面结构、组件配置或编辑内容？
        │    │     └── 是 -> 进入低代码 JSON
        │    │
        │    └── 是否可以在发布或转换阶段确定？
        │          └── 是 -> 进入低代码 JSON
        │
        └── 是
             ├── 是否依赖外部系统、用户、请求、时间或实时状态？
             │     └── 是 -> 进入 Next.js Loader
             │
             ├── 是否包含跨数据源聚合或业务计算？
             │     └── 是 -> 进入 Next.js Loader
             │
             └── 是否需要独立缓存、鉴权、超时和错误处理？
                   └── 是 -> 进入 Next.js Loader
```

## 三、HTL 中的数据形式

## 1. 当前组件节点属性：`properties`

### HTL 示例

```html
<div class="title">
  ${properties.title}
</div>

<img
  src="${properties.fileReference}"
  alt="${properties.altText}"
/>
```

这里的 `properties` 是当前组件资源的 ValueMap 属性。

AEM 内容节点可能是：

```text
/content/site/en/page/jcr:content/root/title
  ├── sling:resourceType = "project/components/title"
  ├── title = "Hello World"
  ├── fileReference = "/content/dam/site/image.jpg"
  └── altText = "Example image"
```

### 迁移判断

通常进入低代码 JSON 的组件 `props`：

```json
{
  "type": "Title",
  "props": {
    "title": "Hello World",
    "image": "/assets/image.jpg",
    "altText": "Example image"
  }
}
```

但如果 `properties` 中存储的是外部业务 ID，例如 `productId`，则只把 ID 放进 JSON，实际产品数据由 Loader 获取：

```json
{
  "props": {
    "productId": "P10001"
  },
  "dataSource": {
    "type": "product-detail"
  }
}
```

## 2. 当前资源信息：`resource`

### HTL 示例

```html
<div
  data-resource-path="${resource.path}"
  data-resource-type="${resource.resourceType}">
</div>
```

常见属性：

```html
${resource.path}
${resource.name}
${resource.resourceType}
${resource.resourceSuperType}
```

### 迁移判断

这类信息通常属于组件或页面上下文，不需要独立 API，可以由页面转换层或 Next.js 运行时提供。

```json
{
  "source": {
    "path": "/content/site/page/jcr:content/root/hero",
    "resourceType": "project/components/hero"
  }
}
```

## 3. 当前页面对象：`currentPage`

### HTL 示例

```html
<h1>${currentPage.title}</h1>
<p>${currentPage.name}</p>
<a href="${currentPage.path}.html">
  Current page
</a>
```

常见字段：

```html
${currentPage.title}
${currentPage.name}
${currentPage.path}
${currentPage.navigationTitle}
${currentPage.description}
${currentPage.lastModified}
```

### 迁移判断

通常进入页面级 JSON：

```json
{
  "page": {
    "title": "Example Page",
    "navigationTitle": "Example",
    "path": "/example"
  }
}
```

如果页面标题需要根据外部业务数据实时生成，则动态字段由 Loader 补充。

## 4. 页面属性：`pageProperties`

### HTL 示例

```html
<title>${pageProperties['jcr:title']}</title>
<meta
  name="description"
  content="${pageProperties['jcr:description']}">
```

也可能写成：

```html
${pageProperties.pageTitle}
${pageProperties.brand}
${pageProperties.cqTags}
```

### 迁移判断

通常转换到页面 JSON 的 `seo` 或 `page` 节点：

```json
{
  "page": {
    "title": "Example Page"
  },
  "seo": {
    "description": "Page description",
    "tags": ["product", "campaign"]
  }
}
```

## 5. 继承页面属性：`inheritedPageProperties`

### HTL 示例

```html
<img
  src="${inheritedPageProperties.logoPath}"
  alt="${inheritedPageProperties.siteName}">
```

常用于：

- 站点名称；
- 品牌 Logo；
- Analytics ID；
- 页头和页脚配置；
- 站点级 SEO 默认值；
- 区域级配置。

### 迁移判断

不要只读取当前页面节点。应在转换阶段完成继承，或者建立明确的站点级配置：

```json
{
  "site": {
    "name": "Example",
    "logo": "/assets/logo.svg",
    "analyticsId": "UA-XXXX"
  }
}
```

## 6. 设计和样式配置：`currentStyle`

### HTL 示例

```html
<div class="${currentStyle.cssClass}">
  ${properties.title}
</div>

<sly data-sly-test="${currentStyle.showBorder}">
  <div class="bordered">
    ...
  </div>
</sly>
```

### 迁移判断

需要将内容和样式分开：

```json
{
  "props": {
    "title": "Example"
  },
  "style": {
    "cssClass": "theme-dark",
    "showBorder": true
  }
}
```

`currentStyle` 通常来自 Design、Template Policy 或 Style System，不应与业务数据混在一起。

## 7. 编辑模式：`wcmmode`

### HTL 示例

```html
<div data-sly-test="${wcmmode.edit && !properties.title}">
  Please configure the title.
</div>
```

常见判断：

```html
${wcmmode.edit}
${wcmmode.preview}
${wcmmode.disabled}
${wcmmode.design}
```

### 迁移判断

这类属于编辑器或预览上下文，不应进入正式生产页面数据。新系统应区分：

```text
生产渲染
预览渲染
低代码编辑态
```

## 8. 组件上下文：`component`

### HTL 示例

```html
<span>${component.title}</span>
```

可能使用：

```html
${component.name}
${component.path}
${component.resourceType}
```

这类数据通常用于组件编辑框、占位符、组件装饰或调试信息，一般不需要 API。

## 9. 请求上下文：`request`

### HTL 示例

```html
${request.pathInfo}
${request.requestURI}
${request.queryString}
${request.method}
```

也可能读取由 Servlet、Filter 或 Model 注入的请求属性：

```html
${request.attributes.someValue}
```

Java 代码可能存在：

```java
request.setAttribute("someValue", value);
```

### 迁移判断

需要映射为 Next.js 的：

- URL 参数；
- Header；
- Cookie；
- Server Component 上下文；
- 页面运行时上下文；
- Loader 参数。

如果请求属性来自外部系统或复杂计算，应放到 Loader。

## 10. 绑定对象：`bindings`

### HTL 示例

```html
${bindings.resource}
${bindings.request}
${bindings.properties}
${bindings.currentPage}
```

复杂 Use-API 中也可能出现：

```html
${bindings['myObject']}
```

### 迁移判断

需要结合 Java Use-API、Sling Model 和 HTL Runtime 分析，不能单独根据 HTL 表达式判断数据来源。

## 11. 子资源：`data-sly-resource`

### HTL 示例

```html
<div data-sly-resource="${'hero'}"></div>
```

也可能指定资源类型：

```html
<div
  data-sly-resource="${resource @ resourceType='project/components/hero'}">
</div>
```

容器组件常见写法：

```html
<div class="container">
  <sly data-sly-list.child="${resource.listChildren}">
    <div data-sly-resource="${child.path}"></div>
  </sly>
</div>
```

### 迁移判断

需要建立父组件到子组件的关系：

```text
Container
  -> data-sly-resource
  -> 子资源
  -> 子资源 resourceType
  -> 子组件 HTL
```

页面 JSON 中的组件树通常应该保留这种嵌套关系。

## 12. HTL 文件引用：`data-sly-include`

### HTL 示例

```html
<sly data-sly-include="header.html"></sly>
<sly data-sly-include="footer.html"></sly>
```

### 迁移判断

需要建立 HTL 文件依赖关系：

```text
page.html
  -> header.html
  -> navigation.html
  -> footer.html
```

在新系统中，通常将这些公共 HTL 转换为公共 React/UI 组件，而不是保留文件级 include。

## 13. HTL 模板：`data-sly-template` 和 `data-sly-call`

### HTL 示例

```html
<template data-sly-template.card="${@ title, image, link}">
  <article class="card">
    <h2>${title}</h2>
    <img src="${image}" alt="">
    <a href="${link}">Read more</a>
  </article>
</template>
```

调用：

```html
<sly
  data-sly-call="${card @
    title=properties.title,
    image=properties.image,
    link=properties.link
  }">
</sly>
```

### 迁移判断

需要追踪模板参数来源：

```text
template 参数 title
  <- properties.title
  <- card UI component props.title
```

模板参数本身不是新数据源，真正的数据源是调用方传入的表达式。

## 14. Sling Model 或 Java/JavaScript Use-API：`data-sly-use`

### Sling Model 示例

```html
<sly data-sly-use.model="com.example.core.models.ProductModel">
  ${model.title}
  ${model.price}
</sly>
```

### JavaScript Use-API 示例

```html
<div data-sly-use.model="model.js">
  <h2>${model.title}</h2>
</div>
```

### 迁移判断

`data-sly-use` 只说明 HTL 使用了某个对象，不代表所有内容都必须转换为 API。

需要继续分析 Model 或 Use-API 的数据来源：

- 只读组件属性：进入低代码 JSON；
- 读取页面属性：进入页面模型；
- 读取外部系统：进入 Loader/API；
- 跨系统聚合：进入 BFF/Loader；
- 用户相关逻辑：进入 Loader；
- 复杂业务计算：进入领域服务或后端 API。

## 15. 列表和集合：`data-sly-list`、`data-sly-repeat`

### HTL 示例

```html
<ul data-sly-list.item="${model.items}">
  <li>${item.title}</li>
</ul>
```

也可能来自子资源：

```html
<ul data-sly-list.child="${resource.listChildren}">
  <li>
    <a href="${child.path}.html">${child.name}</a>
  </li>
</ul>
```

或者来自多值属性：

```html
<div data-sly-list.tag="${pageProperties['cq:tags']}">
  ${tag}
</div>
```

### 迁移判断

需要识别集合来源：

- Sling Model；
- 子资源；
- 当前节点多值属性；
- Use-API；
- OSGi 服务；
- QueryBuilder 结果。

如果集合是运营人员配置的静态子项，进入低代码 JSON；如果是搜索、推荐或外部查询结果，进入 Loader。

## 16. 条件渲染：`data-sly-test`

### HTL 示例

```html
<div data-sly-test="${properties.showPromo}">
  ${properties.promoText}
</div>
```

```html
<section data-sly-test="${model.isAvailable}">
  ${model.availabilityText}
</section>
```

### 迁移判断

需要分别记录：

```text
条件字段：showPromo / isAvailable
输出字段：promoText / availabilityText
```

简单的静态展示开关可以进入 JSON：

```json
{
  "props": {
    "showPromo": true
  }
}
```

复杂业务判断应进入 Loader：

```text
用户是否有权限
库存是否大于 0
活动是否在有效期内
当前区域是否支持购买
```

## 17. 动态 HTML 元素和属性

### HTL 示例

```html
<div data-sly-element="${properties.elementName}">
  ${properties.content}
</div>
```

```html
<div data-sly-attribute.data-id="${properties.id}">
  Content
</div>
```

### 迁移判断

这类通常属于组件展示配置，可以进入 `props`，但需要检查是否存在安全风险，尤其是动态 HTML 标签、属性和富文本。

## 18. 中间变量：`data-sly-set`

### HTL 示例

```html
<sly data-sly-set.imagePath="${properties.fileReference}"></sly>

<img src="${imagePath}" alt="${properties.altText}">
```

### 迁移判断

需要追踪变量流：

```text
imagePath
  <- properties.fileReference
  <- img.src
```

`imagePath` 不是新的数据来源，只是中间变量。

## 19. 表达式选项

### HTL 示例

```html
<a href="${properties.link @ extension='html'}">
  ${properties.linkLabel}
</a>
```

```html
<div>${properties.description @ context='html'}</div>
```

```html
<a href="${resource.path @ selectors='model', extension='json'}">
  JSON
</a>
```

常见选项：

- `context`；
- `format`；
- `join`；
- `extension`；
- `selectors`；
- `scheme`；
- `prependPath`；
- `appendPath`；
- `replace`。

### 迁移判断

这些选项可能改变 URL、HTML 转义、格式化和数据输出方式，转换时不能只提取表达式左侧字段。

特别需要关注：

```html
${properties.description @ context='html'}
```

这通常意味着富文本输出，迁移时需要做 HTML 清洗和 XSS 防护。

## 20. 组件继承：`sling:resourceSuperType`

组件可能继承 Core Components 或项目公共组件：

```text
project/components/title
  -> sling:resourceSuperType
core/wcm/components/title/v3/title
  -> title.html
  -> TitleImpl
```

### 迁移判断

必须递归解析：

- 父组件 HTL；
- 父组件 Dialog；
- 父组件 Sling Model；
- 父组件 Clientlib；
- 当前组件覆盖和新增的内容。

否则会漏掉继承来的行为。

## 21. Servlet 或前端 Clientlib 间接获取数据

HTL 可能只输出一个接口地址：

```html
<div
  class="product"
  data-product-url="${resource.path}.product.json">
</div>
```

Clientlib 中再通过浏览器请求：

```javascript
fetch(element.dataset.productUrl)
  .then((response) => response.json())
  .then(renderProduct);
```

### 迁移判断

需要同时扫描：

- HTL 中的 URL；
- `data-*` 属性；
- Clientlib JavaScript；
- `fetch`；
- `XMLHttpRequest`；
- jQuery AJAX；
- `.model.json`；
- Selector；
- Extension；
- Servlet 注册信息。

这类依赖可能完全没有 Sling Model，但仍然需要迁移为 Next.js Loader、BFF 或浏览器端 API 请求。

## 四、数据归属分类

## 1. 进入低代码 JSON

满足以下特征时，通常进入低代码 JSON：

- 运营人员需要编辑；
- 发布后相对稳定；
- 描述页面结构；
- 描述组件属性；
- 描述视觉样式；
- 描述组件展示配置；
- 可以在发布时确定；
- 不依赖用户或请求；
- 不包含服务端密钥；
- 不需要复杂计算。

典型内容：

- 页面模板；
- 页面区域；
- 组件树；
- 标题、正文和按钮文案；
- 图片、视频和资源引用；
- 主题和样式变体；
- 组件布局；
- 静态显示开关；
- 运营人员手工选择的 ID；
- 固定 SEO 信息；
- 数据源类型声明。

## 2. 进入 Next.js Loader

满足以下特征时，通常进入 Next.js Loader：

- 请求时才能确定；
- 来自外部系统；
- 依赖用户、Cookie、Header 或地域；
- 高频变化或实时变化；
- 需要鉴权；
- 需要多个 API 聚合；
- 包含业务规则或计算；
- 需要独立缓存；
- 需要错误、超时和降级处理；
- 需要保护服务端凭证；
- 涉及写操作或敏感数据。

典型内容：

- 产品名称、价格和库存；
- 搜索结果；
- 推荐内容；
- 会员信息；
- 订单状态；
- 当前用户可见内容；
- AB 实验分组；
- 用户权限；
- 汇率和促销状态；
- 跨接口聚合结果；
- 复杂业务计算；
- 表单提交和其他写操作。

## 五、边界对照表

| 内容或逻辑 | 低代码 JSON | Next.js Loader | 说明 |
|---|---:|---:|---|
| 页面模板 | 是 | 否 | 页面结构配置 |
| 组件类型 | 是 | 否 | 例如 `Hero`、`Card` |
| 组件顺序 | 是 | 否 | 页面编排 |
| 标题和正文 | 是 | 否 | 运营内容 |
| 图片引用 | 是 | 否 | 资源 ID 或 URL |
| 手工配置的产品 ID | 是 | 否 | 只存引用 |
| 产品名称和价格 | 否 | 是 | 业务系统数据 |
| 库存 | 否 | 是 | 实时数据 |
| 搜索结果 | 否 | 是 | 请求相关 |
| 用户会员等级 | 否 | 是 | 用户上下文 |
| AB 测试分组 | 否 | 是 | 运行时判断 |
| 样式变体 | 是 | 否 | 视觉配置 |
| 是否显示按钮 | 是 | 否 | 简单展示配置 |
| 是否允许购买 | 否 | 是 | 业务规则 |
| 多 API 聚合 | 否 | 是 | 数据编排 |
| SEO 固定标题 | 是 | 否 | 发布时确定 |
| 产品结构化数据 | 部分 | 是 | 产品实时字段由 Loader 生成 |
| API 鉴权 | 否 | 是 | 服务端责任 |
| 错误和降级策略 | 可配置 | 是 | 执行逻辑在 Loader |
| 缓存策略 | 可声明 | 是 | 实际缓存由 Loader 执行 |
| 表单提交 | 否 | 是 | 写操作必须走 API |
| 组件编辑提示 | 是/编辑态 | 否 | 仅低代码编辑环境使用 |

## 六、推荐的低代码 JSON 结构

低代码 JSON 可以声明数据源，但不应该直接承载真正的数据访问代码：

```json
{
  "id": "product-detail",
  "type": "ProductDetail",
  "version": "1.0",
  "props": {
    "productId": "P10001",
    "showReviews": true,
    "layout": "two-column"
  },
  "dataSource": {
    "type": "product-detail",
    "params": {
      "productId": "$props.productId"
    }
  },
  "cache": {
    "revalidate": 300,
    "tags": [
      "product:P10001"
    ]
  },
  "errorPolicy": {
    "mode": "fallback",
    "fallbackComponent": "ProductUnavailable"
  }
}
```

字段职责：

```text
props
  = 低代码配置和静态内容

dataSource
  = 声明需要哪类运行时数据

cache
  = 声明缓存意图

errorPolicy
  = 声明组件失败后的展示策略
```

真正的接口调用、数据转换、鉴权和业务判断仍然由 Next.js Loader 执行。

## 七、Loader 的职责边界

一个 Loader 通常负责：

1. 读取组件配置；
2. 获取请求上下文；
3. 校验参数；
4. 调用 BFF 或后端 API；
5. 聚合多个数据源；
6. 转换成 UI 数据契约；
7. 处理鉴权；
8. 处理超时和重试；
9. 设置缓存；
10. 返回错误或 fallback 状态。

Loader 不应该负责：

- 页面布局；
- HTML 结构；
- CSS；
- 组件视觉样式；
- 编辑器交互；
- 运营人员直接编辑的文案。

这些属于低代码模型或 UI 组件。

## 八、完整示例：产品详情组件

### 低代码 JSON

```json
{
  "type": "ProductDetail",
  "props": {
    "productId": "P10001",
    "showReviews": true,
    "theme": "light",
    "ctaText": "Buy now"
  },
  "dataSource": {
    "type": "product-detail"
  }
}
```

### JSON 中保存的内容

- 产品 ID；
- 是否显示评论；
- 主题；
- CTA 文案；
- 组件类型。

### Loader 获取的内容

- 产品名称；
- 产品描述；
- 产品图片；
- 当前价格；
- 折扣价格；
- 库存；
- 可购买状态；
- 评论数量；
- 用户可见价格；
- 地区货币。

### UI 组件最终接收

```json
{
  "config": {
    "showReviews": true,
    "theme": "light",
    "ctaText": "Buy now"
  },
  "data": {
    "id": "P10001",
    "name": "Example Product",
    "description": "Product description",
    "price": {
      "value": 99.99,
      "currency": "USD"
    },
    "availability": "in-stock",
    "reviewCount": 128,
    "canBuy": true
  }
}
```

UI 组件只负责渲染，不需要知道数据来自 AEM、PIM、ERP 还是其他系统。

## 九、需要避免的两种极端

### 极端一：把所有内容都放 JSON

```text
低代码 JSON
  -> 产品名称
  -> 产品价格
  -> 库存
  -> 推荐结果
  -> 用户状态
  -> 复杂条件表达式
  -> API URL
  -> 鉴权参数
```

问题：

- 数据过期；
- 暴露敏感信息；
- JSON 不可维护；
- 业务逻辑分散；
- 缓存不可控；
- 页面发布和业务数据更新耦合。

### 极端二：把所有内容都放 Loader

```text
Loader
  -> 页面结构
  -> 标题
  -> 图片
  -> 颜色
  -> 布局
  -> 产品数据
  -> 业务规则
```

问题：

- 运营人员无法灵活编辑；
- 页面结构变更需要开发发布；
- 低代码平台失去意义；
- 内容和代码耦合；
- 页面预览困难。

## 十、团队级判断口诀

### 放进低代码 JSON

```text
运营可编辑
发布时可确定
描述页面结构
描述展示配置
不依赖用户
不依赖实时状态
不包含业务计算
```

### 放进 Next.js Loader

```text
请求时确定
外部系统提供
依赖用户或请求
实时或高频变化
需要鉴权
需要多接口聚合
包含业务规则
需要独立缓存
需要超时和降级
涉及敏感数据或写操作
```

## 十一、最终规则

> **低代码 JSON 保存内容、结构、展示配置和数据引用；Next.js Loader 负责运行时数据、外部系统访问、用户上下文、业务计算、缓存、鉴权和错误处理。**

也可以用以下两个问题快速判断：

```text
低代码 JSON：运营人员需要编辑什么？
Next.js Loader：系统在请求时需要计算和获取什么？
```

关键边界是：

> 低代码 JSON 可以声明 `dataSource`，但不应该承载真正的数据访问和业务执行代码。
