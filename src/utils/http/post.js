import { api } from 'src/boot/axios'
import { generateFormData, shouldUseFormData } from './generateFormData'

export const postData = async (path, data) => {
  try {
    const isFormDataRequired = shouldUseFormData(data)

    const response = isFormDataRequired
      ? await postFormData(path, data)
      : await api.post(path, data)

    console.log(response)

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

const postFormData = async (path, data) => {
  const formData = generateFormData(data)
  const response = await api.post(path, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}
