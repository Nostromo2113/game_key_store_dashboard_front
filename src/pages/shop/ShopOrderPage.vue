<template>
  <div class="relative-position page-height">
    <OrderShop v-show="!loading" @success="loading = false" />
    <InnerLoading :loading="loading" />
  </div>
</template>
<script setup>
import InnerLoading from 'src/components/ui/InnerLoading.vue'
import OrderShop from 'src/components/shows/OrderShop.vue'
import { ref } from 'vue'

const loading = ref(true)
</script>
<style lang=""></style>
