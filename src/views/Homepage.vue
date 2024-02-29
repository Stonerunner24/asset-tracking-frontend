<script setup>
import router from "../router";
import { onMounted, ref, computed } from "vue";
import Utils from "../config/utils";
import QuicklinkServices from "../services/quicklinkServices";

const routes = router.options.routes;
const routePaths = ref([]);
const selectedPage = ref(null);
let user = Utils.getStore("user");
const userQuickLinks = ref([]);

function changePage(route){
    console.log(route)
    router.push(route);
}
const setPages = async() => {
    const homeRoute = routes.find(route => route.path === '/home');
    if (homeRoute && homeRoute.children) {
        for (const childRoute of homeRoute.children) {
            const data = {
                "path": childRoute.path,
                "name": childRoute.meta ? childRoute.meta.qlname : childRoute.name,
            }
            routePaths.value.push(data);
        }
    }
    console.log(routePaths.name)
}

async function getQuickLinks() {
    try {
        console.log(`user: ${user.userId}`);
        const response = await QuicklinkServices.getByUserId(user.userId);
        userQuickLinks.value = response.data;
        console.log('User links:', userQuickLinks.value);
    } catch (error) {
        console.error('Error fetching User\'s quicklinks: ', error);
    }
}

onMounted (async() => {
    await setPages();
    await getQuickLinks();
});

</script>
<template>
<div class="ml-15 mt-5">
    <div class="pb-2 pt-4 mr-15">
        <v-card flat color="gray" class="pa-4" style="font-size: larger;">Welcome, {{ user.fName }}!</v-card>
    </div>
    <div class="pt-10">
        <!-- <div>{{ routePaths.name }}</div> -->
        <v-row>
            <v-col cols="12" md="6">
                <div>Quicklinks</div>
                <v-card color="gray" flat>
                    <div v-if="userQuickLinks.length <= 5">
                        <v-combobox :items="routePaths" item-text="name"></v-combobox>
                    </div>
                    <v-btn v-for="p in userQuickLinks" @click="changePage(p.path)">{{ p.name }}</v-btn>
                </v-card>
            </v-col>
        </v-row>
    </div>
</div>
</template> 