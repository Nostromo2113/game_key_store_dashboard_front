import { api } from 'src/boot/axios'

export const getData = async (path, id = null, queryParams = null) => {
  const requestPath = id ? `${path}/${id}` : path
  const params = {
    id: queryParams?.id,
    query: queryParams?.query,
  }

  console.log('query', params)
  const response = await api.get(requestPath, { params })
  const data = response.data.data ? response.data.data : response.data
  return data
}
