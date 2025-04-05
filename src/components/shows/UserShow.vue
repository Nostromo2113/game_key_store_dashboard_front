<template>
  <div class="q-pa-md custom-rounded">
    <!-- Блок с аватаром -->
    <div class="grid-container">
      <q-card class="avatar-section q-pa-md custom-rounded shadow-sm" flat>
        <q-card-section class="q-mb-md q-pa-none">
          <div class="text-subtitle2 text-grey">Аватар</div>
        </q-card-section>
        <ImageUpload
          title="Аватар"
          height="290px"
          width="260px"
          :imageLink="userData.avatar"
          @onFileChange="onFileChange"
          :showAlt="false"
          class="full-width"
        />
      </q-card>
      <!-- Блок с Данными пользователя -->
      <q-card class="user-data-section q-pa-md full-height custom-rounded shadow-sm" flat>
        <q-card-section class="q-mb-md q-pa-none">
          <div class="text-subtitle2 text-grey">Данные пользователя</div>
        </q-card-section>
        <q-card-section class="user-data-grid">
          <!-- Левая колонка -->
          <div class="left-column">
            <q-input v-model="userData.surname" label="Фамилия" filled />
            <q-input v-model="userData.name" label="Имя" filled />
            <q-input v-model="userData.patronymic" label="Отчество" filled />
            <q-input v-model="userData.age" type="number" label="Возраст" filled />
          </div>

          <q-separator vertical class="separator" />

          <!-- Правая колонка -->
          <div class="right-column">
            <q-input v-model="userData.email" type="email" label="Email" filled />
            <q-input v-model="userData.address" label="Адрес" filled />
            <q-input v-model="userData.phone_number" label="Телефон" mask="+7##########" filled />
            <q-input label="Администратор" filled></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md q-pr-md">
          <q-btn
            @click="updateUser(userData, selectedFile, userId)"
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
            @click="readonly = true"
          />
          <q-btn label="Удалить пользователя" color="negative" unelevated no-caps />
        </q-card-actions>
      </q-card>
    </div>

    <!-- Панель с заказами и корзиной -->
    <q-card flat class="q-pa-sm custom-rounded q-mt-md shadow-sm">
      <q-toolbar>
        <q-toolbar-title>{{ tab === 'orders' ? 'Заказы' : 'Корзина' }}</q-toolbar-title>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab name="orders" label="Заказы" />
          <q-tab name="cart" label="Корзина" />
        </q-tabs>
      </q-toolbar>
      <q-tab-panels v-model="tab" animated keep-alive>
        <q-tab-panel name="orders">
          <OrderTable :rowsData="orderData" :userPage="true" :userId="+userId" />
        </q-tab-panel>
        <q-tab-panel name="cart">
          <CartProductsTable :propsUserId="+userId" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>
<script setup>
import ImageUpload from 'src/components/blocks/ImageUpload.vue'
import OrderTable from 'src/components/tables/OrderTable.vue'
import CartProductsTable from 'src/components/tables/CartProductsTable.vue'
import notify from 'src/plugins/notify'
import { getData } from 'src/utils/http/get'
import { ref, onMounted, defineEmits } from 'vue'
import { useRoute } from 'vue-router'
import { patchData } from 'src/utils/http/patch'
import { useCartStore } from 'src/stores/cartStore'

const route = useRoute()
const cartStore = useCartStore()
const userId = route.params.userId

const emit = defineEmits(['success'])

const tab = ref('orders')
const userData = ref({})
const selectedFile = ref()
const orderData = ref([])

const getUserData = async (userId) => {
  const path = `users/${userId}`
  try {
    const response = await getData(path)
    userData.value = response.data
    await cartStore.fetchCart(userId)
    emit('success')
  } catch (e) {
    console.error(e)
  }
}

const onFileChange = (file) => {
  selectedFile.value = file
}

const updateUser = async (userData, selectedFile, userId) => {
  const path = `users/${userId}`
  const loading = notify.loading('Обработка')
  try {
    const data = {
      user: userData,
    }
    if (selectedFile) {
      data.user.file = selectedFile
    }
    await patchData(path, data)
    notify.success('Успешно')
  } catch (e) {
    console.error(e)
    notify.error('Ошибка')
  } finally {
    getUserData(userId)
    loading()
  }
}

onMounted(() => {
  getUserData(userId)
})
</script>

<style scoped>
.custom-rounded {
  border-radius: 8px;
}

.grid-container {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid-container {
    grid-template-columns: 300px 1fr;
  }
}

.user-data-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .user-data-grid {
    grid-template-columns: 1fr auto 1fr;
  }
}

.separator {
  margin: 0 16px;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
