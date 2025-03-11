import { api } from 'src/boot/axios'

export const getData = async (path, id = null, params = null) => {
  const requestPath = id ? `${path}/${id}` : path

  console.log('query', params)
  const response = await api.get(requestPath, { params })
  console.log('GET', response)
  const fullUrl = api.getUri({ url: requestPath, params })
  console.log('Full URL:', fullUrl)
  const data = response.data
  return data
}
