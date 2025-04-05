<template>
  <div>
    <q-card
      class="no-shadow rounded-borders q-pa-md q-mx-auto text-center"
      style="width: 700px; max-width: 85vw"
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
            v-model="formData.phone_number"
            label="Телефон"
            mask="+7##########"
            filled
            :rules="requiredRule"
          />
          <q-input
            v-model="formData.age"
            type="number"
            label="Возраст"
            filled
            lazy-rules
            :rules="requiredRule"
          ></q-input>
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
  phone_number: '',
  name: '',
  surname: '',
  patronymic: '',
  age: null,
  gender: '',
  address: '',
})

const accept = ref(false)

const requiredRule = [(val) => (val && val.length > 0) || 'Поле обязательно для заполнения']

const submit = async () => {
  if (!accept.value) {
    console.warn('Подтвердите добавление в БД')
    return
  }
  await postUser(path, formData.value)
}

const postUser = async (path, data) => {
  const userData = { user: { ...data } }
  try {
    const response = await postData(path, userData)
    console.log(response)
  } catch (e) {
    console.error(e)
  }
}

const resetData = () => {
  for (let key in formData.value) {
    key == 'age' ? (formData.value[key] = null) : (formData.value[key] = '')
  }
  accept.value = false
}
</script>

<style></style>

<style></style>
