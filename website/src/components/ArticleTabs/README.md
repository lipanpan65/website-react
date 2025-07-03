# ArticleTabs 组件

一个通用的文章标签页组件，支持不同分类的标签页展示，可选择性地显示文章列表。

## 基本用法

```tsx
import ArticleTabs from '@/components/ArticleTabs';

// 基本使用
<ArticleTabs category="recommended" />

// 带回调函数
<ArticleTabs 
  category="backend"
  onTabChange={(key) => console.log('Tab changed:', key)}
/>

// 自定义激活的标签页
<ArticleTabs 
  category="frontend"
  activeKey="latest"
  onTabChange={handleTabChange}
/>
```

## 高级用法

```tsx
// 显示热门标签页
<ArticleTabs 
  category="backend"
  showHot={true}
/>

// 显示文章列表（推荐用法）
<ArticleTabs 
  category="recommended"
  showArticleList={true}
  showHot={true}
  onTabChange={handleTabChange}
/>

// 自定义标签页配置
const customItems = [
  {
    key: 'featured',
    label: '精选',
    content: '精选内容'
  },
  {
    key: 'trending',
    label: '趋势',
    children: <div>趋势内容组件</div>
  }
];

<ArticleTabs 
  category="recommended"
  customItems={customItems}
/>

// 自定义样式
<ArticleTabs 
  category="frontend"
  className="custom-tabs"
  style={{ marginTop: 16 }}
/>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| category | string | - | 分类名称（recommended/backend/frontend） |
| onTabChange | function | - | 标签页切换回调函数 |
| activeKey | string | 'recommend' | 当前激活的标签页 |
| customItems | TabItem[] | - | 自定义标签页配置 |
| showHot | boolean | false | 是否显示热门标签页 |
| showArticleList | boolean | false | 是否显示文章列表 |
| className | string | - | 自定义 CSS 类名 |
| style | CSSProperties | - | 自定义样式 |

## TabItem 接口

```tsx
interface TabItem {
  key: string;           // 标签页唯一标识
  label: string;         // 标签页标题
  children?: React.ReactNode;  // 标签页内容（React 组件）
  content?: string;      // 标签页内容（字符串）
}
```

## 默认标签页

- **推荐** (recommend): 显示推荐内容
- **最新** (latest): 显示最新内容  
- **热门** (hot): 仅在 recommended 分类或 showHot=true 时显示

## 文章列表集成

当 `showArticleList={true}` 时，每个标签页会自动显示对应的文章列表：

```tsx
// 推荐标签页会显示
<ArticleList category="recommended" tabKey="recommend" />

// 最新标签页会显示
<ArticleList category="recommended" tabKey="latest" />

// 热门标签页会显示
<ArticleList category="recommended" tabKey="hot" />
```

## 使用场景

1. **纯标签页展示**: `showArticleList={false}`（默认）
2. **文章列表展示**: `showArticleList={true}`
3. **自定义内容**: 使用 `customItems` 配置自定义标签页
4. **条件显示**: 使用 `showHot` 控制热门标签页的显示 