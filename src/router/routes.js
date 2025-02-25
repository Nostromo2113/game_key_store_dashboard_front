import IndexPage from 'pages/IndexPage.vue'
import ProductListPage from 'src/pages/lists/ProductListPage.vue'
import UserListPage from 'src/pages/lists/UserListPage.vue'
import OrderListPage from 'src/pages/lists/OrderListPage.vue'
import GenreListPage from 'src/pages/lists/GenreListPage.vue'
import CategoryListPage from 'src/pages/lists/CategoryListPage.vue'
import ProductPage from 'src/pages/details/ProductPage.vue'
import UserPage from 'src/pages/details/UserPage.vue'
import OrderShowPage from 'src/pages/details/OrderShowPage.vue'
import AuthPage from 'src/pages/AuthPage.vue'
import AuthLayout from 'src/layouts/AuthLayout.vue'
import AdminShowPage from 'src/pages/details/AdminShowPage.vue'
import ShopPage from 'src/pages/ShopPage.vue'

const routes = [
  {
    path: '/auth',
    component: AuthLayout,
    children: [{ path: 'auth', component: AuthPage, name: 'auth' }],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { breadCrumbName: 'Пользователи' },
    redirect: { name: 'index' },
    children: [
      {
        path: 'shop',
        component: ShopPage,
        name: 'shop',
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
        path: 'users/:userId',
        component: UserPage,
        name: 'user.show',
      },
      {
        path: 'users/:userId/:orderId',
        component: OrderShowPage,
        name: 'user.order.show',
      },

      {
        path: 'products',
        component: ProductListPage,
        name: 'products',
      },

      {
        path: 'products/:productId',
        component: ProductPage,
        name: 'product.show',
      },
      {
        path: 'products/create',
        component: ProductPage,
        name: 'product.create',
      },

      {
        path: 'orders',
        component: OrderListPage,
        name: 'orders',
      },
      {
        path: 'orders/:orderId',
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
