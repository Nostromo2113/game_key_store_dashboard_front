import { api } from 'src/boot/axios'

export const patchFormData = async (path, data) => {
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
  formData.append('_method', 'patch')
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
  //  showFormData(formData)
  return formData
}

const isObject = (el) =>
  typeof el === 'object' && !Array.isArray(el) && el !== null && !(el instanceof File)

// Просмотреть данные в formData

// const showFormData = (formData) => {
//   for (const [key, value] of formData.entries()) {
//     console.log(`formData el: '${key}: ${value}`)
//   }
// }
