<template>
  <div>
    <q-form @submit="getQueryData" @reset="clearQueryData">
      <q-list class="q-pt-sm">
        <q-item>
          <q-item-section>
            <q-input
              v-model="queryParams.title"
              bg-color="white"
              placeholder="Поиск..."
              dense
              outlined
              style="width: 200px"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-select
              v-model="queryParams.category"
              :options="categoriesOptions"
              option-value="id"
              option-label="title"
              label="Категория"
              outlined
              dense
              style="width: 200px"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="row items-start custom-border q-px-md rounded-borders">
            <q-checkbox left-label v-model="queryParams.is_published" label="Опубликованные" />
          </q-item-section>
        </q-item>
        <q-item class="row gap-md">
          <q-btn type="submit" icon="search" dense no-caps class="col" flat />
          <q-btn type="reset" icon="close" dense no-caps class="col" flat />
        </q-item>
      </q-list>
    </q-form>
  </div>
</template>
<script setup>
import { ref, defineEmits } from 'vue'
import { getData } from 'src/utils/http/get'

const emit = defineEmits(['getQueryData'])

const queryParams = ref({
  title: '',
  category: null,
  is_published: true,
})

const categoriesOptions = ref([])

const getQueryData = () => {
  const data = {
    title: queryParams.value?.title,
    category_id: queryParams.value.category?.id,
    is_published: queryParams.value.is_published ? 1 : 0,
  }
  emit('getQueryData', data)
}

const clearQueryData = () => {
  queryParams.value.title = ''
  queryParams.value.category = null
  queryParams.value.is_published = true
  getQueryData()
}

const getCategories = async () => {
  try {
    const response = await getData('categories')
    categoriesOptions.value = response
    console.log(categoriesOptions.value)
  } catch (e) {
    console.error(e)
  }
}

getCategories()
</script>
<style lang=""></style>
