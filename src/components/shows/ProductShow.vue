<template>
  <div class="grid-container">
    <q-card flat class="custom-rounded shadow-sm">
      <q-card-section class="grid-section">
        <div class="preview-section">
          <div class="text-subtitle1 q-mb-sm">Превью изображение</div>
          <ImageUpload
            :imageLink="productData.preview_image"
            @onFileChange="onFileChange"
            width="370px"
            height="250px"
          />
          <div class="column" style="max-width: 370px">
            <div class="text-subtitle1 q-mt-md">Данные в магазине</div>
            <div class="q-gutter-md col row q-mb-md">
              <q-input
                v-model="productData.price"
                placeholder="Цена"
                type="number"
                label="Цена в ₽"
                outlined
                dense
                class="col"
              />
              <q-input
                v-model="productData.amount"
                outlined
                readonly
                placeholder="Не редактируется"
                dense
                class="col"
              />
            </div>
          </div>
          <div class="q-mt-md">
            <div class="text-subtitle1 q-mb-sm">Опубликовать?</div>
            <div class="row justify-start full-width gap-sm">
              <q-radio v-model="productData.is_published" :val="1" label="Опубликовть"></q-radio>
              <q-radio v-model="productData.is_published" :val="0" label="Не публиковать"></q-radio>
            </div>
          </div>
        </div>
        <div class="main-section">
          <div class="text-subtitle1 q-mb-sm">Основные данные по продукту</div>
          <div class="q-gutter-md row q-mb-md">
            <q-input
              v-model="productData.title"
              placeholder="Введите название игры"
              label="Название игры"
              outlined
              dense
              class="col"
            />
          </div>
          <div class="q-gutter-md row q-mb-md">
            <q-input
              v-model="productData.publisher"
              placeholder="Укажите издателя игры"
              label="Организация выпустившая игру"
              outlined
              dense
              class="col"
            />
            <InputCalendar v-model="productData.release_date" placeholder="Выберите дату" />
          </div>
          <div class="text-subtitle1 q-mb-sm">Теги продукта</div>
          <div class="q-gutter-md col row q-mb-md">
            <q-select
              v-model="selectedCategory"
              :options="categoriesOptions"
              option-value="id"
              option-label="title"
              label="Выберите категорию"
              outlined
              dense
              class="col"
            />
            <q-select
              v-model="selectedGenres"
              :options="genresOptions"
              option-value="id"
              option-label="title"
              multiple
              label="Выберите жанры"
              outlined
              dense
              class="col"
            />
          </div>
          <div class="text-subtitle1 q-mb-sm">Описание</div>
          <div class="q-gutter-md row">
            <q-editor v-model="productData.description" class="col" min-height="7rem"></q-editor>
          </div>
          <TechnicalForm class="q-mt-xl" :data="technicalRequirements" />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <div class="q-gutter-md">
          <q-btn
            v-if="productId"
            @click="updateProduct(productData, selectedFile, productId)"
            label="Применить"
            color="primary"
            unelevated
            no-caps
          ></q-btn>
          <q-btn
            v-else
            @click="storeProduct(productData, selectedFile)"
            label="Отправить"
            color="primary"
            unelevated
            no-caps
          ></q-btn>
          <q-btn
            @click="getProduct(productId)"
            label="Отменить"
            color="warning"
            unelevated
            no-caps
          ></q-btn>
          <q-btn
            @click="removeProduct(productId)"
            label="Удалить продукт"
            color="negative"
            unelevated
            no-caps
          ></q-btn>
        </div>
      </q-card-actions>
    </q-card>
  </div>
</template>
<script setup>
import TechnicalForm from 'src/components/forms/TechnicalForm.vue'
import InputCalendar from 'src/components/ui/InputCalendar.vue'
import ImageUpload from 'src/components/blocks/ImageUpload.vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { ref, onMounted, defineEmits } from 'vue'
import { getData } from 'src/utils/http/get'
import { patchData } from 'src/utils/http/patch'
import { deleteData } from 'src/utils/http/delete'
import { postData } from 'src/utils/http/post'
import notify from 'src/plugins/notify'

const route = useRoute()
const productId = route.params.productId
const router = useRouter()
const emit = defineEmits(['getProductId', 'success'])

const productData = ref({
  title: '',
  publisher: '',
  release_date: '',
  description: 'Придумайте описание для игры',
  price: '',
  amount: '',
  is_published: 0,
})

const technicalRequirements = ref({
  platform: '',
  os: '',
  cpu: '',
  gpu: '',
  ram: '',
  storage: '',
})

const selectedFile = ref()
const genresOptions = ref([])
const categoriesOptions = ref([])
const selectedGenres = ref([])
const selectedCategory = ref([])

const getProduct = async (productId) => {
  const path = `products/${productId}`
  try {
    const response = await getData(path)
    fillLocalProduct(response.data)
    emit('getProductId', productData.value.id)
    emit('success')
  } catch (e) {
    console.error(e)
  }
}

const getGenres = async () => {
  try {
    const response = await getData('genres')
    genresOptions.value = response
  } catch (e) {
    console.error(e)
  }
}

const getCategories = async () => {
  try {
    const response = await getData('categories')
    categoriesOptions.value = response
  } catch (e) {
    console.error(e)
  }
}

const updateProduct = async (productData, selectedFile, productId) => {
  const path = `products/${productId}`
  const loading = notify.loading('Обработка')
  try {
    const data = prepareProductData(productData, selectedFile)
    const response = await patchData(path, data)
    fillLocalProduct(response.data.data)
    notify.success('Успешно')
  } catch (e) {
    console.error(e)
    getProduct(productId)
    notify.error('Ошибка')
  } finally {
    loading()
  }
}

const storeProduct = async (product, selectedFile) => {
  const path = 'products'
  const loading = notify.loading('Обработка')
  try {
    const data = prepareProductData(product, selectedFile)
    await postData(path, data)
    notify.success('Успешно')
    router.push({ name: 'products' })
  } catch (e) {
    console.error(e)
    notify.error('Ошибка')
  } finally {
    loading()
  }
}

const removeProduct = async (productId) => {
  const path = `products/${productId}`
  try {
    await deleteData(path)
    router.push({ name: 'products' })
  } catch (e) {
    console.error(e)
    getProduct(productId)
  }
}

const fillLocalProduct = (data) => {
  productData.value = data
  productData.value.amount = data.amount
  technicalRequirements.value = data.technical_requirements
  selectedCategory.value = data.category
  selectedGenres.value = data.genres
}

const prepareProductData = (product, selectedFile) => {
  const data = {
    product: {
      ...product,
    },
  }
  delete data.product.activation_keys
  data.product.category = selectedCategory.value.id
  data.product.genres = selectedGenres.value.map((genre) => genre.id)
  if (selectedFile) {
    data.product.file = selectedFile
  }
  data.product.technical_requirements = technicalRequirements.value
  return data
}

const onFileChange = (file) => {
  selectedFile.value = file
}

onMounted(() => {
  getGenres()
  getCategories()
  if (productId) {
    getProduct(productId)
  }
})
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.grid-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.preview-section {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-section {
  grid-column: 1 / -1;
}

@media (min-width: 1200px) {
  .grid-section {
    grid-template-columns: 1fr 3fr;
  }

  .preview-section {
    grid-column: 1 / 2;
    align-items: start;
  }

  .main-section {
    grid-column: 2 / 3;
  }
}
</style>
