import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
} from '@vben/types';

import { generateAccessible } from '@vben/access';
import { preferences } from '@vben/preferences';
import { useTabbarStore } from '@vben/stores';

import { message } from 'ant-design-vue';

import { getAllMenusApi } from '#/api';
import { BasicLayout, IFrameView } from '#/layouts';
import { $t } from '#/locales';

const forbiddenComponent = () => import('#/views/_core/fallback/forbidden.vue');

async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue');

  const layoutMap: ComponentRecordType = {
    BasicLayout,
    IFrameView,
  };

  const accessible = await generateAccessible(preferences.app.accessMode, {
    ...options,
    fetchMenuListAsync: async () => {
      message.loading({
        content: `${$t('common.loadingMenu')}...`,
        duration: 1.5,
      });
      return await getAllMenusApi();
    },
    // 可以指定没有权限跳转403页面
    forbiddenComponent,
    // 如果 route.meta.menuVisibleWithForbidden = true
    layoutMap,
    pageMap,
  });
  const tabbarStore = useTabbarStore();
  tabbarStore.tabs.forEach((tab) => {
    if (
      tab.path.startsWith('/orders/order-details-') &&
      tab.name &&
      !options.router.hasRoute(tab.name.toString())
    ) {
      // const newRouter = ;
      options.router.addRoute('ordersManagement', {
        component: () => import('#/views/orders/order-details.vue'),
        meta: {
          keepAlive: true,
          title: `${$t('page.orders.ordersDetail.title')} ${tab.name.toString().replace('order-details-', '')}`,
        },
        name: tab.name,
        path: `/orders/${tab.name.toString()}`,
      });
    } else if (
      tab.path.startsWith('/order-shipment/order-details-') &&
      tab.name &&
      !options.router.hasRoute(tab.name.toString())
    ) {
      options.router.addRoute('ordersShipmentManagement', {
        component: () => import('#/views/shipment/order-shipment-details.vue'),
        meta: {
          keepAlive: true,
          title: `Shipment Details ${tab.name.toString().replace('shipment-details-', '')}`,
        },
        name: tab.name,
        path: `/order-shipment/${tab.name.toString()}`,
      });
    }
  });

  return accessible;
}

export { generateAccess };
