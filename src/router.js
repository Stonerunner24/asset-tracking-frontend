import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import ItemLookup from "./views/ItemLookup.vue";
import ItemView from "./views/ItemView.vue";
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
    {
      path:"/itemview/:id",
      alias: "/itemview/:id",
      name: "itemview",
      component: ItemView
    },
  ],
});

export default router;
