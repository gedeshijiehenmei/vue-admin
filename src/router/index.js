import Vue from "vue";
import VueRouter from "vue-router";
import login from "../components/login.vue";
import Home from "../components/Home.vue";
import Welcome from "../components/welcome.vue";
import Users from "../components/userInfo.vue";
import shopping from "../components/goods.vue";
import rights from "../components/power/rights.vue";
import roles from "../components/power/roles.vue";
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      component: login
    },
    {
      path: "/home",
      component: Home,
      redirect: "/welcome",
      children: [
        {
          path: "/welcome",
          component: Welcome
        },
        {
          path: "/users",
          component: Users
        },
        {
          path: "/goods",
          component: shopping
        },
        {
          path: "/rights",
          component: rights
        },
        {
          path: "/roles",
          component: roles
        }
      ]
    }
  ]
});
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  next();
});
export default router;
