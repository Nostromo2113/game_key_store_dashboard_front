<template>
  <q-card class="q-pa-md" style="background: #ffffff00" flat>
    <q-form @submit="submitForm" class="q-gutter-md">
      <template v-if="step === 1">
        <div class="text-subtitle2 q-pt-md">Ваши данные для регистрации:</div>
        <q-input v-model="form.surname" label="Фамилия" required dense />
        <q-input v-model="form.name" label="Имя" required dense />
        <q-input v-model="form.patronymic" label="Отчество" dense />
        <q-input v-model="form.address" label="Адрес" required dense />
        <q-input v-model="form.age" type="number" label="Возраст" required dense />
        <q-card-actions align="right" class="q-pa-none q-mt-xl">
          <q-btn
            @click="nextStep"
            label="Далее"
            color="primary"
            :disable="!isStepOneValid"
            no-caps
            size="16px"
            unelevated
          />
        </q-card-actions>
      </template>

      <template v-if="step === 2">
        <div class="text-subtitle2 q-pt-md">Данные для авторизации:</div>
        <q-input v-model="form.email" label="Email" type="email" required>
          <template v-slot:prepend><q-icon name="email" /></template>
        </q-input>
        <q-input v-model="form.phone" label="Телефон" required mask="+7##########">
          <template v-slot:prepend><q-icon name="call_end" /></template>
        </q-input>
        <q-input
          v-model="form.password"
          label="Пароль"
          :type="isPwd ? 'password' : 'text'"
          required
        >
          <template v-slot:prepend><q-icon name="lock" /></template>
          <template v-slot:append>
            <q-icon
              :name="!isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-input
          v-model="form.password_confirmation"
          label="Подтверждение пароля"
          type="password"
          required
        >
          <template v-slot:prepend><q-icon name="enhanced_encryption" /></template>
          <template v-slot:append>
            <q-icon
              :name="!isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-card-actions align="around" class="q-pa-none q-mt-xl">
          <q-btn label="Назад" color="primary" outline @click="step = 1" no-caps unelevated />
          <q-btn
            type="submit"
            label="Зарегистрироваться"
            color="primary"
            :disable="!isStepTwoValid"
            unelevated
            no-caps
          />
        </q-card-actions>
      </template>
    </q-form>
    <q-card-section class="flex justify-center">
      <q-btn @click="$emit('isRegistered')" flat no-caps class="custom-rounded"
        >Уже зарегистрированы?</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { postData } from 'src/utils/http/post'
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/userStore'

const userStore = useUserStore()
const router = useRouter()
const path = 'registration'
const step = ref(1)
const isPwd = ref(false)

const form = ref({
  name: '',
  surname: '',
  patronymic: '',
  address: '',
  email: '',
  phone: '',
  age: '',
  password: '',
  password_confirmation: '',
})

const isStepOneValid = computed(
  () => form.value.name && form.value.surname && form.value.patronymic && form.value.address,
)
const isStepTwoValid = computed(
  () => form.value.email && form.value.password && form.value.password_confirmation,
)

const nextStep = () => {
  if (isStepOneValid.value) step.value = 2
}

const createUser = async (path, data) => {
  try {
    return await postData(path, data)
  } catch (e) {
    console.error(e)
  }
}

const submitForm = async () => {
  if (form.value.password !== form.value.password_confirmation) {
    alert('Пароли не совпадают!')
    return
  }

  form.value.age = +form.value.age

  try {
    const response = await createUser(path, form.value)
    localStorage.setItem('access_token', response.access_token)
    await userStore.fetchUser()
    router.push({ name: 'admin' })
  } catch (e) {
    console.error(e)
  }
}
</script>
