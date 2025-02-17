<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="text-blue-grey-1 bg-dark">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title> Game Key Shop </q-toolbar-title>
        <SearchForm />
        <q-btn flat rounded dense icon="dark_mode" class="q-ml-md" @click="toggleMode(darkMode)">
          <q-tooltip class="bg-red" :offset="[10, 10]"> Темная тема не настроена </q-tooltip></q-btn
        >
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" :width="230" :breakpoint="700" class="bg-dark">
      <AdminPreview />
      <NavList />
    </q-drawer>

    <q-page-container>
      <TheBreadcrumbs class="q-mt-md" />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavList from 'src/components/blocks/NavList.vue'
import AdminPreview from 'src/components/blocks/AdminPreview.vue'
import SearchForm from 'src/components/forms/SearchForm.vue'
import TheBreadcrumbs from 'src/components/blocks/TheBreadcrumbs.vue'

import { useUserStore } from 'src/stores/userStore'
const userStore = useUserStore()
import { api } from 'src/boot/axios'

import { useQuasar } from 'quasar'

const darkMode = ref(false)

const $q = useQuasar()

function toggleMode(mode) {
  darkMode.value = !mode
  $q.dark.set(darkMode.value)
}

const leftDrawerOpen = ref(true)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const getMe = async () => {
  try {
    const response = await api.post('auth/me')
    if (response.data) {
      userStore.setUser(response.data)
    }
    console.log('Пользователь загружен')
  } catch (error) {
    console.error('Ошибка при загрузке пользователя:', error)
  }
}

// Загружаем пользователя при монтировании
onMounted(() => {
  getMe()
})
</script>
<style scoped></style>
