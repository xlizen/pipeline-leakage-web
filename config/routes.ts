export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.pipeline',
    icon: 'table',
    path: '/pipeline/list',
    component: './PipelineList',
  },
  {
    name: 'list.system',
    icon: 'table',
    path: '/system/list',
    component: './System',
  },
  {
    path: '/',
    redirect: '/pipeline/list',
  },
  {
    component: './404',
  },
];
