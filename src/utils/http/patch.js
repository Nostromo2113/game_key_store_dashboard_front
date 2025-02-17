import { api } from 'src/boot/axios'

export const patchData = async (path, itemId, item) => {
  console.log(path, item)
  const patchPath = `${path}/${itemId}`
  console.warn(item)
  const response = await api.patch(patchPath, item)
  return response
}
