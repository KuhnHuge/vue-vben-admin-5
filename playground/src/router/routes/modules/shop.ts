import type { RouteRecordRaw } from 'vue-router';

// import { useOrderOnlineStore } from '@vben/stores';

import { BasicLayout } from '#/layouts';
// import { $t } from '#/locales';

// const orderOnlineStore = useOrderOnlineStore();
const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'mdi:shopping-outline',
      order: 3006,
      title: 'Order Online',
    },
    name: 'orderOnlineManagement',
    path: '/orderOnlineManagement',
    redirect: '/orderOnline',
    children: [
      {
        name: 'orderOnline',
        path: '/orderOnline',
        component: () => import('#/views/shop/order-online.vue'),
        meta: {
          icon: 'mdi:shopping-outline',
          keepAlive: true,
          title: 'Order Online',
        },
        children: [],
      },
      {
        name: 'productSearch',
        path: '/productSearch',
        component: () => import('#/views/shop/product-search.vue'),
        meta: {
          icon: 'mdi:search',
          keepAlive: true,
          title: 'Product Search',
        },
        children: [],
      },
      {
        name: 'cart',
        path: '/cart',
        component: () => import('#/views/shop/cart.vue'),
        meta: {
          // badge: '20',
          // badgeVariants: 'destructive',
          // badgeType: orderOnlineStore.cartActive ? 'dot' : 'normal',
          icon: 'mdi:cart-outline',
          keepAlive: true,
          title: 'Cart',
        },
        children: [],
      },
    ],
  },
];

export default routes;
