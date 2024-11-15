import { defineStore } from 'pinia';

export class PageConfig {
  pageSize: number = 10;
}
export interface PageState {
  orderDetailsConfig: PageConfig;
  ordersConfig: PageConfig;
}

export const useUserPageStore = defineStore('core-user-page', {
  actions: {
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
    orderDetailsConfig: new PageConfig(),
    ordersConfig: new PageConfig(),
  }),
});
