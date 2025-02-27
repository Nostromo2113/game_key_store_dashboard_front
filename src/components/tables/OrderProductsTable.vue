<template>
  <div>
    <q-table
      :rows="rows"
      :columns="columns"
      :pagination="tablePagination"
      row-key="title"
      flat
      dense
      class="q-pa-sm text-blue-grey-9"
    >
      <template v-if="!shop && status" v-slot:top-right>
        <div class="row gap-sm">
          <q-badge color="info" class="text-subtitle2 text-black"> Ключи зарезервированы </q-badge>
          <q-badge color="secondary" class="text-subtitle2 text-black">
            Примените изменения
          </q-badge>
        </div>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="preview_image" :props="props">
            <q-img
              :src="getImageUrl(props.row.preview_image)"
              width="160px"
              height="80px"
              class="rounded-borders"
            ></q-img>
          </q-td>
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="title" :props="props">
            {{ props.row.title }}
          </q-td>
          <q-td key="publisher" :props="props">
            {{ props.row.publisher }}
          </q-td>
          <q-td key="release_date" :props="props">
            {{ props.row.release_date }}
          </q-td>

          <q-td key="price" :props="props">
            {{ props.row.price }}
          </q-td>

          <q-td key="quantity" :props="props" class="cursor-pointer">
            <q-badge
              v-if="!shop && status !== 'completed'"
              :color="
                props.row.activation_keys.length > 0 &&
                props.row.activation_keys.length === props.row.quantity
                  ? 'info'
                  : 'secondary'
              "
              class="text-subtitle2 text-black q-px-md"
            >
              {{ props.row.quantity }}
            </q-badge>
            <div v-if="shop && status !== 'completed'">{{ props.row.activation_keys.length }}</div>
            <div v-if="status === 'comleted'">{{ props.row.quantity }}</div>
            <q-popup-edit v-model="props.row.quantity" title="Кол-во экземпляров" buttons>
              <q-input
                v-model="props.row.quantity"
                :min="1"
                type="number"
                dense
                autofocus
              ></q-input>
            </q-popup-edit>
          </q-td>
          <q-td key="keys" :props="props">
            <q-btn
              size="12px"
              color="primary"
              round
              dense
              unelevated
              @click="props.expand = !props.expand"
              :icon="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
            ></q-btn>
          </q-td>
          <q-td key="remove" :props="props">
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
        <q-tr v-if="!shop && status !== 'completed'" v-show="props.expand" :props="props">
          <q-td colspan="100%" class="bg-grey-1">
            <q-list
              dense
              class="items-start flex column"
              style="padding-left: -20px"
              v-if="props.row.activation_keys.length > 0"
            >
              <q-item v-for="(item, index) in props.row.activation_keys" :key="index">
                <q-item-section class="text-subtitle2">
                  <q-badge color="primary" class="text-subtitle2" style="min-width: 180px">
                    <span class="text-grey q-mr-sm">{{ index + 1 }}. </span>
                    {{ item.key }}
                  </q-badge>
                </q-item-section>
              </q-item>
            </q-list>
            <div v-if="props.row.activation_keys.length < 1" class="text-h6">
              Примените для привязки ключей
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog v-model="modalRemove" persistent>
      <confirmation-card :itemTitle="removeItem.title" @confirm="removeFromOrder(removeItem.id)" />
    </q-dialog>
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import { orderProductsColumns } from 'src/constants/orderProductsColumns.js'
import { defineEmits } from 'vue'
import ConfirmationCard from '../ui/ConfirmationCard.vue'
import { getImageUrl } from 'src/utils/getImageUrl'

const emit = defineEmits(['removeFromOrder'])

const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
  shop: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: 'completed',
  },
})

const columns = ref([])

const rows = ref([])
const removeItem = ref({})

const modalRemove = ref(false)

const prepareForRemove = (item) => {
  modalRemove.value = true
  removeItem.value = item
}
const removeFromOrder = async (id) => {
  emit('removeFromOrder', id)
}

watch(
  () => props.tableData,
  (newVal) => {
    rows.value = newVal
  },
)

onMounted(() => {
  if (props.shop) {
    columns.value = orderProductsColumns.filter(
      (column) => column.name !== 'remove' && column.name !== 'id' && column.name !== 'keys',
    )
  } else {
    columns.value = orderProductsColumns
  }
})
const tablePagination = ref({
  page: 1,
  rowsPerPage: 20,
})
</script>
<style lang="css"></style>
