<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { MdiCart, MdiSearch } from '@vben/icons';
import { preferences } from '@vben/preferences';
import { useOrderOnlineStore } from '@vben/stores';

import purchasedList from './components/purchased-list.vue';
import quoteList from './components/quoted-list.vue';

const router = useRouter();
const searchValue = ref('');
const orderOnlineStore = useOrderOnlineStore();

function search() {
  const input = searchValue.value?.trim();
  if (input) {
    orderOnlineStore.setSearchKeyword(input);
    router.push({ name: 'productSearch' });
  }
}
</script>

<template>
  <div class="flex flex-col items-center">
    <a-input-group class="m-6 !flex max-w-[900px]" compact>
      <a-input
        v-model:value="searchValue"
        placeholder="OE No / Vehicle / Parts"
        size="large"
        @press-enter="search()"
      />
      <a-button
        class="!flex min-w-28 items-center justify-around !rounded-l-[0px]"
        size="large"
        type="primary"
        @click="search"
      >
        <template #icon>
          <MdiSearch width="21" />
        </template>
        Search
      </a-button>
    </a-input-group>
    <h1 style="font-size: 3em; text-align: center">
      Your Quoted Products Not Ordered
    </h1>
    <quote-list class="mb-[50px]" />
    <h1 style="font-size: 3em; text-align: center">Your Purchased Products</h1>
    <purchased-list class="mb-[50px]" />
    <div
      :style="`
        width: 60px;
        height: 60px;
        position: fixed;
        border-radius: 50%;
        background: ${preferences.theme.colorPrimary};
        bottom: 274px;
        right: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        `"
      @click="router.push('/cart')"
    >
      <MdiCart color="#FFF" width="32" />
    </div>
  </div>
</template>

<style scoped></style>
