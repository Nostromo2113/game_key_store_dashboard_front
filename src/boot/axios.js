import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: 'https://gamestoredashboard.ru/api/admin/',
  //baseURL: 'http://127.0.0.1:8000/api/admin',
})

// Интерсептор запроса
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)
// Интерсептор ответа
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401) {
      try {
        const refreshResponse = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } },
        )
        const newToken = refreshResponse.data.access_token
        localStorage.setItem('access_token', newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return axios(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('user')
        console.error('Не удалось обновить токен, авторизуйтесь снова.')
        return Promise.reject(refreshError)
      }
    }

    // Обработка других ошибок
    if (error.response) {
      console.error('Ошибка сервера:', error.response.status)
    } else if (error.request) {
      console.error('Нет ответа от сервера:', error.request)
    } else {
      console.error('Ошибка настройки запроса:', error.message)
    }

    return Promise.reject(error)
  },
)

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
