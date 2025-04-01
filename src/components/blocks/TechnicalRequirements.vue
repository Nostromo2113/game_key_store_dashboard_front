<template>
  <div>
    <div class="text-h6 text-weight-medium q-mb-md text-accent">Системные требования</div>
    <q-list bordered separator class="requirements-list glossy-card">
      <q-item class="requirement-item" v-for="item in requirements" :key="item.key">
        <q-item-section>
          <q-item-label class="text-caption text-grey-7">{{ item.label }}</q-item-label>
          <q-item-label class="text-h6 text-weight-medium">
            <template v-if="item.value">
              {{ item.value }}
              <span v-if="item.unit">{{ item.unit }}</span>
            </template>
            <template v-else>—</template>
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon :name="item.icon" size="sm" color="accent" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
})

const technical_requirements = ref(props.data)

const requirements = computed(() => [
  {
    key: 'platform',
    label: 'Платформа',
    value: technical_requirements.value.platform,
    icon: 'computer',
  },
  {
    key: 'os',
    label: 'Операционная система',
    value: technical_requirements.value.os,
    icon: 'terminal',
  },
  {
    key: 'cpu',
    label: 'Процессор',
    value: technical_requirements.value.cpu,
    icon: 'memory',
  },
  {
    key: 'gpu',
    label: 'Видеокарта',
    value: technical_requirements.value.gpu,
    icon: 'videogame_asset',
  },
  {
    key: 'ram',
    label: 'Оперативная память',
    value: technical_requirements.value.ram,
    unit: 'GB',
    icon: 'speed',
  },
  {
    key: 'storage',
    label: 'Хранилище',
    value: technical_requirements.value.storage,
    unit: 'GB',
    icon: 'storage',
  },
])

watch(
  () => props.data,
  (newVal) => {
    technical_requirements.value = newVal
  },
  { deep: true },
)
</script>

<style scoped>
.requirements-list {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.requirement-item {
  transition: all 0.3s ease;
  padding: 12px 16px;
}

.requirement-item:hover {
  background: rgba(63, 81, 181, 0.05);
  transform: translateX(4px);
}

.requirement-item + .requirement-item {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.text-accent {
  color: #3f51b5;
}
</style>
