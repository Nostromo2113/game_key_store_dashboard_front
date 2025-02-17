<template>
  <label class="flex column label">
    <span class="text-caption label-text">{{ label }}</span>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :type="type"
      class="simple-input"
    />
  </label>
</template>

<script setup>
defineProps({
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
</script>

<style scoped>
.simple-input {
  border: 1px solid rgba(0, 0, 0, 0.514);
  padding: 12px;
  border-radius: 10px;
  cursor: auto;
}

.label {
  position: relative;
  color: rgba(0, 0, 0, 0.514);
}

.label-text {
  position: absolute;
  top: -10px;
  left: 14px;
  background: white;
  padding-inline: 5px;
}
</style>
