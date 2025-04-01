<template>
  <div class="relative-position page-height">
    <UserShow v-show="!loading" @success="loading = false" />
    <InnerLoading :loading="loading" size="200px" />
  </div>
</template>
<script setup>
import UserShow from 'src/components/shows/UserShow.vue'
import InnerLoading from 'src/components/ui/InnerLoading.vue'
import { ref } from 'vue'
const loading = ref(true)
</script>
<style lang=""></style>
