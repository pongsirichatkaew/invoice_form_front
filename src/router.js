import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard.vue";
import DashboardAdmin from "@/views/DashboardAdmin.vue";
import FormApproved from "@/components/FormApprove.vue";
import FormRecieve from "@/components/FormRecieved.vue";
import FormTable from "@/components/FormTable.vue";
import ManageUser from "@/components/ManageUser.vue";
import QuotationPage from "@/views/quotation_page.vue";
Vue.use(Router);
import { Decode } from "./services/";

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    },
    { path: "/a", name: "a", component: QuotationPage },
    {
      path: "/dashboard",
      redirect: "/dashboard/form",
      name: "dashboard",
      component: Dashboard,
      beforeEnter: (to, from, next) => {
        if (window.$cookies.get("user")) {
          console.log("before");
          var obj = JSON.parse(Decode.decode(window.$cookies.get("user")));
          if (obj.role === 1) {
            next();
          } else if (obj.role === 2 || obj.role === 3) {
            next("/admin");
          }
        } else {
          next("/");
        }
      },
      children: [
        {
          path: "form",
          name: "formTable",
          component: FormTable
        }
      ]
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
            next("/dashboard");
          } else if (obj.role === 2 || obj.role === 3) {
            next();
          }
        } else {
          next("/");
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
        },
        {
          path: "recieved",
          name: "formRecieved",
          component: FormRecieve
        }
      ]
    }
  ]
});
