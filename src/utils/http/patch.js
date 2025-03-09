import { api } from 'src/boot/axios'

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
  formData.append('_method', 'patch') // Добавляем метод PATCH для Laravel
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

  //Просмотр formData
  // showFormData(formData)
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

// Функция для просмотра formData. Для использования необходимо раскомментировать функцию ии ее вызов
// const showFormData = (formData) => {
//   for (const [key, value] of formData.entries()) {
//     console.log(`formData el: '${key}: ${value}`)
//   }
// }
