import { api } from 'src/boot/axios'

export const deleteData = async (path) => {
  try {
    const response = await api.delete(path)
    return response
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
