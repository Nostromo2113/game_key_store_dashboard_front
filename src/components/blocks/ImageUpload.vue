<template>
  <div class="flex items-center column gap-md q-pa-none">
    <q-img
      :height="computedHeight"
      :width="computedWidth"
      class="rounded-borders"
      :src="previewUrl"
    ></q-img>
    <UploadInput
      :disabledUpload="disabledUpload"
      type="file"
      @change="onFileChange"
      :style="{ width: computedWidth }"
    />
  </div>
</template>

<script setup>
import { ref, defineProps, watch, defineEmits, computed } from 'vue'
import { useQuasar } from 'quasar'
import UploadInput from '../ui/UploadInput.vue'
import { getImageUrl } from 'src/utils/getImageUrl'

const $q = useQuasar()

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
  mobileBreakpoint: {
    type: String,
    default: 'sm',
  },
})

const emit = defineEmits(['onFileChange'])
const previewUrl = ref(props.imageLink)
const selectedFile = ref()

const computedWidth = computed(() => {
  return $q.screen.lt[props.mobileBreakpoint] ? '100%' : props.width
})

const computedHeight = computed(() => {
  if ($q.screen.lt[props.mobileBreakpoint]) {
    return 'auto'
  }
  return props.height
})

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
    previewUrl.value = getImageUrl(newVal)
  },
  { immediate: true },
)
</script>
