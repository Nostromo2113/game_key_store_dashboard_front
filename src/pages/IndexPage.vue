<template>
  <q-page class="flex flex-center">
    <!-- <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    /> -->
    <OrderProductsTable />
  </q-page>
</template>

<script setup>
import OrderProductsTable from 'src/components/tables/OrderProductsTable.vue'
</script>
