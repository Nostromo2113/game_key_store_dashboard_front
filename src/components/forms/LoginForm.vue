<template>
  <q-card style="background: #ffffff00">
    <q-form @submit="performLogin(path, form)">
      <div class="text-subtitle2 q-pt-md q-mb-md">Данные для авторизации:</div>
      <div class="column gap-md">
        <q-input v-model="form.email" label="Email" type="email" required>
          <template v-slot:prepend>
            <q-icon name="email" />
          </template>
        </q-input>
        <div class="row items-center">
          <q-input class="col" v-model="form.password" label="Пароль" type="password" required>
            <template v-slot:prepend> <q-icon name="lock" /> </template
          ></q-input>
          <q-btn
            @click="modalRestore = true"
            flat
            no-caps
            dense
            color="negative"
            class="custom-rounded col-3"
            >Не помню</q-btn
          >
        </div>
      </div>
      <q-card-actions align="right" class="q-mt-xl">
        <q-btn type="submit" color="primary" no-caps>Войти</q-btn>
      </q-card-actions>
    </q-form>
    <q-card-section class="flex justify-center">
      <q-btn @click="$emit('isNotRegistered')" flat no-caps class="custom-rounded"
        >Еще не зарегистрированы?</q-btn
      >
    </q-card-section>
    <q-dialog v-model="modalRestore">
      <div>
        <q-card class="q-pa-md shadow-sm" style="min-width: 320px">
          <p class="text-grey-8 text-center">Будет выслан новый пароль</p>
          <ResetPasswordForm class="full-width" />
        </q-card>
      </div>
    </q-dialog>
  </q-card>
</template>
<script setup>
import ResetPasswordForm from './ResetPasswordForm.vue'
import { api } from 'src/boot/axios'
import { postData } from 'src/utils/http/post'
import { ref } from 'vue'
import { useUserStore } from 'src/stores/userStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  email: '',
  password: '',
})

const path = 'auth/login'

const modalRestore = ref(false)

const performLogin = async (path, data) => {
  try {
    const response = await postData(path, data)
    console.log(response)
    saveToken(response.data.access_token)
    await getMe()
    router.push({ name: 'admin' })
  } catch (e) {
    console.error(e)
  }
}

const saveToken = (token) => {
  localStorage.setItem('access_token', token)
}

const getMe = async () => {
  const response = await api.post('auth/me')
  userStore.setUser(response.data)
}
getMe()
</script>
<style lang="css" scoped></style>
