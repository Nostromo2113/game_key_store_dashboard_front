<template lang="">
  <div class="q-mt-md"><OrderTable :userId="userId" /></div>
</template>
<script setup>
import OrderTable from 'src/components/tables/OrderTable.vue'
import { useUserStore } from 'src/stores/userStore'
import { computed } from 'vue'

const userStore = useUserStore()

const userId = computed(() => userStore.user?.id)
</script>
<style lang=""></style>
