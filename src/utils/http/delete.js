import { api } from 'src/boot/axios'

export const deleteData = async (path) => {
  try {
    const response = await api.delete(path)
    return response
  } catch (e) {
    console.error(e)
  }
}
