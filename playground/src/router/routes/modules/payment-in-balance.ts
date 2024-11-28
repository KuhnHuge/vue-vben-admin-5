import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
// import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'mdi:account-payment-outline',
      order: 3002,
      title: 'Payment in Balance',
    },
    name: 'paymentManagement',
    path: '/paymentManagement',
    redirect: '/paymentInBalance',
    children: [
      {
        name: 'paymentInBalance',
        path: '/paymentInBalance',
        component: () => import('#/views/payment/payment-in-balance.vue'),
        meta: {
          icon: 'mdi:account-payment-outline',
          keepAlive: true,
          title: 'Payment in Balance',
        },
        children: [],
      },
    ],
  },
];

export default routes;
