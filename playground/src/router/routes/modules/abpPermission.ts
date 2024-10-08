import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ic:round-security',
      order: 8888,
      title: '权限管理',
    },
    name: 'AbpPermission',
    path: '/abp-permission',
    children: [
      {
        name: 'Role',
        path: '/abp-permission/role',
        component: () => import('#/views/permission/role/role.vue'),
        meta: {
          icon: 'ic:twotone-group',
          title: '角色',
        },
      },
    ],
  },
];

export default routes;
