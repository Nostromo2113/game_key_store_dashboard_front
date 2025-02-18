import { api } from 'src/boot/axios'

export const postData = async (path, item) => {
  try {
    const response = await api.post(path, item)
    const data = response.data.data ? response.data.data : response.data
    return data
  } catch (error) {
    throw new Error(error)
  }
}
