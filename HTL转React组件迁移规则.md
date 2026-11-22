# HTL 转 React 组件迁移规则

> 说明 HTL 是否可以直接转换成 React 组件，以及推荐的迁移方法、职责划分和自动化边界。
>
> 记录日期：2026-11-22

## 一、核心结论

HTL 通常**不是直接转换成 React 组件代码**，而是以 HTL 为输入，分析其结构和依赖后，重新实现为 React 组件。

推荐流程：

```text
HTL
  -> 分析 HTML 结构
  -> 分析 Dialog 字段
  -> 分析 Sling Model / Use-API
  -> 分析子组件和外部接口
  -> 定义新的组件数据契约
  -> 重写 React 组件
```

HTL 不只是 HTML 模板，还可能包含：

- HTML 结构；
- AEM 资源属性；
- 页面属性；
- Sling Model；
- OSGi 服务计算结果；
- 子资源渲染；
- AEM 组件继承；
- 编辑模式逻辑；
- Clientlib 行为；
- Servlet 或外部 API 地址；
- HTL 条件、循环和模板语法。

因此，直接进行语法转换只能得到页面表面结构，无法自动迁移完整功能。

## 二、为什么不建议直接翻译 HTL

例如，HTL：

```html
<sly data-sly-use.model="com.example.core.models.ProductModel">
  <div data-sly-test="${model.available}">
    <h2>${model.title}</h2>
    <span>${model.price}</span>
  </div>
</sly>
```

这段 HTL 背后可能包含：

```text
ProductModel
  -> ProductService
  -> PriceService
  -> InventoryService
```

如果只转换成 JSX：

```tsx
<div>
  <h2>{model.title}</h2>
  <span>{model.price}</span>
</div>
```

仍然没有解决：

- `model.title` 从哪里来；
- `model.price` 是否实时；
- `model.available` 如何计算；
- 价格是否依赖用户和地区；
- 数据是否需要缓存；
- API 失败如何处理；
- 是否需要权限；
- AEM 编辑态如何替换。

因此，复杂 HTL 需要语义化重构，而不是简单的语法翻译。

## 三、HTL 和 React 的对应关系

| HTL | React/Next.js |
|---|---|
| HTML 标签 | JSX |
| `properties.xxx` | `props.xxx` 或低代码 JSON |
| `currentPage.xxx` | `page` 上下文 |
| `pageProperties.xxx` | 页面模型或 `page.seo` |
| `inheritedPageProperties.xxx` | 站点级配置 |
| `currentStyle.xxx` | `style` 或组件变体 |
| `data-sly-test` | 条件渲染 |
| `data-sly-list` | `map()` |
| `data-sly-repeat` | `map()` |
| `data-sly-resource` | 子组件递归渲染 |
| `data-sly-include` | React 子组件或公共组件 |
| `data-sly-template` | React 组件或函数 |
| Sling Model | Loader、BFF 或领域 API |
| OSGi Service | 后端 API 或服务层 |
| Clientlib JS | React Client Component 或浏览器行为 |
| `wcmmode` | 编辑态/预览态上下文 |

## 四、简单 HTL 的半自动转换

对于只包含静态结构、组件属性和简单条件的 HTL，可以自动或半自动转换。

### 原始 HTL

```html
<div class="title">
  <h2>${properties.title}</h2>
  <p data-sly-test="${properties.description}">
    ${properties.description}
  </p>
</div>
```

### 转换成低代码 JSON

```json
{
  "type": "Title",
  "props": {
    "title": "Example title",
    "description": "Example description"
  }
}
```

### React 组件

```tsx
type TitleProps = {
  title?: string;
  description?: string;
};

export function Title({ title, description }: TitleProps) {
  return (
    <div className="title">
      {title && <h2>{title}</h2>}
      {description && <p>{description}</p>}
    </div>
  );
}
```

自动化转换的重点不是直接生成最终 React 代码，而是识别：

- HTML 结构；
- 字段名称；
- 条件逻辑；
- 组件属性；
- CSS 类；
- 是否存在子组件。

## 五、复杂 HTL 的重构方式

### 原始 HTL

```html
<sly data-sly-use.product="com.example.core.models.ProductModel">
  <section data-sly-test="${product.available}">
    <h1>${product.title}</h1>
    <span>${product.price}</span>
    <a href="${product.buyUrl}">Buy now</a>
  </section>
</sly>
```

不建议直接翻译成只引用 `product` 的 JSX：

```tsx
<section>
  <h1>{product.title}</h1>
  <span>{product.price}</span>
  <a href={product.buyUrl}>Buy now</a>
</section>
```

推荐拆成三个部分。

### 1. 低代码 JSON

```json
{
  "type": "ProductDetail",
  "props": {
    "productId": "P10001",
    "buyButtonText": "Buy now"
  },
  "dataSource": {
    "type": "product-detail"
  }
}
```

### 2. Next.js Loader

```text
productId
  -> Product API
  -> Price API
  -> Inventory API
  -> 计算 available
  -> 生成 buyUrl
  -> 返回 ProductDetailData
```

### 3. React UI 组件

```tsx
type ProductDetailData = {
  title: string;
  price: string;
  available: boolean;
  buyUrl?: string;
};

type ProductDetailProps = {
  config: {
    buyButtonText: string;
  };
  data: ProductDetailData;
};

export function ProductDetail({
  config,
  data
}: ProductDetailProps) {
  if (!data.available) {
    return null;
  }

  return (
    <section>
      <h1>{data.title}</h1>
      <span>{data.price}</span>
      <a href={data.buyUrl}>{config.buyButtonText}</a>
    </section>
  );
}
```

职责划分如下：

