<template lang="">
  <q-form class="row full-width">
    <q-input filled label="Email" type="email" placeholder="Введите email" class="full-width">
      <template v-slot:prepend>
        <q-icon name="email" />
      </template>
      <template v-slot:append>
        <q-btn dense icon="send" flat class="text-grey-7"></q-btn>
      </template>
    </q-input>
  </q-form>
</template>
<script>
export default {}
</script>
<style lang=""></style>
