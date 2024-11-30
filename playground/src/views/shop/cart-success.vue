<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <a-result
    :sub-title="`Submit Time ${new Date().toLocaleString()}`"
    status="success"
    title="Successfully submit from cart!"
  >
    <template #extra>
      <a-button
        key="console"
        type="primary"
        @click="() => router.push('/orderOnline')"
      >
        Go to Order Online
      </a-button>
      <a-button key="buy" type="primary" @click="() => router.push('/cart')">
        Back to Cart
      </a-button>
    </template>
  </a-result>
</template>

<style scoped></style>
