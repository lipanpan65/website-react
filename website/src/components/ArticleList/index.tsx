import * as React from 'react'
import { List, Skeleton } from 'antd'
import { Link } from 'react-router-dom'
import { request, rowKeyF, showTotal } from '@/utils'

interface ArticleItem {
  id: string;
  title: string;
  summary: string;
  creator?: string;
  create_time: string;
  category_name: string;
}

interface ArticleListProps {
  category: string; // 分类：recommended, backend, frontend
  tabKey: string; // 标签页：recommend, latest, hot
  className?: string;
  style?: React.CSSProperties;
}

const ArticleList: React.FC<ArticleListProps> = ({ 
  category, 
  tabKey, 
  className,
  style 
}) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [data, setData] = React.useState<ArticleItem[]>([]);
  const [page, setPage] = React.useState({
    total: 0,
    current: 1,
    pageSize: 10
  });

  // 获取文章列表数据
  const getArticleList = React.useCallback((params?: any) => {
    setLoading(true);
    
    // 构建请求参数
    const requestParams = {
      status: 'publish',
      category: category,
      tab: tabKey,
      ...params
    };

    request({
      url: `/api/user/v1/article/`,
      method: 'GET',
      params: requestParams
    }).then((response: any) => {
      if (response && response.success) {
        const { page: pageData, data: articleData } = response.data;
        setData(articleData);
        setPage(pageData);
      }
      setLoading(false);
    }).catch((error: any) => {
      console.error('Failed to fetch articles:', error);
      setLoading(false);
    });
  }, [category, tabKey]);

  // 当分类或标签页变化时重新获取数据
  React.useEffect(() => {
    getArticleList();
  }, [getArticleList]);

  // 分页变化处理
  const handlePaginationChange = (current: number, pageSize: number) => {
    getArticleList({ page: current, pageSize });
  };

  // 文章标题组件
  const ArticleTitle = (article: ArticleItem) => (
    <Link 
      className='title'
      to={{
        pathname: `/user/article/detail/${article.id}`,
      }}
      target='_blank'
    >
      {article.title ?? '无标题'}
    </Link>
  );

  return (
    <div className={className} style={style}>
      <Skeleton loading={loading}>
        <div className="article-list">
          <List
            itemLayout="vertical"
            loading={loading}
            dataSource={data}
            split={false}
            pagination={{
              ...page,
              showTotal,
              align: 'center',
              showSizeChanger: false,
              onChange: handlePaginationChange
            }}
            rowKey={rowKeyF}
            renderItem={(item: ArticleItem, index: number) => (
              <List.Item
                style={{
                  // padding: '12px 12px 12px 12px'
                }}
                actions={[
                  <span>{item.creator || '皮皮虾'}</span>,
                  <span>{item.create_time}</span>,
                  <span>{item.category_name}</span>,
                ]}
              >
                <List.Item.Meta
                  title={ArticleTitle(item)}
                  description={
                    <div style={{ 
                      width: '100%', 
                      overflow: 'hidden', 
                      whiteSpace: 'nowrap', 
                      textOverflow: 'ellipsis' 
                    }}>
                      {item.summary}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </Skeleton>
    </div>
  );
};

export default ArticleList; 