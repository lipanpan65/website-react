import * as React from 'react'
import { Navigate, useLocation, useRoutes } from 'react-router-dom'

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
  // BugOutlined,
  // NodeIndexOutlined,
  // VerifiedOutlined,
  // BlockOutlined,
  // FileTextOutlined,
  HomeOutlined
} from '@ant-design/icons'


import AppLayout from '../components/AppLayout'
import Article from '../pages/user/article'

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
      // {
      //   id: "10",
      //   name: "工作台",
      //   url: "/operation/dashboard/workbench",
      //   hash: "#/operation/dashboard/workbench",
      //   icon: <DesktopOutlined />,
      // },
      // {
      //   id: "12",
      //   name: "异常汇总",
      //   url: "/operation/dashboard/problems",
      //   hash: "#/operation/dashboard/problems",
      //   icon: <AlertOutlined />,
      // },
    ]
  },
]


const Routes = () => {
  // const auth = useSelector((state: any) => state.auth)
  // console.log("auth", auth)
  return useRoutes(
    [
      {
        path: '/',
        element: <Navigate to='/user/article' />,
      },
      {
        path: '/user/article',
        element: <AppLayout />,
        children: [
          {
            path: '/user/article',
            element: <Navigate to='/user/article/overview' />
          }, {
            path: '/user/article/overview',
            element: <Article />
          }
        ]
      }
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
      // {
      //   path: "*",
      //   element: <NotFound />
      // }
    ])

}

export default Routes



