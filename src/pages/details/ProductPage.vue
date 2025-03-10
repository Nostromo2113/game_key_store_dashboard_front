<template>
  <div class="q-pa-md">
    <q-card class="custom-rounded shadow-sm q-pa-sm" flat>
      <q-toolbar>
        <q-toolbar-title>{{ tab === 'product' ? 'Продукт' : 'Ключи' }}</q-toolbar-title>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey q-mb-sm"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab name="product" label="Продукт"></q-tab>
          <q-tab name="keys" label="Ключи"></q-tab>
        </q-tabs>
      </q-toolbar>
      <q-separator></q-separator>
      <q-tab-panels v-model="tab" animated keep-alive>
        <q-tab-panel name="product">
          <ProductDetails @getProductId="(productId) => (productId = productId)" />
        </q-tab-panel>
        <q-tab-panel name="keys"> <ActivationKeysTable :productId="productId" /> </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import ProductDetails from 'src/components/blocks/ProductDetails.vue'
import ActivationKeysTable from 'src/components/tables/ActivationKeysTable.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tab = ref('product')
const productId = route.params.productId
</script>
<style lang=""></style>
