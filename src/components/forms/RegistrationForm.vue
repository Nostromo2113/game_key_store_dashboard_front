<template>
  <q-card class="q-pa-md" style="background: #ffffff00" flat>
    <q-form @submit="submitForm" class="q-gutter-md">
      <template v-if="step === 1">
        <div class="text-subtitle2 q-pt-md">Ваши данные для регистрации:</div>
        <q-input v-model="form.surname" label="Фамилия" required dense />
        <q-input v-model="form.name" label="Имя" required dense />
        <q-input v-model="form.patronymic" label="Отчество" dense />
        <q-input v-model="form.address" label="Адрес" required dense />
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
          <template v-slot:prepend>
            <q-icon name="email" />
          </template>
        </q-input>
        <q-input v-model="form.password" label="Пароль" type="password" required>
          <template v-slot:prepend> <q-icon name="lock" /> </template
        ></q-input>
        <q-input
          v-model="form.passwordConfirm"
          label="Подтверждение пароля"
          type="password"
          required
        >
          <template v-slot:prepend>
            <q-icon name="enhanced_encryption" />
          </template>
        </q-input>
        <q-card-actions align="around" class="q-pa-none q-mt-xl">
          <q-btn label="Назад" color="primary" outline @click="step = 1" no-caps unelevated></q-btn>
          <q-btn
            type="submit"
            label="Зарегистрироваться"
            color="primary"
            :disable="!isStepTwoValid"
            unelevated
            no-caps
        /></q-card-actions>
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

const step = ref(1)
const form = ref({
  name: '',
  surname: '',
  patronymic: '',
  address: '',
  email: '',
  password: '',
  passwordConfirm: '',
})

const isStepOneValid = computed(() => {
  return form.value.name && form.value.surname && form.value.patronymic && form.value.address
})

const isStepTwoValid = computed(() => {
  return form.value.email && form.value.password && form.value.passwordConfirm
})

const nextStep = () => {
  if (isStepOneValid.value) {
    step.value = 2
  }
}

const submitForm = () => {
  if (form.value.password !== form.value.passwordConfirm) {
    alert('Пароли не совпадают!')
    return
  }
  console.log('Форма отправлена', form.value)
}
</script>
