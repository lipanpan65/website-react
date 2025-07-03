# ArticleList 组件

一个通用的文章列表组件，支持不同分类和标签页的文章展示。

## 基本用法

```tsx
import ArticleList from '@/components/ArticleList';

// 基本使用
<ArticleList category="recommended" tabKey="recommend" />

// 后端最新文章
<ArticleList category="backend" tabKey="latest" />

// 前端热门文章
<ArticleList category="frontend" tabKey="hot" />
```

## 高级用法

```tsx
// 自定义样式
<ArticleList 
  category="recommended"
  tabKey="recommend"
  className="custom-article-list"
  style={{ marginTop: 16 }}
/>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| category | string | - | 分类名称（recommended/backend/frontend） |
| tabKey | string | - | 标签页类型（recommend/latest/hot） |
| className | string | - | 自定义 CSS 类名 |
| style | CSSProperties | - | 自定义样式 |

## ArticleItem 接口

```tsx
interface ArticleItem {
  id: string;           // 文章ID
  title: string;        // 文章标题
  summary: string;      // 文章摘要
  creator?: string;     // 作者
  create_time: string;  // 创建时间
  category_name: string; // 分类名称
}
```

## 功能特性

1. **自动数据获取**: 根据 category 和 tabKey 自动获取对应的文章列表
2. **分页支持**: 内置分页功能，支持页码和每页数量配置
3. **加载状态**: 自动显示加载状态和骨架屏
4. **错误处理**: 内置错误处理机制
5. **响应式**: 支持自定义样式和类名

## API 请求参数

组件会自动构建以下请求参数：

```tsx
{
  status: 'publish',
  category: 'recommended', // 来自 props
  tab: 'recommend',        // 来自 props
  page: 1,                 // 分页参数
  pageSize: 10             // 分页参数
}
```

## 与 ArticleTabs 配合使用

```tsx
import ArticleTabs from '@/components/ArticleTabs';

<ArticleTabs 
  category="recommended"
  showArticleList={true}  // 启用文章列表显示
  showHot={true}          // 显示热门标签页
/>
``` 