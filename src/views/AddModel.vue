<script setup>
import { ref, onMounted, computed } from "vue";
import Sidebar from "../components/SideBar.vue";
import modelServices from "../services/modelServices";
import categoryServices from "../services/categorySerices";
import router from "../router";

const categories = ref([]);
const categoryNames = computed(() => categories.value.map(category => category.catName));


async function getCategories() {
    try {
        const response = await categoryServices.getAll();
        categories.value = response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}
onMounted(async () => {
    await getCategories();
});
</script>
<template>
    <v-container>
        <Sidebar />
    </v-container>
    <div class="ma-15 mt-7">
        <!-- Page Title -->
        <div style="font-size: x-large;">Add Model</div> 
        <v-combobox clearable label="Category" :items="categoryNames">
        </v-combobox>
    </div>
</template>