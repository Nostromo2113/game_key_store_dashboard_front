export const ordersColumns = [
  {
    name: 'show',
    label: 'Просмотреть заказ',
    align: 'center',
    fiels: 'show',
  },
  {
    name: 'orderNumber',
    label: 'номер заказа',
    field: 'orderNumber',
    align: 'center',
  },
  {
    name: 'id',
    label: 'id в БД',
    align: 'left',
    field: 'id',
    sortable: true,
  },
  {
    name: 'user_id',
    label: 'id заказчика',
    align: 'center',
    field: 'user_id',
  },
  {
    name: 'status',
    label: 'статус заказа',
    align: 'center',
    field: 'status',
  },
]
