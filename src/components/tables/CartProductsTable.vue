<template>
  <div>
    <q-table
      :rows="cartItems"
      :columns="cartProductsColumns"
      :pagination="pagination"
      row-key="title"
      flat
      dense
      class="q-pa-sm text-blue-grey-9 custom-rounded"
    >
      <template v-slot:top-left>
        <div class="text-h6 bg-primary text-white q-px-sm custom-rounded">Корзина</div>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="preview_image" :props="props">
            <q-img
              :src="getImageUrl(props.row.preview_image)"
              width="160px"
              height="80px"
              class="rounded-borders"
            ></q-img>
          </q-td>
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="title" :props="props">
            {{ props.row.title }}
          </q-td>
          <q-td key="publisher" :props="props">
            {{ props.row.publisher }}
          </q-td>
          <q-td key="release_date" :props="props">
            {{ props.row.release_date }}
          </q-td>
          <q-td key="price" :props="props">
            {{ props.row.price }}
          </q-td>
          <q-td key="quantity" :props="props">
            <QuantitySelector
              v-if="props.row.quantity_store"
              :quantity_cart="props.row.quantity_cart"
              :quantity_store="props.row.quantity_store"
              class="q-pl-xl"
              @update:quantity="(quantity) => updateProductQuantity(props.row.id, quantity)"
            />
            <q-badge v-else color="warning" class="q-pa-sm text-black">Товар закончился</q-badge>
          </q-td>
          <q-td key="destroy" :props="props">
            <q-btn
              @click="removeProductFromCart(props.row.id)"
              icon="close"
              size="14px"
              color="negative"
              dense
              round
            ></q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog
      v-model="modalOrder"
      aria-labelledby="remove-dialog-title"
      aria-describedby="remove-dialog-description"
    >
      <q-card class="custom-rounded">
        <q-item class="bg-primary text-white">
          <q-item-section>
            <q-item-label>Ключи будут отправлены на электронную почту</q-item-label>
          </q-item-section>
        </q-item>
        <CardForm />
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps, onMounted } from 'vue'
import { cartProductsColumns } from 'src/constants/cartProductsColumns'
import { defineEmits } from 'vue'
import QuantitySelector from '../ui/QuantitySelector.vue'
import CardForm from '../forms/CardForm.vue'
import { getImageUrl } from 'src/utils/getImageUrl'
import { useCartStore } from 'src/stores/cartStore'
import { useUserStore } from 'src/stores/userStore'
import notify from 'src/plugins/notify'

const emit = defineEmits(['cartReceived', 'updateQuantity'])

const props = defineProps({
  propsUserId: {
    type: Number,
    default: null,
  },
})

const cartStore = useCartStore()
const userStore = useUserStore()

const modalOrder = ref(false)

const cartId = computed(() => cartStore.cartDetails?.id)
const userId = computed(() => userStore.user?.id)

const cartItems = computed(() => cartStore.cartProducts || [])
const cartDetails = computed(() => cartStore.cartDetails || {})

const fetchCart = async (userId) => {
  if (!userId) {
    console.warn('Нет userId')
    return
  }

  try {
    await cartStore.fetchCart(userId)
    emit('cartReceived', cartItems.value)
  } catch (error) {
    console.error('Ошибка загрузки корзины:', error)
    cartItems.value = []
  }
}

const updateProductQuantity = async (productId, quantity) => {
  const loading = notify.loading('Обработка')
  try {
    await cartStore.updateProductFromCart(cartId.value, {
      product_id: productId,
      quantity: quantity,
    })
    notify.success('Успешно')
  } catch (e) {
    notify.error('Ошибка')
    console.error(e)
  } finally {
    loading()
  }
}

const removeProductFromCart = async (productId) => {
  const loading = notify.loading('Обработка')
  try {
    await cartStore.removeProductFromCart(cartDetails.value.id, productId)
    notify.success('Успешно')
  } catch (e) {
    notify.error('Ошибка')
    console.error(e)
  } finally {
    loading()
  }
}

watch(
  () => userId.value,
  (newValue) => {
    if (newValue && !props.propsUserId) {
      fetchCart(newValue)
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (props.propsUserId) {
    fetchCart(props.propsUserId)
  }
})

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
})
</script>

<style lang="css"></style>
