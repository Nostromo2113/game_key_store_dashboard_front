<template>
  <q-page class="q-pa-md relative-position">
    <div v-show="!loading">
      <div class="text-h5 q-mb-md text-center">Административная панель</div>
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-md-3 col-sm-6 col-xs-12">
          <q-card class="bg-blue-1 shadow-sm custom-rounded" flat>
            <q-card-section>
              <div class="text-h4 text-center">{{ stats.orders }}</div>
              <div class="text-subtitle1 text-center">Заказы</div>
            </q-card-section>
            <q-separator />
            <q-card-actions class="flex-center">
              <q-btn
                flat
                icon="receipt"
                label="Управление"
                color="primary"
                :to="{ name: 'orders' }"
              />
            </q-card-actions>
          </q-card>
        </div>
        <div class="col-md-3 col-sm-6 col-xs-12">
          <q-card class="bg-green-1 shadow-sm custom-rounded" flat>
            <q-card-section>
              <div class="text-h4 text-center">{{ stats.products }}</div>
              <div class="text-subtitle1 text-center">Игры</div>
            </q-card-section>
            <q-separator />
            <q-card-actions class="flex-center">
              <q-btn
                flat
                icon="sports_esports"
                label="Каталог"
                color="green"
                :to="{ name: 'products' }"
              />
            </q-card-actions>
          </q-card>
        </div>
        <div class="col-md-3 col-sm-6 col-xs-12">
          <q-card class="bg-purple-1 shadow-sm custom-rounded" flat>
            <q-card-section>
              <div class="text-h4 text-center">{{ stats.users }}</div>
              <div class="text-subtitle1 text-center">Пользователи</div>
            </q-card-section>
            <q-separator />
            <q-card-actions class="flex-center">
              <q-btn flat icon="people" label="Управление" color="purple" :to="{ name: 'users' }" />
            </q-card-actions>
          </q-card>
        </div>
        <div class="col-md-3 col-sm-6 col-xs-12">
          <q-card class="bg-orange-1 shadow-sm custom-rounded" flat>
            <q-card-section>
              <div class="text-h4 text-center">{{ stats.keys }}</div>
              <div class="text-subtitle1 text-center">Ключи активации</div>
            </q-card-section>
            <q-separator />
            <q-card-actions class="flex-center">
              <q-btn flat icon="vpn_key" label="Просмотр" color="orange" :to="{ name: 'keys' }" />
            </q-card-actions>
          </q-card>
        </div>
      </div>
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12">
          <q-card class="custom-rounded shadow-sm" flat>
            <q-card-section>
              <div class="text-h6">Быстрые действия</div>
            </q-card-section>
            <q-card-section class="row q-col-gutter-md">
              <div class="col-md-4 col-sm-6 col-xs-12">
                <q-btn
                  color="primary"
                  icon="add"
                  label="Добавить игру"
                  class="full-width shadow-sm custom-rounded"
                  :to="{ name: 'product.create' }"
                  unelevated
                />
              </div>
              <div class="col-md-4 col-sm-6 col-xs-12">
                <q-btn
                  color="accent"
                  icon="person_add"
                  label="Добавить пользователя"
                  class="full-width shadow-sm custom-rounded"
                  :to="{ name: 'users' }"
                  unelevated
                />
              </div>
              <div class="col-md-4 col-sm-6 col-xs-12">
                <q-btn
                  color="teal"
                  icon="store"
                  label="Перейти в магазин"
                  class="full-width shadow-sm custom-rounded"
                  :to="{ name: 'shop' }"
                  unelevated
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row q-mb-lg">
        <div class="col-12">
          <q-card class="custom-rounded shadow-sm" flat>
            <q-card-section class="bg-primary">
              <div class="text-h6 text-white">Последние заказы</div>
            </q-card-section>
            <q-card-section class="bg-blue-grey-2">
              <OrderTable />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <InnerLoading :loading="loading" />
  </q-page>
</template>

<script setup>
import InnerLoading from 'src/components/ui/InnerLoading.vue'
import OrderTable from 'src/components/tables/OrderTable.vue'
import { getData } from 'src/utils/http/get'
import { ref, onMounted } from 'vue'

const stats = ref({
  orders: 0,
  products: 0,
  users: 0,
  keys: 0,
})

const loading = ref(true)

const loadStats = async () => {
  const response = await getData('stats')
  loading.value = false
  stats.value = {
    products: response.products,
    users: response.users,
    keys: response.activation_keys,
    orders: response.orders,
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
