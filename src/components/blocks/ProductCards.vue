<template>
  <div>
    <!-- Сетка карточек продуктов -->
    <div v-if="rows.length" class="product-grid">
      <q-card v-for="product in rows" :key="product.id" class="custom-rounded shadow-sm" flat>
        <q-img
          :src="getImageUrl(product.preview_image)"
          width="100%"
          height="200px"
          class="rounded-borders"
        />

        <q-card-section>
          <!-- Название продукта -->
          <div class="text-h6">{{ product.title }}</div>
          <!-- Издатель -->
          <div class="text-subtitle2">{{ product.publisher }}</div>

          <!-- Цена и количество -->
          <div class="q-mt-md">
            <div class="text-subtitle1">Цена: {{ product.price }} ₽</div>
            <div class="text-subtitle2">Количество: {{ product.amount }}</div>
          </div>
        </q-card-section>

        <q-card-actions align="center">
          <!-- Кнопка для просмотра товара -->
          <div class="row justify-between full-width">
            <q-btn
              flat
              rounded
              icon="visibility"
              @click="viewProduct(product.id)"
              label="Посмотреть"
              no-caps
            />
            <!-- Кнопка добавления в корзину -->
            <q-btn
              v-if="!isInCart(product.id)"
              @click="addSelectedProduct(product)"
              color="primary"
              flat
              rounded
              icon="shopping_cart"
              no-caps
            >
              <q-tooltip v-if="isInCart(product.id)">В корзине</q-tooltip>
            </q-btn>
            <q-btn
              v-if="isInCart(product.id)"
              @click="removeProductFromCart(product.id)"
              color="negative"
              icon="remove_shopping_cart"
              flat
              rounded
              no-caps
            >
            </q-btn>
          </div>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { getData } from 'src/utils/http/get'
import { getImageUrl } from 'src/utils/getImageUrl'
import { useCartStore } from 'src/stores/cartStore'

const emit = defineEmits(['addSelectedProduct'])

const cartStore = useCartStore()

const cartProducts = computed(() => cartStore.cartProducts)

const router = useRouter()

const rows = ref([])

const getProducts = async (path) => {
  try {
    const response = await getData(path)
    rows.value = response
  } catch (e) {
    console.error(e)
  }
}

const addSelectedProduct = (product) => {
  emit('addSelectedProduct', product)
}

const viewProduct = (productId) => {
  router.push({ name: 'product.show', params: { productId } })
}

const isInCart = (productId) => {
  if (cartProducts.value) {
    return cartProducts.value.some((p) => p.id === productId)
  }
}

const removeProductFromCart = (productId) => {
  cartStore.removeProductFromCart(cartStore.cartDetails.id, productId)
}

onMounted(() => {
  getProducts('products')
})
</script>

<style lang="css" scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}

.custom-rounded {
  border-radius: 16px;
}

.q-card {
  transition: transform 0.3s;
}

.q-card:hover {
  transform: scale(1.02);
}
</style>
