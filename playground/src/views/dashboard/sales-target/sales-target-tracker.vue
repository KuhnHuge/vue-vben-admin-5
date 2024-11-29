<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import VChart from 'vue-echarts';

import { preferences } from '@vben/preferences';

import { BarChart, GaugeChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

import { OrderApi } from '#/api/gt-api';

use([
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
  PieChart,
  TitleComponent,
]);

use([GaugeChart, CanvasRenderer]);
const api = new OrderApi();
const minYear = 2024;
const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - minYear + 1 },
  (_, i) => minYear + i,
);
const selectedYear = ref(currentYear);
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
const secondQuarterOptions = ref({
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
          name: '2nd Quarter',
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
const thirdQuarterOptions = ref({
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
          name: '3rd Quarter',
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
const fourthQuarterOptions = ref({
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
          name: '4th Quarter',
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

const categoryBarOptions = ref({
  grid: {
    bottom: '3%',
    containLabel: true,
    left: '3%',
    right: '4%',
  },
  series: [
    {
      barWidth: '60%',
      data: [0, 0, 0, 0, 0],
      name: 'Percentage',
      type: 'bar',
    },
  ],
  tooltip: {
    axisPointer: {
      type: 'shadow',
    },
    trigger: 'axis',
  },
  xAxis: [
    {
      axisLabel: {
        showMaxLabel: true,
        showMinLabel: true,
      },
      axisTick: {
        alignWithLabel: true,
      },
      data: ['...', '...', '...', '...'],
      type: 'category',
    },
  ],
  yAxis: [
    {
      alignTicks: true,
      axisLabel: {
        formatter: '{value} %',
      },
      axisLine: {
        lineStyle: {
          color: '#5470C6',
        },
        show: true,
      },
      position: 'left',
      type: 'value',
    },
  ],
});

const brandBarOptions = ref({
  series: [
    {
      data: [
        { name: 'Brand1', value: 10 },
        { name: 'Brand2', value: 10 },
        { name: 'Brand3', value: 10 },
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
    text: '',
  },
  tooltip: {
    trigger: 'item',
  },
});
onMounted(async () => {
  await loadData();
});
async function loadData() {
  const cp_model = await api.exportProductClassInfo(selectedYear.value);
  if (
    cp_model &&
    categoryBarOptions.value.series[0] &&
    categoryBarOptions.value.xAxis[0]
  ) {
    categoryBarOptions.value.series[0].data = cp_model
      .slice(0, 4)
      .map((item) => item.percent);
    categoryBarOptions.value.xAxis[0].data = cp_model
      .slice(0, 4)
      .map((item) => item.class_name);
  }
  const mp_model = await api.exportProductMakeInfo(selectedYear.value);
  if (mp_model && brandBarOptions.value.series[0]) {
    brandBarOptions.value.series[0].data = mp_model.map((item) => {
      return { name: item.make_code, value: item.percent };
    });
  }
  const sc_model = await api.salesCompletionRate(selectedYear.value);
  if (
    sc_model &&
    firstQuarterOptions.value.series[0]?.data[0] &&
    secondQuarterOptions.value.series[0]?.data[0] &&
    thirdQuarterOptions.value.series[0]?.data[0] &&
    fourthQuarterOptions.value.series[0]?.data[0]
  ) {
    firstQuarterOptions.value.series[0].data[0].value = Number(
      (Number(sc_model.first_season_sales_completion_rate) * 100).toFixed(2),
    );
    secondQuarterOptions.value.series[0].data[0].value = Number(
      (Number(sc_model.second_season_sales_completion_rate) * 100).toFixed(2),
    );
    thirdQuarterOptions.value.series[0].data[0].value = Number(
      (Number(sc_model.third_season_sales_completion_rate) * 100).toFixed(2),
    );
    fourthQuarterOptions.value.series[0].data[0].value = Number(
      (Number(sc_model.fourth_season_sales_completion_rate) * 100).toFixed(2),
    );
  }
}
</script>

<template>
  <div class="m-2.5">
    <div class="mb-1.5">
      <label>Year: </label>
      <a-select
        v-model:value="selectedYear"
        :options="data"
        style="width: 120px"
      />
      <a-button class="ml-1.5" type="primary">Apply</a-button>
    </div>
    <a-card class="mb-1.5" title="Target">
      <div
        class="m-auto flex flex-row flex-wrap justify-between"
        style="max-width: 1800px"
      >
        <div
          class="m-2 min-h-72 md:basis-[47.5%] 2xl:m-0 2xl:max-w-sm 2xl:basis-1/4"
        >
          <VChart
            :option="firstQuarterOptions"
            :theme="currentTheme"
            autoresize
          />
        </div>
        <div
          class="m-2 min-h-72 md:basis-[47.5%] 2xl:m-0 2xl:max-w-sm 2xl:basis-1/4"
        >
          <VChart
            :option="secondQuarterOptions"
            :theme="currentTheme"
            autoresize
          />
        </div>
        <div
          class="m-2 min-h-72 md:basis-[47.5%] 2xl:m-0 2xl:max-w-sm 2xl:basis-1/4"
        >
          <VChart
            :option="thirdQuarterOptions"
            :theme="currentTheme"
            autoresize
          />
        </div>
        <div
          class="m-2 min-h-72 md:basis-[47.5%] 2xl:m-0 2xl:max-w-sm 2xl:basis-1/4"
        >
          <VChart
            :option="fourthQuarterOptions"
            :theme="currentTheme"
            autoresize
          />
        </div>
      </div>
    </a-card>
    <div class="flex flex-row justify-between">
      <a-card class="md:basis-[49.7%]" title="Category Percentage">
        <VChart
          :option="categoryBarOptions"
          :theme="currentTheme"
          autoresize
          class="h-96"
        />
      </a-card>
      <a-card class="md:basis-[49.7%]" title="Brands Percentage">
        <VChart
          :option="brandBarOptions"
          :theme="currentTheme"
          autoresize
          class="h-96"
        />
      </a-card>
    </div>
  </div>
</template>

<style scoped></style>
