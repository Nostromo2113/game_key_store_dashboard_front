<template>
  <div class="relative-position page-shop-height">
    <div v-show="!loading" class="q-py-md">
      <div>
        <ProductCards @success="loading = false" />
      </div>
    </div>
    <InnerLoading :loading="loading" size="200px" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ProductCards from 'src/components/blocks/ProductCards.vue'
import InnerLoading from 'src/components/ui/InnerLoading.vue'
import { useUserStore } from 'src/stores/userStore'
import { useCartStore } from 'src/stores/cartStore'

const userStore = useUserStore()
const cartStore = useCartStore()

const userId = computed(() => userStore.user?.id)

const loading = ref(true)

const fetchCart = async (userId) => {
  try {
    await cartStore.fetchCart(userId)
  } catch (e) {
    console.error(e)
  } finally {
    console.log('ready', cartStore.cartProducts)
  }
}

watch(
  () => userId.value,
  (newValue) => {
    if (newValue) {
      fetchCart(newValue)
    }
  },
  { immediate: true },
)
</script>

<style scoped></style>
