<script setup>
  import MenuBar from "../components/MenuBar.vue";
  import SideBar from "../components/SideBar.vue";
</script>
<template>
    <div>
      <MenuBar />
      <SideBar />
      <v-container>
        <router-view />
      </v-container>
    </div>
</template>
  