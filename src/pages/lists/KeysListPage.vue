<template lang="">
  <div class="q-pa-sm relative-position page-height">
    <ActivationKeysTable v-show="!loading" @success="loading = false" />
    <InnerLoading :loading="loading" size="200px" />
  </div>
</template>
<script setup>
import ActivationKeysTable from 'src/components/tables/ActivationKeysTable.vue'
import InnerLoading from 'src/components/ui/InnerLoading.vue'
import { ref } from 'vue'

const loading = ref(true)
</script>
<style lang=""></style>
