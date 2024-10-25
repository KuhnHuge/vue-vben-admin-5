<script setup lang="ts">
import type { STablePaginationConfig } from '@surely-vue/table';
import type { ColumnType } from '@surely-vue/table/dist/src/components/interface';
import type { RouteRecordRaw } from 'vue-router';

import type { GtOrderDataModel } from '#/api/gt-api/models/gt-order-data-model';

import {
  onBeforeUnmount,
  onMounted,
  reactive,
  type Ref,
  ref,
  watch,
} from 'vue';
import { useRouter } from 'vue-router';

import { MidFilter } from '@vben/icons';

import dayjs from 'dayjs';

import { OrderApi } from '#/api/gt-api';
import { FilterChangeHandler } from '#/components/handle-filter-change';
import TbCustomFilter from '#/components/tb-custom-filter.vue';
import { FilterValueType } from '#/components/TbColumnType';
import { getUpdateTableHeight } from '#/components/update-table-height';
import { $t } from '#/locales';

const applyChangeEnabled = ref(false);
const router = useRouter();
const api = new OrderApi();
const columns: Ref<ColumnType[]> = ref([]);
let dateFormatType = 0;
const tableMaxHeight = ref(400);
const loading = ref(false);
const dataSource = ref<any[]>([]);
const pagination = ref<STablePaginationConfig>({
  onChange: async (page, pageSize) => {
    await loadData(page, pageSize);
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
const updateTableHeight = getUpdateTableHeight('table', tableMaxHeight);
const filterValue = reactive({
  createDate: new FilterValueType('date', 'eq', true, [
    dayjs('2024-01-01'),
    dayjs('2024-12-31'),
  ]),
});
filterValue.createDate.bindObject = {
  picker: 'year',
};
filterValue.createDate.filterOperations = ['eq', 'between'];
const filterChangeHandler = new FilterChangeHandler(filterValue);
watch(
  () => filterValue,
  () => {
    filterChangeHandler.setNextFilterValue(filterValue);
    applyChangeEnabled.value = filterChangeHandler.isFilterChanged();
  },
  { deep: true },
);

onMounted(async () => {
  await loadData();
  columns.value = getColumns();
  await updateTableHeight();
  window.addEventListener('resize', updateTableHeight);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTableHeight);
});

async function changeDateFormatType() {
  dateFormatType = (dateFormatType + 1) % 3;
  await loadData();
}

function formatDate(date: Date) {
  switch (dateFormatType) {
    case 0: {
      return date.toLocaleDateString();
    }
    case 1: {
      return date.toLocaleString();
    }
    case 2: {
      return date.toDateString();
    }
    default: {
      return date.toLocaleString();
    }
  }
}

async function loadData(
  page: number | undefined = undefined,
  pageSize: number | undefined = undefined,
) {
  try {
    loading.value = true;
    const model = await api.orderList({
      commonFilters: filterChangeHandler.getFilterItems(),
      pageIndex: page ?? pagination.value.current ?? 1,
      pageSize: pageSize ?? pagination.value.pageSize ?? 10,
    });
    if (!model) return;
    dataSource.value = model.data as any[];
    pagination.value.current = model.pageIndex;
    pagination.value.pageSize = model.pageSize;
    pagination.value.total = model.total;
  } finally {
    loading.value = false;
  }
}

function toDetails(model: GtOrderDataModel) {
  const name = `order-details-${model.no}`;
  if (router.hasRoute(name)) {
    router.push({ name, query: { id: model.id } });
  } else {
    const newRouter: RouteRecordRaw = {
      component: () => import('#/views/orders/order-details.vue'),
      meta: {
        keepAlive: true,
        title: `${$t('page.orders.ordersDetail.title')} ${model.no}`,
      },
      name,
      path: `/orders/${name}`,
    };

    router.addRoute('ordersManagement', newRouter);
    router.push({ path: newRouter.path, query: { id: model.id } });
  }
}

function getColumns(): ColumnType[] {
  return [
    {
      dataIndex: 'no',
      title: $t('page.orders.ordersList.table.no'),
    },
    {
      customFilterDropdown: true,
      dataIndex: 'createDate',
      title: $t('page.orders.ordersList.table.createDate'),
    },
    {
      dataIndex: 'totalDollar',
      title: $t('page.orders.ordersList.table.totalDollar'),
    },
    {
      fixed: 'right',
      key: 'operation',
      title: $t('common.operation'),
      width: 200,
    },
  ];
}

async function apply() {
  filterChangeHandler.apply();
  applyChangeEnabled.value = false;
  await loadData(1);
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
        >
          <div>
            <a-button
              :disabled="!applyChangeEnabled"
              type="primary"
              @click="apply"
            >
              Apply Conditions
            </a-button>
          </div>
          <div class="table-header-tool">
            <a-button @click="changeDateFormatType"> Date Style </a-button>
            <a-button type="primary" @click="loadData">
              {{ $t('common.refresh') }}
            </a-button>
          </div>
        </div>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <div class="operation-column">
            <a-button @click="toDetails(record)">
              {{ $t('common.details') }}
            </a-button>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'createDate'">
          {{ record.createDate ? formatDate(new Date(record.createDate)) : '' }}
        </template>
        <template v-else-if="column.dataIndex === 'totalDollar'">
          {{ `$${record.totalDollar}` }}
        </template>
      </template>
      <template #customFilterDropdown="{ column }">
        <TbCustomFilter :column="column" :model-value="filterValue" />
      </template>
      <template #customFilterIcon="{ column }">
        <MidFilter
          :style="{
            color:
              (filterValue[column.dataIndex as keyof typeof filterValue]
                ?.filterEnable ?? false)
                ? '#2561ba'
                : undefined,
          }"
        />
      </template>
    </s-table>
  </div>
</template>
<style scoped lang="less">
.table-header-tool button {
  margin-left: 8px;
}
</style>
