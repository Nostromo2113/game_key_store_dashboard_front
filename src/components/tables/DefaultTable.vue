<template>
  <div v-if="!loading">
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <q-table
        :title="title"
        :rows="rows"
        :columns="props.columns"
        :pagination="tablePagination"
        row-key="title"
        dense
        flat
        class="q-pa-sm custom-rounded text-blue-grey-9 shadow-sm"
      >
        <template v-slot:top-right>
          <q-btn
            @click="addModal = !addModal"
            size="16px"
            color="primary"
            icon="add"
            class="custom-rounded"
          ></q-btn>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">
              {{ props.row.id }}
            </q-td>
            <q-td key="title" :props="props">
              <q-badge color="blue-grey-10 text-subtitle2 shadow-1 custom-rounded">
                <q-input
                  :model-value="props.row.title"
                  @update:model-value="(val) => onUpdateTitle(val, props.row)"
                  @blur="updateItem(path, props.row)"
                  dense
                  borderless
                  input-style="text-align: center; color: white"
                >
                </q-input>
              </q-badge>
            </q-td>
            <q-td key="destroy" :props="props">
              <q-btn
                @click="((itemToRemove = props.row), (modalRemove = true))"
                icon="close"
                size="12px"
                color="negative"
                round
                dense
              ></q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </transition>
    <q-dialog
      v-model="modalRemove"
      persistent
      aria-labelledby="remove-dialog-title"
      aria-describedby="remove-dialog-description"
    >
      <ConfirmationCard
        :itemTitle="itemToRemove.title"
        @confirm="deleteItem(path, itemToRemove.id)"
      />
    </q-dialog>
    <q-dialog v-model="addModal" persistent>
      <default-form @storeItem="(item) => postItem(path, item)" />
    </q-dialog>
  </div>
  <InnderLoading v-else />
</template>
<script setup>
import { ref, onMounted } from 'vue'
import ConfirmationCard from '../ui/ConfirmationCard.vue'
import DefaultForm from 'src/components/forms/DefaultForm.vue'
import InnderLoading from '../ui/InnderLoading.vue'
import { getData } from 'src/utils/http/get'
import { deleteData } from 'src/utils/http/delete'
import { postData } from 'src/utils/http/post'
import { patchData } from 'src/utils/http/patch'
import notify from 'src/plugins/notify'

const props = defineProps({
  title: {
    type: String,
    default: 'Title',
  },
  columns: {
    type: Array,
  },
  path: {
    type: String,
    required: true,
  },
})

const path = props.path

const loading = ref(true)

const addModal = ref(false)
const modalRemove = ref(false)
const itemToRemove = ref({})

const rows = ref([])

const getItems = async (path) => {
  try {
    const response = await getData(path)
    rows.value = response
    loading.value = false
  } catch (e) {
    console.error(e)
  }
}

const postItem = async (path, item) => {
  const loading = notify.loading('Обработка')
  try {
    const response = await postData(path, item)
    storeLocalData(response)
    notify.success('Элемент добавлен')
  } catch (e) {
    console.error(e)
  } finally {
    loading()
  }
}

const deleteItem = async (path, id) => {
  const pathItem = `${path}/${id}`
  const loading = notify.loading('Обработка')
  try {
    await deleteData(pathItem)
    removeLocalData(id)
    notify.success('Элемент удален')
  } catch (e) {
    console.error(e)
  } finally {
    loading()
  }
}

const onUpdateTitle = (value, row) => {
  row.title = value
}

const updateItem = async (path, row) => {
  const pathItem = `${path}/${row.id}`
  const loading = notify.loading('Обработка')
  try {
    const response = await patchData(pathItem, row)
    updateLocalData(response)
    notify.success('Данные обновлены')
  } catch (e) {
    console.error(e)
    getData(path)
  } finally {
    loading()
  }
}

onMounted(() => {
  getItems(props.path)
})

const updateLocalData = (data) => {
  const item = data.data?.id ? data.data : data.data?.data
  const index = rows.value.findIndex((el) => el.id === item.id)
  rows.value[index] = item
}

const removeLocalData = (id) => {
  const index = rows.value.findIndex((el) => el.id === id)
  console.log(index, console.log(rows.value[index]))
  rows.value.splice(index, 1)
}

const storeLocalData = (data) => {
  const item = data.data.id ? data.data : data.data.data
  if (item) {
    rows.value.push(item)
  } else {
    return
  }
}

const tablePagination = ref({
  page: 1,
  rowsPerPage: 20,
})
</script>
<style lang="css"></style>
