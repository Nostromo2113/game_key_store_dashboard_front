import { Notify } from 'quasar'

const notify = (options) => {
  // Поддерживаем как объект, так и строку
  const settings = typeof options === 'string' ? { message: options } : options

  // Всегда используем Notify.create (правильный вызов)
  return Notify.create({
    position: 'center',
    timeout: 400,
    color: 'primary',
    textColor: 'white',
    ...settings,
  })
}

// Добавляем методы-помощники
notify.success = (message, opts = {}) =>
  notify({
    message,
    color: 'positive',
    icon: 'check_circle',
    ...opts,
  })

notify.error = (message, opts = {}) =>
  notify({
    message,
    color: 'negative',
    icon: 'error',
    ...opts,
  })

notify.warning = (message, opts = {}) =>
  notify({
    message,
    color: 'warning',
    icon: 'warning',
    ...opts,
  })

notify.info = (message, opts = {}) =>
  notify({
    message,
    color: 'info',
    icon: 'info',
    ...opts,
  })

notify.loading = (message, opts = {}) => {
  return notify({
    message,
    color: 'primary',
    icon: 'hourglass_empty',
    spinner: true,
    timeout: 0,
    group: false,
    ...opts,
  })
}

export default notify
