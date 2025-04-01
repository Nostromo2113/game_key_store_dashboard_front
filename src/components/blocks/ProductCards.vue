<template>
  <div>
    <q-btn-dropdown icon="filter_list" unelevated class="custom-rounded q-mb-md" label="Фильтры">
      <FilterGroup @getQueryData="getQueryProducts" />
    </q-btn-dropdown>

    <div v-if="rows.length" class="product-grid">
      <q-card
        v-for="product in rows"
        :key="product.id"
        class="flex justify-between gap-sm custom-rounded shadow-sm"
        style="width: 284px"
        flat
      >
        <q-img
          :src="getImageUrl(product.preview_image)"
          width="100%"
          height="200px"
          class="rounded-borders"
        />

        <q-card-section class="q-py-sm q-px-md full-width">
          <div class="text-h6">{{ product.title }}</div>

          <div class="text-subtitle2">{{ product.publisher }}</div>

          <div>
            <div class="text-subtitle1">Цена: {{ product.price }} ₽</div>
            <div class="text-subtitle2">Количество: {{ product.amount }}</div>
          </div>
        </q-card-section>
        <q-card-section class="q-py-none">
          <div class="q-px-sm bg-primary text-white custom-rounded text-caption">
            {{ product.category.title }}
          </div>
        </q-card-section>
        <q-card-actions align="center" class="full-width">
          <div class="row justify-between full-width">
            <q-btn
              flat
              rounded
              icon="visibility"
              @click="viewProduct(product.id)"
              label="Посмотреть"
              no-caps
            />

            <q-btn
              v-if="!isInCart(product.id)"
              @click="storeProductToCart(cartId, product)"
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
    <div v-if="hasMore" class="full-width flex justify-center">
      <q-btn @click="showMore" class="q-my-xl custom-rounded" color="info" :disable="!hasMore">
        Показать еще
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import FilterGroup from './FilterGroup.vue'
import { onMounted, ref, computed, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { getData } from 'src/utils/http/get'
import { getImageUrl } from 'src/utils/getImageUrl'
import { useCartStore } from 'src/stores/cartStore'
import notify from 'src/plugins/notify'

const emit = defineEmits(['success'])

const cartStore = useCartStore()
const cartId = computed(() => cartStore.cartDetails.id)

const cartProducts = computed(() => cartStore.cartProducts)

const router = useRouter()

const rows = ref([])

const page = ref(1)
const hasMore = ref(true)

const getQueryProducts = async (queryParams = {}) => {
  const path = 'products'
  const params = {
    ...queryParams,
  }
  if (queryParams.page) {
    params.page = queryParams.page
  }
  try {
    const response = await getData(path, params)
    console.log(response)
    rows.value = response.data

    page.value = response.meta.current_page

    existNextPage(response.meta.current_page, response.meta.last_page)

    emit('success')
  } catch (e) {
    console.error(e)
  }
}

const showMore = async () => {
  const params = {
    page: page.value + 1,
  }
  try {
    const response = await getData('products', params)
    if (response.data.length > 0) {
      rows.value.push(...response.data)
    }
    existNextPage(response.meta.current_page, response.meta.last_page)
    page.value = response.meta.current_page
  } catch (e) {
    console.error('Ошибка при запросе новых продуктов', e)
    page.value -= 1
  }
}

const existNextPage = (currentPage, lastPage) => {
  if (currentPage >= lastPage) {
    hasMore.value = false
  } else {
    hasMore.value = true
  }
}

const storeProductToCart = async (cartId, product) => {
  const loading = notify.loading('Обработка')
  try {
    await cartStore.storeProductToCart(cartId, product)
    notify.success('Добавлено в корзину')
  } catch (e) {
    console.error(e)
    notify.error('Ошибка')
  } finally {
    loading()
  }
}

const viewProduct = (productId) => {
  router.push({ name: 'shop.product', params: { productId } })
}

const isInCart = (productId) => {
  if (cartProducts.value) {
    return cartProducts.value.some((p) => p.id === productId)
  }
}

const removeProductFromCart = async (productId) => {
  const loading = notify.loading('Обработка')
  try {
    await cartStore.removeProductFromCart(cartStore.cartDetails.id, productId)
    notify.success('Удалено из корзины')
  } catch (e) {
    console.error(e)
    notify.error('Ошибка')
  } finally {
    loading()
  }
}

onMounted(() => {
  getQueryProducts()
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
