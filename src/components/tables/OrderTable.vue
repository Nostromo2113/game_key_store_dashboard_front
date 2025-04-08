<template>
  <div>
    <q-table
      :rows="rows"
      :columns="columns"
      :pagination="tablePagination"
      hide-bottom
      row-key="title"
      dense
      flat
      class="custom-rounded q-pa-md text-blue-grey-9"
    >
      <template v-if="props.userId" v-slot:top-right>
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
          <q-td key="show" :props="props">
            <q-btn
              @click="navigateToOrder(props.row.id, props.row.userId)"
              flat
              rounded
              dense
              icon="visibility"
            />
          </q-td>
          <q-td key="orderNumber" :props="props">
            {{ props.row.order_number }}
          </q-td>
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="user_id" :props="props">
            {{ props.row.user_id }}
          </q-td>
          <q-td key="status" :props="props">
            <q-badge :color="props.row.status === 'completed' ? 'info' : 'warning'">
              {{ props.row.status }}
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
      <q-card>
        <q-card-section class="row items-center">
          <span class="text-h6"
            >Удалить заказ: <strong>{{ itemToRemove.order_number }}</strong
            >?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Нет" color="primary" v-close-popup></q-btn>
          <q-btn
            @click="destroyOrder(itemToRemove.id, itemToRemove.user_id)"
            flat
            label="Да"
            color="negative"
            v-close-popup
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addModal" persistent>
      <ConfirmationCard
        itemTitle="Создать заказ"
        destroy
        @confirm="createAnEmptyOrder(props.userId)"
      />
    </q-dialog>
    <div class="row justify-center q-mt-md">
      <q-pagination
        v-model="pagination.currentPage"
        :max="pagination.lastPage"
        :max-pages="5"
        direction-links
        boundary-links
        @update:model-value="(page) => getOrders(props.userId, { page: page })"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, defineProps, watch, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmationCard from '../ui/ConfirmationCard.vue'
import { ordersColumns } from 'src/constants/ordersColumns'
import { getData } from 'src/utils/http/get'
import { deleteData } from 'src/utils/http/delete'
import { postData } from 'src/utils/http/post'

const router = useRouter()
const emit = defineEmits(['success'])

const props = defineProps({
  shopPage: {
    type: Boolean,
    default: false,
  },
  userPage: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: Number,
    default: null,
  },
})

const columns = ref([...ordersColumns])
const addModal = ref(false)
const modalRemove = ref(false)
const itemToRemove = ref({})
const rows = ref(props.rowsData ?? [])

const pagination = ref({
  currentPage: 1,
  lastPage: 1,
})

const navigateToOrder = (orderId, userId) => {
  const routeName = props.shopPage
    ? 'shop.order'
    : props.userPage
      ? 'user.order.show'
      : 'order.show'

  router.push({
    name: routeName,
    params: { orderId, ...(props.shopPage ? {} : { userId }) },
  })
}

const createAnEmptyOrder = async (userId) => {
  const path = `/users/${userId}/orders`
  try {
    const response = await postData(path, {
      order: {
        user_id: userId,
      },
    })
    console.log(response)
  } catch (e) {
    console.error(e)
  } finally {
    getOrders(userId)
  }
}

const destroyOrder = async (orderId, userId) => {
  const path = `/users/${userId}/orders/${orderId}`
  try {
    await deleteData(path)
  } catch (e) {
    console.error(`Ошибка при удалении заказа: ${e}`)
  } finally {
    getOrders(userId)
  }
}

const getOrders = async (userId, queryParams = {}) => {
  try {
    const path = userId ? `/users/${userId}/orders` : 'orders'
    const response = await getData(path, queryParams)
    rows.value = response.data?.data || response.data

    if (response.current_page && response.last_page) {
      pagination.value.currentPage = response.current_page
      pagination.value.lastPage = response.last_page
    }

    emit('success')
  } catch (e) {
    console.error(e)
  }
}

const updateColumns = (userId) => {
  columns.value = [...ordersColumns]
  if (userId) {
    columns.value.push({
      name: 'destroy',
      label: 'удалить',
      align: 'right',
      field: 'destroy',
    })
  }
}

watch(
  () => props.userId,
  (userId) => {
    getOrders(userId)
    updateColumns(userId)
  },
  { immediate: true },
)

const tablePagination = ref({
  page: 1,
  rowsPerPage: 100,
})
</script>
<style lang="css"></style>
