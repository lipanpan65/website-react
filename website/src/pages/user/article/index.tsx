import * as React from 'react'

import {
  Link,
  useNavigate,
  useLocation
} from "react-router-dom"

import {
  Button,
  Card,
  List,
  Menu,
  MenuProps,
  theme,
  Skeleton
} from 'antd'

import { request, rowKeyF, showTotal } from '@/utils'

import './index.css';
import {
  // AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  CompassOutlined,
  ConsoleSqlOutlined,
  LaptopOutlined,
  ToolOutlined
} from '@ant-design/icons';

import Recommended from './recommended';
import Backend from './backend';
import Frontend from './frontend';
import ArticleTabs from '@/components/ArticleTabs';
import ArticleList from '@/components/ArticleList';

const ArticleTitle = (article: any) => <Link className='title'
  to={{
    pathname: `/user/article/detail/${article.id}`,
    // search: 'new'
  }}
  // state={{ id: article.id, status: 'drafts' }}
  target='_blank'>{article.title ?? '无标题'}</Link>

// 接口返回的数据
const initialState = {
  loading: false,
  data: [],
  page: {
    total: 0,
    current: 0,
    pageSize: 10
  }
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'READ':
      return {
        loading: true,
        ...state
      }
    case 'READ_DONE':
      const { payload: { data, page } } = action
      return {
        ...state,
        data, page
      }
    default:
      return state
  }
}

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'recommended',
    label: '综合',
    icon: < CompassOutlined />,
  },
  {
    key: 'backend',
    label: '后端',
    icon: <ConsoleSqlOutlined />,
  },
  {
    key: 'frontend',
    label: '前端',
    icon: <LaptopOutlined />,
  },
  // {
  //   key: '开发工具',
  //   label: '开发工具',
  //   icon: <ToolOutlined />,
  // },
];

interface ArticleProps {
  category?: string;
}

const Article: React.FC<ArticleProps> = ({ category = 'recommended' }) => {

  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = React.useState<string>('recommend');

  const [loading, setLoading] = React.useState<boolean>(true)

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const onChange = (page: any, pageSize: any) => {
    getArticleList({ page, pageSize })
  }

  const getArticleList = (params?: any): any => {
    // 根据当前分类获取对应的文章列表
    const categoryParam = category || 'recommended';
    request({
      url: `/api/user/v1/article/?status=publish&category=${categoryParam}`,
      method: 'GET',
      params: params || {}
    }).then((response: any) => {
      if (response && response.success) {
        const { page, data } = response.data
        dispatch({ type: 'READ_DONE', payload: { data, page } })
      }
      setLoading(false)
    })
  }

  React.useEffect(() => getArticleList(), [category])

  // 通过点击菜单，切换文章列表
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    
    // 使用 navigate 跳转到对应的路由
    navigate(`/user/article/${e.key}`);
    
    // 根据点击的菜单，切换文章列表
    switch (e.key) {
      case 'recommended':
        getArticleList({ status: 'publish', category: 'recommended' });
        break;
      case 'backend':
        getArticleList({ status: 'publish', category: 'backend' });
        break;
      case 'frontend':
        getArticleList({ status: 'publish', category: 'frontend' });
        break;
    }
  };

  // 标签页变化处理
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    console.log('Tab changed to:', key, 'Category:', category);
  };

  // 根据当前路由设置默认选中的菜单项
  const defaultSelectedKeys = [category];

  return (
    <React.Fragment>
      <div className='article-wrapper'>
        <div className="section section-left" style={{
          padding: '0',
          minHeight: '',
          // flexDirection: 'column',
          // backgroundColor: "#fff",
          // height: 'fix-content',
          // gap: '8px'
        }}>
          {/* <Button>你好</Button> */}
          <Menu
            onClick={onClick}
            style={{
              borderRadius: borderRadiusLG
            }}
            selectedKeys={defaultSelectedKeys}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
          />
        </div>

        {/* 文章列表 */}
        <div className="section center">
          <ArticleTabs 
            category={category}
            activeKey={activeTab}
            onTabChange={handleTabChange}
            showArticleList={true}
            showHot={category === 'recommended'}
          />
        </div>
        {/* <div className="section section-right">
          <div className="right-pane">
            <Card>
              <p>晚上好</p>
            </Card>
          </div>
          <div className="right-pane">
            <Card title={"文章榜"}>
            </Card>
          </div>
          <div className="right-pane">
            <Card title={"作者榜"}></Card>
          </div>
          <div className="right-pane">
          </div>
        </div> */}
      </div>
    </React.Fragment>
  )
}
export default Article







