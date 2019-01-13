import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

import Vue from 'vue';

import App from './App.vue';
import router from './router';

import VueBootstrap from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(VueBootstrap);

import VueNotifications from 'vue-notification';
Vue.use(VueNotifications);

import VueAutosize from 'vue-autosize';
Vue.use(VueAutosize);

import VueRx from 'vue-rx';
Vue.use(VueRx);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
