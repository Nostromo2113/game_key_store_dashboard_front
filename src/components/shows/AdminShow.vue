<template>
  <div class="bg-gradient" style="height: 100vh">
    <div class="container">
      <q-toolbar class="custom-rounded q-pa-none q-px-md q-mb-md bg-white text-grey-9 shadow-sm"
        >Добро пожаловать, {{ user.name }}!</q-toolbar
      >
      <div class="grid-container">
        <div class="avatar-section full-height">
          <q-card class="q-pa-md custom-rounded full-height shadow-sm" flat>
            <q-card-section class="q-pa-none q-mb-md">
              <div class="text-subtitle2 text-grey">Ваш аватар:</div>
            </q-card-section>
            <div>
              <ImageUpload
                title="Аватар"
                height="290px"
                width="260px"
                :imageLink="user.avatar"
                @onFileChange="onFileChange"
                :showAlt="false"
                :disabledUpload="!edit"
                class="full-width"
              />
            </div>
          </q-card>
        </div>
        <div class="user-info-section">
          <q-card class="q-pa-md custom-rounded shadow-sm" flat>
            <q-card-section class="q-pa-none q-mb-md">
              <div class="text-subtitle2 text-grey">Ваши данные:</div>
            </q-card-section>
            <q-input v-model="user.surname" label="Фамилия" class="q-mb-sm" dense filled />
            <q-input v-model="user.name" label="Имя" class="q-mb-sm" dense filled />
            <q-input v-model="user.patronymic" label="Отчество" class="q-mb-sm" dense filled />
            <q-input
              v-model="user.age"
              label="Возраст"
              type="number"
              class="q-mb-sm"
              dense
              filled
            />
            <q-input v-model="user.email" label="Email" type="email" class="q-mb-sm" dense filled />
            <q-input v-model="user.address" label="Адрес" class="q-mb-sm" dense filled />
            <q-input
              v-model="user.phone_number"
              label="Телефон"
              mask="+7(###)#######"
              class="q-mb-sm"
              dense
              filled
            />
            <q-card-actions align="right" class="q-mt-md">
              <template v-if="edit">
                <q-btn
                  @click="updateUser(userPath, user, selectedFile, user.id)"
                  label="Применить"
                  color="primary"
                  unelevated
                  no-caps
                  class="q-mr-sm"
                />
                <q-btn
                  label="Отменить"
                  color="warning"
                  unelevated
                  no-caps
                  class="q-mr-sm"
                  @click="edit = false"
                />
              </template>
              <q-btn
                v-else
                label="Редактировать"
                color="primary"
                unelevated
                no-caps
                @click="edit = true"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
      <q-card class="q-mt-md q-pa-md custom-rounded shadow-sm" flat>
        <q-card-section class="q-pa-none q-mb-md">
          <div class="text-subtitle2 text-grey">Сменить пароль:</div>
        </q-card-section>
        <q-input
          v-model="password.current_password"
          label="Старый пароль"
          type="password"
          class="q-mb-sm"
          outlined
          dense
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            ></q-icon> </template
        ></q-input>
        <q-input
          v-model="password.new_password"
          label="Новый пароль"
          type="password"
          class="q-mb-sm"
          outlined
          dense
          ><template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            ></q-icon> </template
        ></q-input>
        <q-input
          v-model="password.new_password_confirmation"
          label="Подтвердите пароль"
          type="password"
          class="q-mb-sm"
          outlined
          dense
          ><template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            ></q-icon> </template
        ></q-input>
        <q-card-actions align="right" class="q-pa-none q-mt-md"
          ><q-btn
            color="primary"
            label="Сменить пароль"
            @click="changePassword"
            no-caps
            unelevated />
          <q-btn
            color="warning"
            label="Восстановить пароль"
            @click="modalRestore = true"
            no-caps
            unelevated
        /></q-card-actions>
      </q-card>
    </div>
    <q-dialog v-model="modalRestore">
      <div>
        <q-card class="q-pa-md shadow-sm" style="min-width: 320px">
          <p class="text-grey-8 text-center">Будет выслан новый пароль</p>
          <ResetPasswordForm class="full-width" :userEmail="user.email" />
        </q-card>
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from 'src/stores/userStore'
import ImageUpload from 'src/components/blocks/ImageUpload.vue'
import ResetPasswordForm from 'src/components/forms/ResetPasswordForm.vue'
import { postData } from 'src/utils/http/post'
import { patchData } from 'src/utils/http/patch'
import notify from 'src/plugins/notify'

const userStore = useUserStore()

const edit = ref(false)
const modalRestore = ref(false)
const isPwd = ref(false)
const userPath = 'users'

const user = computed(() => (userStore.user ? userStore.user : {}))
const selectedFile = ref()

const password = ref({
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
})

const changePassword = async () => {
  const loading = notify.loading('Обработка')
  try {
    await postData('password/change', password.value)
    notify.success('Успешно')
  } catch (e) {
    console.error(e)
    notify.error('Ошибка')
  } finally {
    for (let key in password.value) {
      password.value[key] = ''
    }
    loading()
  }
}

const onFileChange = (file) => {
  selectedFile.value = file
  console.log('selected', file)
}

const updateUser = async (userPath, userData, selectedFile, userId) => {
  const path = `${userPath}/${userId}`
  const data = userData
  const loading = notify.loading('Обработка')
  if (selectedFile) {
    data.file = selectedFile
  }
  console.log('USER: ', data)
  try {
    await patchData(path, { user: data })
    notify.success('Успешно')
    loading()
  } catch (e) {
    console.error(e)
    notify.error('Ошибка')
  } finally {
    userStore.fetchUser
    if (selectedFile) {
      selectedFile.value = null
    }
  }
}
</script>

<style scoped>
.container {
  padding: 16px;
  max-width: 1200px;
  margin: auto;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .grid-container {
    grid-template-columns: 300px 1fr;
  }
}

.q-card {
  width: 100%;
}

.custom-rounded {
  border-radius: 8px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
}

.user-info-section {
  display: flex;
  flex-direction: column;
}
</style>
