import { api } from 'src/boot/axios'

export const patchData = async (path, itemId, item) => {
  try {
    const patchPath = `${path}/${itemId}`
    const response = await api.patch(patchPath, item)
    console.log('RES', response)
    return response
  } catch (e) {
    console.error(e)
    throw new Error(e)
  }
}
