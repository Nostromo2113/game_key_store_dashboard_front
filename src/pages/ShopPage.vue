<template>
  <div v-if="!loading" class="q-py-md">
    <div>
      <ProductCards v-if="!openCart" @addSelectedProduct="addSelectedProduct" />
    </div>
  </div>
  <div v-if="loading" syle="full-width full-height bg-grey">
    <h1 class="q-mx-auto">Загрузка...</h1>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ProductCards from 'src/components/blocks/ProductCards.vue'
import { useUserStore } from 'src/stores/userStore'
import { useCartStore } from 'src/stores/cartStore'

const userStore = useUserStore()
const cartStore = useCartStore()
const cartId = computed(() => userStore.user?.cart_id)

const selectedProduct = ref()

const openCart = ref(false)
const loading = ref(true)

const storeProductToCart = async (cartId) => {
  cartStore.storeProductToCart(cartId, selectedProduct.value)
}

const addSelectedProduct = (product) => {
  selectedProduct.value = product
  storeProductToCart(cartId.value)
}

const fetchCart = async (cartId) => {
  try {
    await cartStore.fetchCart(cartId)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
    console.log('ready', cartStore.cartProducts)
  }
}

watch(
  () => cartId.value,
  (newValue) => {
    fetchCart(newValue)
  },
  { immediate: true },
)
</script>

<style scoped></style>
