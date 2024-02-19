import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import ItemLookup from "./views/ItemLookup.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      alias: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/itemlookup",
      alias: "/itemlookup",
      name: "itemlookup",
      component: ItemLookup
    },
  ],
});

export default router;
