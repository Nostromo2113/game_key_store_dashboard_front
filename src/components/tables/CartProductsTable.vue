<template>
  <div>
    <q-table
      :rows="rows"
      :columns="cartProductsColumns"
      :pagination="tablePagination"
      row-key="title"
      flat
      dense
      class="q-pa-sm text-blue-grey-9"
    >
      <template v-slot:top-right>
        <div class="text-overline2 bg-primary text-white q-px-sm custom-rounded">
          Только для просмотра
        </div>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="preview_image" :props="props">
            <q-img
              :src="getImageUrl(props.row.preview_image)"
              width="160px"
              height="80px"
              class="rounded-borders"
            ></q-img>
          </q-td>
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="title" :props="props">
            {{ props.row.title }}
          </q-td>
          <q-td key="publisher" :props="props">
            {{ props.row.publisher }}
          </q-td>
          <q-td key="release_date" :props="props">
            {{ props.row.release_date }}
          </q-td>

          <q-td key="price" :props="props">
            {{ props.row.price }}
          </q-td>

          <q-td key="quantity" :props="props">
            <q-badge class="text-subtitle2 q-px-md">
              {{ props.row.quantity }}
            </q-badge>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog v-model="modalRemove" persistent>
      <confirmation-card :itemTitle="removeItem.title" @confirm="removeFromOrder(removeItem.id)" />
    </q-dialog>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue'
import { cartProductsColumns } from 'src/constants/cartProductsColumns'
import { defineEmits } from 'vue'
import ConfirmationCard from '../ui/ConfirmationCard.vue'
import { getImageUrl } from 'src/utils/getImageUrl'
import { getData } from 'src/utils/http/get'

const emit = defineEmits(['removeFromOrder'])

const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
  userId: {
    type: Number,
    default: 0,
  },
})

const path = 'cart'

const rows = ref([])
const removeItem = ref({})

const modalRemove = ref(false)

const removeFromOrder = async (id) => {
  emit('removeFromOrder', id)
}

const getCart = async (path, id) => {
  try {
    const response = await getData(path, id)
    console.log('RES:', response)
    rows.value = response.products
  } catch (e) {
    console.error(e)
  }
}

watch(
  () => props.tableData,
  (newVal) => {
    rows.value = newVal
  },
  { immediate: true },
)

onMounted(() => {
  if (props.userId) {
    getCart(path, props.userId)
  }
})

const tablePagination = ref({
  page: 1,
  rowsPerPage: 20,
})
</script>
<style lang="css"></style>
