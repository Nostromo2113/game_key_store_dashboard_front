import { api } from 'src/boot/axios'

export const deleteData = async (path) => {
  const response = await api.delete(path)
  return response
}
