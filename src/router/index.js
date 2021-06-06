import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index.js";
import routes from "./routes";

Vue.use(VueRouter);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function(/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });
  Router.beforeEach(async (to, from, next) => {
    // Si es necesaria la auth y no hay usuario
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresaDMIN = to.matched.some(record => record.meta.requiresAdmin);
    if (requiresAuth && store.getters["auth/isAuthenticated"]) next("/login");
    if (requiresAdmin && store.getters["auth/isAdmin"] == "Admin")
      next("/login");
    // Si estoy autentificado y estoy por ahí
    // else if (!requiresAuth && currentUser) next("/calendario");
    // Si estoy bien tiro millas
    else next();
  });
  return Router;
}
