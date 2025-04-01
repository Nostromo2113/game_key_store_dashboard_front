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
      cartDetails.value = response
      cartProducts.value = response.products
      delete cartDetails.value.products
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
      await postData(path, data)
    } catch (e) {
      throw new Error(e)
    } finally {
      fetchCart(cartDetails.value.user_id)
    }
  }

  const removeProductFromCart = async (cartId, productId) => {
    const path = `cart/${cartId}/products/${productId}`
    try {
      await deleteData(path)
    } catch (e) {
      console.error(e)
      throw new Error(e)
    } finally {
      fetchCart(cartDetails.value.user_id)
    }
  }

  const updateProductFromCart = async (cartId, product) => {
    const path = `cart/${cartId}/products/${product.product_id}`
    const data = {
      product: {
        ...product,
      },
    }
    try {
      await patchData(path, data)
    } catch (e) {
      console.error(e)
      throw new Error(e)
    } finally {
      fetchCart(cartDetails.value.user_id)
    }
  }

  const clearCart = () => (cartProducts.value = [])

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
