export const generateFormData = (data, patch = false) => {
  const formData = new FormData()
  if (patch) {
    formData.append('_method', 'patch')
  }
  try {
    // Рекурсия
    const appendFormData = (data, parentKey = '') => {
      if (isObject(data)) {
        Object.keys(data).forEach((key) => {
          const value = data[key]
          const newKey = parentKey ? `${parentKey}[${key}]` : key

          if (Array.isArray(value)) {
            // Обработка вложенных массивов

            value.forEach((el, index) => {
              // Создается значение типа key[value]
              const arrayKey = `${newKey}[${index}]`
              if (isObject(el)) {
                // Если вложенный элемент является объектом, вызывается рекурсивно функция
                appendFormData(el, arrayKey)
              } else {
                formData.append(arrayKey, el)
              }
            })
          } else if (isObject(value)) {
            // В случае, если мы получаем объект
            appendFormData(value, newKey)
          } else {
            // Если вложенные данные примитивы
            formData.append(newKey, value)
          }
        })
      } else {
        // Если это простой набор примитивов
        formData.append(parentKey, data)
      }
    }

    appendFormData(data)
    //средство для просмотра formData
    showFormData(formData)
    return formData
  } catch (e) {
    console.error('Ошибка при генерации formData: ' + e)
  }
}

export const shouldUseFormData = (data) => {
  // Для избежания рекурсии набор с данными делаю первым ключом data
  try {
    const nestedKey = Object.keys(data)[0]
    try {
      return Object.values(data[nestedKey]).some(
        (value) =>
          value instanceof File || (Array.isArray(value) && value.some((el) => el instanceof File)),
      )
    } catch (e) {
      console.error('Данные для проверки файла не читаются', e)
    }
  } catch (e) {
    console.error('Ошибка при проверки на генерацию fromData: ' + e)
  }
}

const isObject = (el) =>
  el ? typeof el === 'object' && !Array.isArray(el) && el !== null && !(el instanceof File) : false

// Функция для просмотра formData. Для использования необходимо раскомментировать функцию ии ее вызов
export const showFormData = (formData) => {
  for (const [key, value] of formData.entries()) {
    console.log(`formData el: '${key}: ${value}`)
  }
}
