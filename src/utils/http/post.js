import { api } from 'src/boot/axios'

export const postData = async (path, item) => {
  try {
    const response = await api.post(path, item)
    console.log(response)
    const data = response.data ? response.data : response
    return data
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}
