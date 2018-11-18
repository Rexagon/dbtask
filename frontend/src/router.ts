import Vue from 'vue';
import axios from 'axios';
import Router from 'vue-router';

import state from '@/models/state';

import HomePage from './views/Home.vue';
import LoginPage from './views/Login.vue';

Vue.use(Router);

const router = new Router({
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

router.beforeEach((to, from, next) => {
  if (
    (to.name && ['login'].includes(to.name)) ||
    state.userManager.currentUser
  ) {
    next();
    return;
  }

  next({
    name: 'login'
  });
});

axios.interceptors.response.use(
  (res) => {
    if (res.data.err != null) {
      return Promise.reject(res.data.err);
    }

    return Promise.resolve(res);
  },
  (err) => {
    const res = err.response;

    switch (res.status) {
      case 200:
        return res;

      case 401:
      case 403:
        router.push({ name: 'login' });
        return Promise.reject();

      default:
        return Promise.reject();
    }
  }
);

export default router;
