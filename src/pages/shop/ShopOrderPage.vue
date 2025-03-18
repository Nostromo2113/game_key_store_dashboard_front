<template>
  <div>
    <q-card class="q-my-md custom-rounded shadow-sm" flat>
      <q-item class="text-h6 q-px-md q-py-sm text-blue-grey-8">Детали заказа</q-item>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <div class="text-subtitle1">Статус:</div>
            <q-badge class="text-h6" :color="order.status === 'pending' ? 'orange' : 'green'">
              {{ order.status === 'pending' ? 'ожидает оплаты' : 'выполнен' }}
            </q-badge>
          </div>
          <div class="col-12 col-md-4">
            <div class="text-subtitle1">Номер заказа:</div>
            <div class="text-h6 text-info">{{ order.order_number }}</div>
          </div>

          <div class="col-12 col-md-4">
            <div class="text-subtitle1">Общая сумма:</div>
            <div class="text-h6 text-info">{{ totalPrice }} ₽</div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" v-if="order.status !== 'completed'">
        <q-btn @click="executeOrder(orderId)" color="primary" label="Оплатить" unelevated></q-btn>
      </q-card-actions>
    </q-card>

    <!-- Карточка с информацией о пользователе -->
    <q-card class="q-mb-md custom-rounded shadow-sm" flat>
      <q-item class="text-h6 q-px-md q-py-sm text-blue-grey-8">Информация о покупателе</q-item>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-md">
          <!-- Имя -->
          <div class="col-12 col-md-4">
            <div class="text-subtitle1">Имя:</div>
            <div class="text-h6 text-info">{{ order.user?.name }}</div>
          </div>

          <!-- Электронная почта -->
          <div class="col-12 col-md-4">
            <div class="text-subtitle1">Электронная почта:</div>
            <div class="text-h6 text-info">{{ order.user?.email }}</div>
          </div>

          <!-- Телефон -->
          <div class="col-12 col-md-4">
            <div class="text-subtitle1">Телефон:</div>
            <div class="text-h6 text-info">{{ order.user?.phone_number }}</div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Карточка с товарами -->
    <q-card class="shadow-sm custom-rounded" flat>
      <q-card-section>
        <div class="text-h6 q-mb-md">Товары в заказе ({{ order.order_products?.length }})</div>
        <OrderProductsTable :tableData="order.order_products" :shop="true" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getData } from 'src/utils/http/get'
import { patchData } from 'src/utils/http/patch'
import OrderProductsTable from 'src/components/tables/OrderProductsTable.vue'

const route = useRoute()
const orderId = route.params.orderId

const order = ref({})

const totalPrice = ref(0)

const getOrder = async (orderId) => {
  const path = `orders/${orderId}`
  try {
    const response = await getData(path)
    console.log('get order', response)
    order.value = response.data
    totalPrice.value = calculateTotalPrice(order.value.order_products)
  } catch (e) {
    console.error(e)
  }
}

const calculateTotalPrice = (products) => {
  let totalPrice = 0
  products.forEach((product) => {
    const price = product.price * product.activation_keys.length
    totalPrice += price
  })
  return totalPrice
}

const executeOrder = async (orderId) => {
  const path = `orders/${orderId}`

  try {
    const response = await patchData(path, {
      is_execute: true,
    })
    console.log('res', response)
    order.value = response.data.data
  } catch (e) {
    console.error(e)
  }
}

getOrder(orderId)
</script>

<style lang="scss" scoped></style>
