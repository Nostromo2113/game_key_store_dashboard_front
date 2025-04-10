<template>
  <div>
    <q-table
      title="Пользователи"
      :rows="rows"
      :columns="usersColumns"
      :pagination="tablePagination"
      row-key="title"
      flat
      class="custom-rounded q-pa-md text-blue-grey-9 shadow-sm"
      dense
    >
      <template v-slot:top-right>
        <q-btn
          @click="createModal = !createModal"
          size="16px"
          color="primary"
          icon="add"
          unelevated
          class="custom-rounded"
        ></q-btn>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="show" :props="props">
            <q-btn
              flat
              :to="{
                name: 'user.show',
                params: { userId: props.row.id },
              }"
              rounded
              dense
              icon="visibility"
            />
          </q-td>
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="avatar" :props="props">
            <q-img
              width="75px"
              height="75px"
              :src="getImageUrl(props.row.avatar)"
              class="custom-rounded"
            ></q-img>
          </q-td>
          <q-td key="email" :props="props">
            {{ props.row.email }}
          </q-td>
          <q-td key="name" :props="props" class="cursor-pointer">
            {{ props.row.name }}
          </q-td>
          <q-td key="surname" :props="props">
            {{ props.row.surname }}
          </q-td>
          <q-td key="patronymic" :props="props">
            {{ props.row.patronymic }}
          </q-td>
          <q-td key="age" :props="props">
            {{ props.row.age }}
          </q-td>
          <q-td key="address" :props="props">
            {{ props.row.address }}
          </q-td>
          <q-td key="phoneNumber" :props="props">
            {{ props.row.phone_number }}
          </q-td>
          <q-td key="destroy" :props="props">
            <q-btn
              @click="prepareForRemove(props.row)"
              icon="close"
              size="12px"
              color="negative"
              round
              dense
              unelevated
            ></q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog v-model="modalRemove" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="text-h6"
            >Удалить пользователя: <strong>{{ itemToRemove.name }}</strong
            >?</span
          >
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Нет" color="primary" v-close-popup></q-btn>
          <q-btn
            @click="removeUser(itemToRemove.id)"
            flat
            label="Да"
            color="negative"
            v-close-popup
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="createModal" persistent full-width>
      <user-form title="Добавить пользователя"></user-form>
    </q-dialog>
  </div>
</template>
<script setup>
import { ref, defineEmits, onMounted } from 'vue'
import UserForm from '../forms/UserForm.vue'
import { usersColumns } from 'src/constants/usersColumns'
import { getData } from 'src/utils/http/get'
import { deleteData } from 'src/utils/http/delete'
import { getImageUrl } from 'src/utils/getImageUrl'

const emit = defineEmits('success')

const createModal = ref(false)
const modalRemove = ref(false)
const itemToRemove = ref({})
const rows = ref([])

const prepareForRemove = (item) => {
  itemToRemove.value = item
  modalRemove.value = true
}

const removeUser = async (userId) => {
  const path = `users/${userId}`
  try {
    await deleteData(path)
  } catch (e) {
    console.error(e)
  } finally {
    getUsers('users')
  }
}

const getUsers = async (path) => {
  try {
    const response = await getData(path)
    rows.value = response.data
    emit('success')
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  getUsers('users')
})

const tablePagination = ref({
  page: 1,
  rowsPerPage: 20,
})
</script>
<style lang="css"></style>
