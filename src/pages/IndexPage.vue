<template>
  <q-page class="q-pa-md justify-center items-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px; margin: auto"
    />
  </q-page>
  <q-btn-dropdown
    icon="filter_list"
    color="primary"
    unelevated
    class="custom-rounded"
    label="Фильтры"
  >
    <FilterGroup />
  </q-btn-dropdown>
</template>

<script setup>
import FilterGroup from 'src/components/blocks/FilterGroup.vue'
</script>
