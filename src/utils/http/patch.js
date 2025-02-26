import { api } from 'src/boot/axios'

export const patchData = async (path, item) => {
  try {
    const response = await api.patch(path, item)
    console.log('RES', response)
    return response
  } catch (e) {
    console.error(e)
    throw new Error(e)
  }
}
