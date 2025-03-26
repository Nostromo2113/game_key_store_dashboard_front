<template lang="">
  <div>
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
                <span class="bg-indigo-2 q-px-sm rounded-borders"
                  >{{ user.surname }} {{ user.name }} {{ user.patronymic }}</span
                >
              </div>
              <div>Email:</div>
              <div class="row">
                <span class="bg-indigo-2 q-px-sm rounded-borders">{{ user.email }}</span>
              </div>
              <div>Телефон:</div>
              <div class="row">
                <span class="bg-indigo-2 q-px-sm rounded-borders">+79999999999</span>
              </div>
              <div>Адрес:</div>
              <div class="row">
                <span class="bg-indigo-2 q-px-sm rounded-borders">{{ user.address }}</span>
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
                <span class="bg-indigo-2 q-px-sm rounded-borders">{{ orderProducts.length }}</span>
              </div>
              <div>Копий:</div>
              <div class="row">
                <span class="bg-indigo-2 q-px-sm rounded-borders">{{ totalAmount }}</span>
              </div>
              <div>Сумма:</div>
              <div class="row">
                <span class="bg-indigo-2 q-px-sm rounded-borders">{{ totalPrice }} ₽</span>
              </div>
              <div>Оплачен:</div>
              <div class="row">
                <span class="bg-indigo-2 q-px-sm rounded-borders">
                  {{ status === 'completed' ? 'Оплачен' : 'Ожидает оплаты' }}
                </span>
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
          @click="getOrder(orderId)"
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
import { onMounted, ref, defineEmits } from 'vue'
import { patchData } from 'src/utils/http/patch'
import notify from 'src/plugins/notify'

const emit = defineEmits(['success'])

const tab = ref('orderProducts')

const route = useRoute()
const orderId = route.params.orderId

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
    }
  })
  const path = `orders/${orderId}/products`
  const loading = notify.loading('Обработка')
  try {
    const response = await patchData(path, { order_products: applyProducts })
    orderProducts.value = response.data.order.order_products.map((product) => ({
      ...product,
      quantity: product.activation_keys.length,
    }))
    status.value = response.data.order.status
    calcTotalAmount(orderProducts.value)
    calcTotalPrice(orderProducts.value)
    notify.success('Успешно')
  } catch (e) {
    if (e.status == 500) {
      notify.error('Недостаточно ключей активации')
    } else {
      notify.error('Ошибка')
    }
  } finally {
    loading()
  }
}

const getOrder = async (orderId) => {
  const path = `orders/${orderId}`
  try {
    let response = await getData(path)
    response = response.data
    status.value = response.status
    orderProducts.value = response.order_products.map((product) => ({
      ...product,
      quantity: product?.activation_keys ? product.activation_keys.length : product.quantity,
    }))
    user.value = response.user

    calcTotalPrice(orderProducts.value)
    calcTotalAmount(orderProducts.value)

    emit('success')
  } catch (e) {
    console.error(e)
  } finally {
    console.log('final')
  }
}

const removeFromOrder = (id) => {
  orderProducts.value = orderProducts.value.filter((product) => product.id !== id)
  console.log(id, orderProducts.value)
}

const calcTotalPrice = (products) => {
  let resultPrice = 0
  products.forEach((el) => {
    resultPrice += el.price * el.activation_keys.length
  })
  totalPrice.value = resultPrice
}

const calcTotalAmount = (products) => {
  let resultAmount = 0
  products.forEach((el) => {
    resultAmount += el.activation_keys.length
  })
  totalAmount.value = resultAmount
}

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

onMounted(() => {
  getOrder(orderId)
})
</script>

<style lang="css">
.grid-container {
  display: grid;
  grid-template-columns: 75px 1fr;
  align-items: center;
  gap: 2px;
}
</style>
