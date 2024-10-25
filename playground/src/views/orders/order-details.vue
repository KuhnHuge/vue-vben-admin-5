<script setup lang="ts">
import type { STablePaginationConfig } from '@surely-vue/table';
import type { ColumnType } from '@surely-vue/table/dist/src/components/interface';

import type { GtGetOrderPageInput } from '#/api/gt-api/models';

import { onBeforeUnmount, onMounted, reactive, type Ref, ref } from 'vue';
import { useRoute } from 'vue-router';

import {
  MidEqual,
  MidFilter,
  MidGreaterThan,
  MidGreaterThanOrEqual,
  MidLessThan,
  MidLessThanOrEqual,
  MidNotEqual,
  MidUnfoldLessVertical,
  SvgContainsIcon,
} from '@vben/icons';
import { $t } from '@vben/locales';

import { useDebounceFn } from '@vueuse/core';
import dayjs from 'dayjs';

import { OrderApi } from '#/api/gt-api';
import {
  FilterValueType,
  getFilterOperations,
} from '#/components/TbColumnType';

// import { Input, InputNumber, DatePicker, RangePicker } from 'ant-design-vue';

const api = new OrderApi();
const updateScreenHeight = useDebounceFn(calculateMaxHeight, 300);
const route = useRoute();
const orderId = route.query.id;
const tableMaxHeight = ref(400);
const loading = ref(false);
const columns: Ref<ColumnType[]> = ref([]);
const dataSource = ref<any[]>([]);
const pagination = ref<STablePaginationConfig>({
  onChange: async (page, pageSize) => {
    await LoadData(page, pageSize);
    await updateScreenHeight();
  },
  pageSize: 10,
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
  picker: 'month',
};

onMounted(async () => {
  await LoadData();
  columns.value = GetColumn();
  calculateMaxHeight();
  window.addEventListener('resize', updateScreenHeight);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScreenHeight);
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

function calculateMaxHeight() {
  const screenHeight = window.innerHeight;
  const table = document.querySelector('#table');
  const topOffset =
    table
      ?.getElementsByClassName('surely-table-body')[0]
      ?.getBoundingClientRect().top ?? 0;
  const pagination = table?.getElementsByClassName('ant-pagination');
  if (pagination && pagination[0]) {
    const style = getComputedStyle(pagination[0]);
    tableMaxHeight.value =
      screenHeight -
      topOffset -
      pagination[0].clientHeight -
      Number(style?.marginTop.replace('px', '')) -
      Number(style.marginBottom.replace('px', ''));
  } else {
    tableMaxHeight.value = screenHeight - topOffset;
  }
}

function GetColumn(): ColumnType[] {
  return [
    {
      autoHeight: true,
      dataIndex: 'carModel',
      fixed: true,
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
      dataIndex: 'number',
      title: $t('page.orders.ordersDetail.table.number'),
      width: 150,
    },
    {
      dataIndex: 'nameEn',
      title: $t('page.orders.ordersDetail.table.nameEn'),
      width: 180,
    },
    {
      dataIndex: 'size',
      title: 'Size',
      width: 100,
    },
    {
      dataIndex: 'brand',
      title: $t('page.orders.ordersDetail.table.brand'),
      width: 100,
    },
    {
      // customFilterDropdown: true,
      dataIndex: 'unit',
      title: $t('page.orders.ordersDetail.table.unit'),
      width: 100,
    },
    {
      // customFilterDropdown: true,
      dataIndex: 'qty',
      title: $t('page.orders.ordersDetail.table.qty'),
      width: 120,
    },
    {
      dataIndex: 'price',
      title: $t('page.orders.ordersDetail.table.price'),
      width: 150,
    },
    {
      dataIndex: 'priceDollar',
      title: $t('page.orders.ordersDetail.table.priceDollar'),
      width: 100,
    },
    {
      dataIndex: 'amount',
      title: $t('page.orders.ordersDetail.table.amount'),
      width: 100,
    },
    {
      dataIndex: 'minOrderQty',
      title: $t('page.orders.ordersDetail.table.minOrderQty'),
      width: 100,
    },
    {
      dataIndex: 'packQty',
      title: $t('page.orders.ordersDetail.table.packQty'),
      width: 120,
    },
    {
      dataIndex: 'exportQty',
      title: $t('page.orders.ordersDetail.table.exportQty'),
      width: 100,
    },
    {
      dataIndex: 'proWeight',
      title: $t('page.orders.ordersDetail.table.proWeight'),
      width: 120,
    },
    {
      dataIndex: 'proVolume',
      title: $t('page.orders.ordersDetail.table.proVolume'),
      width: 120,
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
      :scroll="{ y: tableMaxHeight }"
      auto-header-height
      row-key="id"
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
        <template v-if="column.dataIndex === 'qty'">
          <span style="color: #3c82ee">{{ title }}</span>
        </template>
        <template
          v-else-if="
            column.dataIndex === 'exportQty' ||
            column.dataIndex === 'proWeight' ||
            column.dataIndex === 'proVolume'
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
        <template v-else-if="column.dataIndex === 'amount'">
          {{ `￥${record.amount}` }}
        </template>
      </template>
      <template #customFilterDropdown="{ column }">
        <div style="padding: 8px">
          <div class="custom-filter-select-area">
            <a-switch
              v-model:checked="
                filterValue[column.dataIndex as keyof typeof filterValue]
                  .filterEnable
              "
              size="small"
            />
            <a-select
              v-model:value="
                filterValue[column.dataIndex as keyof typeof filterValue]
                  .selectOperation
              "
              :disabled="
                !filterValue[column.dataIndex as keyof typeof filterValue]
                  .filterEnable
              "
              style="width: 192px"
            >
              <a-select-option
                v-for="item in getFilterOperations(
                  filterValue[column.dataIndex as keyof typeof filterValue]
                    .filterType,
                  filterValue[column.dataIndex as keyof typeof filterValue]
                    .filterOperations,
                )"
                :key="item"
                :value="item"
              >
                <span
                  v-if="item === 'eq'"
                  class="filter-operation-select-option"
                >
                  <MidEqual />Equal
                </span>
                <span
                  v-else-if="item === 'neq'"
                  class="filter-operation-select-option"
                >
                  <MidNotEqual />Not Equal
                </span>
                <span
                  v-else-if="item === 'gt'"
                  class="filter-operation-select-option"
                >
                  <MidGreaterThan />Greater Than
                </span>
                <span
                  v-else-if="item === 'gte'"
                  class="filter-operation-select-option"
                >
                  <MidGreaterThanOrEqual />Greater Than Or Equal
                </span>
                <span
                  v-else-if="item === 'lt'"
                  class="filter-operation-select-option"
                >
                  <MidLessThan />Less Than
                </span>
                <span
                  v-else-if="item === 'lte'"
                  class="filter-operation-select-option"
                >
                  <MidLessThanOrEqual />Less Than Or Equal
                </span>
                <span
                  v-else-if="item === 'like'"
                  class="filter-operation-select-option"
                >
                  <SvgContainsIcon />Contains
                </span>
                <span
                  v-else-if="item === 'between'"
                  class="filter-operation-select-option"
                >
                  <MidUnfoldLessVertical />Between
                </span>
              </a-select-option>
            </a-select>
          </div>
          <div class="custom-filter-area">
            <component
              :is="
                filterValue[column.dataIndex as keyof typeof filterValue]
                  .component
              "
              v-if="
                (filterValue[column.dataIndex as keyof typeof filterValue]
                  .componentCode &
                  1) >
                0
              "
              v-model:value="
                filterValue[column.dataIndex as keyof typeof filterValue]
                  .values[0]
              "
              :disabled="
                !filterValue[column.dataIndex as keyof typeof filterValue]
                  .filterEnable
              "
              :style="
                (filterValue[column.dataIndex as keyof typeof filterValue]
                  .componentCode &
                  2) >
                0
                  ? 'width: 110px'
                  : 'width: 230px'
              "
              v-bind="
                filterValue[column.dataIndex as keyof typeof filterValue]
                  .bindObject
              "
            />
            <div
              v-if="
                (filterValue[column.dataIndex as keyof typeof filterValue]
                  .componentCode &
                  2) >
                0
              "
            >
              -
            </div>
            <component
              :is="
                filterValue[column.dataIndex as keyof typeof filterValue]
                  .component
              "
              v-if="
                (filterValue[column.dataIndex as keyof typeof filterValue]
                  .componentCode &
                  2) >
                0
              "
              v-model:value="
                filterValue[column.dataIndex as keyof typeof filterValue]
                  .values[1]
              "
              :disabled="
                !filterValue[column.dataIndex as keyof typeof filterValue]
                  .filterEnable
              "
              v-bind="
                filterValue[column.dataIndex as keyof typeof filterValue]
                  .bindObject
              "
              style="width: 110px"
            />
            <component
              :is="
                filterValue[column.dataIndex as keyof typeof filterValue]
                  .specialComponent
              "
              v-if="
                (filterValue[column.dataIndex as keyof typeof filterValue]
                  .componentCode &
                  4) >
                0
              "
              v-model:value="
                filterValue[column.dataIndex as keyof typeof filterValue].values
              "
              :disabled="
                !filterValue[column.dataIndex as keyof typeof filterValue]
                  .filterEnable
              "
              v-bind="
                filterValue[column.dataIndex as keyof typeof filterValue]
                  .bindObject
              "
              style="width: 230px"
            />
          </div>
        </div>
      </template>
      <template #customFilterIcon="{ column }">
        <MidFilter
          :style="{
            color: filterValue[column.dataIndex as keyof typeof filterValue]
              .filterEnable
              ? '#2561ba'
              : undefined,
          }"
        />
      </template>
    </s-table>
  </div>
</template>

<style scoped>
.filter-operation-select-option {
  display: flex;
  align-items: center;
}

.surely-table-filter-dropdown {
  max-width: 246px;
}

.custom-filter-select-area {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.custom-filter-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
