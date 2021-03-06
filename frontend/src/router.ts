import Vue from 'vue';
import axios from 'axios';
import Router from 'vue-router';

import state from '@/models/state';

import HomePage from './views/Home.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/signin',
      name: 'signin',
      component: () =>
        import(/* webpackChunkName: "auth" */ './views/Login.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () =>
        import(/* webpackChunkName: "auth" */ './views/Registration.vue')
    },
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/profile',
      name: 'profile',
      component: () =>
        import(/* webpackChunkName: "profile" */ './views/Profile.vue')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (
    (to.name && ['signin', 'signup'].includes(to.name)) ||
    state.userManager.currentUser
  ) {
    next();
    return;
  }

  next({
    name: 'signin'
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
        router.push({ name: 'signin' });
        return Promise.reject();

      default:
        return Promise.reject();
    }
  }
);

export default router;
