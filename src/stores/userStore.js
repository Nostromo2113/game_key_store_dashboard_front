import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from 'src/boot/axios'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)

  const isAuthenticated = computed(() => !!user.value)
  const fetchUser = async () => {
    try {
      const response = await api.post('/auth/me')
      user.value = response.data.data
      setUser(user.value)
    } catch (error) {
      console.error('Ошибка загрузки пользователя', error)
      clearUser()
    }
  }

  const setUser = (userData) => {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const clearUser = () => {
    user.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
  }

  return {
    user,
    isAuthenticated,
    fetchUser,
    setUser,
    clearUser,
  }
})
