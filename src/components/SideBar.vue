<script setup>

import {ref} from 'vue';
import router from '../router';

function goToPage(page){
    router.push(page);
}

const permission = 0;
/*TODO: ONCE PERMISSIONS ARE FINISHED
    GET USER ROLE
    ASSIGN TO
    0 - GUEST
    1 - WORKER
    2 - MANAGER
    3 - ADMIN
    DISPLAY LIST ITEM IF THE PERMISSION LEVEL IS LESS THAN OR EQUAL TO YOUR OWN
*/

const list = ref([
    {title: 'Home', icon: 'mdi-home', link: '/home', permission: 0},
    {title: 'Items', icon: 'mdi-barcode', link: '/itemlookup', permission: 1},
    {title: 'Models', icon: 'mdi-laptop', link: '/modellookup', permission: 1},
    {title: 'Types', icon: 'mdi-signal', link: '/typelookup', permission: 2},
    {title: 'Categories', icon: '', link: 'viewcategories', permission: 3},
    {title: 'Buildings', icon: 'mdi-city-variant', link: '/buildinglookup', permission: 2},
    {title: 'People', icon: 'mdi-account', link: '/peoplelookup', permission: 2},
    {title: 'Check In', icon: 'mdi-login', link: '/checkin', permission: 1},
    {title: 'Check Out', icon: 'mdi-logout', link: '/checkout', permission: 1},
    {title: 'Add Repair', icon: 'mdi-wrench', link: '/repairadd', permission: 1},
    {title: 'Reports', icon: 'mdi-file-document', link: '/reports', permission: 2},
]);

const system = ref(false);
const groupList = ref([
    {title: 'Categories', link: '/viewcategories'},
    {title: 'Fields', link: '/'},
    {title: 'Vendors', link: '/'},
    {title: 'Users', link: ''}
]);

</script>
<template>
<div>
    <v-navigation-drawer
        disable-resize-watcher
        expand-on-hover
        rail
        color="silver"
        width="200"
        :floating="true"
        :permanent="true"
    >
        <v-list density="compact">
            <v-list-item v-for="item in list"
                :prepend-icon="item.icon"
                :title="item.title" 
                v-on:click="goToPage(item.link)"
            ></v-list-item>
            <v-list-group v-model="system" :value="system">
                <template v-slot:activator="{props}">
                    <v-list-item
                        title="System"
                        prepend-icon="mdi-cog"
                        v-bind="props"
                    ></v-list-item>
                </template>
                <v-list-item
                    v-for="item in groupList"
                    :title="item.title"
                    :value="item.title"
                    v-on:click="goToPage(item.link)"
                ></v-list-item>
            </v-list-group>
        </v-list>
    </v-navigation-drawer>
</div>
</template>