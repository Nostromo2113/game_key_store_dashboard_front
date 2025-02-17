import axios from 'axios'

export const initAuthApi = () => {
  const authApi = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Полный базовый URL для API
  })

  authApi.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      } else {
        console.error('Токен не найден, авторизуйтесь снова')
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  authApi.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      const originalRequest = error.config

      if (error.response && error.response.status === 401) {
        console.error('Токен истек, либо пользователь неавторизован.')
        console.error(' Проверяю токен...')
        console.error('Сохраненный токен: ', localStorage.getItem('access_token'))

        try {
          const refreshResponse = await axios.post(
            `${authApi.defaults.baseURL}/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              },
            },
          )

          const newToken = refreshResponse.data.access_token
          localStorage.setItem('access_token', newToken)

          originalRequest.headers.Authorization = `Bearer ${newToken}`
          console.error('Токен успешно обновлен')
          return authApi.request(originalRequest)
        } catch (refreshError) {
          console.error('Не удалось обновить токен, авторизуйтесь снова.')
          return Promise.reject(refreshError)
        }
      } else {
        if (error.response) {
          console.error('Ошибка сервера:', error.response.status)
        } else if (error.request) {
          console.error('Нет ответа от сервера:', error.request)
        } else {
          console.error('Ошибка настройки запроса:', error.message)
        }
      }

      return Promise.reject(error)
    },
  )

  return authApi
}
