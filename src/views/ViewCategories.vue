<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import CategoryServices from "../services/categorySerices"
 
const router = useRouter();

const categories = ref([]);
const catNames = ref([])

async function getCategory() {
    await CategoryServices.getAll()
        .then((response) => {
            console.log(response);
            categories.value= response.data;
        })
        .catch((err) => {
                console.log(err);
        })
}

onMounted(async() => {
    await getCategory();
})
</script>

<template>
<div  class="ma-15 mt-7">

    <!-- Page Title -->
    <div style="font-size: x-large;">
        Category Lookup
    </div>

    <!-- Category Data Table -->
    <!-- TODO Add Table functionality -->
    <v-dataTable class="display">
        <thead>
            <tr>
                <th style="font-weight: bolder;">Category Name</th>
                <th style="font-weight: bolder; text-align: right;">View</th>
            </tr>
            <tr v-for="c in categories">
                <th>
                    {{ c.catName }}
                </th>
                <th>
                    <div style="display: flex; justify-content: end;">
                    <td class="pr-5">
                        <v-btn color="blue" elevation="1">view</v-btn>
                    </td>
                    <td class="pl-5">
                        <v-btn color="gray" elevation="1">hide</v-btn>
                    </td>
                    </div>
                </th>
            </tr>
        </thead>
    </v-dataTable>

    <!-- Add Category Display -->
    <!-- TODOAdd API functionality -->
    <div class="pt-10">
    <v-card color="gray" class="pa-4">
        <v-row align="center" class="mr-2">
            <v-col cols="4">
                <v-text-field label="Category Name"></v-text-field>
            </v-col>
            <v-col cols="8" class="text-right"> 
                <v-btn color="blue">Save</v-btn>
            </v-col>
        </v-row>
    </v-card>
</div>

</div>


<!-- TODO data table of 2 tabs: visible and hidden -->
<!-- TODO List of category name on the left and view and hide buttons on the right -->

</template>