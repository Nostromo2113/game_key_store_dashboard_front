<template>
  <div>
    <q-table
      :rows="rows"
      :columns="filteredColumns"
      :pagination="tablePagination"
      hide-bottom
      row-key="title"
      class="q-pa-sm custom-rounded text-blue-grey-9 shadow-sm"
      flat
      dense
      ><template v-slot:top-left>
        <q-btn-dropdown
          icon="filter_list"
          color="primary"
          unelevated
          class="custom-rounded"
          label="Фильтры"
        >
          <FilterGroup @getQueryData="getQueryProducts" />
        </q-btn-dropdown>
      </template>
      <template v-slot:top-right>
        <q-btn
          v-if="!checkboxes"
          @click="navigateToCreateProduct"
          size="16px"
          color="primary"
          icon="add"
          unelevated
          class="custom-rounded"
        ></q-btn>
        <q-btn
          v-if="selectedProducts.length > 0"
          @click="addSelectedProducts(selectedProducts)"
          color="primary"
        >
          Добавить в заказ
        </q-btn>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-if="!checkboxes" key="showProduct" :props="props">
            <q-btn
              flat
              :to="{
                name: 'product.show',
                params: { productId: props.row.id },
              }"
              rounded
              dense
              icon="visibility"
            />
          </q-td>
          <q-td v-if="checkboxes" key="addToOrder" :props="props"
            ><q-checkbox v-model="selectedProducts" :val="props.row"></q-checkbox>
          </q-td>
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
          <q-td
            key="description"
            :props="props"
            style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
          >
            <span v-html="props.row.description"></span>
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
          <q-td key="amount" :props="props">
            {{ props.row.amount }}
          </q-td>
          <q-td key="is_published" :props="props">
            {{ props.row.is_published === 1 ? 'Да' : 'Нет' }}
          </q-td>
          <q-td key="destroy" :props="props">
            <q-btn
              @click="prepareForRemove(props.row)"
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
    <q-dialog v-model="modalRemove" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="text-h6"
            >Удалить продукт: <strong>{{ itemToRemove.title }}</strong
            >?</span
          >
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Нет" color="primary" v-close-popup></q-btn>
          <q-btn
            @click="removeProduct(itemToRemove.id)"
            flat
            label="Да"
            color="negative"
            v-close-popup
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="row justify-center q-mt-md">
      <q-pagination
        v-model="pagination.currentPage"
        :max="pagination.lastPage"
        :max-pages="5"
        direction-links
        boundary-links
        @update:model-value="(page) => getQueryProducts({ page: page })"
      />
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { productsColumns } from 'src/constants/productsColumns'
import { getData } from 'src/utils/http/get'
import { deleteData } from 'src/utils/http/delete'
import { getImageUrl } from 'src/utils/getImageUrl'
import FilterGroup from '../blocks/FilterGroup.vue'
import notify from 'src/plugins/notify'

const router = useRouter()

const props = defineProps({
  tableTitle: {
    type: String,
    default: 'Title',
  },
  preloadersTable: {
    type: Object,
  },
  createButton: {
    type: Boolean,
    default: true,
  },
  checkboxes: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['addSelectedProducts', 'success'])

const rows = ref([])

const filteredColumns = ref([])
const selectedProducts = ref([])

const modalRemove = ref(false)
const itemToRemove = ref({})

const pagination = ref({
  currentPage: 1,
  lastPage: 1,
})

const navigateToCreateProduct = () => {
  if (!props.checkboxes) {
    router.push({ name: 'product.create' })
  }
}

const getQueryProducts = async (queryParams = {}) => {
  const path = 'products'
  try {
    const response = await getData(path, queryParams)
    console.log(response)
    rows.value = response.data

    if (response.meta.current_page && response.meta.last_page) {
      pagination.value.currentPage = response.meta.current_page
      pagination.value.lastPage = response.meta.last_page
    }
    emit('success')
  } catch (e) {
    console.error(e)
  }
}

const removeProduct = async (productId) => {
  const path = `products/${productId}`
  const loading = notify.loading('Обработка')
  try {
    await deleteData(path)
    rows.value = rows.value.filter((product) => product.id !== productId)
    notify.success('Успешно')
  } catch (e) {
    console.error(e)
    notify.error('Ошибка')
  } finally {
    loading()
  }
}

const addSelectedProducts = (products) => {
  const preparedSelectedProducts = prepareSelectedProducts(products)
  emit('addSelectedProducts', preparedSelectedProducts)
  selectedProducts.value = []
}

const prepareSelectedProducts = (products) => {
  const preparedSelectedProducts = products.map((product) => {
    product.activation_keys = []
    product.quantity = 1
    return product
  })
  return preparedSelectedProducts
}

const prepareForRemove = (item) => {
  itemToRemove.value = item
  modalRemove.value = true
}

onMounted(() => {
  getQueryProducts()
  defineColumnStructure(productsColumns, props.checkboxes)
})

const defineColumnStructure = (productsColumns, checkboxes) => {
  if (!checkboxes) {
    filteredColumns.value = productsColumns.filter((el) => el.name !== 'addToOrder')
  } else {
    filteredColumns.value = productsColumns.filter((el) => el.name !== 'showProduct')
  }
}

const tablePagination = ref({
  page: 1,
  rowsPerPage: 100,
})
</script>
<style lang="css"></style>
