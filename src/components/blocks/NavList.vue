<template>
  <q-list class="text-blue-grey-1">
    <template v-for="(menuItem, index) in menuList" :key="index">
      <router-link :to="menuItem.path" class="routerlink-unset">
        <q-item clickable :class="{ 'bg-info': menuItem.path.name === route.name }">
          <q-item-section avatar>
            <q-icon :name="menuItem.icon"></q-icon>
          </q-item-section>
          <q-item-section>
            {{ menuItem.label }}
          </q-item-section>
        </q-item>
      </router-link>
    </template>
  </q-list>
</template>
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const menuList = [
  {
    icon: 'store',
    label: 'Магазин',
    path: { name: 'shop' },
  },
  {
    icon: 'home',
    label: 'Главная',
    path: { name: 'index' },
  },
  {
    icon: 'group',
    label: 'Пользователи',
    path: { name: 'users' },
  },
  {
    icon: 'local_mall',
    label: 'Продукты',
    path: { name: 'products' },
  },
  {
    icon: 'key',
    label: 'Ключи',
    path: { name: 'keys' },
  },
  {
    icon: 'shopping_bag',
    label: 'Заказы',
    path: { name: 'orders' },
  },
  {
    icon: 'category',
    label: 'Категории',
    path: { name: 'categories' },
  },
  {
    icon: 'style',
    label: 'Жанры',
    path: { name: 'genres' },
  },
  {
    icon: 'login',
    label: 'Авторизация',
    path: { name: 'auth' },
  },
]
</script>
<style lang="css"></style>
