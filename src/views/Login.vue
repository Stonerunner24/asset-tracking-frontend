<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import ocLogo from "/oc-logo-red.svg";
</script>

<template>
  <v-app-bar app color="primary" height="80">
    <v-img
          class="mx-2"
          :src=ocLogo
          height="80"
          width="80"
          contain
        ></v-img>
        <v-toolbar-title class="title">
        Asset Tracking
      </v-toolbar-title>
      <v-spacer/>
      <v-spacer/>
  </v-app-bar>
  <v-container>
    <h1>Welcome to OC Asset Tracking</h1>
    <text-subtitle-1>Please log in with OC credentials to continue</text-subtitle-1>
    <br /><br />
    <SocialLogin />
    <br /><br />
  </v-container>
</template>
