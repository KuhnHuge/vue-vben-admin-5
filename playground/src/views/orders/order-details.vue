<script setup lang="ts">
import type { STablePaginationConfig } from '@surely-vue/table';
import type { ColumnType } from '@surely-vue/table/dist/src/components/interface';

import type { GtGetOrderPageInput, GtOrderInfo } from '#/api/gt-api/models';

import { onBeforeUnmount, onMounted, reactive, type Ref, ref } from 'vue';
import { useRoute } from 'vue-router';

import { $t } from '@vben/locales';
import { useUserPageStore } from '@vben/stores';

import dayjs from 'dayjs';

import { OrderApi } from '#/api/gt-api';
import { formatWithCommas } from '#/components/common-extensions';
import { FilterValueType } from '#/components/TbColumnType';
import { getUpdateTableHeight } from '#/components/update-table-height';

const userPageStore = useUserPageStore();
const api = new OrderApi();
const route = useRoute();
const orderId = route.query.id;
const tableMaxHeight = ref(400);
const loading = ref(false);
const columns: Ref<ColumnType[]> = ref([]);
const dataSource = ref<any[]>([]);
const orderInfo = ref<GtOrderInfo>({
  company_name: '...',
  currency: [],
  currency_id: 0,
  delivery_type: '...',
  orders_no: '...',
  phone: '...',
  shipment_status: undefined,
  total_quantity: 0,
  transport_type: '...',
});
const updateTableHeight = getUpdateTableHeight('table', tableMaxHeight);
const pagination = ref<STablePaginationConfig>({
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
const planLoading = ref(false);
const planColumns: Ref<ColumnType[]> = ref([]);
const planDataSource = ref<any[]>([]);
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
  const orderInfoResponse = await api.getOrderInfo({
    orderId: Number(orderId),
  });
  if (orderInfoResponse) {
    orderInfo.value = orderInfoResponse;
  }
  columns.value = GetColumn();
  await LoadData();
  planColumns.value = GetPlanColumn();
  await LoadPlanData();
  pagination.value.onChange = async (page, pageSize) => {
    await LoadData(page, pageSize);
    await updateTableHeight();
    userPageStore.setOrderDetailsConfig((c) => (c.pageSize = pageSize ?? 10));
  };
  await updateTableHeight();
  window.addEventListener('resize', updateTableHeight);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTableHeight);
});
async function LoadPlanData() {
  try {
    planLoading.value = true;
    const model = await api.orderItemPlanList(Number(orderId));
    if (!model) return;
    planDataSource.value = model;
  } finally {
    planLoading.value = false;
  }
}
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
      dataIndex: 'picture',
      fixed: true,
      title: 'Picture',
      width: 80,
    },
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
      resizable: true,
      title: $t('page.orders.ordersDetail.table.number'),
      width: 150,
    },
    {
      dataIndex: 'product_name_en',
      resizable: true,
      title: $t('page.orders.ordersDetail.table.nameEn'),
      width: 180,
    },
    {
      autoHeight: true,
      dataIndex: 'specification_en',
      resizable: true,
      title: 'Size',
      width: 130,
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
      dataIndex: 'export_qty',
      title: $t('page.orders.ordersDetail.table.exportQty'),
      width: 100,
    },
    {
      dataIndex: 'price',
      title: $t('page.orders.ordersDetail.table.price'),
      width: 150,
    },
    // {
    //   dataIndex: 'price_dollar',
    //   title: $t('page.orders.ordersDetail.table.priceDollar'),
    //   width: 100,
    // },
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
function GetPlanColumn(): ColumnType[] {
  return [
    {
      dataIndex: 'planned_id',
      title: 'Plan No.',
      width: 100,
    },
    {
      dataIndex: 'plan_subtotal_qty',
      title: 'Plan Subtotal Quantity',
      width: 120,
    },
    {
      dataIndex: 'non_arrival',
      title: 'Non-Arrival',
      width: 120,
    },
    {
      dataIndex: 'packed',
      title: 'Packed',
      width: 120,
    },
    {
      dataIndex: 'shipped',
      title: 'Shipped',
      width: 120,
    },
  ];
}
</script>

<template>
  <div>
    <a-descriptions
      :column="2"
      bordered
      class="m-2.5 max-w-[700px]"
      size="middle"
    >
      <a-descriptions-item :span="2" label="Order ID">
        {{ orderInfo.orders_no }}
      </a-descriptions-item>
      <a-descriptions-item label="Days Since Order Placed">
        {{ orderInfo.days }}
      </a-descriptions-item>
      <a-descriptions-item :span="1" label="Order Total Quantity">
        {{ orderInfo.total_quantity }}
      </a-descriptions-item>
    </a-descriptions>
    <s-table
      :columns="planColumns"
      :data-source="planDataSource"
      :loading="planLoading"
      :pagination="false"
      :scroll="{ y: 300 }"
      class="mb-[30px]"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'non_arrival'">
          {{
            `${((record.non_arrival / record.plan_subtotal_qty) * 100).toFixed(2)}%`
          }}
        </template>
        <template v-if="column.dataIndex === 'packed'">
          {{
            `${((record.packed / record.plan_subtotal_qty) * 100).toFixed(2)}%`
          }}
        </template>
        <template v-if="column.dataIndex === 'shipped'">
          {{
            `${((record.shipped / record.plan_subtotal_qty) * 100).toFixed(2)}%`
          }}
        </template>
      </template>
    </s-table>
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
      <template #headerCell="{ title, column }">
        <template
          v-if="
            column.dataIndex === 'export_qty' || column.dataIndex === 'quantity'
          "
        >
          <span style="color: #3c82ee">{{ title }}</span>
        </template>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'picture'">
          <a-image
            :alt="record.product_name_en"
            :src="record.picture"
            height="40px"
            width="40px"
          />
        </template>
        <template v-if="column.dataIndex === 'price'">
          {{ `￥${formatWithCommas(record.price)}` }}
        </template>
        <template v-else-if="column.dataIndex === 'price_dollar'">
          {{ `$${formatWithCommas(record.price_dollar)}` }}
        </template>
        <template v-else-if="column.dataIndex === 'total_price'">
          {{ `￥${formatWithCommas(record.total_price)}` }}
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
