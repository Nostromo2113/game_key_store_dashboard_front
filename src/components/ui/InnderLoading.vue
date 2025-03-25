<template lang="">
  <div>
    <q-inner-loading :showing="visible">
      <q-spinner-cube size="200px" color="primary"></q-spinner-cube>
    </q-inner-loading>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const visible = ref(true)
</script>
<style lang=""></style>
