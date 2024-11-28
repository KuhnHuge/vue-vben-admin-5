import { defineStore } from 'pinia';

export interface OrderOnlineState {
  cartChange: boolean;
}

export const useOrderOnlineStore = defineStore('core-order-online', {
  actions: {
    setCartChange(value: boolean) {
      this.cartChange = value;
    },
  },
  state: (): OrderOnlineState => ({
    cartChange: false,
  }),
});
