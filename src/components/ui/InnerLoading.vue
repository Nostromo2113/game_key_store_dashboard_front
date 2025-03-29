<template>
  <q-inner-loading :showing="loading" style="background: transparent">
    <q-spinner-cube :size="size" :color="color" />
  </q-inner-loading>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    required: true,
  },
  size: {
    type: String,
    default: '200px',
  },
  color: {
    type: String,
    default: 'primary',
  },
  background: {
    type: Boolean,
    default: false,
  },
})
</script>
