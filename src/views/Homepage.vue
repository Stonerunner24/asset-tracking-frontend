<script setup>
import router from "../router";
import { onMounted, ref, computed } from "vue";

const routes = router.options.routes;
const routePaths = ref([]);
const selectedPage = ref(null);

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

onMounted (async() => {
    await setPages();
});

// const pages = computed(() => {
//     return routePaths.value.map(route => route.name);
// });

</script>
<template>
<div class="ml-15 mt-5">
    <div>{{ routes }}</div>
    <div v-for="route in routePaths" :key="route.path">{{ route.name }}</div>
    <div class="pb-2 pt-4 mr-15">
        <v-card flat color="gray" class="pa-4" style="font-size: larger;">Welcome!</v-card>
    </div>
    <div class="pt-10">
        <!-- <div>{{ routePaths.name }}</div> -->
        <v-row>
            <v-col cols="12" md="6">
                <div>Quicklinks</div>
                <v-card color="gray" flat>
                    <div class="pa-5">
                        <v-combobox :items="routePaths" item-text="name" item-value="path" v-model="selectedPage"></v-combobox>
                        <v-btn flat color="silver"  @click="changePage(selectedPage.path)">View Categories</v-btn>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </div>
</div>
</template>