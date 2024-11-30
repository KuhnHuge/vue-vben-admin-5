<script setup lang="ts">
// import type { STablePaginationConfig } from '@surely-vue/table';
// import type {
//   ColumnType,
//   SorterResult,
// } from '@surely-vue/table/dist/src/components/interface';
// import type { TableAction } from '@surely-vue/table/dist/src/components/Table';
// import type { RouteRecordRaw } from 'vue-router';
//
// import type { GtOrderDataModel } from '#/api/gt-api/models/gt-order-data-model';

import {
  onBeforeUnmount,
  onMounted,
  reactive,
  type Ref,
  ref,
  watch,
} from 'vue';

import { MdiInformation } from '@vben/icons';

import dayjs from 'dayjs';

import { OrderApi } from '#/api/gt-api';
import { FilterChangeHandler } from '#/components/handle-filter-change';
// import TbCustomFilter from '#/components/tb-custom-filter.vue';
import { FilterValueType, type TbColumnType } from '#/components/TbColumnType';
import { getUpdateTableHeight } from '#/components/update-table-height';
// import { $t } from '#/locales';

const left_amount = ref('');
const applyChangeEnabled = ref(false);
const api = new OrderApi();
const columns: Ref<TbColumnType[]> = ref([]);
// let dateFormatType = 0;
const tableMaxHeight = ref(400);
const loading = ref(false);
const dataSource = ref<any[]>([]);
const updateTableHeight = getUpdateTableHeight('table', tableMaxHeight);
const filterValue = reactive({
  create_date: new FilterValueType('date', 'between', true, [
    dayjs('2024-01-01'),
    dayjs('2024-12-31'),
  ]),
  orders_no: new FilterValueType('text', 'like', false, ['', '']),
});
filterValue.create_date.bindObject = {
  picker: 'month',
};
filterValue.create_date.filterOperations = ['eq', 'between'];
filterValue.orders_no.bindObject = {
  placeholder: 'Order No',
};
const filterChangeHandler = new FilterChangeHandler(filterValue);
watch(
  () => filterValue,
  () => {
    filterChangeHandler.setNextFilterValue(filterValue);
    applyChangeEnabled.value = filterChangeHandler.isFilterChanged();
  },
  { deep: true },
);

async function loadData() {
  try {
    loading.value = true;
    const model = await api.payDetailList();
    if (!model) return;
    dataSource.value = model.list as any[];
    left_amount.value = model.left_amount.toString();
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  columns.value = getColumns();
  await loadData();
  await updateTableHeight();
  window.addEventListener('resize', updateTableHeight);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTableHeight);
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
      dataIndex: 'create_time',
      key: 'create_time',
      resizable: true,
      title: 'Date',
    },
    {
      dataIndex: 'amount',
      key: 'amount',
      resizable: true,
      title: 'Receiving value in dollar',
    },
    {
      dataIndex: 'exchange_rate',
      key: 'exchange_rate',
      resizable: true,
      title: 'Currency exchange rate',
    },
    {
      dataIndex: 'amount_rmb',
      key: 'amount_rmb',
      resizable: true,
      title: 'Receiving value in RMB',
    },
    {
      dataIndex: 'bill_amount',
      headerToolTip:
        'minus value (-)  means we make compensation; positive amount (+) means you owe us.',
      key: 'bill_amount',
      resizable: true,
      title: 'Shipping value',
    },
    {
      dataIndex: 'left_amount',
      headerToolTip:
        'minus amount (-) means we owe you; positive amount (+) means you owe us',
      key: 'left_amount',
      resizable: true,
      title: 'Balance amount',
    },
  ];
}
</script>

<template>
  <div>
    <div class="m-2.5 flex items-center text-base">
      <div class="font-bold" style="color: #3c82ee">Initial Balance:</div>
      <div>￥{{ left_amount }}</div>
      <a-tooltip placement="rightTop">
        <template #title>
          <span class="font-bold">Negative (-):</span><br />
          <span>
            The initial balance represents the amount we owe to the customer at
            the beginning of the period.
          </span>
          <br />
          <span>
            (This occurs when the customer has made an advance payment or
            overpaid in the previous period.)
          </span>
          <br />
          <span class="font-bold">Positive (+):</span><br />
          <span>
            The initial balance represents the amount the customer owes us at
            the beginning of the period.
          </span>
          <br />
          <span>
            (This occurs when there are outstanding invoices or unpaid balances
            from the previous period.)
          </span>
          <br />
        </template>
        <span><MdiInformation width="18" /></span>
      </a-tooltip>
    </div>
    <s-table
      id="table"
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="false"
      :scroll="{ y: tableMaxHeight }"
      row-key="seq"
      stripe
    >
      <template #headerCell="{ title, column }">
        <template
          v-if="
            column.dataIndex === 'bill_amount' ||
            column.dataIndex === 'left_amount'
          "
        >
          <div
            style="
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              justify-content: flex-start;
            "
          >
            <span style="color: #3c82ee">{{ title }}&nbsp;</span>
            <a-tooltip placement="leftTop">
              <template #title>{{ column.headerToolTip }} </template>

              <span><MdiInformation width="18" /></span>
            </a-tooltip>
          </div>
        </template>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'amount'">
          {{ record.amount ? `$${record.amount}` : '' }}
        </template>
        <template v-if="column.key === 'amount_rmb'">
          {{ record.amount_rmb ? `￥${record.amount_rmb}` : '' }}
        </template>
        <template v-if="column.key === 'bill_amount'">
          {{ record.bill_amount ? `￥${record.bill_amount}` : '' }}
        </template>
        <template v-if="column.key === 'left_amount'">
          {{ record.left_amount ? `￥${record.left_amount}` : '' }}
        </template>
      </template>
    </s-table>
  </div>
</template>

<style scoped></style>
