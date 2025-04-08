<template>
  <div class="q-pa-sm relative-position page-height">
    <UserTable v-show="!loading" @success="loading = false" />
    <InnerLoading :loading="loading" size="200px" />
  </div>
</template>
<script setup>
import UserTable from 'src/components/tables/UserTable.vue'
import InnerLoading from 'src/components/ui/InnerLoading.vue'
import { ref } from 'vue'

const loading = ref(true)
</script>
<style lang="css"></style>
