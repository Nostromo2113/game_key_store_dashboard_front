<template>
  <div>
    <q-table
      :rows="cartItems"
      :columns="cartProductsColumns"
      :pagination="pagination"
      row-key="title"
      flat
      dense
      class="q-pa-sm text-blue-grey-9 custom-rounded"
    >
      <template v-slot:top-left>
        <div class="text-h6 bg-primary text-white q-px-sm custom-rounded">Корзина</div>
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
            <QuantitySelector
              :quantity_cart="props.row.quantity_cart"
              :quantity_store="props.row.quantity_store"
              class="q-pl-xl"
              @increase="(quantity) => updateProductQuantity(props.row.id, quantity)"
              @decrease="(quantity) => updateProductQuantity(props.row.id, quantity)"
            />
          </q-td>
          <q-td key="destroy" :props="props">
            <q-btn
              @click="removeProductFromCart(props.row.id)"
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
  </div>
</template>

<script setup>
import { ref, defineProps, computed, watch } from 'vue'
import { cartProductsColumns } from 'src/constants/cartProductsColumns'
import { defineEmits } from 'vue'
import QuantitySelector from '../ui/QuantitySelector.vue'
import { getImageUrl } from 'src/utils/getImageUrl'
import { useCartStore } from 'src/stores/cartStore'

const emit = defineEmits(['cartReceived', 'updateQuantity'])

const cartStore = useCartStore()

const props = defineProps({
  cartId: {
    type: Number,
    required: true,
  },
})

const cartId = computed(() => props.cartId)

const cartItems = computed(() => cartStore.cartProducts)
const cartDetails = computed(() => cartStore.cartDetails)

const fetchCart = async (path, id) => {
  if (!id) {
    console.warn('Нет userId')
    return
  }
  try {
    await cartStore.fetchCart(id)
    emit('cartReceived', cartItems.value)
  } catch (error) {
    console.error('Ошибка загрузки корзины:', error)
    cartItems.value = []
  }
}

const updateProductQuantity = (productId, quantity) => {
  const productIndex = cartItems.value.findIndex((product) => product.id === productId)
  if (productIndex !== -1) {
    cartItems.value[productIndex].quantity = quantity
    emit('updateQuantity', cartItems.value[productIndex])
  }
}

const removeProductFromCart = async (productId) => {
  cartStore.removeProductFromCart(cartDetails.value.id, productId)
}

watch(
  () => cartId.value,
  (newValue) => {
    fetchCart('cart', newValue)
  },
  { immediate: true },
)

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
})
</script>

<style lang="css"></style>
