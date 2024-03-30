import * as React from 'react'
import {
  Navigate,
  useLocation,
  useRoutes
} from 'react-router-dom'

import {
  AlertOutlined,
  // ApartmentOutlined,
  // CloudServerOutlined,
  DesktopOutlined,
  // UsergroupAddOutlined,
  // UserOutlined,
  // UserAddOutlined,
  // BookOutlined,
  AppstoreOutlined,
  // SettingOutlined,
  // DeploymentUnitOutlined,
  // InboxOutlined,
  // DatabaseOutlined,
  BugOutlined,
  // NodeIndexOutlined,
  // VerifiedOutlined,
  // BlockOutlined,
  // FileTextOutlined,
  SwitcherOutlined,
  EditOutlined,
  HomeOutlined,
  ProfileOutlined
} from '@ant-design/icons'

{/* <ProfileOutlined /> */ }

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
            icon: <AppstoreOutlined />,
          },
          // {
          //   id: "222",
          //   name: "文章管理2",
          //   url: "/user/creator/article",
          //   hash: "#/user/creator/article",
          //   icon: <AppstoreOutlined />,
          // },
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
          // {
          //   path: '/user/article/edit/:id',
          //   element: <EditArticle />
          // }
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
        ]
      },
      // {
      //   path: "/login",
      //   element: <Login />
      // },
      // {
      //   path: "/operation/dashboard",
      //   element: <RouteWrapper><AppLayout /></RouteWrapper>,
      //   children: [
      //     {
      //       path: "/operation/dashboard",
      //       element: <Navigate to='/operation/dashboard/workbench' />,
      //     },
      //     {
      //       path: "/operation/dashboard/workbench",
      //       element: <Workbench />
      //     },
      //     {
      //       path: "/operation/dashboard/duty",
      //       element: <Duty />
      //     },
      //     {
      //       path: "/operation/dashboard/problems",
      //       element: <MonitorProblems />
      //     },
      //     // {
      //     //   path: "/operation/dashboard/overview",
      //     //   element: <OverView />
      //     // },
      //   ]
      // },
      // {
      //   path: "/operation/configure",
      //   element: <AppLayout />,
      //   children: [
      //     {
      //       path: "/operation/configure",
      //       element: <Navigate to='/operation/configure/user/overview' />,
      //     },
      //     {
      //       path: "/operation/configure/user/overview",
      //       element: <User />
      //     },
      //     {
      //       path: "/operation/configure/user/group",
      //       element: <UserGroup />
      //     },
      //     {
      //       path: "/operation/configure/user/permission",
      //       element: <UserPermissonMain />
      //     },
      //     // {
      //     //   path: "/operation/configure/user/role",
      //     //   element: <UserRole />
      //     // },
      //     {
      //       path: "/operation/configure/segment",
      //       element: <Segment />
      //     },
      //     {
      //       path: "/operation/configure/tag",
      //       element: <Tag />
      //     },
      //     {
      //       path: "/operation/configure/dict",
      //       element: <GlobalDict />
      //     },
      //     {
      //       path: "/operation/configure/organize",
      //       element: <Organize />
      //     },
      //     {
      //       path: "models",
      //       element: <ModelsView />,
      //       // children: [
      //       //   {
      //       //     path: "overview",
      //       //     element: <ModelOverView />
      //       //   }
      //       // ]
      //     },
      //     {
      //       path: "/operation/configure/model-graph",
      //       element: <ModelGraph />
      //     },
      //     {
      //       path: "/operation/configure/models/:model_key/overview",
      //       element: <ModelOverView />
      //     },
      //     {
      //       path: "/operation/configure/model-store",
      //       element: <ModelStore />
      //     },
      //     {
      //       path: "/operation/configure/model-store/:id/data/",
      //       element: <ModelData />
      //     },
      //     {
      //       path: "/operation/configure/model-store/:id/detail",
      //       element: <ModelDetail />
      //     },
      //     {
      //       path: "/operation/configure/workorder",
      //       element: <WorkOrderOverview />
      //     },
      //     // 开发文档
      //     {
      //       path: 'development/json-form/',
      //       element: <JsonForm />
      //     },
      //   ]
      // },
      // {
      //   path: "/operation/subjects",
      //   element: <AppLayout withoutLeft />,
      //   children: [
      //     {
      //       path: "/operation/subjects",
      //       element: <Navigate to='/operation/subjects/overview' />,
      //     },
      //     {
      //       path: "/operation/subjects/:id",
      //       element: <PostsDetail />,
      //     },
      //     {
      //       path: "/operation/subjects/overview",
      //       element: <SubjectOverview />
      //     },
      //     {
      //       path: "/operation/subjects/edit/",
      //       element: <EditPosts />
      //     },
      //     {
      //       path: "/operation/subjects/creator",
      //       element: <Creator />
      //     }
      //   ]
      // },
      {
        path: "*",
        element: <NotFound />
      }
    ])

}

export default Routes





