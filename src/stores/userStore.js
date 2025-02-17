// src/stores/userStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // Состояние для хранения данных пользователя
  const user = ref({
    name: 'Иванов',
    surname: 'Иван',
    patronymic: 'Иванович',
    age: 30,
    email: 'ivanov@example.com',
    address: 'г. Москва, ул. Ленина, д. 10, кв. 5',
    phone: '+7 (999) 123-45-67',
    role: 'Администратор',
  })

  // Геттер для получения информации о пользователе
  const isAuthenticated = computed(() => !!user.value)

  // Экшн для установки пользователя
  const setUser = (userData) => {
    user.value = userData
    console.log('USER VALUE', user.value)
  }

  // Экшн для удаления пользователя (выход из системы)
  const clearUser = () => {
    user.value = null
    localStorage.removeItem('access_token') // Очистить токен при выходе
  }

  return {
    user,
    isAuthenticated,
    setUser,
    clearUser,
  }
})
