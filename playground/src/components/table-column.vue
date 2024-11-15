<script setup lang="ts">
import type { ColumnType } from '@surely-vue/table/dist/src/components/interface';

import cloneDeep from 'lodash/cloneDeep';

const props = defineProps<{
  dataSource: ColumnType[];
}>();

const dataSource = cloneDeep(props.dataSource);
dataSource?.forEach((item) => {
  if (!item.key && item.dataIndex) {
    item.key = item.dataIndex.toString();
  }
});
const columns: ColumnType[] = [
  {
    dataIndex: 'title',
    title: 'title',
    width: 100,
  },
  {
    title: 'action',
    width: 100,
  },
];
</script>

<template>
  <div>
    <s-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
      :scroll="{ y: 300 }"
      row-key="id"
      stripe
    />
  </div>
</template>
<style scoped></style>
