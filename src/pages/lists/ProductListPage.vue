<template>
  <div class="q-pa-sm">
    <ProductTable />
    <router-view></router-view>
  </div>
</template>
<script setup>
import ProductTable from 'src/components/tables/ProductTable.vue'
</script>
<style lang="css"></style>
