import type { Ref } from 'vue';

import { useDebounceFn } from '@vueuse/core';

function getUpdateTableHeight(id: string, tableMaxHeight: Ref<number>) {
  return useDebounceFn(() => calculateMaxHeight(id, tableMaxHeight), 300);
}

function calculateMaxHeight(id: string, tableMaxHeight: Ref<number>) {
  const screenHeight = window.innerHeight;
  const table = document.querySelector(`#${id}`);
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
      Number(style.marginBottom.replace('px', '')) -
      10;
  } else {
    tableMaxHeight.value = screenHeight - topOffset;
  }
}

export { getUpdateTableHeight }; // 使用命名导出
