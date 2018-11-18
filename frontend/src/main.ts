import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = 'http://localhost:17400/api/';

import Vue from 'vue';

import App from './App.vue';
import router from './router';
import bus from './bus';

import VueBootstrap from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(VueBootstrap);

import VueNotifications from 'vue-notification';
Vue.use(VueNotifications);

import VueAutosize from 'vue-autosize';
Vue.use(VueAutosize);

Vue.config.productionTip = false;

Vue.prototype.$bus = bus;

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
