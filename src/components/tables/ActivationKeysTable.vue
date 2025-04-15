<template>
  <div>
    <q-table
      title="Ключи активации"
      :rows="rows"
      :columns="activationKeysColumns"
      :pagination="tablePagination"
      hide-bottom
      row-key="title"
      dense
      flat
      class="q-pa-sm custom-rounded text-blue-grey-9 shadow-sm"
    >
      <template v-slot:top-right>
        <q-btn
          v-if="props.productId"
          @click="addModal = !addModal"
          size="16px"
          color="primary"
          icon="add"
          class="custom-rounded"
        ></q-btn>
        <q-badge class="text-subtitle2 text-white q-pa-sm bg-primary shadow-1" v-else>
          Управление возможно только из меню продукта
        </q-badge>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="key" :props="props">
            <q-badge
              color="accent text-subtitle2 text-black justify-center"
              style="min-width: 170px"
            >
              {{ props.row.key }}
            </q-badge>
          </q-td>
          <q-td key="productTitle" :props="props">
            {{ props.row.product_title }}
          </q-td>
          <q-td key="productId" :props="props">
            {{ props.row.product_id }}
          </q-td>
          <q-td key="reserved" :props="props">
            {{ props.row.reserved ? 'Да' : 'Нет' }}
          </q-td>
          <q-td key="destroy" :props="props">
            <q-btn
              @click="((itemToRemove = props.row), (modalRemove = true))"
              icon="close"
              size="12px"
              color="negative"
              round
              dense
              :disable="!productId"
            ></q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog
      v-model="modalRemove"
      persistent
      aria-labelledby="remove-dialog-title"
      aria-describedby="remove-dialog-description"
    >
      <ConfirmationCard :itemTitle="itemToRemove.key" @confirm="deleteItem(itemToRemove.id)" />
    </q-dialog>
    <q-dialog v-model="addModal" persistent>
      <default-form @storeItem="(item) => postItem(item, props.productId)" />
    </q-dialog>
    <div class="row justify-center q-mt-md">
      <q-pagination
        v-model="pagination.currentPage"
        :max="pagination.lastPage"
        :max-pages="5"
        direction-links
        boundary-links
        @update:model-value="(page) => getItems(props.productId, page)"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import ConfirmationCard from '../ui/ConfirmationCard.vue'
import DefaultForm from 'src/components/forms/DefaultForm.vue'
import { activationKeysColumns } from 'src/constants/activationKeysColumns'
import { getData } from 'src/utils/http/get'
import { deleteData } from 'src/utils/http/delete'
import { postData } from 'src/utils/http/post'
import notify from 'src/plugins/notify'

const emit = defineEmits(['success'])

const props = defineProps({
  title: {
    type: String,
    default: 'Title',
  },
  productId: {
    type: Number,
    default: null,
  },
})

const addModal = ref(false)
const modalRemove = ref(false)
const itemToRemove = ref({})

const rows = ref([])

const pagination = ref({
  currentPage: 1,
  lastPage: 1,
})

const getItems = async (productId, page) => {
  const path = !productId ? 'activation_keys' : `products/${productId}/activation_keys`
  console.warn(path)
  const params = {
    page: page,
  }
  try {
    const response = await getData(path, params)
    rows.value = response.data
    // Если в ответе есть информация о пагинации
    if (response.meta.current_page && response.meta.last_page[0]) {
      pagination.value.currentPage = response.meta.current_page[0]
      pagination.value.lastPage = response.meta.last_page[0]
    }
    emit('success')
  } catch (e) {
    console.error(e)
  }
}

const postItem = async (item, productId) => {
  const path = `products/${productId}/activation_keys`
  const data = {
    activation_key: { product_id: productId, key: item.title },
  }
  const loading = notify.loading('Обработка')
  try {
    const response = await postData(path, data)
    rows.value.push(response.data.data)
    notify.success('Успешно')
  } catch (e) {
    console.error(e)
    notify.error('Ошибка')
  } finally {
    loading()
  }
}

const deleteItem = async (keyId) => {
  const path = `/activation_keys/${keyId}`
  const loading = notify.loading('Обработка')
  try {
    await deleteData(path)
    notify.success('Успешно')
    removeLocalData(keyId)
  } catch (e) {
    console.error(e)
    notify.error('Ошибка')
  } finally {
    loading()
  }
}

const removeLocalData = (id) => {
  const index = rows.value.findIndex((el) => el.id === id)
  rows.value.splice(index, 1)
}

onMounted(() => {
  getItems(props.productId)
})

const tablePagination = ref({
  page: 1,
  rowsPerPage: 100,
})
</script>
<style lang="css"></style>
