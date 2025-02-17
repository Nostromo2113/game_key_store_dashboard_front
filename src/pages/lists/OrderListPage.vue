<template>
  <div class="q-pa-sm">
    <q-card flat class="custom-rounded">
      <div class="text-h6 q-px-md q-pt-md">Все заказы</div>
      <OrderTable />
    </q-card>
  </div>
</template>
<script setup>
import OrderTable from 'src/components/tables/OrderTable.vue'
</script>
<style lang="css"></style>
