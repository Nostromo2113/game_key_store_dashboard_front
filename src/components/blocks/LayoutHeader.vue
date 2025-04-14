<template lang="">
  <q-header class="text-blue-grey-1 bg-dark">
    <q-toolbar>
      <q-btn flat dense round icon="menu" aria-label="Menu" @click="$emit('toggleLeftDrawer')" />
      <q-toolbar-title> Game Key Shop </q-toolbar-title>
      <SearchForm @getSearchItems="navigateToQueryOrder" placeholder="Номер заказа..." />
      <q-btn flat rounded dense icon="dark_mode" class="q-ml-md" @click="toggleMode(darkMode)">
        <q-tooltip class="bg-red" :offset="[10, 10]"> Темная тема не настроена </q-tooltip></q-btn
      >
    </q-toolbar>
  </q-header>
</template>
<script setup>
import SearchForm from 'src/components/forms/SearchForm.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { getData } from 'src/utils/http/get'

const router = useRouter()

const darkMode = ref(false)

const $q = useQuasar()

function toggleMode(mode) {
  darkMode.value = !mode
  $q.dark.set(darkMode.value)
}

const navigateToQueryOrder = async (query) => {
  const path = `orders/number/${+query}`

  if (query) {
    try {
      const response = await getData(path)
      const orderId = response[0].id
      const userId = response[0].user_id
      if (orderId) {
        router.push({ name: 'user.order.show', params: { userId: userId, orderId: orderId } })
      }
    } catch (e) {
      console.error(e)
    }
  } else {
    return
  }
}
</script>
<style lang=""></style>
