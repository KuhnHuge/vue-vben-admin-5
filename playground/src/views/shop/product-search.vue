<script setup lang="ts">
import type { GtProductSearchItem } from '#/api/gt-api/models';

import { computed, onMounted, type Ref, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { MdiCart, MdiSearch } from '@vben/icons';
import { preferences } from '@vben/preferences';
import { useOrderOnlineStore } from '@vben/stores';

import { message } from 'ant-design-vue';

import { CartApi } from '#/api/gt-api';
import { ProductApi } from '#/api/gt-api/productApi';

const router = useRouter();
const addCartData = ref([0]);
const currentKeyword = ref('');

const searchValue = ref('');
const orderOnlineStore = useOrderOnlineStore();
const api = new ProductApi();
const cartApi = new CartApi();
const dataSource: Ref<GtProductSearchItem[]> = ref([]);
const pagination = ref({
  current: 1,
  pageSize: 20,
  total: 120,
});
const loading = ref(false);
const infoBackgroundColor = ref(
  preferences.theme.mode === 'dark' ? '#313131' : '#f1f3f6',
);
const cardBackgroundColor = ref(
  preferences.theme.mode === 'dark' ? 'unset' : '#fff',
);
const noData = computed(() => !loading.value && dataSource.value.length === 0);
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
  await loadData(orderOnlineStore.searchKeyword);
  searchValue.value = orderOnlineStore.searchKeyword ?? '';
});

async function loadData(
  keyword?: string | undefined,
  page: number | undefined = undefined,
  pageSize: number | undefined = undefined,
) {
  try {
    loading.value = true;
    if ((!keyword || !keyword.trim()) && !currentKeyword.value) return;
    currentKeyword.value = keyword?.trim() ?? currentKeyword.value;
    const model = await api.productSearch(
      currentKeyword.value,
      pageSize ?? pagination.value.pageSize ?? 10,
      page ?? pagination.value.current ?? 1,
    );
    if (!model) return;
    dataSource.value = model.data.list;
    pagination.value.total = model.data.total;
    pagination.value.pageSize = model.data.per_page;
    pagination.value.current = model.data.current_page;
    addCartData.value = dataSource.value.map(() => {
      return 0;
    });
  } finally {
    loading.value = false;
  }
}
async function addCart(item: GtProductSearchItem, quantity: number) {
  const model = await cartApi.addToCart(Number(item.product_id), quantity);
  if (model?.msg) {
    message.success(model.msg);
    orderOnlineStore.setCartChange(true);
  }
}
function search() {
  const input = searchValue.value?.trim();
  if (input) {
    orderOnlineStore.setSearchKeyword(input);
  }
}
watch(
  () => orderOnlineStore.searchKeyword,
  async (newValue) => {
    searchValue.value = orderOnlineStore.searchKeyword ?? '';
    await loadData(newValue);
  },
);
</script>

<template>
  <div class="flex flex-col items-center">
    <a-input-group class="m-6 !flex max-w-[900px]" compact>
      <a-input
        v-model:value="searchValue"
        placeholder="OE No / Vehicle / Parts"
        size="large"
        @press-enter="search()"
      />
      <a-button
        class="!flex min-w-28 items-center justify-around !rounded-l-[0px]"
        size="large"
        type="primary"
        @click="search"
      >
        <template #icon>
          <MdiSearch width="21" />
        </template>
        Search
      </a-button>
    </a-input-group>
    <a-empty v-show="noData" />
    <a-card
      v-show="!noData"
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
          class="product-card m-2.5 flex h-[450px] w-[19rem] flex-col items-center"
        >
          <div
            class="flex h-[200px] w-full flex-col items-center p-[8%]"
            style="background: #fff"
          >
            <img :alt="item.my_no" :src="item.pic" class="h-[160px]" />
          </div>
          <div class="line-clamp-2 w-[95%] text-sm">
            {{ item.title }}
          </div>
          <div class="w-full pl-2 pr-2">
            <a-divider style="margin: 12px 0" />
          </div>
          <div
            class="flex w-full flex-col p-[3%]"
            style="
              width: 95%;
              font-size: 14px;
              font-weight: 100;
              background-color: #f4f4f4;
            "
          >
            <div
              :style="`background-color:${infoBackgroundColor}`"
              class="flex w-[95%] justify-between pl-[0.6rem] pr-[0.6rem]"
            >
              <span>OE:</span>
              <span>{{ item.oe }}</span>
            </div>
            <div
              :style="`background-color:${infoBackgroundColor}`"
              class="flex w-[95%] justify-between pl-[0.6rem] pr-[0.6rem]"
            >
              <span>NID:</span>
              <span>{{ item.my_no }}</span>
            </div>
            <div
              :style="`background-color:${infoBackgroundColor}`"
              class="flex w-[95%] justify-between pl-[0.6rem] pr-[0.6rem]"
            >
              <span>MOQ:</span>
              <span>{{ item.min_qty }}</span>
            </div>
            <div
              :style="`background-color:${infoBackgroundColor};color: #c9465d`"
              class="flex w-[95%] justify-between pl-[0.6rem] pr-[0.6rem]"
            >
              <span>PRICE:</span>
              <span>{{ item.current_price }}</span>
            </div>
          </div>

          <div class="w-full pl-2 pr-2">
            <a-divider style="margin: 12px 0" />
          </div>
          <div class="flex w-[95%] justify-between">
            <a-input-number
              v-model:value="addCartData[index]"
              :min="0"
              class="w-[225px]"
            />
            <a-button
              type="primary"
              @click="addCart(item, addCartData[index] ?? 0)"
            >
              <MdiCart width="20px" />
            </a-button>
          </div>
        </div>
        <i class="m-2.5 w-[19rem]"></i>
        <i class="m-2.5 w-[19rem]"></i>
        <i class="m-2.5 w-[19rem]"></i>
        <i class="m-2.5 w-[19rem]"></i>
        <i class="m-2.5 w-[19rem]"></i>
        <i class="m-2.5 w-[19rem]"></i>
        <i class="m-2.5 w-[19rem]"></i>
        <i class="m-2.5 w-[19rem]"></i>
        <i class="m-2.5 w-[19rem]"></i>
        <i class="m-2.5 w-[19rem]"></i>
        <i class="m-2.5 w-[19rem]"></i>
        <i class="m-2.5 w-[19rem]"></i>
        <i class="m-2.5 w-[19rem]"></i>
        <i class="m-2.5 w-[19rem]"></i>
        <i class="m-2.5 w-[19rem]"></i>
      </div>
    </a-card>
    <a-pagination
      v-model:current="pagination.current"
      v-model:page-size="pagination.pageSize"
      :show-size-changer="false"
      :total="pagination.total"
      show-less-items
      show-quick-jumper
      @change="loadData()"
    />
    <div
      :style="`
        width: 60px;
        height: 60px;
        position: fixed;
        border-radius: 50%;
        background: ${preferences.theme.colorPrimary};
        bottom: 274px;
        right: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        `"
      @click="router.push('/cart')"
    >
      <MdiCart color="#FFF" width="32" />
    </div>
  </div>
</template>

<style scoped></style>
