<template>
  <q-card flat class="custom-rounded shadow-sm">
    <q-card-section class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-card
          class="q-pa-md custom-rounded shadow-sm"
          flat
          @click="console.log(cartStore.cartDetails)"
        >
          <div class="text-h6 text-weight-medium q-mb-md text-accent">Изображение</div>
          <q-img
            :src="getImageUrl(productData.preview_image)"
            :ratio="16 / 9"
            class="custom-rounded shadow-3"
            transition="fade"
            v-if="productData.preview_image"
          />
          <div class="placeholder-image custom-rounded shadow-1" v-else>
            <q-icon name="image_not_supported" size="xl" color="grey-4" />
          </div>

          <div class="text-h6 text-weight-medium q-mt-lg text-accent">Данные в магазине</div>
          <q-list dense class="q-mt-sm info-list" flat>
            <q-item class="info-item">
              <q-item-section>
                <q-item-label class="text-grey-7">Цена</q-item-label>
              </q-item-section>
              <q-item-section side>
                <span class="text-h6 text-weight-bold text-primary">{{ productData.price }} ₽</span>
              </q-item-section>
            </q-item>
            <q-item class="info-item">
              <q-item-section>
                <q-item-label class="text-grey-7">Доступно копий</q-item-label>
              </q-item-section>
              <q-item-section side>
                <span class="text-h6 text-weight-bold">{{ productData.amount }}</span>
              </q-item-section>
            </q-item>
            <q-item class="info-item">
              <q-item-section>
                <q-item-label class="text-grey-7">Статус</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge
                  :color="productData.is_published ? 'positive' : 'orange'"
                  text-color="white"
                  class="status-badge"
                  :label="productData.is_published ? 'Опубликован' : 'Не опубликован'"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
        <q-card flat class="q-mt-md flex justify-center">
          <q-btn
            v-if="!isInCart(productId)"
            @click="storeProductToCart(cartId, productData)"
            color="warning"
            icon-right="shopping_cart"
            label="Добавить в корзину"
            size="18px"
            class="custom-rounded q-mx-auto"
            no-caps
          ></q-btn>
          <q-btn
            v-else
            @click="removeProductFromCart(productId, cartId)"
            color="positive"
            icon-right="remove_shopping_cart"
            label="Выложить"
            size="18px"
            class="custom-rounded q-mx-auto"
            no-caps
          >
          </q-btn>
        </q-card>
      </div>

      <!-- Main Section -->
      <div class="col-12 col-md-8">
        <q-card class="q-pa-md custom-rounded shadow-sm" flat>
          <div class="text-h5 text-weight-medium q-mb-md text-accent">Основные данные</div>

          <div class="info-grid q-gutter-y-md">
            <div class="info-block">
              <div class="text-caption text-grey-7">Название игры</div>
              <div class="text-h6 text-weight-medium">{{ productData.title }}</div>
            </div>

            <div class="info-block">
              <div class="text-caption text-grey-7">Издатель</div>
              <div class="text-h6 text-weight-medium">{{ productData.publisher }}</div>
            </div>

            <div class="info-block">
              <div class="text-caption text-grey-7">Дата выхода</div>
              <div class="text-h6 text-weight-medium">{{ productData.release_date }}</div>
            </div>

            <div class="info-block">
              <div class="text-caption text-grey-7">Категория</div>
              <div class="text-h6 text-weight-medium">{{ selectedCategory?.title }}</div>
            </div>

            <div class="info-block">
              <div class="text-caption text-grey-7">Жанры</div>
              <div class="genre-tags q-pt-xs">
                <q-chip
                  v-for="genre in selectedGenres"
                  :key="genre.id"
                  color="accent"
                  text-color="white"
                  class="shadow-1"
                >
                  {{ genre.title }}
                </q-chip>
              </div>
            </div>
          </div>

          <div class="text-h6 text-weight-medium q-mt-xl q-mb-sm text-accent">Описание</div>
          <q-card flat bordered class="q-pa-md description-card">
            <div v-html="productData.description" class="description-content"></div>
          </q-card>

          <TechnicalRequirements class="q-mt-xl" :data="technicalRequirements" view-mode />
          <ProductCommentsShop class="q-mt-xl" :productId="productId" />
        </q-card>
      </div>
    </q-card-section>
    <q-card-actions align="right" class="q-px-md q-pb-md">
      <q-btn label="Назад" color="primary" no-caps class="custom-rounded" @click="$router.back()" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted, defineEmits, computed } from 'vue'
import { getData } from 'src/utils/http/get'
import { getImageUrl } from 'src/utils/getImageUrl'
import { useCartStore } from 'src/stores/cartStore'
import TechnicalRequirements from '../blocks/TechnicalRequirements.vue'
import ProductCommentsShop from '../blocks/ProductCommentsShop.vue'
import notify from 'src/plugins/notify'

const cartStore = useCartStore()

const emit = defineEmits(['success'])

const route = useRoute()
const productId = route.params.productId

const productData = ref({})
const cartId = computed(() => cartStore.cartDetails.id)
const cartProducts = computed(() => cartStore.cartProducts)

const technicalRequirements = ref({})
const selectedGenres = ref([])
const selectedCategory = ref([])

const getProduct = async (productId) => {
  const path = `products/${productId}`
  try {
    const response = await getData(path)
    fillLocalProduct(response.data)
    emit('success')
  } catch (e) {
    console.error(e)
  }
}

const fillLocalProduct = (data) => {
  productData.value = data
  productData.value.amount = data.amount
  technicalRequirements.value = data.technical_requirements || {}
  selectedCategory.value = data.category || {}
  selectedGenres.value = data.genres || []
}

const storeProductToCart = async (cartId, data) => {
  const loading = notify.loading('Обработка')
  try {
    await cartStore.storeProductToCart(cartId, data)
    notify.success('Добавлено в корзину')
  } catch (e) {
    notify.error('Ошибка')
    console.error(e)
  } finally {
    loading()
  }
}

const removeProductFromCart = async (productId, cartId) => {
  const loading = notify.loading('Обработка')
  try {
    await cartStore.removeProductFromCart(cartId, productId)
    notify.success('Удалено из корзины')
  } catch (e) {
    console.error(e)
    notify.error('Ошибка')
  } finally {
    loading()
  }
}

const isInCart = (productId) => {
  if (cartProducts.value) {
    cartProducts.value.forEach((el) => {
      console.log(el.id === +productId)
    })
    return cartProducts.value.some((p) => p.id === +productId)
  }
}

onMounted(() => {
  if (productId) {
    getProduct(productId)
  }
})
</script>

<style scoped>
.placeholder-image {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.02);
}

.info-list .info-item {
  transition: all 0.3s ease;
  border-radius: 8px;
  padding: 8px 12px;
}

.info-list .info-item:hover {
  background: rgba(63, 81, 181, 0.05);
}

.status-badge {
  font-size: 0.8em;
  padding: 4px 8px;
  border-radius: 4px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.info-block {
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.info-block:hover {
  background: rgba(63, 81, 181, 0.05);
}

.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.description-card {
  background: rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
}

.description-card:hover {
  background: rgba(63, 81, 181, 0.05);
}

.description-content {
  line-height: 1.6;
}
</style>
