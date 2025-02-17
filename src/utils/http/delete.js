import { api } from 'src/boot/axios'

export const deleteData = async (path, id) => {
  const deletePath = `${path}/${id}`
  console.log(deletePath)
  const response = await api.delete(deletePath)
  return response
}
