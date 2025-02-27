<template>
  <div style="width: 1200px; margin: auto">
    <q-toolbar class="custom-rounded bg-white shadow-sm q-px-md q-my-md">
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
import { computed } from 'vue'
import { useUserStore } from 'src/stores/userStore'
import { useCartStore } from 'src/stores/cartStore'
import { useRoute } from 'vue-router'

const route = useRoute()

const userStore = useUserStore()
const cartStore = useCartStore()

const cartId = computed(() => userStore.user?.cart_id)

const cartLink = computed(() =>
  cartId.value ? { name: 'shop.cart', params: { cartId: cartId.value } } : { name: 'shop' },
)
</script>
