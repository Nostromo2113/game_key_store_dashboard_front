<template>
  <div v-if="breadcrumbs.length > 1" class="q-px-md">
    <q-breadcrumbs class="custom-breadcrumbs shadow-sm">
      <q-breadcrumbs-el
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="index"
        :label="breadcrumb.label"
        :to="breadcrumb.to"
        class="custom-breadcrumb"
      />
    </q-breadcrumbs>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const breadcrumbs = ref([])

const breadcrumbDictionary = {
  categories: 'Категории',
  genres: 'Жанры',
  index: 'Главная',
  admin: 'Администратор',
  user: 'Пользователь',
  users: 'Пользователи',
  order: 'Заказ',
  orders: 'Заказы',
  product: 'Продукт',
  create: 'Создание',
  products: 'Продукты',
  shop: 'Магазин',
  cart: 'Корзина',
}

function createBreadcrumbs() {
  const pathItems = route.path.split('/').filter((item) => item)
  breadcrumbs.value = []

  let accumulatedPath = ''

  pathItems.forEach((item, index) => {
    accumulatedPath += `/${item}` // Формируем текущий путь
    const matchedRoute = route.matched.find((r) => r.path === accumulatedPath)
    console.log(accumulatedPath, matchedRoute)
    let label = matchedRoute?.meta?.breadcrumb || item
    Object.keys(route.params).forEach((key) => {
      if (label.includes(route.params[key])) {
        label = label.replace(route.params[key], `:${key}`)
      }
    })

    // Используем словарь для замены параметров на более читаемые имена
    Object.keys(breadcrumbDictionary).forEach((key) => {
      if (label?.includes(`:${key}`)) {
        label = label.replace(`:${key}`, breadcrumbDictionary[key]).replace('Id', '')
      }
      if (label?.includes(key)) {
        label = breadcrumbDictionary[label]
      }
    })

    const breadcrumb = {
      label,
      to: index < pathItems.length - 1 ? accumulatedPath : null, // Если не последняя крошка, то ссылаемся на путь
    }

    breadcrumbs.value.push(breadcrumb)
  })
}
watchEffect(() => {
  createBreadcrumbs()
})
</script>
<style scoped>
.custom-breadcrumbs {
  padding: 4px 0;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.custom-breadcrumb {
  color: #6c757d;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  padding: 5px 8px;
  border-radius: 8px;
  transition:
    color 0.3s ease,
    background-color 0.3s ease;
}

.custom-breadcrumb:hover {
  background-color: #e9ecef94;
  color: #007bff;
}

.q-breadcrumbs-el--active {
  color: #007bff;
  font-weight: bold;
  cursor: default;
}

.q-breadcrumbs-el--active::after {
  content: '';
}

.custom-breadcrumbs {
  padding-left: 15px;
  padding-right: 15px;
}
</style>
