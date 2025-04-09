<template>
  <q-card flat class="custom-rounded shadow-sm">
    <q-card-section>
      <div class="text-h5 text-weight-medium q-mb-md text-accent">Комментарии</div>

      <div class="q-gutter-y-md">
        <q-card v-for="comment in comments" :key="comment.id" flat class="custom-rounded shadow-1">
          <q-card-section>
            <div class="row justify-between items-center no-wrap">
              <div class="col">
                <div class="text-subtitle1 text-weight-medium">{{ comment.user_name }}</div>
                <div class="text-caption text-grey-7">{{ comment.product_title }}</div>
              </div>
              <div class="col-auto">
                <div class="text-caption text-grey">{{ formatDate(comment.created_at) }}</div>
              </div>
            </div>
            <q-separator class="q-my-sm" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-body1 comment-content">
              {{ comment.content }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getData } from 'src/utils/http/get'

const props = defineProps({
  productId: {
    type: Number,
    required: true,
  },
})

const comments = ref([])

const getComments = async (productId) => {
  const path = `products/${productId}/comments`
  try {
    const response = await getData(path)
    comments.value = response.data || response
  } catch (e) {
    console.error('Ошибка загрузки комментариев:', e)
  }
}

function formatDate(isoString) {
  const date = new Date(isoString)
  const pad = (num) => num.toString().padStart(2, '0')
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

onMounted(() => {
  getComments(props.productId)
})
</script>

<style scoped>
.comment-content {
  white-space: pre-line;
  word-break: break-word;
  line-height: 1.6;
  padding: 8px 0;
}
</style>
