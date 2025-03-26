<template>
  <div class="q-pa-sm relative-position page-height">
    <TableDefault
      v-show="!loading"
      :columns="categoriesColumns"
      title="Категории"
      path="categories"
      @success="loading = false"
    />
    <q-inner-loading :showing="loading">
      <q-spinner-cube size="200px" color="primary"></q-spinner-cube>
    </q-inner-loading>
  </div>
</template>
<script setup>
import TableDefault from 'src/components/tables/DefaultTable.vue'
import { categoriesColumns } from 'src/constants/categoriesColumns.js'
import { ref } from 'vue'

const loading = ref(true)
</script>
<style lang="css"></style>
