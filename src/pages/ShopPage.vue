<template>
  <div class="q-py-md" style="width: 1200px; margin: auto">
    <q-toolbar class="custom-rounded bg-white shadow-sm q-px-md q-mb-md">
      <!-- Левый блок с надписью "Store" -->
      <q-toolbar-title class="fit text-grey-8"
        ><q-icon name="sports_esports" style="font-size: 30px"></q-icon> Shop for administrator
      </q-toolbar-title>
      <!-- Центральная строка поиска -->
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

      <!-- Правая иконка корзины -->
      <q-btn v-if="!openCart" @click="openCart = true" flat icon="shopping_cart" />
      <q-btn v-else @click="openCart = false" flat icon="store" />
    </q-toolbar>
    <div class="q-pa-sm custom-border">тут отслеживаем</div>
    <div>
      <ProductCards v-if="!openCart" @addSelectedProduct="addSelectedProduct" />
      <CartProductsTable v-else :userId="userId" class="shadow-sm" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProductCards from 'src/components/blocks/ProductCards.vue'
import CartProductsTable from 'src/components/tables/CartProductsTable.vue'
import { useUserStore } from 'src/stores/userStore'

const userStore = useUserStore()
const userId = userStore.user.id

const selectedProduct = ref([])

const searchQuery = ref('')

const openCart = ref(false)

const addSelectedProduct = (product) => {
  selectedProduct.value.push(product)
}
</script>

<style scoped>
/* Можете добавить стили по вашему усмотрению */
</style>
