import { api } from 'src/boot/axios'

export const getData = async (path, params = null) => {
  try {
    console.log('query', params)
    const response = await api.get(path, { params })
    console.log('GET', response)
    const data = response.data
    return data
  } catch (error) {
    const errorInfo = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      isAxiosError: error.isAxiosError,
    }
    console.error(error)
    throw errorInfo
  }
}
