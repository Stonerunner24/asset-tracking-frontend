<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import Sidebar from "../components/SideBar.vue";
</script>

<template>
  <v-container>
    <v-toolbar>
      <v-toolbar-title>Welcome to Tutorials!</v-toolbar-title>
    </v-toolbar>
    <Sidebar />
    <br /><br />
    <SocialLogin />
    <br /><br />
  </v-container>
</template>
