<template>
  <div class="q-pa-sm relative-position page-height">
    <OrderTable v-show="!loading" @success="loading = false" />

    <InnerLoading :loading="loading" size="200px" />
  </div>
</template>
<script setup>
import OrderTable from 'src/components/tables/OrderTable.vue'
import InnerLoading from 'src/components/ui/InnerLoading.vue'
import { ref } from 'vue'

const loading = ref(true)
</script>
<style lang="css"></style>
