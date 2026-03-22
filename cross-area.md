RDS 实例是一个独立的数据库实体，它必须运行在**某个特定的区域**内（比如“美国东部-弗吉尼亚北部”）。但是，AWS 提供了几种机制，可以实现数据库在**多个区域之间协同工作或实现容灾**。

---

### 🌍 RDS 跨区域的几种方式

| 方式 | 核心机制 | 数据同步 | 适用场景 |
| --- | --- | --- | --- |
| **跨区域只读副本** | 在另一个区域创建只读副本 | 异步复制（通常几秒内） | 读流量分担、就近访问、跨区域容灾 |
| **跨区域快照复制** | 手动或自动将快照复制到其他区域 | 按需复制（非实时） | 跨区域备份、合规要求、异地恢复 |
| **Aurora 全球数据库** | Aurora 专用的一写多读跨区域部署 | 通常 < 1 秒 | 全球级应用、跨区域低延迟读取 |

---

### 1\. 跨区域只读副本

这是最常见的跨区域部署方式。你可以在主区域有一个 RDS 主实例（可读可写），然后在其他区域创建一个或多个**只读副本**。


**特点**：

- **数据同步**：主实例的数据会**异步复制**到副本区域，通常延迟在几秒以内。
    
- **用途**：
    
    - **就近读取**：让不同地理位置的用户读取最近的副本，降低访问延迟。
        
    - **跨区域容灾**：当主区域发生灾难时，可以将只读副本**提升为主实例**。
        
- **限制**：副本是只读的，写操作必须回到主实例。
    

**适用数据库引擎**：MySQL、MariaDB、PostgreSQL、Aurora（部分支持）

---

### 2\. 跨区域快照复制

这种方式不是实时的，但非常稳妥。

**操作方式**：

1. 定期（例如每天）为 RDS 实例创建数据库快照。
    
2. 将该快照**复制**到另一个区域的 S3 存储中。
    
3. 当需要恢复时，在目标区域**基于该快照创建新的 RDS 实例**。
    

**特点**：

- **非实时**：复制的快照是某个时间点的数据，不是最新的。
    
- **用途**：
    
    - **跨区域备份**：满足合规性要求（如数据必须保留在多个地理位置）。
        
    - **灾难恢复**：当主区域完全不可用时，可以用最新复制的快照在其他区域重建数据库。
        
- **成本**：按快照存储容量计费（跨区域复制会额外收取数据传输费用）。
    

---

### 3\. Aurora 全球数据库

这是 **Amazon Aurora** 数据库（MySQL/PostgreSQL 兼容）独有的功能，是跨区域部署最强大的方案。

图表

代码

下载

全屏

.kvfysmfp{overflow:hidden;touch-action:none}.ufhsfnkm{transform-origin: 0 0}

