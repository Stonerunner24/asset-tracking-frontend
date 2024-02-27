<script setup>
import router from "../router";

function goToViewCategories(){
    router.push("/viewCategories")
}
function goToViewTypes(){
    router.push("/")
}
function goToViewModels(){
    router.push("/")
}
function goToViewItems(){
    router.push("/itemlookup")
}

</script>
<template>
<div class="ml-15 mt-5">
    <div class="pb-2 pt-4 mr-15">
        <v-card flat color="gray" class="pa-4" style="font-size: larger;">Welcome!</v-card>
    </div>

    <div class="pt-10">
        <v-row>
            <v-col cols="12" md="6">
                <div>Quicklinks</div>
                <v-card color="gray" flat>
                    <div class="pa-5">
                        <v-btn flat block color="silver" @click="goToViewCategories()">View Categories</v-btn>
                    </div>
                    <div class="pa-5">
                        <v-btn flat block color="silver" @click="goToViewTypes">View Types</v-btn>
                    </div>
                    <div class="pa-5">
                        <v-btn flat block color="silver" @click="goToViewModels">View Models</v-btn>
                    </div>
                    <div class="pa-5">
                        <v-btn flat block color="silver" @click="goToViewItems">View Items</v-btn>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </div>
</div>
</template>