```text
低代码 JSON = 组件配置
Next.js Loader = ProductModel 的运行时数据逻辑
React = UI 展示
```

## 六、推荐的三层迁移模型

## 第一层：页面模型转换层

负责把 AEM 页面和组件配置转换为低代码 JSON：

```text
identify.json
  -> Page Model Adapter
  -> Low-code JSON
```

主要处理：

- `resourceType`；
- 组件树；
- `properties`；
- 页面属性；
- 样式配置；
- 子资源；
- 资源 URL；
- 内容字段映射。

## 第二层：运行时数据层

负责替代 Sling Model 的动态部分：

```text
dataSource
  -> Next.js Loader
  -> BFF / API
  -> normalized data
```

主要处理：

- 外部 API；
- 数据聚合；
- 业务计算；
- 鉴权；
- 用户上下文；
- 缓存；
- 错误降级。

## 第三层：React UI 层

负责替代 HTL 的 HTML 表达和 Clientlib 的交互：

```text
config + data
  -> React Component
  -> HTML
```

主要处理：

- HTML 结构；
- CSS；
- 响应式布局；
- 条件展示；
- 列表渲染；
- 客户端交互；
- 无障碍；
- 埋点。

## 七、组件接口建议

React 组件建议使用清晰的数据契约：

```text
ReactComponent(config, data, context)
```

其中：

```text
config
  = 来自低代码 JSON 的内容和展示配置

data
  = 来自 Next.js Loader 的运行时数据

context
  = locale、site、pathname、preview、user 等运行时上下文
```

示例：

```tsx
type ComponentContext = {
  locale: string;
  site: string;
  pathname: string;
  preview: boolean;
};

type ProductDetailProps = {
  config: {
    productId: string;
    showReviews?: boolean;
    theme?: "light" | "dark";
    ctaText?: string;
  };
  data: ProductDetailData;
  context: ComponentContext;
};
```

这样可以避免 React 组件直接依赖 AEM 的 `resource`、`properties` 或具体 Sling Model。

## 八、哪些内容可以自动化

### 可以自动化提取

- HTL 文件清单；
- 组件 `resourceType`；
- `sling:resourceSuperType`；
- `properties.xxx`；
- `pageProperties.xxx`；
- `currentPage.xxx`；
- `data-sly-use`；
- `data-sly-resource`；
- `data-sly-list`；
- `data-sly-test`；
- CSS 类；
- Dialog 字段；
- 页面使用次数；
- 组件嵌套关系。

### 可以半自动转换

- 简单 HTML 结构；
- 简单属性绑定；
- 简单条件；
- 简单列表；
- 静态组件配置；
- 低代码 JSON 初始生成；
- AEM 组件到新组件的映射表。

### 必须人工设计

- Sling Model 到 API 的边界；
- OSGi Service 的迁移方式；
- 复杂业务规则；
- 外部系统集成；
- 用户和权限逻辑；
- 缓存策略；
- 错误和降级策略；
- 表单和写操作；
- 个性化；
- SEO 行为；
- Clientlib 交互重构；
- 多语言和多站点逻辑。

## 九、不要使用“一对一文件转换”作为标准

不要简单采用：

```text
一个 HTL 文件 = 一个 React 文件
```

更合理的迁移原则是：

```text
一个可复用的业务展示单元 = 一个 React 组件
```

例如，AEM 中可能存在：

```text
product.html
price.html
availability.html
promotion.html
```

迁移后可以组合成一个：

```text
ProductDetail
```

也可以拆分成：

```text
ProductSummary
ProductPrice
ProductAvailability
PromotionBadge
```

具体取决于：

- 是否独立复用；
- 是否独立获取数据；
- 是否独立缓存；
- 是否独立加载；
- 是否有独立编辑配置；
- 是否有独立交互；
- 是否有独立业务边界。

## 十、HTL 迁移步骤

推荐按以下步骤执行：

```text
1. HTL 静态分析
   -> 识别结构和依赖

2. AEM 页面模型转换
   -> 生成低代码 JSON

3. Sling Model / OSGi 逻辑拆分
   -> 生成 Loader、BFF 或后端 API

4. React 组件重写
   -> 使用 config + data 渲染页面
```

具体实施步骤：

1. 统计页面实际使用的 `resourceType`；
2. 读取组件 Dialog，确定可配置字段；
3. 分析 HTL 的隐式对象和表达式；
4. 识别 `data-sly-resource`、`include` 和模板调用；
5. 查找 Sling Model、Use-API 和 OSGi Service；
6. 区分静态内容、运行时数据和业务逻辑；
7. 建立 AEM 组件到新 UI 组件的映射；
8. 设计低代码 JSON 数据结构；
9. 为动态部分设计 Loader 或 BFF API；
10. 重写 React 组件；
11. 对比 AEM 和 Next.js 的页面输出；
12. 验证 SEO、性能、缓存、错误和权限。

## 十一、最终判断

HTL 到 React 的迁移不是简单的模板语法转换，而是一次页面渲染逻辑和数据依赖的重构。

最终推荐的关系是：

```text
HTL
  -> 分析页面结构和数据依赖
  -> 生成或辅助生成低代码 JSON
  -> 提取 Sling Model / OSGi 动态逻辑
  -> 设计 Loader、BFF 或后端 API
  -> 重写 React UI 组件
```

简单静态 HTL 可以自动生成初始 JSX 或低代码配置；涉及 Sling Model、OSGi 服务、动态 API 和业务规则的 HTL，必须进行语义化重构。

> **HTL 通常不是直接转换成 React 组件，而是通过“HTL 分析 → 页面模型转换 → Sling Model/API 拆分 → React 组件重写”的方式迁移。**
