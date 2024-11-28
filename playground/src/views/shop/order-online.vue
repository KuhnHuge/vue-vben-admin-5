<script setup lang="ts">
import purchasedList from './components/purchased-list.vue';
import quoteList from './components/quoted-list.vue';
</script>

<template>
  <div class="flex flex-col">
    <h1 style=" font-size: 3em;text-align: center">Your Quoted Products</h1>
    <quote-list />
    <h1 style=" font-size: 3em;text-align: center">Your Purchased Products</h1>
    <purchased-list />
  </div>
</template>

<style scoped></style>
