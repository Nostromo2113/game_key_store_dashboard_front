import { api } from 'src/boot/axios'

export const postData = async (path, item) => {
  const response = await api.post(path, item)
  const data = response.data.data ? response.data.data : response.data
  return data
}
