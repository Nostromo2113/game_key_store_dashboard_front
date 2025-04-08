<template>
  <div class="relative-position page-height">
    <OrderShopShow v-show="!loading" @success="loading = false" />
    <InnerLoading :loading="loading" />
  </div>
</template>
<script setup>
import InnerLoading from 'src/components/ui/InnerLoading.vue'
import OrderShopShow from 'src/components/shows/OrderShopShow.vue'
import { ref } from 'vue'

const loading = ref(true)
</script>
<style lang=""></style>
