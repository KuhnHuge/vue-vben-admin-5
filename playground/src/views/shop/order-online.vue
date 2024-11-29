<script setup lang="ts">
import { ref } from 'vue';

import { MdiSearch } from '@vben/icons';

import purchasedList from './components/purchased-list.vue';
import quoteList from './components/quoted-list.vue';

const searchValue = ref('');
</script>

<template>
  <div class="flex flex-col items-center">
    <a-input-group class="m-6 !flex max-w-[900px]" compact>
      <a-input
        v-model:value="searchValue"
        placeholder="OE No / Vehicle / Parts"
        size="large"
      />
      <a-button
        class="!flex min-w-28 items-center justify-around !rounded-l-[0px]"
        size="large"
        type="primary"
      >
        <template #icon>
          <MdiSearch width="21" />
        </template>
        Search
      </a-button>
    </a-input-group>
    <h1 style="font-size: 3em; text-align: center">Your Quoted Products</h1>
    <quote-list />
    <h1 style="font-size: 3em; text-align: center">Your Purchased Products</h1>
    <purchased-list />
  </div>
</template>

<style scoped></style>
