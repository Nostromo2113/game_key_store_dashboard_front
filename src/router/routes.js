// =============================================
// 1. Базовые страницы (корневые и аутентификация)
// =============================================
import IndexPage from 'pages/IndexPage.vue' // Главная страница
import AuthPage from 'src/pages/AuthPage.vue' // Страница авторизации
import AuthLayout from 'src/layouts/AuthLayout.vue' // Лейаут для авторизации

// =============================================
// 2. Магазин и связанные страницы
// =============================================
import ShopLayout from 'src/layouts/ShopLayout.vue' // Лейаут магазина
import ShopIndexPage from 'src/pages/shop/ShopIndexPage.vue' // Главная страница магазина
import CartPage from 'src/pages/shop/ShopCartPage.vue' // Корзина покупок
import ShopOrderPage from 'src/pages/shop/ShopOrderPage.vue' // Страница оформления заказа
import ShopOrdersList from 'src/pages/shop/ShopOrdersList.vue' // Список заказов пользователя
import ShopProductPage from 'src/pages/shop/ShopProductPage.vue' // Просмотр продукта в магазине

// =============================================
// 3. Страницы списков (админка)
// =============================================
import ProductListPage from 'src/pages/lists/ProductListPage.vue' // Список товаров
import UserListPage from 'src/pages/lists/UserListPage.vue' // Список пользователей
import OrderListPage from 'src/pages/lists/OrderListPage.vue' // Список заказов
import GenreListPage from 'src/pages/lists/GenreListPage.vue' // Список жанров
import CategoryListPage from 'src/pages/lists/CategoryListPage.vue' // Список категорий
import KeysListPage from 'src/pages/lists/KeysListPage.vue' // Список ключей активации

// =============================================
// 4. Страницы детального просмотра (админка)
// =============================================
import ProductPage from 'src/pages/shows/ProductShowPage.vue' // Детали товара
import UserPage from 'src/pages/shows/UserShowPage.vue' // Профиль пользователя
import OrderShowPage from 'src/pages/shows/OrderShowPage.vue' // Детали заказа
import AdminShowPage from 'src/pages/shows/AdminShowPage.vue' // Админ-панель (детальный просмотр)

const routes = [
  {
    path: '/auth',
    component: AuthLayout,
    children: [{ path: 'auth', component: AuthPage, name: 'auth' }],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: { name: 'index' },
    children: [
      {
        path: 'shop',
        component: ShopLayout,
        redirect: { name: 'shop' },
        meta: { breadCrumbName: 'shop' },
        children: [
          {
            path: '',
            component: ShopIndexPage,
            name: 'shop',
          },
          {
            path: 'cart/:cartId',
            component: CartPage,
            name: 'shop.cart',
          },
          {
            path: 'orders/order/:orderId',
            component: ShopOrderPage,
            name: 'shop.order',
          },
          {
            path: 'orders',
            component: ShopOrdersList,
            name: 'shop.orders',
          },
          {
            path: 'product/:productId',
            component: ShopProductPage,
            name: 'shop.product',
          },
        ],
      },
      {
        path: 'admin',
        component: AdminShowPage,
        name: 'admin',
      },
      { path: 'index', component: IndexPage, name: 'index' },
      {
        path: 'users',
        component: UserListPage,
        name: 'users',
      },
      {
        path: 'users/user/:userId',
        component: UserPage,
        name: 'user.show',
      },
      {
        path: 'users/user/:userId/order/:orderId',
        component: OrderShowPage,
        name: 'user.order.show',
      },

      {
        path: 'products',
        component: ProductListPage,
        name: 'products',
      },

      {
        path: 'products/product/:productId',
        component: ProductPage,
        name: 'product.show',
      },
      {
        path: 'products/product/create',
        component: ProductPage,
        name: 'product.create',
      },
      {
        path: 'keys',
        component: KeysListPage,
        name: 'keys',
      },
      {
        path: 'orders',
        component: OrderListPage,
        name: 'orders',
      },
      {
        path: 'orders/order/:orderId',
        component: OrderShowPage,
        name: 'order.show',
      },
      {
        path: 'genres',
        component: GenreListPage,
        name: 'genres',
      },
      {
        path: 'categories',
        component: CategoryListPage,
        name: 'categories',
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
