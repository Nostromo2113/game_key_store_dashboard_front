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

<script>
export default {
  data() {
    return {
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
    }
  },
  methods: {
    submitForm() {
      console.log('Данные карты:', this.cardNumber, this.cardHolder, this.expiryDate, this.cvv)
    },
  },
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
