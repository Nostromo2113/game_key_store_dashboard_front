<template>
  <div>
    <q-table
      :title="title"
      :rows="rows"
      :columns="props.columns"
      :pagination="tablePagination"
      row-key="title"
      dense
      flat
      class="q-pa-sm custom-rounded text-blue-grey-9"
    >
      <template v-slot:top-right>
        <q-btn
          @click="addModal = !addModal"
          size="16px"
          color="primary"
          icon="add"
          unelevated
          class="custom-rounded"
        ></q-btn>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="title" :props="props">
            <q-badge color="accent text-subtitle2">
              <q-input
                :model-value="props.row.title"
                @update:model-value="(val) => onUpdateTitle(val, props.row)"
                @blur="updateItem('categories', props.row)"
                dense
                borderless
                input-style="text-align: center"
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
      <ConfirmationCard
        :itemTitle="itemToRemove.title"
        @confirm="deleteItem(path, itemToRemove.id)"
      />
    </q-dialog>
    <q-dialog v-model="addModal" persistent>
      <default-form @storeItem="(item) => postItem(props.path, item)" />
    </q-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import ConfirmationCard from '../ui/ConfirmationCard.vue'
import DefaultForm from 'src/components/forms/DefaultForm.vue'
import { getData } from 'src/utils/http/get'
import { deleteData } from 'src/utils/http/delete'
import { postData } from 'src/utils/http/post'
import { patchData } from 'src/utils/http/patch'

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
    default: 'categories',
  },
})

const addModal = ref(false)
const modalRemove = ref(false)
const itemToRemove = ref({})

const rows = ref([])

const getItems = async (path) => {
  const response = await getData(path)
  rows.value = response
}

const postItem = async (path, item) => {
  try {
    console.log('path: ', path, 'item: ', item)
    const response = await postData(path, item)
    console.log(response)
  } catch (e) {
    console.error(e)
  } finally {
    getItems(path)
  }
}

const deleteItem = async (path, id) => {
  try {
    const response = await deleteData(path, id)
    console.log(response)
  } catch (e) {
    console.error(e)
  } finally {
    getItems(path)
  }
}

const onUpdateTitle = (value, row) => {
  row.title = value
}

const updateItem = async (path, row) => {
  console.warn(row, path)
  try {
    const response = patchData(path, row)
    console.log(response)
  } catch (e) {
    console.error(e)
  } finally {
    getData(path)
  }
}

onMounted(() => {
  getItems(props.path)
})

const tablePagination = ref({
  page: 1,
  rowsPerPage: 20,
})
</script>
<style lang="css"></style>
