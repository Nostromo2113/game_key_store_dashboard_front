<template>
  <div>
    <q-card
      class="no-shadow rounded-borders q-pa-md q-mx-auto text-center"
      style="width: 700px; max-width: 80vw"
    >
      <q-card-section class="row items-center q-pa-none q-pb-sm">
        <span class="text-h6 text-grey">Создать пользователя</span>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>

      <q-form @submit="submit" @reset="resetData" class="q-gutter-md">
        <div>
          <q-input
            v-model="formData.surname"
            label="Фамилия"
            filled
            lazy-rules
            :rules="requiredRule"
          ></q-input>
          <q-input
            v-model="formData.name"
            label="Имя"
            filled
            lazy-rules
            :rules="requiredRule"
          ></q-input>
          <q-input
            v-model="formData.patronymic"
            label="Отчество"
            filled
            lazy-rules
            :rules="requiredRule"
          ></q-input>
          <q-input
            v-model="formData.email"
            label="Email"
            filled
            lazy-rules
            :rules="requiredRule"
          ></q-input>
          <q-input
            v-model="formData.address"
            label="Адрес"
            filled
            lazy-rules
            :rules="requiredRule"
          ></q-input>
          <q-input
            v-model="formData.phone"
            label="Телефон"
            mask="+7 (###) ###-##-##"
            filled
            :rules="requiredRule"
          />
        </div>

        <div class="row items-center justify-between gap-md">
          <q-input
            v-model="formData.age"
            type="number"
            label="Возраст"
            filled
            style="flex: 1"
            lazy-rules
            :rules="requiredRule"
          ></q-input>
          <q-select
            v-model="formData.gender"
            :options="genderOptions"
            filled
            label="Пол"
            lazy-rules
            :rules="requiredRule"
            style="flex: 1"
          ></q-select>
        </div>

        <span>Пользователю будет отправлено письмо с паролем и ссылкой для верификации</span>
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
          <q-btn label="Очистить" type="reset" color="primary" flat class="q-ml-sm"></q-btn>
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { postData } from 'src/utils/http/post'

const path = 'users'

const formData = ref({
  email: '',
  name: '',
  surname: '',
  patronymic: '',
  age: null,
  gender: '',
  address: '',
  phone: '',
})

const accept = ref(false)

const genderOptions = ['Мужской', 'Женский']

const requiredRule = [(val) => (val && val.length > 0) || 'Поле обязательно для заполнения']

const submit = async () => {
  if (!accept.value) {
    console.warn('Подтвердите добавление в БД')
    return
  }

  const data = {
    email: formData.value.email,
    name: formData.value.name,
    surname: formData.value.surname,
    patronymic: formData.value.patronymic,
    age: formData.value.age,
    gender: formData.value.gender === 'Мужской' ? 1 : 2,
    address: formData.value.address,
  }

  console.log('user data:', data)
  await postUser(path, data)
}

const postUser = async (path, data) => {
  try {
    const response = await postData(path, data)
    console.log(response)
  } catch (e) {
    console.error(e)
  }
}

const resetData = () => {
  formData.value = {
    email: '',
    name: '',
    surname: '',
    patronymic: '',
    age: null,
    gender: '',
    address: '',
    phone: '',
  }
  accept.value = false
}
</script>

<style></style>

<style></style>
