import * as React from 'react'
import {
  Navigate,
  useLocation,
  useRoutes
} from 'react-router-dom'

{/* <SecurityScanOutlined /> */ }
{/* <UserOutlined /> */ }
import {
  GroupOutlined,
  GatewayOutlined,
  OrderedListOutlined,
  MenuOutlined,
  AppstoreOutlined,
  BugOutlined,
  SwitcherOutlined,
  HomeOutlined,
  ProfileOutlined,
  SecurityScanOutlined,
  UserOutlined
} from '@ant-design/icons'

import AppLayout from '@/components/AppLayout'
import BaseLayout from '@/components/BaseLayout'
import Article from '@/pages/user/article'
import ArticleDetail from '@/pages/user/article/detail'
import EditArticle from '@/pages/operator/article/editor'
import CreatorOverView from '@/pages/user/creator'
import CreatorLayout from '@/components/CreatorLayout'
import CratorArticle from '@/pages/user/creator/article'
import EditorLayout from '@/components/EditorLayout'
import NotFound from '@/components/NotFound'
import ArticleCategory from '@/pages/operator/article/category'
import Subject from '@/pages/user/subjects/overview'
import SubjectDetail from '@/pages/user/subjects/detail'
import AppMenu from '@/pages/operator/account/menu'

export const routeMap: any = [
  {
    id: "1",
    name: "首页",
    icon: <HomeOutlined />,
    url: '/user/article',
    hash: '#/user/article',
    childs: [
      {
        id: "11",
        name: "首页概览",
        url: "/user/article/overview",
        hash: "#/user/article/overview",
        icon: <AppstoreOutlined />,
      },
      {
        id: "12",
        name: "研发",
        url: "/user/article/develop",
        hash: "#/user/article/develop",
        icon: <BugOutlined />,
      },
    ]
  },
  {
    id: "2",
    name: "创作者中心",
    icon: <HomeOutlined />,
    url: '/user/creator',
    hash: '#/user/creator',
    childs: [
      {
        id: "21",
        name: "首页",
        url: "/user/creator/overview",
        hash: "#/user/creator/overview",
        icon: <AppstoreOutlined />,
      },
      {
        id: "22",
        name: "内容管理",
        // url: "/user/creator/content",
        // hash: "#/user/creator/content",
        icon: <SwitcherOutlined />,
        childs: [
          {
            id: "221",
            name: "文章管理",
            url: "/user/creator/overview",
            hash: "#/user/creator/overview",
            icon: <OrderedListOutlined />,
          },
          {
            id: "222",
            name: "分类管理",
            url: "/user/creator/article-category",
            hash: "#/user/creator/article-category",
            icon: <GroupOutlined />,
          }, {
            id: "223",
            name: "菜单管理",
            url: "/user/creator/menu",
            hash: "#/user/creator/menu",
            icon: <MenuOutlined />,
          },
          {
            id: "224",
            name: "专题管理",
            url: "/user/creator/subjects",
            hash: "#/user/creator/subjects",
            icon: <GatewayOutlined />,
          },
        ]
      }, {
        id: "23",
        name: "用户管理",
        icon: <SecurityScanOutlined />,
        childs: [
          {
            id: "231",
            name: "用户管理",
            url: "/user/creator/subjects",
            hash: "#/user/creator/subjects",
            icon: <UserOutlined />,
          },
        ]
      }
    ]
  },
  {
    id: "3",
    name: "专题",
    icon: <ProfileOutlined />,
    url: '/user/subjects',
    hash: '#/user/subjects',
    childs: [
      {
        id: "11",
        name: "首页概览",
        url: "/user/article/overview",
        hash: "#/user/article/overview",
        icon: <AppstoreOutlined />,
      },
      {
        id: "12",
        name: "研发",
        url: "/user/article/develop",
        hash: "#/user/article/develop",
        icon: <BugOutlined />,
      },
    ]
  },
]

const Routes = () => {

  return useRoutes(
    [
      {
        path: '/',
        element: <Navigate to='/user/article' />,
      },
      {
        path: '/user/article/editor',
        element: <EditorLayout />,
        children: [
          {
            path: '/user/article/editor/:id',
            element: <EditArticle />
          },
        ]
      },
      {
        path: '/user/article',
        element: <AppLayout />,
        children: [
          {
            path: '/user/article',
            element: <Navigate to='/user/article/overview' />
          },
          {
            path: '/user/article/overview',
            element: <Article />
          },
          {
            path: '/user/article/detail/:id',
            element: <ArticleDetail />
          },
        ]
      },
      {
        path: '/user/subjects',
        element: <AppLayout />,
        children: [
          {
            path: '/user/subjects',
            element: <Navigate to='/user/subjects/overview' />
          },
          {
            path: '/user/subjects/overview',
            element: <Subject />
          },
          {
            path: '/user/subjects/detail/:id',
            element: <SubjectDetail />
          },
        ]
      },
      {
        path: '/user/creator',
        element: <CreatorLayout />,
        children: [
          {
            path: '/user/creator',
            element: <Navigate to='/user/creator/overview' />,
          },
          {
            path: '/user/creator/overview',
            element: <CreatorOverView />
          },
          {
            path: '/user/creator/article',
            element: <CratorArticle />
          },
          {
            path: '/user/creator/article-category',
            element: <ArticleCategory />
          },
          {
            path: '/user/creator/menu',
            element: <AppMenu />
          },
        ]
      },
      {
        path: "*",
        element: <NotFound />
      }
    ])

}

export default Routes





