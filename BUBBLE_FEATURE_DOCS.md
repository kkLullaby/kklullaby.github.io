# 泡泡式标签/专栏功能文档

## 功能介绍

这个功能将你的博客标签和专栏页面改造为美观的**悬浮泡泡设计**，具有以下特性：

### 主要特性

✨ **泡泡外观设计**
- 圆形泡泡式设计，给人以柔和、现代的感觉
- 半透明磨砂玻璃质感（Frosted Glass/Glassmorphism）
- 自适应的大小：内容越多的标签/专栏，泡泡越大

🌊 **动画效果**
- 轻微的浮动动画，模拟真实泡泡漂浮在空中
- 微妙的左右摇晃，增加生动感
- 随机的动画延迟，使整体看起来更自然不规则
- 悬停时有明显的放大和上升效果

🎯 **交互体验**
- 悬停时泡泡放大 1.15 倍并上升
- 悬停时磨砂玻璃效果加强
- 平滑的过渡动画（cubic-bezier）
- 完整的响应式设计（手机、平板、桌面）

## 文件结构

新增的功能由以下文件组成：

```
/layouts/_default/terms.html              # 标签/专栏页面模板
/layouts/partials/extend_head.html         # CSS引入
/layouts/partials/extend_footer.html       # JavaScript引入
/assets/css/extended/bubble-terms.css      # 样式文件
/assets/js/bubble-animation.js             # 动画脚本
```

## 工作原理

### 1. 模板渲染 (terms.html)

该模板根据数据生成泡泡元素，每个泡泡包含：
- 标签/专栏名称
- 文章数量标记
- 数据属性用于动态大小计算

### 2. 样式系统 (bubble-terms.css)

#### 大小映射
根据 `data-count` 属性，泡泡有以下大小规则：

| 数量 | 大小 |
|------|------|
| 1 | 80px |
| 2 | 95px |
| 3 | 110px |
| ... | ... |
| 15+ | 290px |

每增加1篇文章，泡泡增加 15px（可自定义）

#### 磨砂玻璃效果 (Glassmorphism)

```css
/* 核心属性 */
background: rgba(255, 255, 255, 0.15);      /* 半透明白色 */
backdrop-filter: blur(10px);                 /* 模糊背景 */
border: 1px solid rgba(255, 255, 255, 0.18); /* 高亮边框 */
```

#### 动画关键帧

- **float**: 上下浮动，周期3秒
- **wobble**: 左右摇晃，周期4秒
- **pulse**: 背景光晕脉冲，周期3秒

### 3. JavaScript 动画 (bubble-animation.js)

- 为每个泡泡随机分配动画延迟（0-2秒）
- 随机设置浮动方向(-5px 到 +5px)
- 支持响应式布局变化
- 提供悬停时的额外交互

## 自定义选项

### 修改泡泡大小

编辑 `assets/css/extended/bubble-terms.css`：

```css
/* 修改基础大小 */
.bubble-item {
    --base-size: 80px;              /* 最小泡泡大小 */
    --count-multiplier: 15px;       /* 每篇文章增加的大小 */
}

/* 或直接修改映射规则 */
.bubble-item[data-count="5"] { --item-size: 150px; } /* 改为150px */
```

### 修改动画速度

```css
/* 浮动速度（数字越大越慢） */
animation: float 3s ease-in-out infinite;    /* 改为 5s 则变慢 */

/* 摇晃速度 */
animation: wobble 4s ease-in-out infinite;   /* 改为 2s 则变快 */
```

### 修改透明度

```css
/* 正常状态 */
background: rgba(255, 255, 255, 0.15);      /* 0.15 = 15%透明度，改为 0.2 更不透明 */

/* 悬停状态 */
background: rgba(255, 255, 255, 0.25);
```

### 修改模糊效果

```css
backdrop-filter: blur(10px);                 /* 改为 blur(5px) 更清晰或 blur(20px) 更模糊 */
```

### 修改颜色

对于深色主题，编辑媒体查询部分：

```css
@media (prefers-color-scheme: dark) {
    .bubble-item {
        background: rgba(255, 255, 255, 0.08);  /* 调整深色背景透明度 */
    }
}
```

## 启用/禁用功能

### 完全禁用
1. 注释或删除 `extend_head.html` 中的 CSS 链接
2. 注释或删除 `extend_footer.html` 中的 JavaScript 链接
3. 将 `terms.html` 恢复为原始版本

### 仅在特定分类启用

编辑 `layouts/partials/extend_head.html`：

```html
{{ if eq .Type "tags" }}
    {{ $bubbleCSS := resources.Get "css/extended/bubble-terms.css" | minify }}
    <link rel="stylesheet" href="{{ $bubbleCSS.RelPermalink }}">
{{ end }}
```

这样只会在 `/tags/` 页面应用泡泡效果，不会在 `/categories/` 应用。

## 浏览器兼容性

- ✅ Chrome/Edge 88+
- ✅ Firefox 79+
- ✅ Safari 15.4+
- ⚠️ 旧浏览器：仍可使用，但没有模糊效果

`backdrop-filter` 在旧浏览器中会被忽略，但泡泡仍会显示为半透明圆形。

## 性能考虑

- 使用 `requestAnimationFrame` 优化JavaScript动画
- CSS 动画由GPU加速，性能优异
- 即使有大量泡泡（50+）也能流畅运行

## 更高级的自定义

### 改变布局排列方式

在 `assets/js/bubble-animation.js` 中修改 `layoutBubbles` 函数可以：
- 改变泡泡的初始位置分布
- 实现力导向图布局
- 添加物理模拟碰撞

### 添加交互声音

可以在 JavaScript 中添加：

```javascript
.bubble-item.addEventListener('click', function() {
    // 播放点击声音
    new Audio('click.mp3').play();
});
```

### 改变页面背景

`bubble-container` 有自己的背景渐变，可以修改：

```css
.bubble-container {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 100%);
    /* 改为自己喜欢的渐变 */
}
```

## 故障排除

### 泡泡没有显示

1. 检查 `extend_head.html` 和 `extend_footer.html` 是否正确引入
2. 运行 `hugo --minify` 重新构建
3. 清除浏览器缓存（Ctrl+F5 或 Cmd+Shift+R）

### 动画不流畅

1. 减少泡泡数量（虽然不太可能）
2. 降低动画复杂度：减少 `box-shadow` 的数量
3. 在移动设备上禁用某些动画

### 磨砂玻璃效果不显示

1. 检查浏览器是否支持 `backdrop-filter`
2. 使用 `backdrop-filter: blur(10px) !important;` 强制应用
3. 在不支持的浏览器中回退到简单半透明效果

## 扩展想法

1. **点击泡泡时的涟漪效果** - 添加水纹扩散动画
2. **根据热度变色** - 热门标签为红色，冷门为蓝色
3. **拖拽排序** - 允许用户自定义泡泡位置
4. **分类群组** - 按首字母或其他维度对泡泡分组
5. **导出/分享** - 支持导出泡泡图表

## 许可证

此功能与你的博客主题一致。

---

**最后更新**: 2026年1月19日
