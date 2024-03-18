<script setup>

import {ref} from 'vue';
import router from '../router';

function goToHome(){
    router.push("/home")
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
    router.push("modellookup")
}

const System = ref(false);

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
                    prepend-icon="mdi-home"
                    title="Home" 
                    v-on:click="goToHome()"
                >
                </v-list-item>
                <v-list-item
                    prepend-icon="mdi-barcode"
                    title="Items"
                    v-on:click="goToItemLookup()"
                >
                </v-list-item>
                <V-list-item
                    prepend-icon="mdi-laptop"
                    title="Models"
                    v-on:click="goToModelLookup()"
                >
                </V-list-item>
                <V-list-item
                    prepend-icon="mdi-signal"
                    title="Types"
                    v-on:click="goToModelLookup()"
                >
                </V-list-item>
                <V-list-item
                    prepend-icon="mdi-city-variant"
                    title="Buildings"
                    v-on:click="goToModelLookup()"
                >
                </V-list-item>
                <V-list-item
                    prepend-icon="mdi-account"
                    title="People"
                    v-on:click="goToModelLookup()"
                >
                </V-list-item>
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
                    prepend-icon="mdi-wrench"
                    title="Add Repair"
                    v-on:click="goToModelLookup()"
                >
                </V-list-item>
                <V-list-item
                    prepend-icon="mdi-file-document"
                    title="Reports"
                    v-on:click="goToModelLookup()"
                >
                </V-list-item>
                <v-list-group
                    v-model="System"
                >
                    <template v-slot:activator="{props}">
                        <v-list-item
                            title="System"
                            prepend-icon="mdi-cog"
                            v-bind="props"
                        ></v-list-item>
                    </template>
                    <v-list-item
                        title="Categories"
                    ></v-list-item>
                    <v-list-item
                        title="Fields"
                    ></v-list-item>
                    <v-list-item
                        title="Vendors"
                    ></v-list-item>
                    <v-list-item
                        title="Users"
                    ></v-list-item>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>