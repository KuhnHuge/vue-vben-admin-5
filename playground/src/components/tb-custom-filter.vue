<script setup lang="ts">
import type { ColumnType } from '@surely-vue/table/dist/src/components/interface';

import { computed } from 'vue';

import {
  MdiEqual,
  MdiGreaterThan,
  MdiGreaterThanOrEqual,
  MdiLessThan,
  MdiLessThanOrEqual,
  MdiNotEqual,
  MdiUnfoldLessVertical,
  SvgContainsIcon,
} from '@vben/icons';

import { getFilterOperations } from '#/components/TbColumnType';

const props = defineProps<{
  column: ColumnType;
  modelValue: any;
}>();

const filterValue = computed({
  get: () => props.modelValue,
  set: (_value) => {
    // console.log(5);
    // emit('updateModelValue', value);
    // checkConditions();
  },
});
</script>

<template>
  <div style="max-width: 246px; padding: 8px">
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
            <MdiEqual />Equal
          </span>
          <span
            v-else-if="item === 'neq'"
            class="filter-operation-select-option"
          >
            <MdiNotEqual />Not Equal
          </span>
          <span
            v-else-if="item === 'gt'"
            class="filter-operation-select-option"
          >
            <MdiGreaterThan />Greater Than
          </span>
          <span
            v-else-if="item === 'gte'"
            class="filter-operation-select-option"
          >
            <MdiGreaterThanOrEqual />Greater Than Or Equal
          </span>
          <span
            v-else-if="item === 'lt'"
            class="filter-operation-select-option"
          >
            <MdiLessThan />Less Than
          </span>
          <span
            v-else-if="item === 'lte'"
            class="filter-operation-select-option"
          >
            <MdiLessThanOrEqual />Less Than Or Equal
          </span>
          <span
            v-else-if="item === 'like'"
            class="filter-operation-select-option"
          >
            <SvgContainsIcon style="width: 24px; height: auto" />&nbsp;Contains
          </span>
          <span
            v-else-if="item === 'between'"
            class="filter-operation-select-option"
          >
            <MdiUnfoldLessVertical />Between
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
