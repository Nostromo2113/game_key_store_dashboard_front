<template>
  <div class="q-pa-sm">
    <TableDefault :columns="categoriesColumns" title="Категории" />
  </div>
</template>
<script setup>
import TableDefault from 'src/components/tables/TableDefault.vue'
import { categoriesColumns } from 'src/constants/categoriesColumns.js'
</script>
<style lang="css"></style>
