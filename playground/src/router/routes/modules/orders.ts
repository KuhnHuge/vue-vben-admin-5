import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'icon-park-twotone:transaction-order',
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
          icon: 'icon-park-twotone:transaction-order',
          keepAlive: true,
          title: $t('page.orders.ordersList.title'),
        },
        children: [],
      },
    ],
  },
];

export default routes;
