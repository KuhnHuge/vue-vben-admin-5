<script setup lang="ts">
import type { STablePaginationConfig } from '@surely-vue/table';
import type { ColumnType } from '@surely-vue/table/dist/src/components/interface';

import type { GtGetOrderPageInput, GtOrderInfo } from '#/api/gt-api/models';

import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  type Ref,
  ref,
  watch,
} from 'vue';
import VChart from 'vue-echarts';
import { useRoute } from 'vue-router';

import { $t } from '@vben/locales';
import { preferences } from '@vben/preferences';
import { useUserPageStore } from '@vben/stores';

import dayjs from 'dayjs';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

import { OrderApi } from '#/api/gt-api';
import { formatWithCommas } from '#/components/common-extensions';
import { FilterValueType } from '#/components/TbColumnType';
import { getUpdateTableHeight } from '#/components/update-table-height';

use([TitleComponent, TooltipComponent, PieChart, CanvasRenderer]);

// import { Input, InputNumber, DatePicker, RangePicker } from 'ant-design-vue';

const currentTheme = ref(preferences.theme.mode);
watch(
  () => preferences.theme.mode,
  () => {
    currentTheme.value = preferences.theme.mode;
  },
);
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
  days: 0,
  delivery_type: '...',
  orders_no: '...',
  phone: '...',
  shipment_status: undefined,
  total_quantity: 0,
  transport_type: '...',
});
const d_s_enums = {
  1: { en: 'Truck Transport', zh: '汽运' },
  2: { en: 'Express Delivery', zh: '快递' },
  3: { en: 'Rail Transport', zh: '铁运' },
  4: { en: 'Sea Transport', zh: '海运' },
  5: { en: 'Air Transport', zh: '空运' },
  6: { en: 'Consolidated Cargo', zh: '拼箱' },
  7: { en: '20-Foot Standard Container', zh: '20英尺标准货柜' },
  8: { en: '20-Foot High Cube Container', zh: '20英尺高柜' },
  9: { en: '40-Foot Standard Container', zh: '40英尺标准货柜' },
  10: { en: '40-Foot High Cube Container', zh: '40英尺高柜' },
  152: { en: '45-Foot High Cube Container', zh: '45英尺高柜' },
  1895: {
    en: 'Shipment - Full Container Load (20 Standard)',
    zh: '出货-整柜(20普)',
  },
  1896: {
    en: 'Shipment - Full Container Load (40 High Cube)',
    zh: '出货-整柜(40高)',
  },
  1897: {
    en: 'Shipment - Full Container Load (40 Standard)',
    zh: '出货-整柜(40普)',
  },
  1898: {
    en: 'Shipment - Full Container Load (45 High Cube)',
    zh: '出货-整柜(45高)',
  },
  1899: { en: 'Shipment - IYKE Consolidated Cargo', zh: '出货-IYKE散柜' },
  1900: { en: 'Shipment - JERRUK Consolidated Cargo', zh: '出货-JERRUK散柜' },
  1901: { en: 'Shipment - Delivery', zh: '出货-送货' },
  1902: { en: 'Shipment - To Company', zh: '出货-送公司' },
  1903: { en: 'Shipment - Air Transport', zh: '出货-空运' },
  1904: { en: 'Shipment - Self Pick-Up', zh: '出货-自提' },
  1905: {
    en: 'Arrival - Pickup by Marketing Department',
    zh: '到货-市场部提货',
  },
  1906: {
    en: 'Arrival - Courier Delivery to Warehouse',
    zh: '到货-快递送仓库',
  },
  1907: {
    en: 'Arrival - Delivery to Marketing Department',
    zh: '到货-送市场部',
  },
  1908: { en: 'Shipment - CHIRAS Consolidated Cargo', zh: '出货-CHIRAS散柜' },
  1909: { en: 'E-Commerce Order', zh: '电商定单' },
};
const delivery_type_desc = computed(() => {
  const l_index = preferences.app.locale === 'zh-CN' ? 'zh' : 'en';
  const obj =
    d_s_enums[Number(orderInfo.value.delivery_type) as keyof typeof d_s_enums];
  if (obj) {
    return obj[l_index];
  }
  return '';
});
const transport_type_desc = computed(() => {
  const l_index = preferences.app.locale === 'zh-CN' ? 'zh' : 'en';
  const obj =
    d_s_enums[Number(orderInfo.value.transport_type) as keyof typeof d_s_enums];
  if (obj) {
    return obj[l_index];
  }
  return '';
});
const currency_name = computed(() => {
  const is_zh = preferences.app.locale === 'zh-CN';
  const item = orderInfo.value.currency.filter(
    (c) => c.currency_id === orderInfo.value.currency_id,
  );
  if (item.length === 0) {
    return '';
  }
  return is_zh ? item[0]?.currency_name : item[0]?.english_name;
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
const shipmentStatusOptions = ref({
  series: [
    {
      data: [
        { name: 'Pending', value: 1 },
        { name: 'Finished', value: 0 },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowOffsetX: 0,
        },
      },
      // name: 'Access From',
      radius: '80%',
      type: 'pie',
    },
  ],
  title: {
    left: 'left',
    // subtext: 'Fake Data',
    // text: 'Shipment Status',
  },
  tooltip: {
    trigger: 'item',
  },
});

onMounted(async () => {
  const orderInfoResponse = await api.getOrderInfo({
    orderId: Number(orderId),
  });
  if (orderInfoResponse && shipmentStatusOptions.value.series[0]) {
    orderInfo.value = orderInfoResponse;
    shipmentStatusOptions.value.series[0].data = [
      {
        name: 'Pending',
        value: orderInfoResponse.shipment_status?.pending ?? 0,
      },
      {
        name: 'Finished',
        value: orderInfoResponse.shipment_status?.finished ?? 0,
      },
    ];
  }
  columns.value = GetColumn();
  await LoadData();
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
async function LoadData(
  page: number | undefined = undefined,
  pageSize: number | undefined = undefined,
) {
  try {
    loading.value = true;
    const input: GtGetOrderPageInput = {
      getAvailable: true,
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
      dataIndex: 'my_no',
      fixed: true,
      title: 'CPID/NID',
      width: 110,
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
      dataIndex: 'available_stock_quantity',
      title: 'Available Stock Quantity',
      width: 130,
    },
    {
      dataIndex: 'qfqty',
      title: 'Non-Arrival Quantity',
      width: 120,
    },
    {
      dataIndex: 'price',
      title: $t('page.orders.ordersDetail.table.price'),
      width: 150,
    },
    // {
    //   dataIndex: 'price',
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
    {
      dataIndex: 'plan_delivery_date',
      title: 'Plan Delivery Date',
      width: 120,
    },
    {
      dataIndex: 'updated_delivery_date',
      title: 'Real Delivery Date',
      width: 120,
    },
  ];
}

function formatDate(value) {
  if (!value) {
    return '';
  }
  if (value === 0) {
    return '';
  }
  return new Date(value * 1000).toLocaleDateString();
}
</script>

<template>
  <div>
    <div class="details-info flex flex-row">
      <div class="details-info-left lg:basis-2/3 xl:basis-3/4">
        <a-descriptions size="middle">
          <a-descriptions-item label="Order ID">
            {{ orderInfo.orders_no }}
          </a-descriptions-item>
        </a-descriptions>
        <a-descriptions bordered size="middle" title="Order Information">
          <a-descriptions-item label="Company Name" span="2">
            ******
          </a-descriptions-item>
          <a-descriptions-item label="Delivery Method" span="2">
            {{ delivery_type_desc }}
          </a-descriptions-item>
          <a-descriptions-item label="Currency" span="2">
            {{ currency_name }}
          </a-descriptions-item>
          <a-descriptions-item label="Shipping Method" span="2">
            {{ transport_type_desc }}
          </a-descriptions-item>
          <a-descriptions-item label="Consignee" span="2">
            ******
          </a-descriptions-item>
          <a-descriptions-item label="Phone No." span="2">
            ***********
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <div class="details-info-right lg:basis-1/3 xl:basis-1/4">
        <VChart
          :option="shipmentStatusOptions"
          :theme="currentTheme"
          autoresize
        />
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
        <template v-else-if="column.dataIndex === 'priceDollar'">
          {{ `$${formatWithCommas(record.priceDollar)}` }}
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
        <template
          v-else-if="
            column.dataIndex === 'plan_delivery_date' ||
            column.dataIndex === 'updated_delivery_date'
          "
        >
          {{
            record[column.dataIndex]
              ? formatDate(new Date(record[column.dataIndex]))
              : ''
          }}
        </template>
        <template v-else-if="column.dataIndex === 'qfqty'">
          {{ Number(record.qfqty ?? '0') < 0 ? '0' : (record.qfqty ?? '0') }}
        </template>
      </template>
    </s-table>
  </div>
</template>

<style scoped>
.details-info-right .echarts {
  overflow: hidden;
  border: 2px solid #c3c3c3;
  border-radius: 6px;
}

.details-info-right {
  padding: 10px;
}

.details-info-left {
  padding: 10px;
}
</style>
