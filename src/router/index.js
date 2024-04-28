import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/form',
    name: 'form',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "form" */ '../views/FormView.vue');
    },
  },
  {
    path: '/table',
    name: 'table',
    component: function () {
      return import(/* webpackChunkName: "table" */ '../views/TableView.vue');
    },
  },
  {
    path: '/user',
    name: 'user',
    component: function () {
      return import(/* webpackChunkName: "user" */ '../views/UserView.vue');
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
