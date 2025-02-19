<template>
  <div class="flex items-center column gap-md q-pa-none">
    <q-img :height="height" :width="width" class="rounded-borders" :src="previewUrl"></q-img>

    <UploadInput
      :disabledUpload="disabledUpload"
      type="file"
      @change="onFileChange"
      :style="{ width: width }"
    />
  </div>
</template>

<script setup>
import { ref, defineProps, watch, defineEmits } from 'vue'
import UploadInput from '../ui/UploadInput.vue'

const props = defineProps({
  imageLink: {
    type: String,
    default: '/images/no_image.jpg',
  },
  height: {
    type: String,
    default: '200px',
  },
  width: {
    type: String,
    default: '300px',
  },
  disabledUpload: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['onFileChange'])
const previewUrl = ref(props.imageLink)
const selectedFile = ref()

const onFileChange = (file) => {
  selectedFile.value = file
  if (selectedFile.value) {
    previewUrl.value = URL.createObjectURL(selectedFile.value)
    emit('onFileChange', file)
  }
}

watch(
  () => props.imageLink,
  (newVal) => {
    console.log(newVal)
    previewUrl.value = `${import.meta.env.VITE_APP_API_URL}/storage/${newVal}`
  },
  { immediate: true },
)
</script>
