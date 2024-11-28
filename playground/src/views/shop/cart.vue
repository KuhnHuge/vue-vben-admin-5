<script setup lang="ts">
import type { STablePaginationConfig } from '@surely-vue/table';

import type { GtProductItem } from '#/api/gt-api/models';

import {
  computed,
  onActivated,
  onBeforeUnmount,
  onMounted,
  type Ref,
  ref,
  watch,
} from 'vue';

import { $t } from '@vben/locales';
import { preferences } from '@vben/preferences';
import { useOrderOnlineStore, useUserPageStore } from '@vben/stores';

import { message } from 'ant-design-vue';

import { CartApi } from '#/api/gt-api';
import { type TbColumnType } from '#/components/TbColumnType';
import { getUpdateTableHeight } from '#/components/update-table-height';

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
let isMounted = false;
const orderOnlineStore = useOrderOnlineStore();
const userPageStore = useUserPageStore();
const api = new CartApi();
const columns: Ref<TbColumnType[]> = ref([]);
const tableMaxHeight = ref(400);
const loading = ref(false);
const dataSource = ref<GtProductItem[]>([]);
const updateTableHeight = getUpdateTableHeight('table', tableMaxHeight);
const pagination = ref<STablePaginationConfig>({
  pageSize: userPageStore.cartConfig.pageSize,
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal: (total) => {
    return $t('templates.pagination.total').replace(
      '[total]',
      total.toString(),
    );
  },
});
const selectedRowKeys = ref<number[]>([]);
const onSelectChange = (keys: number[]) => {
  selectedRowKeys.value = keys;
};
const hasSelected = computed(() => selectedRowKeys.value.length > 0);
async function loadData(withLoading: boolean = true) {
  try {
    if (withLoading) {
      loading.value = true;
    }
    const model = await api.cartList();
    if (!model) return;
    dataSource.value = model.data as GtProductItem[];
    pagination.value.current = model.pageIndex;
    pagination.value.pageSize = model.pageSize;
    pagination.value.total = model.total;
  } finally {
    if (withLoading) {
      loading.value = false;
    }
  }
}
async function removeFromCart(product_ids: string) {
  try {
    loading.value = true;
    await api.removeFromCart(product_ids);
    await loadData(false);
  } finally {
    loading.value = false;
  }
}
async function removeSelected() {
  try {
    loading.value = true;
    await api.removeFromCart(selectedRowKeys.value.join(','));
    await loadData(false);
    selectedRowKeys.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  columns.value = getColumns();
  await loadData();
  pagination.value.onChange = async (page, pageSize) => {
    await loadData(page, pageSize);
    await updateTableHeight();
    userPageStore.setCartConfig((c) => (c.pageSize = pageSize ?? 10));
  };
  await updateTableHeight();
  window.addEventListener('resize', updateTableHeight);
  isMounted = true;
  orderOnlineStore.setCartChange(false);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTableHeight);
});

onActivated(async () => {
  if (isMounted && orderOnlineStore.cartChange) {
    await loadData();
    orderOnlineStore.setCartChange(false);
  }
});

function getColumns(): TbColumnType[] {
  return [
    {
      dataIndex: 'seq',
      fixed: 'left',
      key: 'seq',
      resizable: true,
      title: 'No',
      width: 80,
    },
    {
      autoHeight: true,
      dataIndex: 'item info',
      key: 'item info',
      resizable: true,
      title: 'Item',
    },
    {
      dataIndex: 'quantity',
      editable: true,
      key: 'quantity',
      resizable: true,
      title: 'Quantity',
      valueSetter: async (params) => {
        const nv =
          typeof params.newValue === 'string'
            ? params.newValue?.replaceAll(/\D/g, '')
            : params.newValue;
        const quantity = Number(nv);
        if (quantity !== params.oldValue) {
          if (quantity < 1) {
            message.error('Quantity must be greater than 0');
            return false;
          }
          const model = await api.updateQuantity(
            params.record.product_id,
            quantity,
          );
          if (!model) {
            return false;
          }
          message.success(model.msg);
          params.record.quantity = quantity;
        }
        return true;
      },
      width: 180,
    },
    {
      fixed: 'right',
      key: 'operation',
      title: $t('common.operation'),
      width: 200,
    },
  ];
}
</script>

<template>
  <div>
    <s-table
      id="table"
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
      :scroll="{ y: tableMaxHeight }"
      row-key="product_id"
      stripe
    >
      <template #title>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <div>
            <i></i>
          </div>
          <div>
            <a-button
              :disabled="!hasSelected"
              class="mr-2"
              @click="removeSelected"
            >
              Remove Selected
            </a-button>
            <a-button type="primary" @click="loadData()">
              {{ $t('common.refresh') }}
            </a-button>
          </div>
        </div>
      </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'operation'">
          <div class="operation-column">
            <a-button @click="removeFromCart(record.product_id)">
              Remove
            </a-button>
          </div>
        </template>
        <template v-if="column.key === 'seq'">
          {{ index + 1 }}
        </template>
        <template v-if="column.key === 'item info'">
          <div class="flex">
            <div class="h-[150px] w-[100px] overflow-hidden">
              <img
                :alt="record.my_no"
                :src="record.picture"
                class="h-auto w-full"
              />
            </div>
            <div
              class="flex w-[220px] flex-col pl-2.5 pr-2.5"
              style="font-size: 15px; font-weight: 500"
            >
              <div
                :style="`background-color:${infoBackgroundColor}`"
                class="flex w-full justify-between pl-1 pr-1"
              >
                <span>OE:</span>
                <span>{{ record.oe }}</span>
              </div>
              <div
                :style="`background-color:${infoBackgroundColor}`"
                class="flex w-full justify-between pl-1 pr-1"
              >
                <span>NID:</span>
                <span>{{ record.my_no }}</span>
              </div>
              <div
                :style="`background-color:${infoBackgroundColor}`"
                class="flex w-full justify-between pl-1 pr-1"
              >
                <span>MOQ:</span>
                <span>{{ record.min_qty }}</span>
              </div>
              <div
                :style="`background-color:${infoBackgroundColor};color: #c9465d`"
                class="flex w-full justify-between pl-1 pr-1"
              >
                <span>PRICE:</span>
                <span>{{ record.price }}</span>
              </div>
            </div>
          </div>
        </template>
      </template>
    </s-table>
  </div>
</template>

<style scoped></style>
