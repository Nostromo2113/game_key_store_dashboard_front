<template>
  <q-btn :icon="icon" label="Цена" @click="toggleSort" flat dense class="q-mb-md custom-rounded" />
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['sort'])

const sortDirection = ref(null)

const toggleSort = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  emit('sort', sortDirection.value)
}

const icon = computed(() => (sortDirection.value === 'asc' ? 'arrow_upward' : 'arrow_downward'))
</script>
