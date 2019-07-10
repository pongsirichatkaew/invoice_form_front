import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import Axios from "axios";
import VueAxios from "vue-axios";
Vue.use(require('vue-cookies'))

Vue.config.productionTip = false;
Vue.use(VueAxios, Axios);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
