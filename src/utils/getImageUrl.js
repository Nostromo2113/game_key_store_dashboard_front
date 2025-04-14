export const getImageUrl = (imagePath) => {
  const url = `http://${import.meta.env.VITE_APP_API_URL}/storage/${imagePath}`
  console.log('img url: ', url)
  return url
}
