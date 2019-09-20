import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";
import Axios from "axios";
import VueAxios from "vue-axios";
// import VueSocketIO from 'vue-socket.io'

Vue.use(require('vue-cookies'))
Vue.config.productionTip = false;
Vue.use(VueAxios, Axios);

// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: 'http://localhost:5000/api/v2',
// }))

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
