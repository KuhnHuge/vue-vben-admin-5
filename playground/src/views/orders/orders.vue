<script setup lang="ts">
import type { STablePaginationConfig } from '@surely-vue/table';
import type { ColumnType } from '@surely-vue/table/dist/src/components/interface';

import { onBeforeUnmount, onMounted, type Ref, ref, watch } from 'vue';

import { OrderApi } from '#/api/gt-api';
import { $t } from '#/locales';

const screenHeight = ref(0);
const api = new OrderApi();
const columns: Ref<ColumnType[]> = ref([]);
let dateFormatType = 0;
const tableMaxHeight = ref(400);
// const tableRef = ref<HTMLElement | null>(null);
const loading = ref(false);
const dataSource = ref<any[]>([]);
const pagination = ref<STablePaginationConfig>({
  onChange: async (page, pageSize) => {
    await LoadData(page, pageSize);
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

onMounted(async () => {
  screenHeight.value = window.innerHeight;
  await LoadData();
  calculateMaxHeight();
  // if (tableRef.value) {
  //   const topOffset = tableRef.value.getBoundingClientRect().top;
  //   console.log(topOffset);
  //   console.log(tableRef.value);
  // }
  window.addEventListener('resize', updateScreenHeight);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScreenHeight);
});
async function changeDateFormatType() {
  dateFormatType = (dateFormatType + 1) % 3;
  await LoadData();
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
function calculateMaxHeight() {
  const table = document.querySelector('#table');
  const topOffset =
    table
      ?.getElementsByClassName('surely-table-body')[0]
      ?.getBoundingClientRect().top ?? 0;
  const pagination = table?.getElementsByClassName('ant-pagination');
  if (pagination && pagination[0]) {
    const style = getComputedStyle(pagination[0]);
    tableMaxHeight.value =
      screenHeight.value -
      topOffset -
      pagination[0].clientHeight -
      Number(style?.marginTop.replace('px', '')) -
      Number(style.marginBottom.replace('px', ''));
  } else {
    tableMaxHeight.value = screenHeight.value - topOffset;
  }
}
function updateScreenHeight() {
  screenHeight.value = window.innerHeight;
}
watch(
  () => screenHeight.value,
  () => {
    calculateMaxHeight();
  },
);
async function LoadData(
  page: number | undefined = undefined,
  pageSize: number | undefined = undefined,
) {
  try {
    loading.value = true;
    const model = await api.orderList({
      pageIndex: page ?? pagination.value.current ?? 1,
      pageSize: pageSize ?? pagination.value.pageSize ?? 10,
    });
    if (!model) return;
    dataSource.value = model.data as any[];
    pagination.value.current = model.pageIndex;
    pagination.value.pageSize = model.pageSize;
    pagination.value.total = model.total;

    columns.value = [
      {
        dataIndex: 'no',
        title: $t('page.orders.ordersList.table.no'),
      },
      {
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
  } finally {
    loading.value = false;
  }
}

function toDetails() {
  // const name = `order-details-${Date.now().toString()}`;
  // const newRouter: RouteRecordRaw = {
  //   component: () => import('#/views/orders/order-details.vue'),
  //   name: name,
  //   path: '/orders/details',
  // };
  // router.addRoute('ordersManagement', newRouter);
  // router.push({ name: name });
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
    >
      <template #title>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <span></span>
          <div class="table-header-tool">
            <a-button type="primary" @click="changeDateFormatType">
              Date Style
            </a-button>
            <a-button type="primary" @click="LoadData()">
              {{ $t('common.refresh') }}
            </a-button>
          </div>
        </div>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <div class="operation-column">
            <a-button @click="toDetails">{{ $t('common.details') }}</a-button>
          </div>
        </template>
        <template v-if="column.dataIndex === 'createDate'">
          {{ record.createDate ? formatDate(new Date(record.createDate)) : '' }}
        </template>
      </template>
    </s-table>
  </div>
</template>
<style scoped lang="less">
.table-header-tool button {
  margin-left: 8px;
}
</style>
