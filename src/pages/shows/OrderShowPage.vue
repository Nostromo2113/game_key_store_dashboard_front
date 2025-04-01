<template lang="">
  <div class="relative-position page-height q-pa-md">
    <OrderShow v-show="!loading" @success="loading = false" />
    <InnerLoading :loading="loading" />
  </div>
</template>
<script setup>
import OrderShow from 'src/components/shows/OrderShow.vue'
import InnerLoading from 'src/components/ui/InnerLoading.vue'
import { ref } from 'vue'

const loading = ref(true)
</script>
<style lang=""></style>
