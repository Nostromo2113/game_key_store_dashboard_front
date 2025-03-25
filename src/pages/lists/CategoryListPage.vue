<template>
  <div class="q-pa-sm">
    <TableDefault :columns="categoriesColumns" title="Категории" path="categories" />
  </div>
</template>
<script setup>
import TableDefault from 'src/components/tables/DefaultTable.vue'
import { categoriesColumns } from 'src/constants/categoriesColumns.js'
</script>
<style lang="css"></style>
