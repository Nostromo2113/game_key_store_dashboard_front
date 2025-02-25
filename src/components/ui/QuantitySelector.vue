<template>
  <div class="row gap-sm items-center">
    <q-btn
      icon="remove"
      size="10px"
      round
      @click="decreaseQuantity"
      :disable="quantityCart <= 1"
      color="primary"
    />

    <span class="text-subtitle2 text-bold" style="width: 14px">
      {{ quantityCart }}
    </span>

    <q-btn
      icon="add"
      size="10px"
      round
      @click="increaseQuantity"
      color="primary"
      :disable="quantityCart >= quantityStore"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  quantity_cart: {
    type: Number,
    required: true,
  },
  quantity_store: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['update:quantity'])

const quantityCart = ref(props.quantity_cart)
const quantityStore = ref(props.quantity_store)

watch(
  () => props.quantity_cart,
  (newValue) => {
    quantityCart.value = newValue
  },
)

const increaseQuantity = () => {
  if (quantityCart.value < quantityStore.value) {
    quantityCart.value++
    emit('update:quantity', quantityCart.value)
  }
}

const decreaseQuantity = () => {
  if (quantityCart.value > 1) {
    quantityCart.value--
    emit('update:quantity', quantityCart.value)
  }
}
</script>

<style scoped></style>
