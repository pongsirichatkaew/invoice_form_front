import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import Dashboard from "./views/Dashboard.vue";
import DashboardAdmin from "./views/DashboardAdmin.vue";
import FormApproved from "./components/FormApprove.vue";
import ManageUser from "./components/ManageUser.vue"
Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: Dashboard
    },
    {
      path: "/admin",
      name: "admin",
      component: DashboardAdmin,
      children: [
        {
          path: "",
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
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/login",
      name: "login",
      component: Login
    }
  ]
});