#mermaid-svg-65{font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:16px;fill:#333;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-svg-65 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-svg-65 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-svg-65 .error-icon{fill:#552222;}#mermaid-svg-65 .error-text{fill:#552222;stroke:#552222;}#mermaid-svg-65 .edge-thickness-normal{stroke-width:1px;}#mermaid-svg-65 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-svg-65 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-svg-65 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-svg-65 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-svg-65 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-svg-65 .marker{fill:#333333;stroke:#333333;}#mermaid-svg-65 .marker.cross{stroke:#333333;}#mermaid-svg-65 svg{font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:16px;}#mermaid-svg-65 p{margin:0;}#mermaid-svg-65 .label{font-family:"trebuchet ms",verdana,arial,sans-serif;color:#333;}#mermaid-svg-65 .cluster-label text{fill:#333;}#mermaid-svg-65 .cluster-label span{color:#333;}#mermaid-svg-65 .cluster-label span p{background-color:transparent;}#mermaid-svg-65 .label text,#mermaid-svg-65 span{fill:#333;color:#333;}#mermaid-svg-65 .node rect,#mermaid-svg-65 .node circle,#mermaid-svg-65 .node ellipse,#mermaid-svg-65 .node polygon,#mermaid-svg-65 .node path{fill:#ECECFF;stroke:#9370DB;stroke-width:1px;}#mermaid-svg-65 .rough-node .label text,#mermaid-svg-65 .node .label text,#mermaid-svg-65 .image-shape .label,#mermaid-svg-65 .icon-shape .label{text-anchor:middle;}#mermaid-svg-65 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-svg-65 .rough-node .label,#mermaid-svg-65 .node .label,#mermaid-svg-65 .image-shape .label,#mermaid-svg-65 .icon-shape .label{text-align:center;}#mermaid-svg-65 .node.clickable{cursor:pointer;}#mermaid-svg-65 .root .anchor path{fill:#333333!important;stroke-width:0;stroke:#333333;}#mermaid-svg-65 .arrowheadPath{fill:#333333;}#mermaid-svg-65 .edgePath .path{stroke:#333333;stroke-width:2.0px;}#mermaid-svg-65 .flowchart-link{stroke:#333333;fill:none;}#mermaid-svg-65 .edgeLabel{background-color:rgba(232,232,232, 0.8);text-align:center;}#mermaid-svg-65 .edgeLabel p{background-color:rgba(232,232,232, 0.8);}#mermaid-svg-65 .edgeLabel rect{opacity:0.5;background-color:rgba(232,232,232, 0.8);fill:rgba(232,232,232, 0.8);}#mermaid-svg-65 .labelBkg{background-color:rgba(232, 232, 232, 0.5);}#mermaid-svg-65 .cluster rect{fill:#ffffde;stroke:#aaaa33;stroke-width:1px;}#mermaid-svg-65 .cluster text{fill:#333;}#mermaid-svg-65 .cluster span{color:#333;}#mermaid-svg-65 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:12px;background:hsl(80, 100%, 96.2745098039%);border:1px solid #aaaa33;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-svg-65 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#333;}#mermaid-svg-65 rect.text{fill:none;stroke-width:0;}#mermaid-svg-65 .icon-shape,#mermaid-svg-65 .image-shape{background-color:rgba(232,232,232, 0.8);text-align:center;}#mermaid-svg-65 .icon-shape p,#mermaid-svg-65 .image-shape p{background-color:rgba(232,232,232, 0.8);padding:2px;}#mermaid-svg-65 .icon-shape rect,#mermaid-svg-65 .image-shape rect{opacity:0.5;background-color:rgba(232,232,232, 0.8);fill:rgba(232,232,232, 0.8);}#mermaid-svg-65 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-svg-65 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-svg-65 :root{--mermaid-font-family:"trebuchet ms",verdana,arial,sans-serif;}

备区域：欧洲

备区域：美西

主区域：美东

物理复制  
延迟通常 < 1秒

物理复制

主实例  
（可读可写）

Aurora 只读副本

Aurora 只读副本

Aurora 只读副本

Aurora 只读副本

Aurora 只读副本

**特点**：

- **一个主区域，最多 5 个备区域**。
    
- **跨区域读延迟极低**：使用专用的物理复制技术，跨区域延迟通常 **< 1 秒**。
    
- **跨区域故障切换**：备区域可以一键提升为主区域，通常在 **1 分钟内**完成。
    
- **真正的全球部署**：适合需要全球用户都能低延迟访问的应用。
    

---

### 📊 总结对比

| 方式 | 跨区域只读副本 | 跨区域快照复制 | Aurora 全球数据库 |
| --- | --- | --- | --- |
| **适用引擎** | MySQL/PostgreSQL 等 | 所有 RDS 引擎 | 仅 Aurora |
| **数据实时性** | 几秒延迟 | 基于快照时间点 | < 1 秒 |
| **跨区域写操作** | 不支持（需回主区域写） | 不支持 | 不支持（需回主区域写） |
| **跨区域故障切换** | 手动提升副本（分钟级） | 手动恢复（可能较久） | 一键切换（< 1 分钟） |
| **典型用途** | 读分流、就近访问、基础容灾 | 合规备份、冷备 | 全球级应用、高性能跨区域读取 |

---

### 💡 一个常见的混淆点

你可能会有疑问：**“多可用区（Multi-AZ）和跨区域（Cross-Region）有什么区别？”**

| 维度 | 多可用区 (Multi-AZ) | 跨区域 (Cross-Region) |
| --- | --- | --- |
| **位置** | 同一个区域内的不同可用区 | 不同区域（地理位置相隔很远） |
| **距离** | 通常几公里到几十公里 | 几百到几千公里 |
| **延迟** | 极低（毫秒级同步复制） | 较高（跨大洲可能上百毫秒） |
| **主要目的** | **高可用**（应对可用区级故障） | **容灾 + 就近访问**（应对区域级灾难） |

### 总结

**RDS 实例本身不能跨区域“分身”，但可以通过只读副本、快照复制和 Aurora 全球数据库等方式，实现跨区域的数据同步、读取分发和灾难恢复。** 如果你的应用需要服务全球用户或满足跨区域容灾要求，Aurora 全球数据库是最强大的方案；如果只是做跨区域备份，快照复制就足够了。