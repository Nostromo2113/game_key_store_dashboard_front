<template>
  <div class="file-upload width-100">
    <input type="file" @change="onFileChange" class="file-input text-white" />
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
const emit = defineEmits(['change'])

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    emit('change', file)
  }
}
</script>

<style lang="scss" scoped>
.file-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.file-input {
  width: 100%;
  background-color: $primary;
  border-radius: 4px;
  padding: 12px;
  transition:
    background-color 0.3s,
    border-color 0.3s;
  cursor: pointer;
}

.file-input::file-selector-button {
  display: none;
}
.file-input:hover {
  background-color: rgba(27, 31, 39, 0.89);
  border-color: rgba(0, 0, 0, 0.2);
}
</style>
