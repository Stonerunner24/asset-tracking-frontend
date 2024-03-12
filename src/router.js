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
import ModelLookup from "./views/ModelLookup.vue";
import ViewModel from "./views/ViewModel.vue";
import AddModel from "./views/AddModel.vue";
import TypeLookup from "./views/TypeLookup.vue";
import BuildingLookup from "./views/BuildingLookup.vue";
import BuildingView from "./views/BuildingView.vue"

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
            qlname: "Home",
            qlviewable: false,
          }
        },
        {
          path: "/itemlookup",
          alias: "/itemlookup",
          name: "itemlookup",
          component: ItemLookup,
          meta: {
            qlname: "Item Lookup",
            qlviewable: true,
          }
        },
        {
          path:"/itemview/:id",
          alias: "/itemview/:id",
          name: "itemview",
          component: ItemView,
          meta: {
            qlname: "Item Viewer",
            qlviewable: false,
          }   
        },
        {
          path:"/itemadd",
          name: "itemadd",
          component: ItemAdd,
          meta: {
            qlname: "Item Add",
            qlviewable: true,
          }
        },
        {
          path: "/viewCategories/", 
          name: "viewCategories",
          component: ViewCategories,
          props: true,
          meta: {
            qlname: "View All Categories",
            qlviewable: true,
          }
        },
        {
          path: "/viewCategory/:id",
          name: "viewCategory",
          component: ViewCategory,
          props: true,
          meta: {
            qlname: "Category Viewer",
            qlviewable: false,
          }
        },
        {
          path: "/typeview/:id",
          name: "typeview",
          component: TypeView,
          props: true,
          meta: {
            qlname: "Type Viewer",
            qlviewable: false,
          }
        },
        {
          path: "/modellookup",
          name: "modellookup",
          component: ModelLookup,
          meta: {
            qlname: "Model Lookup",
            qlviewable: true,
          }
        },
        {
          path: "/viewModel/:id",
          name: "viewModel",
          component: ViewModel,
          meta: {
            qlname: "Model View",
            qlviewable: false,
          }
        },
        {
          path: "/addModel/",
          name: "addModel",
          component: AddModel,
          props: true,
        },
        {   
          path: "/buildinglookup",
          name: "buildinglookup",
          component: BuildingLookup,
          meta: {
            qlname: "Building Lookup",
            qlviewable: true,
          }
        },
        {
          path: "/buildingview/:id",
          name: "buildingview",
          component: BuildingView,
          meta: {
            qlname: "Building View",
            qlviewable: false,
          }
        },
        {
          path: "/typelookup",
          name: "typelookup",
          component: TypeLookup,
          meta: {
            qlname: "Types Lookup",
            qlviewable: true,
          }
        },
      ]
    } 
  ],
});

export default router;
