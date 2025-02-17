<template>
  <label>
    <span class="text-caption text-grey">{{ props.label }}</span>
    <q-input
      v-model="inputValue"
      outlined
      :placeholder="props.placeholder"
      :type="props.type"
      dense
    ></q-input>
  </label>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: 'label',
  },
  placeholder: {
    type: String,
    default: 'placeholder',
  },
  type: {
    type: String,
    default: 'text',
  },
})

const emit = defineEmits(['update:modelValue'])

const inputValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal
  },
)

watch(inputValue, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>

<style scoped></style>
