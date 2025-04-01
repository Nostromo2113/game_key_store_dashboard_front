<template>
  <div
    v-if="breadcrumbs.length > 1"
    class="q-px-md"
    :class="{ 'shop-breadcrumbs': route.meta.breadCrumbName === 'shop' }"
  >
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
  ordersShop: 'Заказы',
}

function createBreadcrumbs() {
  const pathItems = route.path.split('/').filter((item) => item)
  breadcrumbs.value = []

  let accumulatedPath = ''

  pathItems.forEach((item, index) => {
    accumulatedPath += `/${item}`
    const matchedRoute = route.matched.find((r) => r.path === accumulatedPath)
    let label = matchedRoute?.meta?.breadcrumb || item

    Object.keys(route.params).forEach((key) => {
      const paramValue = route.params[key]
      // Проверяем точное совпадение (целое число или строка)
      if (label === paramValue || label.split('/').includes(paramValue)) {
        label = label.replace(new RegExp(`\\b${paramValue}\\b`, 'g'), `:${key}`)
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
      to: index < pathItems.length ? accumulatedPath : null, // Если не последняя крошка, то ссылаемся на путь
    }
    breadcrumbs.value.push(breadcrumb)
  })

  if (breadcrumbs.value.length > 1) {
    breadcrumbs.value.forEach((crumb, index) => {
      if (crumb.label === breadcrumbs.value[index + 1]?.label) {
        breadcrumbs.value.splice(index, 1)
      }
    })
  }

  console.log('BC2', breadcrumbs.value)
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

.shop-breadcrumbs {
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: 0;
}
</style>
