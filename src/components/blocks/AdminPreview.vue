<template>
  <div class="q-pa-md text-blue-grey-1">
    <div
      class="admin-preview q-pa-sm custom-rounded cursor-pointer"
      @click="$router.push({ name: 'admin' })"
    >
      <q-avatar size="62px" class="q-mb-sm">
        <img :src="getImageUrl(userStore.user?.avatar)" />
      </q-avatar>
      <div class="text-subtitle1 text-center">{{ userStore.user?.name }}</div>
      <div class="text-subtitle2">{{ userStore.user?.email }}</div>
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
  border: 1px solid rgba(70, 70, 70, 0.418);
  background-color: rgba(255, 255, 255, 0.027);
  backdrop-filter: blur(10px);
  transition: box-shadow background-color 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.admin-preview:hover {
  border: 1px solid rgba(70, 70, 70, 0.753);
  background-color: rgba(255, 255, 255, 0.089);
}
</style>
