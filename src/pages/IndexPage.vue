<template>
  <q-page class="flex flex-center">
    <!-- <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    /> -->
    <CardForm />
    <QuantitySelector />
  </q-page>
</template>

<script setup>
import CardForm from 'src/components/forms/CardForm.vue'
import QuantitySelector from 'src/components/ui/QuantitySelector.vue'
</script>
