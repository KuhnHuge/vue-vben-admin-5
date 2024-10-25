<script setup lang="ts">
import type { ColumnType } from '@surely-vue/table/dist/src/components/interface';

import { computed } from 'vue';

import {
  MidEqual,
  MidGreaterThan,
  MidGreaterThanOrEqual,
  MidLessThan,
  MidLessThanOrEqual,
  MidNotEqual,
  MidUnfoldLessVertical,
  SvgContainsIcon,
} from '@vben/icons';

// import dayjs, { Dayjs } from 'dayjs';

import {
  // type FilterItem,
  // FilterValueType,
  getFilterOperations,
} from '#/components/TbColumnType';

const props = defineProps<{
  column: ColumnType;
  modelValue: any;
}>();

// const emit = defineEmits<{
//   (e: 'updateConditions', isCanApply: boolean, value?: FilterItem[]): void;
//   (e: 'updateModelValue', value: (typeof props)['modelValue']): void;
// }>();

const filterValue = computed({
  get: () => props.modelValue,
  set: (_value) => {
    // console.log(5);
    // emit('updateModelValue', value);
    // checkConditions();
  },
});

// let filterItems: FilterItem[] = [];
// let currentMd5 = getMd5();
// let nextMd5 = '';
//
// function getMd5() {
//   try {
//     filterItems = [];
//     Object.keys(props.modelValue).forEach((key) => {
//       const v = props.modelValue[
//         key as keyof typeof props.modelValue
//       ] as FilterValueType;
//       if (!v.filterEnable) return;
//       filterItems.push({
//         column: key,
//         operation: v.selectOperation,
//         values:
//           Array.isArray(v.values) &&
//           v.values.length > 0 &&
//           v.values[0] instanceof dayjs
//             ? v.values.map((v) => (v as Dayjs).format('YYYY-MM-DD HH:mm:ss'))
//             : (v.values as any[]),
//       });
//     });
//     const s = JSON.stringify(filterItems);
//     console.log(s);
//     // return CryptoJS.MD5(s).toString();
//     return s;
//   } catch (error) {
//     console.log(error);
//     return '';
//   }
// }
// watch(
//   () => props.modelValue,
//   () => {
//     checkConditions();
//   },
//   { deep: true },
// );
// function checkConditions() {
//   const md5 = getMd5();
//   if (currentMd5 === md5) {
//     emit('updateConditions', false);
//   } else {
//     nextMd5 = md5;
//     emit('updateConditions', true, filterItems);
//   }
// }
</script>

<template>
  <div style=" max-width: 246px;padding: 8px">
    <div class="custom-filter-select-area">
      <a-switch
        v-model:checked="
          filterValue[column.dataIndex as keyof typeof filterValue].filterEnable
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
          <span v-if="item === 'eq'" class="filter-operation-select-option">
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
          filterValue[column.dataIndex as keyof typeof filterValue].component
        "
        v-if="
          (filterValue[column.dataIndex as keyof typeof filterValue]
            .componentCode &
            1) >
          0
        "
        v-model:value="
          filterValue[column.dataIndex as keyof typeof filterValue].values[0]
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
          filterValue[column.dataIndex as keyof typeof filterValue].bindObject
        "
      />
      <div
        v-if="
          (filterValue[column.dataIndex as keyof typeof filterValue]
            .componentCode &
            2) >
          0
        "
        style="padding: 3px"
      >
        -
      </div>
      <component
        :is="
          filterValue[column.dataIndex as keyof typeof filterValue].component
        "
        v-if="
          (filterValue[column.dataIndex as keyof typeof filterValue]
            .componentCode &
            2) >
          0
        "
        v-model:value="
          filterValue[column.dataIndex as keyof typeof filterValue].values[1]
        "
        :disabled="
          !filterValue[column.dataIndex as keyof typeof filterValue]
            .filterEnable
        "
        v-bind="
          filterValue[column.dataIndex as keyof typeof filterValue].bindObject
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
          filterValue[column.dataIndex as keyof typeof filterValue].bindObject
        "
        style="width: 230px"
      />
    </div>
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
