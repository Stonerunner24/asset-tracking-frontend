import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import ItemLookup from "./views/ItemLookup.vue";
import ItemView from "./views/ItemView.vue";
import ItemAdd from "./views/ItemAdd.vue";
import ViewCategory from "./views/ViewCategory.vue";
import ViewCategories from "./views/ViewCategories.vue";

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
    {
      path: "/itemadd",
      name: "itemadd",
      component: ItemAdd,
    },
    {
      path: "/viewCategories/",
      name: "viewCategories",
      component: ViewCategories,
      props: true,
    },
    {
      path: "/viewCategory/",
      name: "viewCategory",
      component: ViewCategory,
      props: true,
    },
  ],
});

export default router;
