<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
 
const router = useRouter();

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
                <th>Category Name</th>
                <th>View</th>
            </tr>
        </thead>
    </v-dataTable>

    <!-- Add New Category Button -->
    <!-- TODO Add btn functionality -->
    <!-- TODO Make btn text white -->
    <v-btn prepend-icon="mdi-plus" color="secondary">Add New Category</v-btn>

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