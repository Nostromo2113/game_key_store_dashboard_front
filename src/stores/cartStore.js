import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getData } from 'src/utils/http/get'
import { postData } from 'src/utils/http/post'
import { patchData } from 'src/utils/http/patch'
import { deleteData } from 'src/utils/http/delete'

export const useCartStore = defineStore('cart', () => {
  const cartDetails = ref([])
  const cartProducts = ref([])

  const fetchCart = async (userId) => {
    const path = `users/${userId}/cart`
    try {
      const response = await getData(path)
      fillPiniaData(response)
    } catch (e) {
      console.error(e)
    }
  }

  const storeProductToCart = async (cartId, product) => {
    const data = {
      product: {
        product_id: product.id,
        quantity: 1,
        price: +product.price,
      },
    }
    const path = `cart/${cartId}/products`
    try {
      const response = await postData(path, data)
      fillPiniaData(response)
    } catch (e) {
      throw new Error(e)
    }
  }

  const removeProductFromCart = async (cartId, productId) => {
    const path = `cart/${cartId}/products/${productId}`
    try {
      const response = await deleteData(path)
      fillPiniaData(response)
    } catch (e) {
      console.error(e)
      throw new Error(e)
    }
  }

  const updateProductFromCart = async (cartId, product) => {
    console.warn('123123')
    const path = `cart/${cartId}/products/${product.product_id}`
    const data = {
      product: {
        ...product,
      },
    }
    try {
      const response = await patchData(path, data)
      fillPiniaData(response)
    } catch (e) {
      console.error(e)
      throw new Error(e)
    }
  }

  const clearCart = () => (cartProducts.value = [])

  /**   INTERNAL METHODS   */

  const fillPiniaData = (response) => {
    const responseData = response.data || response

    const cartData = responseData.data || responseData

    cartDetails.value = { ...cartData }

    if (cartData.products) {
      cartProducts.value = cartData.products

      cartDetails.value = cartData
      delete cartDetails.value.products
    } else {
      cartProducts.value = []
    }
  }
  /////////////////////////////////////////////////////
  return {
    cartDetails,
    cartProducts,
    fetchCart,
    storeProductToCart,
    removeProductFromCart,
    updateProductFromCart,
    clearCart,
  }
})
