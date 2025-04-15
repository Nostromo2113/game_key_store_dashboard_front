<template>
  <q-card flat class="custom-rounded shadow-sm">
    <q-toolbar class="justify-between">
      <div class="text-h5 text-weight-medium text-primary q-pa-sm">Комментарии</div>
      <q-btn
        @click="addModal = !addModal"
        size="20px"
        color="primary"
        icon="add_comment"
        class="custom-rounded"
        no-caps
        flat
      />
    </q-toolbar>
    <q-card-section>
      <div class="q-gutter-y-md">
        <q-card
          v-for="comment in comments"
          :key="comment.id"
          flat
          class="custom-rounded shadow-sm"
          :class="{ 'custom-border': userId == comment.user_id }"
        >
          <q-card-section>
            <div class="row justify-between items-center no-wrap">
              <div class="col">
                <div
                  class="text-subtitle1 text-weight-medium"
                  :class="{ 'text-accent': userId == comment.user_id }"
                >
                  {{ comment.user_name }}
                </div>
                <div class="text-caption text-grey-7">{{ comment.product_title }}</div>
              </div>
              <div class="col-auto">
                <div class="text-caption text-grey">{{ formatDate(comment.created_at) }}</div>
              </div>
            </div>
            <q-separator class="q-my-sm" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div v-if="showTextArea !== comment.id" class="text-subtitle2 comment-content">
              {{ comment.content }}
            </div>
            <q-input
              v-else
              type="textarea"
              v-model="comment.content"
              outlined
              dense
              class="q-mt-sm"
            />
          </q-card-section>

          <q-card-actions v-if="userId == comment.user_id" align="right">
            <q-btn
              v-if="showTextArea !== comment.id"
              @click="showTextArea = comment.id"
              color="primary"
              icon="edit"
              size="sm"
              class="q-mr-sm custom-rounded"
              no-caps
              flat
            />
            <q-btn
              v-else
              @click="
                () => {
                  showTextArea = null
                  updateComment(comment)
                }
              "
              color="positive"
              icon="check"
              size="md"
              class="q-mr-sm custom-rounded"
              no-caps
              flat
            />
            <q-btn
              @click="deleteComment(comment)"
              color="negative"
              icon="delete"
              size="md"
              no-caps
              class="custom-rounded"
              flat
            />
          </q-card-actions>
        </q-card>
      </div>
    </q-card-section>

    <q-dialog v-model="addModal" persistent>
      <default-form @storeItem="(item) => postComment(item)" />
    </q-dialog>
  </q-card>
</template>

<script setup>
import DefaultForm from '../forms/DefaultForm.vue'
import { ref, onMounted, computed } from 'vue'
import { getData } from 'src/utils/http/get'
import { postData } from 'src/utils/http/post'
import { patchData } from 'src/utils/http/patch'
import { deleteData } from 'src/utils/http/delete'
import notify from 'src/plugins/notify'
import { useUserStore } from 'src/stores/userStore'

const props = defineProps({
  productId: {
    type: Number,
    required: true,
  },
})

const comments = ref([])
const showTextArea = ref(null)
const addModal = ref(false)

const userId = computed(() => useUserStore().user?.id)

const getComments = async (productId) => {
  const path = `products/${productId}/comments`
  try {
    const response = await getData(path)
    comments.value = response.data || response
  } catch (e) {
    console.error('Ошибка загрузки комментариев:', e)
  }
}

const postComment = async (comment) => {
  const loading = notify.loading('Обработка')
  const path = `products/${props.productId}/comments`
  const data = {
    content: comment.title,
  }
  try {
    const response = await postData(path, data)
    comments.value.push(response.data)
    notify.success('Успешно')
  } catch (e) {
    console.error(e)
    notify.error('Ошибка')
  } finally {
    loading()
  }
}

const updateComment = async (comment) => {
  const path = `comments/${comment.id}`
  const loading = notify.loading('Обновление...')
  try {
    const response = await patchData(path, { content: comment.content })
    updateLocalComment(response.data)
    notify.success('Комментарий обновлён')
  } catch (e) {
    console.error(e)
    notify.error('Ошибка обновления')
  } finally {
    loading()
  }
}

const deleteComment = async (comment) => {
  const path = `comments/${comment.id}`
  const loading = notify.loading('Удаление...')
  try {
    await deleteData(path)
    comments.value = comments.value.filter((c) => c.id !== comment.id)
    notify.success('Комментарий удалён')
  } catch (e) {
    console.error(e)
    notify.error('Ошибка удаления')
  } finally {
    loading()
  }
}

const updateLocalComment = (updatedComment) => {
  const index = comments.value.findIndex((c) => c.id === updatedComment.id)
  if (index !== -1) {
    comments.value[index] = updatedComment
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
