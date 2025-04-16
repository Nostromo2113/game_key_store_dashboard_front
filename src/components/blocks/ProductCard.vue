<template>
  <q-card class="flex justify-between gap-sm custom-rounded shadow-sm" flat>
    <q-img
      :src="getImageUrl(product.preview_image)"
      width="100%"
      height="200px"
      class="rounded-borders"
    />

    <q-card-section class="q-py-sm q-px-md full-width">
      <div class="text-h6">{{ product.title }}</div>
      <div class="text-subtitle2">{{ product.publisher }}</div>
      <div>
        <div class="text-subtitle1">Цена: {{ product.price }} ₽</div>
        <div class="text-subtitle2">Количество: {{ product.amount }}</div>
      </div>
    </q-card-section>

    <q-card-section class="q-py-none">
      <div class="q-px-sm bg-primary text-white custom-rounded text-caption">
        {{ product.category.title }}
      </div>
    </q-card-section>

    <q-card-actions align="center" class="full-width">
      <div class="row justify-between full-width">
        <q-btn
          flat
          rounded
          icon="visibility"
          @click="$emit('view', product.id)"
          label="Посмотреть"
          no-caps
        />

        <q-btn
          v-if="!isInCart"
          @click="$emit('add-to-cart', product)"
          color="primary"
          flat
          rounded
          icon="shopping_cart"
          no-caps
        >
          <q-tooltip v-if="isInCart">В корзине</q-tooltip>
        </q-btn>

        <q-btn
          v-if="isInCart"
          @click="$emit('remove-from-cart', product.id)"
          color="negative"
          icon="remove_shopping_cart"
          flat
          rounded
          no-caps
        />
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { getImageUrl } from 'src/utils/getImageUrl'

defineProps({
  product: {
    type: Object,
    required: true,
  },
  isInCart: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['view', 'add-to-cart', 'remove-from-cart'])
</script>

<style scoped>
.custom-rounded {
  border-radius: 16px;
}

.q-card {
  transition: transform 0.3s;
}

.q-card:hover {
  transform: scale(1.02);
}
</style>
