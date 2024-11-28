<script setup lang="ts">
import type { GtProductItem } from '#/api/gt-api/models';

import { onMounted, type Ref, ref, watch } from 'vue';

import { MdiAddShoppingCart } from '@vben/icons';
import { preferences } from '@vben/preferences';
import { useOrderOnlineStore } from '@vben/stores';

import { message } from 'ant-design-vue';

import { CartApi, OrderApi } from '#/api/gt-api';

const orderOnlineStore = useOrderOnlineStore();
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 120,
});
const api = new OrderApi();
const cartApi = new CartApi();
const loading = ref(false);
const dataSource: Ref<GtProductItem[]> = ref([]);
const addCartData = ref([0]);
const infoBackgroundColor = ref(
  preferences.theme.mode === 'dark' ? '#313131' : '#f1f3f6',
);
const cardBackgroundColor = ref(
  preferences.theme.mode === 'dark' ? 'unset' : '#fff',
);
watch(
  () => preferences.theme.mode,
  () => {
    infoBackgroundColor.value =
      preferences.theme.mode === 'dark' ? '#313131' : '#f1f3f6';
    cardBackgroundColor.value =
      preferences.theme.mode === 'dark' ? 'unset' : '#fff';
  },
);
onMounted(async () => {
  await loadData();
});
async function loadData(
  page: number | undefined = undefined,
  pageSize: number | undefined = undefined,
) {
  try {
    loading.value = true;
    const model = await api.purchasedProductList({
      pageIndex: page ?? pagination.value.current ?? 1,
      pageSize: pageSize ?? pagination.value.pageSize ?? 10,
    });
    if (!model) return;
    dataSource.value = model.data as any[];
    addCartData.value = dataSource.value.map(() => {
      return 0;
    });
    if (pagination.value.current !== model.pageIndex) {
      pagination.value.current = model.pageIndex;
    }

    if (pagination.value.pageSize !== model.pageSize) {
      pagination.value.pageSize = model.pageSize;
    }
    if (pagination.value.total !== model.total) {
      pagination.value.total = model.total;
    }
  } finally {
    loading.value = false;
  }
}

async function addCart(item: GtProductItem, quantity: number) {
  const model = await cartApi.addToCart(item.product_id, quantity);
  if (model?.msg) {
    message.success(model.msg);
    orderOnlineStore.setCartChange(true);
  }
}
</script>

<template>
  <div class="flex flex-col items-center">
    <a-card
      :bordered="false"
      :loading="loading"
      class="w-full"
      style="background: transparent; box-shadow: unset"
    >
      <div class="flex w-full flex-wrap justify-between">
        <div
          v-for="(item, index) in dataSource"
          :key="item.product_id"
          :style="`background-color:${cardBackgroundColor}`"
          class="product-card m-2.5 flex h-[450px] w-64 flex-col items-center"
        >
          <div
            class="flex h-[250px] w-full flex-col items-center"
            style="background: #fff"
          >
            <img
              :alt="item.my_no"
              :src="item.picture"
              class="h-[250px] w-auto"
            />
          </div>
          <div class="w-full pl-2 pr-2">
            <a-divider style="margin: 12px 0" />
          </div>
          <div
            class="flex w-full flex-col pl-2.5 pr-2.5"
            style="font-size: 15px; font-weight: 500"
          >
            <div
              :style="`background-color:${infoBackgroundColor}`"
              class="flex w-full justify-between pl-1 pr-1"
            >
              <span>OE:</span>
              <span>{{ item.oe }}</span>
            </div>
            <div
              :style="`background-color:${infoBackgroundColor}`"
              class="flex w-full justify-between pl-1 pr-1"
            >
              <span>NID:</span>
              <span>{{ item.my_no }}</span>
            </div>
            <div
              :style="`background-color:${infoBackgroundColor}`"
              class="flex w-full justify-between pl-1 pr-1"
            >
              <span>MOQ:</span>
              <span>{{ item.min_qty }}</span>
            </div>
            <div
              :style="`background-color:${infoBackgroundColor};color: #c9465d`"
              class="flex w-full justify-between pl-1 pr-1"
            >
              <span>PRICE:</span>
              <span>{{ item.price }}</span>
            </div>
          </div>

          <div class="w-full pl-2 pr-2">
            <a-divider style="margin: 12px 0" />
          </div>
          <div class="flex w-[225px] justify-between">
            <a-input-number
              v-model:value="addCartData[index]"
              :min="0"
              class="w-[165px]"
            />
            <a-button
              type="primary"
              @click="addCart(item, addCartData[index] ?? 0)"
            >
              <MdiAddShoppingCart width="20px" />
            </a-button>
          </div>
        </div>
        <i class="ml-2.5 mr-2.5 w-64"></i>
        <i class="ml-2.5 mr-2.5 w-64"></i>
        <i class="ml-2.5 mr-2.5 w-64"></i>
        <i class="ml-2.5 mr-2.5 w-64"></i>
        <i class="ml-2.5 mr-2.5 w-64"></i>
        <i class="ml-2.5 mr-2.5 w-64"></i>
        <i class="ml-2.5 mr-2.5 w-64"></i>
        <i class="ml-2.5 mr-2.5 w-64"></i>
        <i class="ml-2.5 mr-2.5 w-64"></i>
        <i class="ml-2.5 mr-2.5 w-64"></i>
        <i class="ml-2.5 mr-2.5 w-64"></i>
        <i class="ml-2.5 mr-2.5 w-64"></i>
        <i class="ml-2.5 mr-2.5 w-64"></i>
        <i class="ml-2.5 mr-2.5 w-64"></i>
      </div>
    </a-card>
    <a-pagination
      v-model:current="pagination.current"
      v-model:page-size="pagination.pageSize"
      :show-size-changer="false"
      :total="pagination.total"
      show-less-items
      show-quick-jumper
      @change="loadData"
    />
  </div>
</template>

<style scoped>
.product-card {
  overflow: hidden;
  border-radius: 6px;
  box-shadow: 0.1em 0.1em 1em rgb(179 179 179 / 35%);
}
</style>
