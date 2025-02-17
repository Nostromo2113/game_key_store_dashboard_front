<template>
  <q-card class="bg-none" flat style="width: 500px">
    <div class="text-h6 text-center q-mb-md">Game Key Store Dashboard</div>
    <RegistrationForm v-if="authMode" @isRegistered="authMode = false" />
    <LoginForm v-else @isNotRegistered="authMode = true" />
  </q-card>
</template>

<script setup>
import RegistrationForm from 'src/components/forms/RegistrationForm.vue'
import LoginForm from 'src/components/forms/LoginForm.vue'
import { ref } from 'vue'
const authMode = ref(false)
</script>
<style type="css" scoped>
.bg-none {
  background: #00000000;
}
</style>
