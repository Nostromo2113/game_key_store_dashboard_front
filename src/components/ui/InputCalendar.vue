<template lang="">
  <div>
    <q-input v-model="inputValue" mask="date" label="Дата релиза" :rules="['date']" outlined dense>
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="inputValue" :locale="russianLocale">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Закрыть" color="primary" flat></q-btn>
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { ref, defineProps, watch, defineEmits } from 'vue'
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const inputValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue
  },
)
watch(
  () => inputValue.value,
  (newDate) => {
    onDateChange(newDate)
  },
)

// Обработчик изменения даты
const onDateChange = (newDate) => {
  inputValue.value = newDate
  console.log('123')
  // Эмитим событие для обновления модели
  emit('update:modelValue', inputValue.value)
}

const russianLocale = {
  days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  daysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  months: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
}
</script>

<style lang=""></style>
