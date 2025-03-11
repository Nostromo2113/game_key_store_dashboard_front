<template>
  <div>
    <q-table
      :title="title"
      :rows="rows"
      :columns="activationKeysColumns"
      :pagination="tablePagination"
      hide-bottom
      row-key="title"
      dense
      flat
      class="q-pa-sm custom-rounded text-blue-grey-9 shadow-sm"
      @click="console.log(props.productId)"
    >
      <template v-slot:top-right>
        <q-btn
          v-if="props.productId"
          @click="addModal = !addModal"
          size="16px"
          color="primary"
          icon="add"
          unelevated
          class="custom-rounded"
        ></q-btn>
        <q-badge class="text-subtitle2 text-white q-pa-sm bg-primary" v-else>
          Добавление возможно только из меню продукта
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
              unelevated
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
      <ConfirmationCard :itemTitle="itemToRemove.title" @confirm="deleteItem(itemToRemove.id)" />
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
import { ref, onMounted } from 'vue'
import ConfirmationCard from '../ui/ConfirmationCard.vue'
import DefaultForm from 'src/components/forms/DefaultForm.vue'
import { activationKeysColumns } from 'src/constants/activationKeysColumns'
import { getData } from 'src/utils/http/get'
import { deleteData } from 'src/utils/http/delete'
import { postData } from 'src/utils/http/post'

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

const pagination = ref({
  currentPage: 1,
  lastPage: 1,
})

const rows = ref([])

const getItems = async (productId, page) => {
  const path = 'keys'
  const params = {
    product_id: productId,
    page: page,
  }

  try {
    const response = await getData(path, null, params)
    rows.value = response.data
    console.log(rows.value)
    // Если в ответе есть информация о пагинации
    if (response.current_page && response.last_page) {
      pagination.value.currentPage = response.current_page
      pagination.value.lastPage = response.last_page
    }
  } catch (e) {
    console.error(e)
  }
}

const postItem = async (item, productId) => {
  const path = 'keys'
  const data = {
    activation_key: { product_id: productId, key: item.title },
  }
  try {
    const response = await postData(path, data)
    console.log(response)
  } catch (e) {
    console.error(e)
  } finally {
    getItems(path)
  }
}

const deleteItem = async (id) => {
  const path = `keys/${id}`
  try {
    const response = await deleteData(path, id)
    console.log(response)
  } catch (e) {
    console.error(e)
  } finally {
    getItems(path)
  }
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
