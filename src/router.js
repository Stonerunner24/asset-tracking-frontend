import { createRouter, createWebHistory } from "vue-router";

// import pages
import Login from "./views/Login.vue";
import Homepage from "./views/Homepage.vue";
import ItemLookup from "./views/ItemLookup.vue";
import ItemView from "./views/ItemView.vue";
import ItemAdd from "./views/ItemAdd.vue";
import TypeView from "./views/TypeView.vue"
import ViewCategory from "./views/ViewCategory.vue";
import ViewCategories from "./views/ViewCategories.vue";


// import layouts
import StandardLayout from "./layouts/StandardLayout.vue";

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
      // Parent path to all standardLayout pages
      // It contains the sidebar and menubar
      path: "/home",
      component: StandardLayout,
      children: [
        {
          path: "",
          name: "homepage",
          component: Homepage,
          meta: {
            qlname: "Home"
          }
        },
        {
          path: "/itemlookup",
          alias: "/itemlookup",
          name: "itemlookup",
          component: ItemLookup,
          meta: {
            qlname: "Item Lookup"
          }
        },
        {
          path:"/itemview/:id",
          alias: "/itemview/:id",
          name: "itemview",
          component: ItemView,
          meta: {
            qlname: "Item Viewer"
          }   
        },
        {
          path:"/itemadd",
          name: "itemadd",
          component: ItemAdd,
          meta: {
            qlname: "Item Add"
          }
        },
        {
          path: "/viewCategories/",
          name: "viewCategories",
          component: ViewCategories,
          props: true,
          meta: {
            qlname: "View All Categories"
          }
        },
        {
          path: "/viewCategory/:id",
          name: "viewCategory",
          component: ViewCategory,
          props: true,
          meta: {
            qlname: "Category Viewer"
          }
        },
        {
          path: "/typeview/:id",
          name: "typeview",
          component: TypeView,
          props: true,
          meta: {
            qlname: "Type Viewer"
          }
        },
      ]
    }
    
  ],
});

export default router;
