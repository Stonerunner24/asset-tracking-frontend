<script setup>
import router from "../router";

const itemLookup = () => {
    router.push(({name: 'itemlookup'}));
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
                >
                </v-list-item>
                <v-list-item
                    prepend-icon="mdi-pencil"
                    title="Item Lookup"
                    @click="itemLookup"
                >
                </v-list-item>
                <v-list-item
                    prepend-icon="mdi-login"
                    title="Check In"
                >

                </v-list-item>
                <v-list-item
                    prepend-icon="mdi-logout"
                    title="Check Out"
                >

                </v-list-item>
                <V-list-item
                    prepend-icon="mdi-file-document"
                    title="Model Lookup"
                >

                </V-list-item>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>