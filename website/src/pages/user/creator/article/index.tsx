import * as React from 'react'
import { Col, MenuProps, Row, Menu, theme, Tabs, List, Dropdown, message } from 'antd'

import {
  MenuOutlined,
  HomeOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'

import type { TabsProps } from 'antd';

import {
  Link,
  NavLink,
  Navigate,
  useNavigate
} from "react-router-dom"

import { dateFormate, request } from '@/utils';

import modal from 'antd/es/modal';

import './index.css'

import { rowKeyF, showTotal } from '@/utils';
import AppContainer from '@/components/AppContainer';
import AppContent from '@/components/AppContent';
import { api } from '@/api';

// 文章标题
const ArticleTitle = (article: any) => <Link
  className='title'
  to={{
    pathname: `/user/article/editor/${article.id}`,
  }}
  // state={{ status: 'drafts' }}
  // unstable_viewTransition
  target='_blank' // 添加了该属性后则无法获取参数
>
  {article.title ?? '无标题'}
</Link >

// 接口返回的数据
const initialState = {
  loading: false,
  data: [], // 文章的数据
  page: {
    total: 0,
    current: 0,
    pageSize: 5
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

interface CratorArticleProps {
  activeKey?: string
}

const CratorArticle: React.FC<CratorArticleProps> = ({
  activeKey = 'publish'
}) => {
  const {
    token: {
      colorBgContainer,
    },
  } = theme.useToken();
  const navigator = useNavigate()
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const items: MenuProps['items'] = [
    {
      key: 'edit',
      label: (<a>编辑</a>),
    },
    {
      key: 'delete',
      label: (<a>删除</a>),
    },
  ];

  const onChange = (page: any, pageSize: any) => {
    queryArticleList({ page, pageSize })
  }

  const queryArticleList = async (params?: any) => {
    try {
      const newParams = {
        status: activeKey,
        ...params
      }
      const response = await api.article.fetch(newParams);
      if (response && response.success) {
        const { data, page } = response.data;
        dispatch({
          type: 'READ_DONE', payload: {
            data, page
          }
        });
      } else {
        message.error(response?.message || '获取数据失败');
      }
    } catch (error) {
      message.error('请求失败，请稍后重试');
    }
    // request({
    //   url: `/api/user/v1/article/`,
    //   method: 'GET',
    //   params: params || {}
    // }).then((response: any) => {
    //   console.log("getArticleList.response", response)
    //   const { status, statusText } = response
    //   if (status === 200 && statusText === 'OK') {
    //     const { success, message, data: { page, data } } = response.data
    //     // const { page, data } = response.data
    //     dispatch({ type: 'READ_DONE', payload: { data, page } })
    //   }
    // })
  }

  const handleLinkTo = (v: any) => {
    navigator(`/user/article/editor/${v.id}`,
      {
        state: {
          status: v
        }
      })
  }

  const handleDeleteArticle = (article: any, cb: Function) => {
    request({
      url: `/api/user/v1/article/${article.id}/`,
      method: 'DELETE',
    }).then(({ status }: any) => {
      message.success("操作成功")
      if (status === 204) {
        queryArticleList()
      } else {
      }
    }).finally(() => cb());
  }
  
  const redirectEditorPage = (article: any) => {
    navigator(`/user/article/editor/${article.id}`, {
      // replace: true,
      state: {
        id: article.id,
        status: 'draft',
      }
    })
  }

  const handleClickDropDown = ({ key }: any, article: any) => {
    console.log('key', key)
    console.log('item', article)
    if (key === "edit") {
      redirectEditorPage(article)
    } else if (key === "delete") {
      modal.confirm({
        title: '删除草稿',
        icon: <ExclamationCircleOutlined />,
        content: '删除内容不可恢复，确定删除嘛？',
        okText: '确认',
        cancelText: '取消',
        onOk: (resolve: Function) => handleDeleteArticle(article, resolve),
      });
    }
  };

  React.useEffect(() => {
    (async () => {
      await queryArticleList();
    })();
  }, [activeKey]);

  return (
    <div>
      <article style={{
        background: colorBgContainer,
      }}>
        <List
          loading={state.loading}
          itemLayout="horizontal"
          dataSource={state.data}
          pagination={{
            ...state.page,
            showTotal,
            align: 'center',
            showSizeChanger: false,
            onChange // function(page, pageSize)
          }}
          rowKey={rowKeyF}
          renderItem={(item: any, index: number) => (
            <React.Fragment>
              <div className='item-wrapper'>
                <div className="item-title">
                  <Link
                    style={{ textDecoration: 'none' }}
                    to={`/user/article/editor/${item.id}`}
                    state={{ id: item.id, status: 'draft' }}
                    target='_black'
                  >
                    {item.title ? item.title : "无标题"}
                  </Link>
                  <span>
                    <React.Fragment>
                      <Dropdown menu={{
                        items,
                        onClick: (e: any) => handleClickDropDown(e, item)
                      }}>
                        <b onClick={(e) => e.preventDefault()}>
                          <EllipsisOutlined />
                        </b>
                      </Dropdown>
                    </React.Fragment>
                  </span>
                </div>
                <div className="item-footer">
                  <span>{dateFormate(item.create_time)}</span>
                </div>
              </div>
            </React.Fragment>
          )}
        />
      </article>
    </div>
  )
}

export default CratorArticle

