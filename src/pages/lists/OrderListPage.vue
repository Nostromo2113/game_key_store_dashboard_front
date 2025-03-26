<template>
  <div class="q-pa-sm relative-position page-height">
    <q-card v-show="!loading" flat class="custom-rounded shadow-sm">
      <div class="text-h6 q-px-md q-pt-md">Все заказы</div>
      <OrderTable @success="loading = false" />
    </q-card>
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
