import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import Dashboard from "./views/Dashboard.vue";
import DashboardAdmin from "./views/DashboardAdmin.vue";
import FormApproved from "./components/FormApprove.vue";
import ManageUser from "./components/ManageUser.vue";
Vue.use(Router);
import { Encode, Decode } from "./services/";

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: Dashboard,
      beforeEnter: (to, from, next) => {
        if (window.$cookies.get("user")) {
          var obj = JSON.parse(Decode.decode(window.$cookies.get("user")));
          if (obj.role === 1) {
            next();
          } else if (obj.role === 2 || obj.role === 3) {
            next("/admin");
          }
        } else {
          next("/login");
        }
      }
    },
    {
      path: "/admin",
      redirect: "/admin/form",
      name: "admin",
      component: DashboardAdmin,
      beforeEnter: (to, from, next) => {
        if (window.$cookies.get("user")) {
          var obj = JSON.parse(Decode.decode(window.$cookies.get("user")));
          if (obj.role === 1) {
            next("/");
          } else if (obj.role === 2 || obj.role === 3) {
            next();
          }
        } else {
          next("/login");
        }
      },
      children: [
        {
          path: "form",
          name: "formApproved",
          component: FormApproved
        },
        {
          path: "manage",
          name: "manageUser",
          component: ManageUser
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      component: Login
    }
  ]
});
