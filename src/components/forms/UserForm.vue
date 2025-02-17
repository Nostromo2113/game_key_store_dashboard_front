<template>
  <div>
    <q-card
      class="no-shadow rounded-borders q-pa-md q-mx-auto"
      style="width: 700px; max-width: 80vw"
    >
      <q-card-section class="row items-center q-pa-none q-pb-sm">
        <div class="text-h6 text-center">{{ title }}</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>
      <q-form @submit="submit" @reset="resetData" class="q-gutter-md" label="Добавить">
        <div>
          <q-input
            v-model="formData.surname"
            label="Фамилия"
            autofocus
            filled
            lazy-rules
            style="flex: 1"
            :rules="[(val) => (val && val.length > 0) || 'Поле обязательно для заполнения']"
          ></q-input>
          <q-input
            v-model="formData.name"
            label="Имя"
            filled
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Поле обязательно для заполнения']"
            style="flex: 1"
          ></q-input>
          <q-input
            filled
            v-model="formData.patronymic"
            label="Отчество"
            autofocus
            style="flex: 1"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Поле обязательно для заполнения']"
          ></q-input>
          <q-input
            filled
            v-model="formData.email"
            label="Email"
            autofocus
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Поле обязательно для заполнения']"
            style="flex: 1"
          ></q-input>
          <q-input
            filled
            v-model="formData.address"
            label="Адрес"
            autofocus
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Поле обязательно для заполнения']"
            style="flex: 1"
          ></q-input>
        </div>
        <div class="row items-center justify-between gap-10">
          <q-input
            filled
            type="number"
            v-model="formData.age"
            label="Возраст"
            style="flex: 1"
            lazy-rules
            :rules="[(val) => (val != '' && val != null) || 'Поле обязательно для заполнения']"
          ></q-input>

          <q-select
            v-model="formData.gender"
            :options="options"
            filled
            label="Пол"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Поле обязательно для заполнения']"
            style="flex: 1"
          ></q-select>
        </div>
        <span v-if="operation === 'store'"
          >Пользователю будет отправлено письмо с паролем и ссылкой для верификации</span
        >
        <q-separator></q-separator>
        <q-toggle
          v-model="accept"
          label="Подтверждаю добавление в базу данных"
          checked-icon="check"
          color="green"
          unchecked-icon="clear"
        ></q-toggle>

        <div>
          <q-btn label="Отправить" type="submit" color="primary"></q-btn>
          <q-btn
            v-if="operation === 'store'"
            label="Очистить"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          ></q-btn>
        </div>
        <div style="width: 42px">
          <q-spinner v-if="storePreloader" color="primary" size="3em"></q-spinner>
        </div>
      </q-form>
    </q-card>
  </div>
</template>
<script setup>
import { defineEmits, defineProps, onMounted } from 'vue'

const emit = defineEmits(['storeItem', 'updateItem'])

const props = defineProps({
  title: {
    type: String,
  },
  preloader: {
    type: Boolean,
  },
  data: {
    type: Object,
  },
  operation: {
    type: String,
    default: 'store',
  },
})

const data = props.data

const options = ['Мужской', 'Женский']

import { ref, watch } from 'vue'
const formData = ref({
  email: '',
  name: '',
  surname: '',
  patronymic: '',
  age: null,
  gender: '',
  address: '',
  password_confirmation: '',
})

const getData = (data) => {
  if (data) {
    formData.value = data
    console.log(data)
  }
}

onMounted(() => {
  getData(data)
})
const accept = ref(false)

const storePreloader = ref(false)
const submit = async () => {
  const data = {
    email: formData.value.email,
    name: formData.value.name,
    surname: formData.value.surname,
    patronymic: formData.value.patronymic,
    age: formData.value.age,
    gender: formData.value.gender === 'Мужской' ? 1 : 2,
    address: formData.value.address,
  }
  if (accept.value) {
    props.operation === 'store'
      ? emit('storeItem', { ...data })
      : emit('updateItem', Object.assign(data, { id: props.data.id }))
    accept.value = false
    !props.operation ? resetData() : null
  } else {
    console.warn('Подтвердите добавление в БД')
  }
}

const resetData = () => {
  formData.value.name = ''
  formData.value.email = ''
  formData.value.surname = ''
  formData.value.patronymic = ''
  ;(formData.value.age = null),
    (formData.value.gender = ''),
    (formData.value.address = ''),
    (formData.value.password = ''),
    (formData.value.password_confirmation = ''),
    (accept.value = false)
}

watch(
  () => props.preloader,
  (newVal) => {
    storePreloader.value = newVal
  },
)
</script>
<style></style>
