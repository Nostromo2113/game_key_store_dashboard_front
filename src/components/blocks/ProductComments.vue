<template>
  <q-card class="q-pa-sm shadow-sm" flat>
    <q-card-actions align="right" class="q-pb-md">
      <q-btn
        @click="addModal = !addModal"
        size="14px"
        color="primary"
        icon="add"
        class="custom-rounded"
        label="Добавить"
        no-caps
      ></q-btn
    ></q-card-actions>
    <div class="q-gutter-y-md align-right">
      <q-card
        v-for="comment in comments"
        :key="comment.id"
        flat
        class="q-mb-sm shadow-sm bg-blue-grey-1"
      >
        <q-card-section>
          <div class="row justify-between items-center">
            <div class="col">
              <div class="text-h6 text-grey-8">{{ comment.product_title }}</div>
              <div class="text-subtitle2 text-weight-medium">{{ comment.user_name }}</div>
            </div>
            <div class="col-auto">
              <div class="text-caption text-grey">{{ formatDate(comment.created_at) }}</div>
            </div>
          </div>
          <q-separator class="q-my-sm" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div
            v-if="showTextArea !== comment.id"
            class="text-body1"
            style="white-space: pre-line; word-break: break-word"
          >
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

        <q-card-actions align="right">
          <q-btn
            v-if="showTextArea !== comment.id"
            @click="showTextArea = comment.id"
            color="secondary"
            icon="edit"
            label="Редактировать"
            size="sm"
            class="q-mr-sm custom-rounded"
            no-caps
          />
          <q-btn
            v-else
            @click="((showTextArea = null), updateComment(comment))"
            color="positive"
            icon="check"
            label="Применить"
            size="sm"
            class="q-mr-sm custom-rounded"
            no-caps
          />
          <q-btn
            @click="deleteComment(comment)"
            color="negative"
            icon="delete"
            label="Удалить"
            size="sm"
            no-caps
            class="custom-rounded"
          />
        </q-card-actions>
      </q-card>
    </div>
    <q-dialog v-model="addModal" persistent>
      <default-form @storeItem="(item) => postComment(item)" />
    </q-dialog>
  </q-card>
</template>

<script setup>
import DefaultForm from '../forms/DefaultForm.vue'
import { ref, defineProps, onMounted } from 'vue'
import { getData } from 'src/utils/http/get'
import { patchData } from 'src/utils/http/patch'
import notify from 'src/plugins/notify'
import { deleteData } from 'src/utils/http/delete'
import { postData } from 'src/utils/http/post'

const props = defineProps({
  productId: {
    type: Number,
    required: true,
  },
})

const showTextArea = ref(null)
const comments = ref([])
const productId = props.productId

const addModal = ref(false)

const getComments = async (productId) => {
  const path = `products/${productId}/comments`
  try {
    const response = await getData(path)
    comments.value = response
  } catch (e) {
    console.error(e)
  }
}

const postComment = async (comment) => {
  // Переиспользую компонент, у которого немного иная задача, но пока так.
  // Костыль в виде data

  const loading = notify.loading('Обработка')
  const path = `products/${productId}/comments`
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
  const loading = notify.loading('Обработка')
  try {
    const response = await patchData(path, comment)
    updateLocalData(response.data)
    notify.success('Успешно')
  } catch (e) {
    console.error(e)
    notify.error('Ошибка')
  } finally {
    loading()
  }
}

const deleteComment = async (comment) => {
  const loading = notify.loading('Обработка')
  const path = `comments/${comment.id}`
  try {
    await deleteData(path)
    comments.value = comments.value.filter((item) => comment.id != item.id)
    notify.success('Успешно')
  } catch (e) {
    console.error(e)
    notify.error('Ошибка')
  } finally {
    loading()
  }
}

const updateLocalData = (item) => {
  const index = comments.value.findIndex((el) => el.id === item.id)
  if (index !== -1) {
    comments.value[index] = item
  }
}

function formatDate(isoString) {
  const date = new Date(isoString)
  const pad = (num) => num.toString().padStart(2, '0')

  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

onMounted(() => {
  getComments(productId)
})
</script>
