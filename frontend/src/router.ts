import Vue from 'vue';
import Router from 'vue-router';

import HomePage from './views/Home.vue';
import LoginPage from './views/Login.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});
