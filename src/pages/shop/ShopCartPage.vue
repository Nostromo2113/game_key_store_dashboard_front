<template>
  <div>
    <q-card
      class="my-card custom-rounded shadow-sm q-mt-md"
      flat
      @click="console.log(cartDetails, cartItems)"
    >
      <q-card-section>
        <div class="text-h6 text-grey">Вы можете оформить заказ:</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <div class="text-subtitle1">Количество товаров:</div>
            <div class="text-h5 text-info">{{ cartItems.length }}</div>
          </div>
          <div class="col-6">
            <div class="text-subtitle1">Товаров на сумму:</div>
            <div class="text-h5 text-info">{{ cartDetails.total_price }} ₽</div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn @click="createOrder" color="warning" class="custom-rounded shadow-sm"
          >Оформить заказ</q-btn
        >
      </q-card-actions>
    </q-card>
    <CartProductsTable :cartId="cartId" shop class="shadow-sm custom-rounded" />
  </div>
</template>

<script setup>
import CartProductsTable from 'src/components/tables/CartProductsTable.vue'
import { computed } from 'vue'
import { useCartStore } from 'src/stores/cartStore'
import { postData } from 'src/utils/http/post'
import { useRouter } from 'vue-router'
import notify from 'src/plugins/notify'

const router = useRouter()

const cartStore = useCartStore()
const cartId = computed(() => cartStore.cartDetails?.id)

const cartItems = computed(() => cartStore.cartProducts || [])
const cartDetails = computed(() => cartStore.cartDetails || {})

const createOrder = async () => {
  const loading = notify.loading('Обработка')
  const data = generateData()
  // if (data.order.order_products.length < 1) {
  //   loading()
  //   notify.warning('Проверьте корзину')
  //   return
  // }

  try {
    const path = `users/${cartDetails.value.user_id}/orders`
    const response = await postData(path, data)
    cartStore.clearCart
    loading()
    notify.success('Успешно')
    router.push({ name: 'shop.order', params: { orderId: response.data.data.id } })
  } catch (e) {
    notify.error('Ошибка')
    console.error('При оформлении заказа произошла ошибка', e)
  } finally {
    loading()
  }
}

const generateData = () => {
  const data = {
    order: {
      user_id: cartDetails.value.user_id,
      order_products: cartItems.value.map((product) => ({
        id: product.id,
        quantity: product.quantity_cart <= product.quantity_store ? product.quantity_cart : 0,
      })),
    },
  }
  data.order.order_products = data.order.order_products.filter((product) => product.quantity != 0)
  return data
}
</script>

<style lang="scss" scoped>
.my-card {
  margin-bottom: 20px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.q-card-section {
  padding: 16px;
}

.q-separator {
  margin: 8px 0;
}
</style>
