// src/stores/userStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // Состояние для хранения данных пользователя
  const user = ref({})

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
