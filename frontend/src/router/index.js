import { createRouter, createWebHistory } from "vue-router";
import AccueilPage from "../pages/AccueilPage.vue";
import CartePage from "../pages/CartePage.vue";
import ReservationPage from "../pages/ReservationPage.vue";

const routes = [
  { path: "/", redirect: "/accueil" },
  { path: "/accueil", name: "accueil", component: AccueilPage },
  { path: "/carte", name: "carte", component: CartePage },
  { path: "/reservation", name: "reservation", component: ReservationPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: "smooth" };
    }
    return { top: 0 };
  },
});

export default router;
