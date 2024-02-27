<script setup>
import { useRoute } from 'vue-router';
import router from '../router';

function goToHome(){
    router.push("/homepage")
}
function goToItemLookup(){
    router.push("/itemlookup")
}
function goToCheckIn(){
    router.push("/")
}
function goToCheckOut(){
    router.push("/")
}
function goToModelLookup(){
    router.push("viewModel")
}

</script>
<template>
    <div>
        <v-navigation-drawer
            disable-resize-watcher
            expand-on-hover
            rail
            color="silver"
            width="200"
            floating="true"
            permanent="true"
        >
            <v-list>
                <v-list-item
                    prepend-icon="mdi-home-city"
                    title="Home" 
                    v-on:click="goToHome()"
                >
                </v-list-item>
                <v-list-item
                    prepend-icon="mdi-pencil"
                    title="Item Lookup"
                    v-on:click="goToItemLookup()"
                >
                </v-list-item>
                <v-list-item
                    prepend-icon="mdi-login"
                    title="Check In"
                    v-on:click="goToCheckIn()"
                >

                </v-list-item>
                <v-list-item
                    prepend-icon="mdi-logout"
                    title="Check Out"
                    v-on:click="goToCheckOut()"
                >

                </v-list-item>
                <V-list-item
                    prepend-icon="mdi-file-document"
                    title="Model Lookup"
                    v-on:click="goToModelLookup()"
                >

                </V-list-item>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>