import { defineStore } from 'pinia';

export class PageConfig {
  pageSize: number = 10;
}
export interface PageState {
  cartConfig: PageConfig;
  orderDetailsConfig: PageConfig;
  ordersConfig: PageConfig;
}

export const useUserPageStore = defineStore('core-user-page', {
  actions: {
    setCartConfig(func: (config: PageConfig) => void) {
      func(this.cartConfig);
    },
    setOrderDetailsConfig(func: (config: PageConfig) => void) {
      func(this.orderDetailsConfig);
    },
    setOrdersConfig(func: (config: PageConfig) => void) {
      func(this.ordersConfig);
    },
  },
  persist: {
    pick: ['ordersConfig', 'orderDetailsConfig'],
  },
  state: (): PageState => ({
    cartConfig: new PageConfig(),
    orderDetailsConfig: new PageConfig(),
    ordersConfig: new PageConfig(),
  }),
});
