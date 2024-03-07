<script setup>
    import BuildingServices from "../services/buildingServices";
    import { ref, onMounted } from "vue";

    const buildings = ref([]);

    async function getBuildings() {
        try {
            const response = await BuildingServices.getAll();
            buildings.value = response.data;
            console.log(buildings)
        } catch (error) {
            console.error("Error fetching buildings:", error);
        }
    }

    onMounted(async () => {
        await getBuildings();
    });
</script>
<template>
    <div>{{ buildings }}</div>
</template>