<template>
  <q-form class="row full-width reset-form" @submit="resetPassword(email)">
    <q-input
      v-model="email"
      filled
      label="Email"
      type="email"
      placeholder="Введите email"
      class="col"
    >
      <template v-slot:prepend>
        <q-icon name="email" />
      </template>
    </q-input>
    <q-btn dense type="submit" icon="send" flat class="text-grey-7 reset-btn"></q-btn>
  </q-form>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import { postData } from 'src/utils/http/post'

const props = defineProps({
  userEmail: {
    type: String,
  },
})

const email = ref(props.userEmail || '')

const resetPassword = async (email) => {
  try {
    await postData('password/reset', { email: email })
  } catch (e) {
    console.error(e)
  }
}
</script>

<style lang="css">
.reset-form {
  position: relative;
}
.reset-btn {
  position: absolute;
  right: 0;
  height: 100%;
}
</style>
