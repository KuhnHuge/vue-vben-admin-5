<script setup lang="ts">
import { ref, watch } from 'vue';
import VChart from 'vue-echarts';

import { preferences } from '@vben/preferences';

import { GaugeChart } from 'echarts/charts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

use([GaugeChart, CanvasRenderer]);

const minYear = 2010;
const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - minYear + 1 },
  (_, i) => minYear + i,
);
/*  map{
    value: 2024,
    label: 2024,
  },*/
const data = years.reverse().map((year) => ({
  label: year,
  value: year,
}));
const currentTheme = ref(preferences.theme.mode);
watch(
  () => preferences.theme.mode,
  () => {
    currentTheme.value = preferences.theme.mode;
  },
);

const firstQuarterOptions = ref({
  series: [
    {
      anchor: {
        show: false,
      },
      axisLabel: {
        color: '#999',
        distance: -27,
        fontSize: 13,
      },
      axisLine: {
        lineStyle: {
          width: 15,
        },
      },
      axisTick: {
        distance: -28,
        lineStyle: {
          color: '#999',
          width: 2,
        },
        splitNumber: 5,
      },
      center: ['50%', '60%'],
      data: [
        {
          name: '1st Quarter',
          value: 20,
        },
      ],
      detail: {
        borderRadius: 8,
        color: 'inherit',
        fontSize: 40,
        fontWeight: 'bolder',
        formatter: '{value} %',
        lineHeight: 40,
        offsetCenter: [0, '0%'],
        valueAnimation: true,
        width: '60%',
      },
      endAngle: -20,
      itemStyle: {
        color: '#FFAB91',
      },
      max: 120,
      min: 0,
      pointer: {
        show: false,
      },
      progress: {
        show: true,
        width: 15,
      },
      splitLine: {
        distance: -35,
        length: 14,
        lineStyle: {
          color: '#999',
          width: 3,
        },
      },
      splitNumber: 12,
      startAngle: 200,
      title: {
        fontSize: 15,
        offsetCenter: [0, '-50'],
      },
      type: 'gauge',
    },
  ],
});
</script>

<template>
  <div>
    <div>
      <label>Year: </label>
      <a-select
        v-model:value="currentYear"
        :options="data"
        style="width: 120px"
      />
      <a-button type="primary">Apply</a-button>
    </div>
    <div
      class="m-auto flex flex-row flex-wrap justify-between"
      style="max-width: 1800px"
    >
      <div
        class="m-2 min-h-72 md:basis-[48%] 2xl:m-0 2xl:max-w-sm 2xl:basis-1/4"
      >
        <VChart
          :option="firstQuarterOptions"
          :theme="currentTheme"
          autoresize
        />
      </div>
      <div
        class="m-2 min-h-72 md:basis-[48%] 2xl:m-0 2xl:max-w-sm 2xl:basis-1/4"
      >
        <VChart
          :option="firstQuarterOptions"
          :theme="currentTheme"
          autoresize
        />
      </div>
      <div
        class="m-2 min-h-72 md:basis-[48%] 2xl:m-0 2xl:max-w-sm 2xl:basis-1/4"
      >
        <VChart
          :option="firstQuarterOptions"
          :theme="currentTheme"
          autoresize
        />
      </div>
      <div
        class="m-2 min-h-72 md:basis-[48%] 2xl:m-0 2xl:max-w-sm 2xl:basis-1/4"
      >
        <VChart
          :option="firstQuarterOptions"
          :theme="currentTheme"
          autoresize
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
