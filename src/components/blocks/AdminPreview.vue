<template>
  <div class="q-pa-md text-blue-grey-1">
    <div
      class="admin-preview q-pa-sm custom-rounded cursor-pointer"
      @click="$router.push({ name: 'admin' })"
    >
      <q-avatar size="60px">
        <img :src="getImageUrl(userStore.user?.avatar)" class="img-cover"
      /></q-avatar>

      <div class="flex column">
        <div class="text-subtitle2">{{ userStore.user?.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from 'src/stores/userStore'
import { getImageUrl } from 'src/utils/getImageUrl'
const userStore = useUserStore()
</script>

<style lang="css">
.admin-preview {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  text-align: center;
  gap: 16px;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.027);
  backdrop-filter: blur(10px);
  transition: box-shadow background-color 0.3s ease;
}

.admin-preview:hover {
  box-shadow: 0px 0px 1px 1px rgba(70, 70, 70, 0.753);
  background-color: rgba(255, 255, 255, 0.089);
}
</style>
