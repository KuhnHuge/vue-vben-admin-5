import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
// import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'majesticons:ship-line',
      order: 3001,
      title: 'Shipment Status',
    },
    name: 'ordersShipmentManagement',
    path: '/ordersShipmentManagement',
    redirect: '/ordersShipment',
    children: [
      {
        name: 'ordersShipment',
        path: '/ordersShipment',
        component: () => import('#/views/shipment/order-shipment.vue'),
        meta: {
          icon: 'majesticons:ship-line',
          keepAlive: true,
          title: 'Shipment Status',
        },
        children: [],
      },
    ],
  },
];

export default routes;
