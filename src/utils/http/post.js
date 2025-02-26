import { api } from 'src/boot/axios'

export const postData = async (path, data) => {
  try {
    const isFormDataRequired = shouldUseFormData(data)
    return isFormDataRequired ? await postFormData(path, data) : await api.post(path, data)
  } catch (error) {
    console.error(error)
    throw new Error(error)
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

const generateFormData = (data) => {
  const formData = new FormData()
  for (const key in data) {
    if (Array.isArray(data[key])) {
      data[key].forEach((el) => {
        formData.append(`${key}[]`, el)
      })
    } else if (isObject(data[key])) {
      for (const nestedKey in data[key]) {
        formData.append(`${key}[${nestedKey}]`, data[key][nestedKey])
      }
    } else {
      formData.append(key, data[key])
    }
  }
  return formData
}

const shouldUseFormData = (data) => {
  return Object.values(data).some(
    (value) =>
      value instanceof File || (Array.isArray(value) && value.some((el) => el instanceof File)),
  )
}

const isObject = (el) =>
  typeof el === 'object' && !Array.isArray(el) && el !== null && !(el instanceof File)
