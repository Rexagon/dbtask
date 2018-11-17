import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = 'http://localhost:17400/api/';

import Vue from 'vue';

import App from './App.vue';
import router from './router';
import state from './models';

import VueBootstrap from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(VueBootstrap);

Vue.config.productionTip = false;

Vue.prototype.$state = state;

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
