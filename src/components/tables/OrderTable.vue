<template>
  <div>
    <q-table
      :rows="rows"
      :columns="ordersColumns"
      row-key="title"
      dense
      flat
      class="custom-rounded q-pa-md text-blue-grey-9"
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
          <q-td key="show" :props="props">
            <q-btn
              @click="navigateToOrder(props.row.id, props.row.userId)"
              flat
              :to="routePushParams"
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
            >Удалить категорию: <strong>{{ itemToRemove.title }}</strong
            >?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Нет" color="primary" v-close-popup></q-btn>
          <q-btn
            @click="destroy(itemToRemove)"
            flat
            label="Да"
            color="negative"
            v-close-popup
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addModal" persistent>
      <ConfirmationCard itemTitle="Создать заказ" destroy @confirm="store" />
    </q-dialog>
  </div>
</template>
<script setup>
import { ref, defineProps, watch, onMounted } from 'vue'
import ConfirmationCard from '../ui/ConfirmationCard.vue'
import { ordersColumns } from 'src/constants/ordersColumns'
import { getData } from 'src/utils/http/get'
import { useRouter } from 'vue-router'
const router = useRouter()
const path = 'orders'

const props = defineProps({
  rowsData: {
    type: Array,
    default: () => [],
  },
  userPage: {
    type: Boolean,
    default: false,
  },
})

const routePushParams = ref({
  name: props.user ? 'user.order.show' : 'order.show',
  params: { orderId: '', userId: '' },
})

const navigateToOrder = (orderId, userId) => {
  router.push({
    name: props.userPage ? 'user.order.show' : 'order.show',
    params: { orderId, userId },
  })
}

const addModal = ref(false)
const modalRemove = ref(false)
const itemToRemove = ref({})
const rows = ref(props.rowsData ?? [])

const getOrders = async (path) => {
  try {
    const response = await getData(path)
    rows.value = response
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  if (!rows.value.length) {
    getOrders(path)
  }
})

watch(
  () => props.rowsData,
  (newVal) => {
    rows.value = newVal
  },
  { immediate: true },
)
</script>
<style lang="css"></style>
