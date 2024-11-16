<script setup lang="ts">
import type { STablePaginationConfig } from '@surely-vue/table';
import type { ColumnType } from '@surely-vue/table/dist/src/components/interface';

import type { GtGetOrderPageInput } from '#/api/gt-api/models';

import { onBeforeUnmount, onMounted, reactive, type Ref, ref } from 'vue';
import { useRoute } from 'vue-router';

import { $t } from '@vben/locales';
import { useUserPageStore } from '@vben/stores';

import dayjs from 'dayjs';

import { OrderApi } from '#/api/gt-api';
import { FilterValueType } from '#/components/TbColumnType';
import { getUpdateTableHeight } from '#/components/update-table-height';

// import { Input, InputNumber, DatePicker, RangePicker } from 'ant-design-vue';

const userPageStore = useUserPageStore();
const api = new OrderApi();
const route = useRoute();
const orderId = route.query.id;
const tableMaxHeight = ref(400);
const loading = ref(false);
const columns: Ref<ColumnType[]> = ref([]);
const dataSource = ref<any[]>([]);
const updateTableHeight = getUpdateTableHeight('table', tableMaxHeight);
const pagination = ref<STablePaginationConfig>({
  onChange: async (page, pageSize) => {
    await LoadData(page, pageSize);
    await updateTableHeight();
    userPageStore.setOrderDetailsConfig((c) => (c.pageSize = pageSize ?? 10));
  },
  pageSize: userPageStore.orderDetailsConfig.pageSize,
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal: (total) => {
    return $t('templates.pagination.total').replace(
      '[total]',
      total.toString(),
    );
  },
});
const filterValue = reactive({
  qty: new FilterValueType('number', 'between', false, [0, 100]),
  unit: new FilterValueType('date', 'between', true, [
    dayjs('2024-01-01'),
    dayjs('2024-12-31'),
  ]),
});
filterValue.unit.bindObject = {
  picker: 'year',
};

onMounted(async () => {
  await LoadData();
  columns.value = GetColumn();
  await updateTableHeight();
  window.addEventListener('resize', updateTableHeight);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTableHeight);
});
async function LoadData(
  page: number | undefined = undefined,
  pageSize: number | undefined = undefined,
) {
  try {
    loading.value = true;
    const input: GtGetOrderPageInput = {
      orderId: Number(orderId),
      pageIndex: page ?? pagination.value.current ?? 1,
      pageSize: pageSize ?? pagination.value.pageSize ?? 10,
    };
    const model = await api.orderItemList(input);
    if (!model) return;
    dataSource.value = model.data as any[];
    pagination.value.current = model.pageIndex;
    pagination.value.pageSize = model.pageSize;
    pagination.value.total = model.total;
  } finally {
    loading.value = false;
  }
}

function GetColumn(): ColumnType[] {
  return [
    {
      autoHeight: true,
      dataIndex: 'rca_model',
      fixed: true,
      resizable: true,
      title: $t('page.orders.ordersDetail.table.carModel'),
      width: 200,
    },
    {
      dataIndex: 'cpid',
      fixed: true,
      title: 'CPID/NID',
      width: 100,
    },
    {
      dataIndex: 'oe',
      title: $t('page.orders.ordersDetail.table.number'),
      width: 150,
    },
    {
      dataIndex: 'product_name_en',
      title: $t('page.orders.ordersDetail.table.nameEn'),
      width: 180,
    },
    {
      dataIndex: 'size',
      title: 'Size',
      width: 100,
    },
    {
      dataIndex: 'brand_name',
      title: $t('page.orders.ordersDetail.table.brand'),
      width: 100,
    },
    {
      // customFilterDropdown: true,
      dataIndex: 'unit_name',
      title: $t('page.orders.ordersDetail.table.unit'),
      width: 100,
    },
    {
      // customFilterDropdown: true,
      dataIndex: 'quantity',
      title: $t('page.orders.ordersDetail.table.qty'),
      width: 120,
    },
    {
      dataIndex: 'price',
      title: $t('page.orders.ordersDetail.table.price'),
      width: 150,
    },
    {
      dataIndex: 'price',
      title: $t('page.orders.ordersDetail.table.priceDollar'),
      width: 100,
    },
    {
      dataIndex: 'total_price',
      title: $t('page.orders.ordersDetail.table.amount'),
      width: 100,
    },
    {
      dataIndex: 'min_qty',
      title: $t('page.orders.ordersDetail.table.minOrderQty'),
      width: 100,
    },
    {
      dataIndex: 'box_qty',
      title: $t('page.orders.ordersDetail.table.packQty'),
      width: 120,
    },
    {
      dataIndex: 'export_qty',
      title: $t('page.orders.ordersDetail.table.exportQty'),
      width: 100,
    },
    {
      dataIndex: 'weight',
      title: $t('page.orders.ordersDetail.table.proWeight'),
      width: 120,
    },
    {
      dataIndex: 'volume',
      title: $t('page.orders.ordersDetail.table.proVolume'),
      width: 120,
    },
  ];
}
</script>

<template>
  <div>
    <div class="details-info">
      <div class="details-info-left">
        <a-descriptions bordered size="middle" title="Order Information">
          <a-descriptions-item label="Company Name">
            Company Name
          </a-descriptions-item>
          <a-descriptions-item label="Delivery Method">
            Delivery Method
          </a-descriptions-item>
          <a-descriptions-item label="Currency"> Currency </a-descriptions-item>
          <a-descriptions-item label="Shipping Method">
            Shipping Method
          </a-descriptions-item>
          <a-descriptions-item label="Consignee">
            Consignee
          </a-descriptions-item>
          <a-descriptions-item label="Phone No.">
            Phone No.
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
    <s-table
      id="table"
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :scroll="{ y: tableMaxHeight }"
      auto-header-height
      row-key="orders_items_id"
      stripe
    >
      <template #title>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        ></div>
      </template>
      <template #headerCell="{ title, column }">
        <template v-if="column.dataIndex === 'quantity'">
          <span style="color: #3c82ee">{{ title }}</span>
        </template>
        <template
          v-else-if="
            column.dataIndex === 'export_qty' ||
            column.dataIndex === 'weight' ||
            column.dataIndex === 'volume'
          "
        >
          <span style="color: #ee3c66">{{ title }}</span>
        </template>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'price'">
          {{ `￥${record.price}` }}
        </template>
        <template v-else-if="column.dataIndex === 'priceDollar'">
          {{ `$${record.priceDollar}` }}
        </template>
        <template v-else-if="column.dataIndex === 'total_price'">
          {{ `￥${record.total_price}` }}
        </template>
        <template v-else-if="column.dataIndex === 'product_name_en'">
          {{
            record.product_name_en == null || record.product_name_en === ''
              ? record.product_name
              : record.product_name_en
          }}
        </template>
      </template>
    </s-table>
  </div>
</template>

<style scoped></style>
