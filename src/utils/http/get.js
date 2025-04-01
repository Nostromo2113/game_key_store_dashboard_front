import { api } from 'src/boot/axios'

export const getData = async (path, params = null) => {
  console.log('query', params)
  const response = await api.get(path, { params })
  console.log('GET', response)
  const data = response.data
  return data
}
