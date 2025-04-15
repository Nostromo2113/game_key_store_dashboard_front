<template lang="">
  <div class="relative-position page-shop-height q-py-md">
    <ProductShopShow class="q-mt-md" v-show="!loading" @success="loading = false" />
    <InnerLoading :loading="loading" />
  </div>
</template>
<script setup>
import ProductShopShow from 'src/components/shows/ProductShopShow.vue'
import InnerLoading from 'src/components/ui/InnerLoading.vue'
import { ref } from 'vue'

const loading = ref(true)
</script>
<style lang=""></style>
