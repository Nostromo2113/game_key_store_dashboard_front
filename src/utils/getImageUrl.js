export const getImageUrl = (imagePath) => {
  return `${import.meta.env.VITE_APP_API_URL}/storage/${imagePath}`
}
