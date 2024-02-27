<script setup>
  import MenuBar from "../components/MenuBar.vue";
  import SideBar from "../components/SideBar.vue";
</script>
<template>
    <div>
      <MenuBar />
        <SideBar />
        <router-view />
    </div>
</template>
  