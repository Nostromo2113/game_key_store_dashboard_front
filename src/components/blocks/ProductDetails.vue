<template>
  <div>
    <q-card flat class="custom-rounded shadow-sm">
      <q-card-section horizontal vertical>
        <q-card-section class="col-3">
          <div style="max-width: 370px">
            <div class="text-subtitle1 q-mb-sm">Превью изображение</div>
            <ImageUpload
              :imageLink="productData.preview_image"
              @onFileChange="onFileChange"
              width="370px"
              height="250px"
            />
            <div class="column">
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
                <q-radio
                  v-model="productData.is_published"
                  :val="0"
                  label="Не публиковать"
                ></q-radio>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section class="col-9">
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
        </q-card-section>
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
import { patchFormData } from 'src/utils/http/patchFormData'
import { patchData } from 'src/utils/http/patch'
import { deleteData } from 'src/utils/http/delete'
import { postData } from 'src/utils/http/post'

const route = useRoute()
const productId = route.params.productId
const router = useRouter()

const emit = defineEmits(['getProductId'])

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
    console.log(response)
    productData.value = response
    productData.value.amount = response.activation_keys.length
    technicalRequirements.value = response.technical_requirements

    selectedCategory.value = response.category
    selectedGenres.value = response.genres

    emit('getProductId', productData.value.id)
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
  try {
    const data = prepareProductData(productData, selectedFile)
    if (selectedFile) {
      await patchFormData(path, data)
    } else {
      await patchData(path, data)
    }
  } catch (e) {
    console.error(e)
  } finally {
    getProduct(productId)
  }
}

const storeProduct = async (product, selectedFile) => {
  const path = 'products'
  try {
    const data = prepareProductData(product, selectedFile)
    await postData(path, data)
    router.push({ name: 'products' })
  } catch (e) {
    console.error(e)
  }
}

const prepareProductData = (product, selectedFile) => {
  const data = { ...product }
  delete data.activation_keys

  data.category = selectedCategory.value.id
  data.genres = selectedGenres.value.map((genre) => genre.id)

  if (selectedFile) {
    data.file = selectedFile
  }
  data.technical_requirements = technicalRequirements.value

  return data
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

const onFileChange = (file) => {
  selectedFile.value = file
  console.log('selected', file)
}

onMounted(() => {
  getGenres()
  getCategories()
  if (productId) {
    getProduct(productId)
  }
})
</script>
<style lang=""></style>
