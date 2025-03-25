import { api } from 'src/boot/axios'
import { shouldUseFormData, generateFormData } from './generateFormData'

export const patchData = async (path, data) => {
  try {
    const isFormDataRequired = shouldUseFormData(data)
    return isFormDataRequired ? await patchFormData(path, data) : await api.patch(path, data)
  } catch (error) {
    console.error(error)
    throw new Error(error)
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
