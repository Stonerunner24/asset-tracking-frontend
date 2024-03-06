<script setup>
import { ref, onMounted, computed } from "vue";
import modelServices from "../services/modelServices";
import categoryServices from "../services/categoryServices";
import typeServices from "../services/typeServives";
import router from "../router";

const categories = ref([]);
const categoryNames = computed(() => categories.value.map(category => category.catName));

const types = ref([]);
const typeNames = computed(() => types.value.map(type => type.typeName));


async function getCategories() {
    try {
        const response = await categoryServices.getAll();
        categories.value = response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

async function getAllTypes(){
    try {
        const response = await typeServices.getAll();
        types.value = response.data;
    } catch (error) {
        console.error("Error fetching types:", error);
    }
}

async function getTypesForCategory(categoryId) {
    try {
        const response = await typeServices.getAllForCategory(categoryId);
        types.value = response.data;
    } catch (error) {
        console.error("Error fetching types:", error);
    }
}

async function changeCategory() {
    // Check to see if a category is selected
    // If category is null, set types to 
}

onMounted(async () => {
    await getCategories();
    await getAllTypes();
});

</script>
<template>
    <div class="ma-15 mt-7">
        <!-- Page Title -->
        <div style="font-size: x-large;">Add Model</div> 
        <!-- Category combobox. Needs to eventually restrict categories to only those assigned to user -->
        <v-combobox clearable label="Category" :items="categoryNames"></v-combobox>
        <!-- Type combo box -->
        <v-combobox clearable label="Type" :items="typeNames"></v-combobox>
        <!-- Name text entry -->
        <v-text-field clearable label="Name"></v-text-field>
        
    </div>
</template>