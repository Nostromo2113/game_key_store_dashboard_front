<template>
  <div>
    <div class="text-subtitle1 q-mb-sm">Системные требования</div>
    <div>
      <div class="flex column gap-sm">
        <q-input
          v-model="technical_requirements.platform"
          placeholder="Укажите платформу"
          label="Платформа"
          dense
          outlined
        />
        <q-input
          v-model="technical_requirements.os"
          placeholder="Укажите OS"
          label="Операционная система"
          dense
          outlined
        />
        <q-input
          v-model="technical_requirements.cpu"
          placeholder="Укажите CPU"
          label="Центральный процессор"
          dense
          outlined
        />
        <q-input
          v-model="technical_requirements.gpu"
          placeholder="Укажите GPU"
          label="Видеокарта"
          dense
          outlined
        />
        <q-input
          v-model="technical_requirements.ram"
          placeholder="Укажите RAM GB"
          label="Оперативная память"
          type="number"
          dense
          outlined
        />
        <q-input
          v-model="technical_requirements.storage"
          placeholder="Укажите HDD/SSD GB"
          label="HDD/SSD"
          type="number"
          outlined
          dense
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      platform: '',
      os: '',
      cpu: '',
      gpu: '',
      ram: '',
      storage: '',
    }),
  },
})
const technical_requirements = ref(props.data)
watch(
  () => props.data,

  (newVal) => {
    if (newVal !== technical_requirements.value) {
      technical_requirements.value = newVal
    }
  },
  { deep: true, immediate: true },
)

watch(technical_requirements.value, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>
<style lang=""></style>
