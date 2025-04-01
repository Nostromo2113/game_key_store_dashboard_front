<template>
  <div style="width: 1200px; max-width: 100vw; margin: auto">
    <q-toolbar class="custom-rounded bg-white shadow-sm q-px-md q-mt-md">
      <q-toolbar-title class="fit text-grey-8"
        ><q-icon name="sports_esports" style="font-size: 30px"></q-icon> Shop for administrator
      </q-toolbar-title>
      <RouterLink v-if="!route.params.cartId" :to="cartLink">
        <q-btn @click="openCart = true" flat icon="shopping_cart"
          ><q-badge floating color="info">{{ cartStore.cartProducts?.length }}</q-badge></q-btn
        >
      </RouterLink>
      <RouterLink v-else :to="{ name: 'shop' }">
        <q-btn flat icon="store" />
      </RouterLink>
      <RouterLink :to="{ name: 'shop.orders' }">
        <q-btn flat icon="receipt_long" no-caps>Заказы</q-btn></RouterLink
      >
    </q-toolbar>
    <RouterView></RouterView>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useCartStore } from 'src/stores/cartStore'
import { useRoute } from 'vue-router'
import { useUserStore } from 'src/stores/userStore'

const route = useRoute()

const cartStore = useCartStore()

const cartId = computed(() => cartStore.cartDetails.id)
const userId = computed(() => useUserStore.user?.id)

const cartLink = computed(() =>
  cartId.value ? { name: 'shop.cart', params: { cartId: cartId.value } } : { name: 'shop' },
)

const fetchCart = async (userId) => {
  try {
    await cartStore.fetchCart(userId)
  } catch (e) {
    console.error(e)
  } finally {
    console.log('ready', cartStore.cartProducts)
  }
}

watch(
  () => userId.value,
  (newValue) => {
    if (newValue) {
      fetchCart(newValue)
    }
  },
  { immediate: true },
)
</script>
