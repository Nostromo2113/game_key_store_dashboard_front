<template>
  <div>
    <q-card class="no-shadow rounded-borders q-pa-md q-mx-auto" style="max-width: 400px">
      <q-card-section class="row items-center q-pa-none q-pb-sm">
        <div class="text-h6">Добавить элемент</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>
      <q-form @submit="store" @reset="resetData" class="q-gutter-md" label="Добавить">
        <q-input
          v-model="formData.title"
          placeholder="Новая запись"
          hint="Название в текстовом формате"
          outlined
          autofocus
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Поле обязательно для заполнения']"
        ></q-input>
        <q-toggle
          v-model="accept"
          label="Подтверждаю добавление в базу данных"
          checked-icon="check"
          color="green"
          unchecked-icon="clear"
        ></q-toggle>

        <div style="display: flex; justify-content: end">
          <q-btn label="Отправить" type="submit" color="primary" unelevated></q-btn>
          <q-btn label="Очистить" type="reset" color="primary" flat class="q-ml-sm"></q-btn>
          <!-- <div style="width: 38px">
            <q-spinner color="primary" size="3em"></q-spinner>
          </div> -->
        </div>
      </q-form>
    </q-card>
  </div>
</template>
<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['storeItem'])

import { ref } from 'vue'
const formData = ref({
  title: '',
})

const accept = ref(false)

const store = async () => {
  if (accept.value) {
    emit('storeItem', formData.value)
    accept.value = false
    resetData()
  } else {
    console.error('Подтвердите добавление в БД')
  }
}

const resetData = () => {
  formData.value.title = ''
  accept.value = false
}
</script>
<style lang=""></style>
