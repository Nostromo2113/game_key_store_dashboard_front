<template>
  <q-card>
    <q-card-section class="row items-center">
      <span class="text-h6"
        >{{ cardText }} <strong>{{ itemTitle }}</strong
        >?</span
      >
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Нет" color="primary" v-close-popup></q-btn>
      <q-btn @click="confirm" flat label="Да" color="negative" v-close-popup></q-btn>
    </q-card-actions>
  </q-card>
</template>
<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const emit = defineEmits(['confirm'])
const props = defineProps({
  itemTitle: {
    type: String,
    default: 'title is not defined',
  },
  destroy: {
    type: Boolean,
    defaul: false,
  },
})

const cardText = props.destroy ? 'Подтверждаете' : 'Удалить '

const itemTitle = ref(props.itemTitle)

const confirm = () => {
  emit('confirm')
}
</script>
<style lang=""></style>
