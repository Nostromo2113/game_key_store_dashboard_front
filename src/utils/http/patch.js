import { api } from 'src/boot/axios'
import { shouldUseFormData, generateFormData } from './generateFormData'

export const patchData = async (path, data) => {
  try {
    const isFormDataRequired = shouldUseFormData(data)
    return isFormDataRequired ? await patchFormData(path, data) : await api.patch(path, data)
  } catch (error) {
    const errorInfo = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      isAxiosError: error.isAxiosError,
    }

    throw errorInfo
  }
}

const patchFormData = async (path, data) => {
  const formData = generateFormData(data, true)
  const response = await api.post(path, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}
