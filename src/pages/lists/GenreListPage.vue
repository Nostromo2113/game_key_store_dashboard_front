<template>
  <div class="q-pa-sm relative-position page-height">
    <TableDefault
      v-show="!loading"
      :columns="categoriesColumns"
      title="Жанры"
      path="genres"
      @success="loading = false"
    />
    <InnerLoading :loading="loading" size="200px" />
  </div>
</template>
<script setup>
import TableDefault from 'src/components/tables/DefaultTable.vue'
import InnerLoading from 'src/components/ui/InnerLoading.vue'
import { categoriesColumns } from 'src/constants/categoriesColumns.js'
import { ref } from 'vue'

const loading = ref(true)
</script>
<style lang="css"></style>
