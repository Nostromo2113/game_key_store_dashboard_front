import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getData } from 'src/utils/http/get'
import { postData } from 'src/utils/http/post'
import { deleteData } from 'src/utils/http/delete'

export const useCartStore = defineStore('cart', () => {
  const cartDetails = ref([])
  const cartProducts = ref([])

  const fetchCart = async (cartId) => {
    try {
      const response = await getData('cart', cartId)
      cartDetails.value = response
      cartProducts.value = response.products
      delete cartDetails.value.products
    } catch (e) {
      console.error(e)
    } finally {
      console.log('Products In Cart: ', cartProducts.value)
    }
  }

  const storeProductToCart = async (cartId, product) => {
    const data = {
      product_id: product.id,
      quantity: 1,
      price: +product.price,
    }
    const path = `cart/${cartId}/products`
    try {
      const response = await postData(path, data)
      console.log('ADD RES', response)
    } catch (e) {
      console.error('Продукт не добавлен в корзину', e)
    } finally {
      fetchCart(1)
    }
  }

  const removeProductFromCart = async (cartId, productId) => {
    const path = `cart/${cartId}/products/${productId}`
    try {
      await deleteData(path)
    } catch (error) {
      console.error(error)
    } finally {
      fetchCart(cartId)
    }
  }

  return {
    cartDetails,
    cartProducts,
    fetchCart,
    storeProductToCart,
    removeProductFromCart,
  }
})
