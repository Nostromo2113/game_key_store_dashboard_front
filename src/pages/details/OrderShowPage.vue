<template lang="">
  <div class="q-pa-md">
    <q-card class="my-card q-mb-md custom-rounded" flat>
      <q-item class="bg-primary text-white">
        <q-item-section avatar>
          <q-avatar size="50px">
            <img :src="getImageUrl(user.avatar)" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-white">{{ user.email }}</q-item-label>
          <q-item-label caption class="text-white"> Администратор </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator></q-separator>

      <q-card-section horizontal>
        <q-card-section class="col q-pa-md column">
          <q-card class="q-px-md q-py-sm custom-rounded" flat bordered>
            <div class="text-subtitle2 q-mb-sm">Данные о пользователе:</div>
            <div class="grid-container">
              <div>ФИО:</div>
              <div class="row">
                <span class="text-grey"
                  >{{ user.surname }} {{ user.name }} {{ user.patronymic }}</span
                >
              </div>
              <div>Email:</div>
              <div class="row">
                <span class="text-grey">{{ user.email }}</span>
              </div>
              <div>Телефон:</div>
              <div class="row">
                <span class="text-grey">+79999999999</span>
              </div>
              <div>Адрес:</div>
              <div class="row">
                <span class="text-grey">{{ user.address }}</span>
              </div>
            </div>
          </q-card>
        </q-card-section>

        <q-card-section class="col q-pa-md column">
          <q-card class="q-px-md q-py-sm custom-rounded" flat bordered>
            <div class="text-subtitle2 q-mb-sm">Данные о заказе:</div>
            <div class="grid-container">
              <div>Игры:</div>
              <div class="row">
                <span class="text-grey">{{ orderProducts.length }}</span>
              </div>
              <div>Копий:</div>
              <div class="row">
                <span class="text-grey">{{ totalAmount }}</span>
              </div>
              <div>Сумма:</div>
              <div class="row">
                <span class="text-grey">{{ totalPrice }} ₽</span>
              </div>
              <div>Оплачен:</div>
              <div class="row">
                <span class="text-grey"> Нет </span>
              </div>
            </div>
          </q-card>
        </q-card-section>
      </q-card-section>
    </q-card>

    <q-card flat class="custom-rounded">
      <q-toolbar>
        <q-toolbar-title> Настройка заказа </q-toolbar-title>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab name="orderProducts" label="Продукты в заказе"></q-tab>
          <q-tab name="products" label="Все продукты"></q-tab>
        </q-tabs>
      </q-toolbar>
      <q-tab-panels v-model="tab" animated keep-alive>
        <q-tab-panel name="orderProducts">
          <OrderProductsTable
            @removeFromOrder="removeFromOrder"
            :tableData="orderProducts"
            :status="status"
          />
        </q-tab-panel>
        <q-tab-panel name="products">
          <ProductTable checkboxes @addSelectedProducts="addSelectedProducts" />
        </q-tab-panel>
      </q-tab-panels>
      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          @click="applyChanges(orderProducts)"
          label="Применить"
          color="primary"
          unelevated
          no-caps
        ></q-btn>
        <q-btn
          @click="getOrderProducts(orderPath, orderId)"
          label="Отменить"
          color="warning"
          unelevated
          no-caps
        ></q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>
<script setup>
import OrderProductsTable from 'src/components/tables/OrderProductsTable.vue'
import ProductTable from 'src/components/tables/ProductTable.vue'
import { getData } from 'src/utils/http/get'
import { getImageUrl } from 'src/utils/getImageUrl'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { patchData } from 'src/utils/http/patch'

const tab = ref('orderProducts')

const route = useRoute()
const orderId = route.params.orderId

const orderPath = 'orders'

const orderProducts = ref([])
const user = ref({})
const totalPrice = ref(0)
const totalAmount = ref(0)

const status = ref('')

const applyChanges = async (products) => {
  const applyProducts = products.map((product) => {
    return {
      id: product.id,
      quantity: product.quantity,
      activation_key_id: product.activation_key_id || null,
    }
  })
  const path = `orders/${orderId}`
  try {
    const response = await patchData(path, { order_products: applyProducts })
    orderProducts.value = response.data.order.products.map((product) => ({
      ...product,
      quantity: product.activation_keys.length,
    }))
    console.log(orderProducts.value)
  } catch (e) {
    console.error('Ошибка при отправке данных:', e)
  }
}

const getOrderProducts = async (orderPath, orderId) => {
  try {
    const response = await getData(orderPath, orderId)
    status.value = response.status
    orderProducts.value = response.products.map((product) => ({
      ...product,
      quantity: product?.activation_keys ? product.activation_keys.length : product.quantity,
    }))
    user.value = response.user
    if (status.value !== 'completed') {
      totalPrice.value = calcTotalPrice(orderProducts.value)
      totalAmount.value = calcTotalAmount(orderProducts.value)
    }
  } catch (e) {
    console.error(e)
  }
}

const removeFromOrder = (id) => {
  orderProducts.value = orderProducts.value.filter((product) => product.id !== id)
  console.log(id, orderProducts.value)
}

const calcTotalPrice = (products) => {
  let totalPrice = 0
  products.forEach((el) => {
    totalPrice += el.price * el.activation_keys.length
  })
  return totalPrice
}

const calcTotalAmount = (products) => {
  let totalAmount = 0
  products.forEach((el) => {
    totalAmount += el.activation_keys.length
  })
  return totalAmount
}

getOrderProducts(orderPath, orderId)

const addSelectedProducts = (selectedProducts) => {
  selectedProducts.forEach((selectedProduct) => {
    const exists = orderProducts.value.some(
      (orderProduct) => orderProduct.id === selectedProduct.id,
    )
    if (!exists) {
      orderProducts.value.push(selectedProduct)
    }
  })
  tab.value = 'orderProducts'
}
</script>

<style lang="css">
.grid-container {
  display: grid;
  grid-template-columns: 75px 1fr;
  align-items: center;
}
</style>
