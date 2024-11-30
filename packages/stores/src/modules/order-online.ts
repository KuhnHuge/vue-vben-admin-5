import { defineStore } from 'pinia';

export interface OrderOnlineState {
  cartChange: boolean;
  searchKeyword?: string;
}

export const useOrderOnlineStore = defineStore('core-order-online', {
  actions: {
    setCartChange(value: boolean) {
      this.cartChange = value;
    },
    setSearchKeyword(value?: string) {
      this.searchKeyword = value;
    },
  },
  state: (): OrderOnlineState => ({
    cartChange: false,
  }),
});
