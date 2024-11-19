import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
// import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'icon-park-outline:history-query',
      order: 3003,
      title: 'Sales Target Tracker',
    },
    name: 'salesTarget',
    path: '/salesTarget',
    redirect: '/salesTargetTracker',
    children: [
      {
        name: 'salesTargetTracker',
        path: '/salesTargetTracker',
        component: () =>
          import('#/views/dashboard/sales-target/sales-target-tracker.vue'),
        meta: {
          icon: '',
          keepAlive: true,
          title: 'Sales Target Tracker',
        },
        children: [],
      },
    ],
  },
];

export default routes;
