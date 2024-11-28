<script setup lang="ts">
import type { STablePaginationConfig } from '@surely-vue/table';
import type {
  ColumnType,
  SorterResult,
} from '@surely-vue/table/dist/src/components/interface';
import type { TableAction } from '@surely-vue/table/dist/src/components/Table';
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

import { MdiFilter /* , MdiSettings*/ } from '@vben/icons';
import { useUserPageStore } from '@vben/stores';

import dayjs from 'dayjs';

import { OrderApi } from '#/api/gt-api';
import { FilterChangeHandler } from '#/components/handle-filter-change';
import TbCustomFilter from '#/components/tb-custom-filter.vue';
import { FilterValueType, type TbColumnType } from '#/components/TbColumnType';
import { getUpdateTableHeight } from '#/components/update-table-height';
import { $t } from '#/locales';

const orderBy = ref('create_date desc');
const userPageStore = useUserPageStore();
const applyChangeEnabled = ref(false);
const router = useRouter();
const api = new OrderApi();
const columns: Ref<TbColumnType[]> = ref([]);
let dateFormatType = 0;
const tableMaxHeight = ref(400);
const loading = ref(false);
const dataSource = ref<any[]>([]);
const updateTableHeight = getUpdateTableHeight('table', tableMaxHeight);
const pagination = ref<STablePaginationConfig>({
  pageSize: userPageStore.ordersConfig.pageSize,
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

onMounted(async () => {
  await loadData();
  pagination.value.onChange = async (page, pageSize) => {
    await loadData(page, pageSize);
    await updateTableHeight();
    userPageStore.setOrdersConfig((c) => (c.pageSize = pageSize ?? 10));
  };
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
async function tableChange(
  _pagination: any,
  _filters: any,
  sorter: SorterResult<ColumnType>,
  { action }: { action: TableAction },
) {
  if (action !== 'sort') return;
  const column = columns.value.find((c) => c.dataIndex === sorter.field);
  if (column && sorter.order) {
    const orderField = column?.alias ?? sorter.field?.toString();
    orderBy.value = orderField
      ? `${orderField} ${sorter.order === 'ascend' ? 'asc' : 'desc'}`
      : 'create_date desc';
    await loadData();
  } else {
    orderBy.value = 'create_date desc';
    await loadData();
  }
}

function toDetails(model: GtOrderDataModel) {
  const name = `order-details-${model.orders_no}`;
  if (router.hasRoute(name)) {
    router.push({ name, query: { id: model.orders_id } });
  } else {
    const newRouter: RouteRecordRaw = {
      component: () => import('#/views/orders/order-details.vue'),
      meta: {
        icon: 'mdi:format-list-bulleted',
        keepAlive: true,
        title: `${$t('page.orders.ordersDetail.title')} ${model.orders_no}`,
      },
      name,
      path: `/orders/${name}`,
    };

    router.addRoute('ordersManagement', newRouter);
    router.push({ path: newRouter.path, query: { id: model.orders_id } });
  }
}

function getColumns(): ColumnType[] {
  return [
    {
      customFilterDropdown: true,
      dataIndex: 'orders_no',
      key: 'orders_no',
      resizable: true,
      sorter: true,
      title: $t('page.orders.ordersList.table.no'),
    },
    {
      dataIndex: 'status',
      key: 'status',
      resizable: true,
      sorter: true,
      title: 'status',
    },
    {
      customFilterDropdown: true,
      dataIndex: 'create_date',
      key: 'create_date',
      resizable: true,
      sorter: true,
      title: $t('page.orders.ordersList.table.createDate'),
    },
    {
      dataIndex: 'total_amount',
      key: 'total_amount',
      resizable: true,
      sorter: true,
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
      row-key="orders_id"
      stripe
      @change="tableChange"
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
            <a-button type="primary" @click="loadData()">
              {{ $t('common.refresh') }}
            </a-button>
            <!--            <div class="table-header-tool-icon">-->
            <!--              <MdiSettings />-->
            <!--            </div>-->
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
        <template v-else-if="column.dataIndex === 'create_date'">
          {{
            record.create_date
              ? formatDate(new Date(record.create_date * 1000))
              : ''
          }}
        </template>
        <template v-else-if="column.dataIndex === 'total_amount'">
          {{ `$${record.total_amount ?? '0.00'}` }}
        </template>
        <template v-else-if="column.dataIndex === 'status'">
          <span v-if="record.status === 2" style="color: #00a000">
            Confirmed
          </span>
          <span v-else-if="record.status === 9" style="color: #959595">
            Finished
          </span>
          <span v-else style="color: #009fa0">Pending</span>
        </template>
      </template>
      <template #customFilterDropdown="{ column }">
        <TbCustomFilter :column="column" :model-value="filterValue" />
      </template>
      <template #customFilterIcon="{ column }">
        <MdiFilter
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
.table-header-tool {
  display: flex;
  align-items: center;
}
//.table-header-tool svg {
//  width: 20px;
//  height: 20px;
//}
//.table-header-tool .table-header-tool-icon {
//  padding: 3px;
//  background: var(--surely-table-header-filter-active-bg);
//}
//.table-header-tool .table-header-tool-icon :hover {
//  //color: var(--surely-table-header-icon-color-hover);
//  //background: rgba(0, 0, 0, 0.04);
//  background: var(--surely-table-header-filter-active-bg);
//}
</style>
