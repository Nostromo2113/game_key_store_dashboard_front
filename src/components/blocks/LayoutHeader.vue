<template lang="">
  <q-header class="text-blue-grey-1 bg-dark">
    <q-toolbar>
      <q-btn flat dense round icon="menu" aria-label="Menu" @click="$emit('toggleLeftDrawer')" />
      <q-toolbar-title> Game Key Shop </q-toolbar-title>
      <SearchForm />
      <q-btn flat rounded dense icon="dark_mode" class="q-ml-md" @click="toggleMode(darkMode)">
        <q-tooltip class="bg-red" :offset="[10, 10]"> Темная тема не настроена </q-tooltip></q-btn
      >
    </q-toolbar>
  </q-header>
</template>
<script setup>
import SearchForm from 'src/components/forms/SearchForm.vue'
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const darkMode = ref(false)

const $q = useQuasar()

function toggleMode(mode) {
  darkMode.value = !mode
  $q.dark.set(darkMode.value)
}
</script>
<style lang=""></style>
