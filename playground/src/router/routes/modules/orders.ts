import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'icon-park-outline:history-query',
      order: 3000,
      title: $t('page.orders.title'),
    },
    name: 'ordersManagement',
    path: '/ordersManagement',
    children: [
      {
        name: 'orders',
        path: '/orders',
        component: () => import('#/views/orders/orders.vue'),
        meta: {
          icon: '',
          keepAlive: true,
          title: $t('page.orders.ordersList.title'),
        },
        children: [],
      },
    ],
  },
];

export default routes;
