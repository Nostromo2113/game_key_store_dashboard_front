<template lang="">
  <form class="flex q-gutter-md" @submit.prevent="getSearchItems(searchQuery)">
    <q-input
      v-model="searchQuery"
      bg-color="white"
      placeholder="Поиск..."
      dense
      outlined
      style="width: 200px"
    >
      <template v-slot:append>
        <q-icon
          name="search"
          @click="getSearchItems(searchQuery)"
          class="cursor-pointer"
        ></q-icon> </template
    ></q-input>
  </form>
</template>
<script setup>
import { ref, defineEmits } from 'vue'
const emit = defineEmits(['getSearchItems'])

const searchQuery = ref('')

const getSearchItems = (query) => {
  emit('getSearchItems', query)
}
</script>
<style lang=""></style>
