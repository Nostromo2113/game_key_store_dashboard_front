<template>
  <div>
    <q-table
      :rows="rows"
      :columns="columns"
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
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="user_id" :props="props">
            {{ props.row.user_id }}
          </q-td>
          <q-td key="status" :props="props">
            {{ props.row.status }}
          </q-td>
          <q-td key="total_price" :props="props">
            {{ props.row.total_price }}
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
            >Удалить заказ: <strong>{{ itemToRemove.id }}</strong
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
  </div>
</template>
<script setup>
import { ref, defineProps, watch, defineEmits } from 'vue'
import ConfirmationCard from '../ui/ConfirmationCard.vue'
import { ordersColumns } from 'src/constants/ordersColumns'
import { getData } from 'src/utils/http/get'
import { useRouter } from 'vue-router'
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

const navigateToOrder = (orderId, userId) => {
  if (!props.shopPage) {
    router.push({
      name: props.userPage ? 'user.order.show' : 'order.show',
      params: { orderId, userId },
    })
  } else {
    router.push({
      name: 'shop.order',
      params: { orderId },
    })
  }
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
    const response = await deleteData(path)
    console.log(response)
  } catch (e) {
    console.error(`Ошибка при удалении заказа: ${e}`)
  } finally {
    getOrders(userId)
  }
}

const addModal = ref(false)
const modalRemove = ref(false)
const itemToRemove = ref({})
const rows = ref(props.rowsData ?? [])

const getOrders = async (userId) => {
  try {
    const path = userId ? `/users/${userId}/orders` : 'orders'
    console.log('path', path)
    const response = await getData(path)
    rows.value = response
    emit('success')
  } catch (e) {
    console.error(e)
  }
}

watch(
  () => props.userId,
  (userId) => {
    getOrders(userId)

    columns.value = [...ordersColumns]

    if (userId) {
      columns.value.push({
        name: 'destroy',
        label: 'удалить',
        align: 'right',
        field: 'destroy',
      })
    }
  },
  { immediate: true },
)
</script>
<style lang="css"></style>
