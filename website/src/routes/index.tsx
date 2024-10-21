import * as React from 'react'
import {
  Navigate,
  useLocation,
  useRoutes
} from 'react-router-dom'

// import { useSelector } from 'react-redux';

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
  UserOutlined,
  SettingOutlined,
  ReadOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  VerifiedOutlined,
  IdcardOutlined
} from '@ant-design/icons'

{/* <IdcardOutlined /> */ }

{/* <SafetyOutlined /> */ }

import AppLayout from '@/components/AppLayout'
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
import SubjectManager from '@/pages/operator/article/subjects'
// 用户登陆主页面
import Authenticate from '@/pages/operator/account/authenticate'
import System from '@/pages/operator/system'

// 管理端
import AdminLayout from '@/components/AdminLayout'
import WorkBench from '@/pages/operator/workbench'
// import AppUserInfo from '@/pages/operator/account/user'
import AppGlobalDict from '@/pages/operator/system/global-dictionary'
import RequireAuth from '@/components/RequireAuth';
import AppUserInfo from '@/pages/operator/system/account'
import AppRole from '@/pages/operator/system/role'



export const AppRoute: any = [
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
        name: "开发者中心",
        url: "/user/article/develop",
        hash: "#/user/article/develop",
        icon: <BugOutlined />,
      },
    ]
  },
]

export const AdminRoute: any = [
  {
    id: "1",
    name: "工作台",
    icon: <HomeOutlined />,
    url: '/operator/workbench',
    hash: '#/operator/workbench',
    childs: [
      {
        id: "11",
        name: "我的待办",
        url: "/operator/workbench/overview",
        hash: "#/operator/workbench/overview",
        icon: <AppstoreOutlined />,
      }
    ]
  },
  {
    id: "2",
    name: "创作者中心",
    icon: <HomeOutlined />,
    url: '/operator/creator',
    hash: '#/operator/creator',
    childs: [
      {
        id: "21",
        name: "首页",
        url: "/operator/creator/overview",
        hash: "#/operator/creator/overview",
        icon: <AppstoreOutlined />,
      },
      {
        id: "22",
        name: "内容管理",
        url: "/operator/creator/content",
        hash: "#/operator/creator/content",
        icon: <SwitcherOutlined />,
        childs: [
          {
            id: "221",
            name: "文章管理",
            url: "/operator/creator/overview",
            hash: "#/operator/creator/overview",
            icon: <OrderedListOutlined />,
          },
          {
            id: "222",
            name: "分类管理",
            url: "/operator/creator/article-category",
            hash: "#/operator/creator/article-category",
            icon: <GroupOutlined />,
          }, {
            id: "223",
            name: "菜单管理",
            url: "/operator/creator/menu",
            hash: "#/operator/creator/menu",
            icon: <MenuOutlined />,
          },
          {
            id: "224",
            name: "专题管理",
            url: "/operator/creator/subjects",
            hash: "#/operator/creator/subjects",
            icon: <GatewayOutlined />,
          },
        ]
      }
    ]
  },
  {
    id: "3",
    name: "设置",
    icon: <SettingOutlined />,
    url: '/operator/system',
    hash: '#/operator/system',
    childs: [
      {
        id: "311",
        name: "用户管理",
        icon: <IdcardOutlined />,
        url: '/operator/system/account',
        hash: '#/operator/system/account',
      }, {
        id: "312",
        name: "字典管理",
        icon: <ReadOutlined />,
        url: '/operator/system/dict',
        hash: '#/operator/system/dict',
      }, {
        id: "313",
        name: "任务管理",
        icon: <ClockCircleOutlined />,
        url: '/operator/system/task',
        hash: '#/operator/system/task',
      }, {
        id: "314",
        name: "角色管理",
        icon: <SafetyOutlined />,
        url: '/operator/system/role',
        hash: '#/operator/system/role',
      },
      {
        id: "315",
        name: "权限管理",
        icon: <VerifiedOutlined />,
        url: '/operator/system/role',
        hash: '#/operator/system/role',
      },
      {
        id: "12",
        name: "开发者中心",
        url: "/operator/system/developer",
        hash: "#/operator/system/developer",
        icon: <BugOutlined />,
      },
    ]
  }
]

const Routes = () => {

  // const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
  // const isAuthenticated = false;
  const isAuthenticated = true;

  return useRoutes(
    [
      {
        path: '/authenticate',
        element: <Authenticate />,
      },
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
            path: '/user/creator/subjects',
            element: <SubjectManager />
          },
          {
            path: '/user/creator/menu',
            element: <AppMenu />
          },
        ]
      },
      {
        path: '/operator/workbench',
        element: <RequireAuth isAuthenticated={isAuthenticated} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <Navigate to="overview" /> }, // 使用 index 路由来表示默认路径
              { path: 'overview', element: <WorkBench /> },
            ],
          },
        ]
      },
      {
        path: '/operator/creator',
        element: <RequireAuth isAuthenticated={isAuthenticated} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <Navigate to="article" /> }, // 使用 index 路由来表示默认路径
              { path: 'article', element: <ArticleCategory /> },
              { path: 'category', element: <ArticleCategory /> },
            ],
          },
        ]
      },
      {
        path: '/operator/system',
        element: <RequireAuth isAuthenticated={isAuthenticated} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <Navigate to="account" /> }, // 使用 index 路由来表示默认路径
              { path: 'account', element: <AppUserInfo /> },
              { path: 'role', element: <AppRole /> },
              { path: 'dict', element: <AppGlobalDict /> }
            ],
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





