<template>
  <q-layout view="lHh LpR lff">
    <LayoutHeader @toggleLeftDrawer="leftDrawerOpen = !leftDrawerOpen" />
    <q-drawer v-model="leftDrawerOpen" :width="230" :breakpoint="700" class="bg-dark">
      <AdminPreview />
      <NavList />
    </q-drawer>

    <q-page-container>
      <TheBreadcrumbs class="q-mt-md" />
      <router-view :key="$route.fullPath" />
    </q-page-container>
    <LayoutFooter />
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavList from 'src/components/blocks/NavList.vue'
import AdminPreview from 'src/components/blocks/AdminPreview.vue'
import LayoutHeader from 'src/components/blocks/LayoutHeader.vue'
import LayoutFooter from 'src/components/blocks/LayoutFooter.vue'
import TheBreadcrumbs from 'src/components/blocks/TheBreadcrumbs.vue'
import { useUserStore } from 'src/stores/userStore'

const userStore = useUserStore()

const leftDrawerOpen = ref(true)

onMounted(async () => {
  await userStore.fetchUser()
})
</script>
<style scoped></style>
