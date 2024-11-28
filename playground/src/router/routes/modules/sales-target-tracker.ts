import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
// import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'mdi:analytics',
      order: 1,
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
          affixTab: true,
          icon: 'mdi:analytics',
          keepAlive: true,
          title: 'Sales Target Tracker',
        },
        children: [],
      },
    ],
  },
];

export default routes;
