<template>
  <div class="relative-position page-shop-height">
    <div v-show="!loading" class="q-py-md">
      <div>
        <ProductCards @success="loading = false" />
      </div>
    </div>
    <InnerLoading :loading="loading" size="200px" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProductCards from 'src/components/blocks/ProductCards.vue'
import InnerLoading from 'src/components/ui/InnerLoading.vue'

const loading = ref(true)
</script>

<style scoped></style>
