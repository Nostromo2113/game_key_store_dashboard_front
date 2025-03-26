<template>
  <div class="q-pa-sm relative-position page-height">
    <ProductTable v-show="!loading" @success="loading = false" />
    <router-view></router-view>
    <q-inner-loading :showing="loading">
      <q-spinner-cube size="200px" color="primary"></q-spinner-cube>
    </q-inner-loading>
  </div>
</template>
<script setup>
import ProductTable from 'src/components/tables/ProductTable.vue'
import { ref } from 'vue'

const loading = ref(true)
</script>
<style lang="css"></style>
