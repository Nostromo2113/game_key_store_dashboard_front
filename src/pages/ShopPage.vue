<template>
  <div v-if="!loading" class="q-py-md" style="width: 1200px; margin: auto">
    <q-toolbar class="custom-rounded bg-white shadow-sm q-px-md q-mb-md">
      <q-toolbar-title class="fit text-grey-8"
        ><q-icon name="sports_esports" style="font-size: 30px"></q-icon> Shop for administrator
      </q-toolbar-title>
      <q-input
        v-model="searchQuery"
        label="Search"
        dense
        debounce="300"
        class="q-mx-md"
        style="width: 400px"
        filled
        rounded
      />
      <q-btn v-if="!openCart" @click="openCart = true" flat icon="shopping_cart"
        ><q-badge floating color="info">{{ cartStore.cartProducts?.length }}</q-badge></q-btn
      >
      <q-btn v-else @click="openCart = false" flat icon="store" />
    </q-toolbar>
    <div>
      <ProductCards v-if="!openCart" @addSelectedProduct="addSelectedProduct" />
      <CartProductsTable
        v-if="openCart"
        @updateQuantity="(product) => console.log(product)"
        :cartId="cartId"
        class="shadow-sm custom-rounded"
      />
    </div>
  </div>
  <div v-if="loading" syle="full-width full-height bg-grey">
    <h1 class="q-mx-auto">Загрузка...</h1>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ProductCards from 'src/components/blocks/ProductCards.vue'
import CartProductsTable from 'src/components/tables/CartProductsTable.vue'
import { useUserStore } from 'src/stores/userStore'
import { useCartStore } from 'src/stores/cartStore'

const userStore = useUserStore()
const cartStore = useCartStore()
const cartId = computed(() => userStore.user?.cart_id)

const selectedProduct = ref()

const searchQuery = ref('')

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
