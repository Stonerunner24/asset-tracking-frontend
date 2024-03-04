<script setup>
import router from "../router";
import { onMounted, ref } from "vue";
import Utils from "../config/utils";
import QuicklinkServices from "../services/quicklinkServices";

const routes = router.options.routes;
const routePaths = ref([]);
const selectedPage = ref(null);
let user = Utils.getStore("user");
const userQuickLinks = ref([]);
const hideAdd = ref(true);

function changePage(route){
    console.log(route)
    router.push(route);
}
const setPages = async() => {
    const homeRoute = routes.find(route => route.path === '/home');
    if (homeRoute && homeRoute.children) {
        for (const childRoute of homeRoute.children) {
            if (childRoute.meta.qlviewable == true) {
                console.log("user id ", user.userId)
                const data = {
                    "path": childRoute.path,
                    "name": childRoute.meta ? childRoute.meta.qlname : childRoute.name,
                    "userId": user.userId,
                }
                routePaths.value.push(data);
                console.log("pushed data:", data)
            }
        }
    }
    console.log('routes',routePaths.value)
}

async function getQuickLinks() {
    try {
        const response = await QuicklinkServices.getByUserId(user.userId);
        userQuickLinks.value = response.data;
    } catch (error) {
        console.error('Error fetching User\'s quicklinks: ', error);
    }
}

async function saveLink(){
    try{
        const data = {
            name: selectedPage.value.name,
            path: selectedPage.value.path,
            userId: user.userId,
        }
        await QuicklinkServices.create(data);
        await getQuickLinks();
        changeAddView();
    } catch (error) {
        console.log(error);
    }
}

async function deleteLink(id) {
    console.log("action")
    try{
        await QuicklinkServices.delete(id);
        await getQuickLinks();
    } catch (error) {
        console.log(error);
    }
}

function changeAddView(){
    hideAdd.value = !hideAdd.value;
}
function cancelLink(){
    hideAdd.value = !hideAdd.value;
}

onMounted (async() => {
    await setPages();
    await getQuickLinks();
});

</script>
<template>
    <div class="ml-15 mt-5">
        <div v-for="route in routePaths">
        </div>
        <div class="pb-2 pt-4 mr-15">
            <v-card flat color="gray" class="pa-4" style="font-size: larger;">Welcome, {{ user.fName }}!</v-card>
        </div>
        <div class="pt-10">
            <v-row>
                <v-col cols="12" md="6">
                    
                    <v-card color="gray" flat>
                        <div class="pa-3">Quicklinks</div>
                        <v-row style="justify-content: center;">
                            <template v-for="p in userQuickLinks">
                                <v-col cols="auto">
                                    <div class="pt-3">
                                    <v-btn 
                                        color="blue" 
                                        flat @click="changePage(p.path)" 
                                        style="width: 30rem;"
                                    >{{ p.name }}</v-btn>
                                    <v-icon 
                                        v-on:click="deleteLink(p.id)"
                                    >mdi-delete</v-icon>
                                    </div>
                                </v-col>
                            </template>
                        </v-row>
                        <div class="pa-3" v-if="userQuickLinks.length <= 5" style="display: flex; justify-content: center;">
                            <div v-if="hideAdd == true" class="pt-3">
                                <v-btn 
                                flat @click="changeAddView()" 
                                style="width: 30rem;" 
                                >
                                <v-icon>mdi-plus</v-icon>
                                Add Link
                                </v-btn>
                                <v-icon></v-icon>
                            </div>
                            <div v-if="hideAdd == false">
                            <v-combobox 
                                v-model="selectedPage" 
                                :items="routePaths" 
                                label="Select a Page" 
                                item-title="name" 
                                item-value="path"
                                style="width: 20rem; height: 4rem; float: left;"
                            ></v-combobox>
                            <div class="pa-1" style="display: flex; justify-content: center;">
                                <v-btn 
                                flat size="small" 
                                color="blue" 
                                style="margin-right: 10px;"
                                @click="saveLink()"
                                >Save</v-btn>
                                <v-btn 
                                flat size="small"
                                @click="cancelLink()"
                                >Cancel</v-btn>
                            </div>
                            </div>
                        </div>
                    
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </div>
    </template>