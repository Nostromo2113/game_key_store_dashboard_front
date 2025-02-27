<template>
  <q-card class="q-pa-md q-mx-auto credit-card-form bg-gradient">
    <q-form @submit="submitForm" class="column gap-sm">
      <q-input v-model="cardNumber" label="Номер карты" mask="#### #### #### ####" filled />
      <q-input v-model="cardHolder" label="Имя владельца" filled />
      <div class="row q-col-gutter-md">
        <q-input class="col" v-model="expiryDate" label="Срок действия" mask="##/##" filled />
        <q-input class="col" v-model="cvv" label="CVV" type="password" filled />
      </div>
      <q-btn label="Оплатить" type="submit" color="primary" class="full-width q-mt-md" />
    </q-form>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'

const cardNumber = ref('4929 1234 5678 9012')
const cardHolder = ref('IVAN IVANOV')
const expiryDate = ref('12/27')
const cvv = ref('123')

const submitForm = () => {
  console.log('Данные карты:', cardNumber.value, cardHolder.value, expiryDate.value, cvv.value)
}
</script>

<style scoped>
.credit-card-form {
  max-width: 400px;
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
