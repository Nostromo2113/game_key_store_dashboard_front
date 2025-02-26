export const cartProductsColumns = [
  {
    name: 'preview_image',
    label: 'Эскиз',
    align: 'center',
    field: 'preview_image',
  },
  {
    name: 'id',
    label: 'id в БД',
    align: 'left',
    field: 'id',
    sortable: true,
  },
  {
    name: 'title',
    label: 'Продукт',
    align: 'center',
    field: 'title',
    sortable: true,
  },
  {
    name: 'publisher',
    label: 'Издатель',
    align: 'center',
    field: 'publisher',
    sortable: true,
  },
  {
    name: 'release_date',
    label: 'Дата выхода',
    align: 'center',
    filed: 'release_date',
    sortable: true,
  },

  {
    name: 'price',
    label: 'Цена',
    align: 'center',
    filed: 'price',
  },

  {
    name: 'quantity',
    label: 'Единиц в заказе',
    align: 'center',
    field: 'quantity',
  },
  {
    name: 'destroy',
    label: 'удалить',
    align: 'center',
    field: 'destroy',
  },
]
