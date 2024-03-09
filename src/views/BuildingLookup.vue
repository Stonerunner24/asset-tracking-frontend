<script setup>
    import BuildingServices from "../services/buildingServices";
    import { ref, onMounted, computed } from "vue";
    import router from "../router";

    const buildings = ref([]);
    const search = ref('');

    const headers = ref([
        { title: 'Name', value: 'buildingName'},
        { title: 'Abbreviation', value: 'buildingTag'},
        { title: 'Built', value: 'yearBuilt'},
        { title: 'Floors', value: 'numStories'},
        { title: 'Square Feet', value: 'sqFeet'},
        { title: 'Action', align:'end' }
    ])

    async function getBuildings() {
        try {
            const response = await BuildingServices.getAll();
            buildings.value = response.data;
            console.log(buildings)
        } catch (error) {
            console.error("Error fetching buildings:", error);
        }
    }

    const filteredBuildings = computed(() =>{
        return buildings.value.filter(building => {
            return building.buildingName.toLowerCase().includes(search.value.toLowerCase()) ||
            building.buildingTag.toLowerCase().includes(search.value.toLowerCase());
        });
    });

    function viewBuilding(buildingId) {
        router.push(`/buildingview/${buildingId}`)
    }

    onMounted(async () => {
        await getBuildings();
    });
</script>
<template>
    <div class="ma-15 mt-7">
        <div style="font-size: x-large;">Building Lookup</div>
        <div class="pt-5">
        <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            single-line
            variant="outlined"
            hide-details
        ></v-text-field>
        <v-data-table :items="filteredBuildings" class="display" :headers="headers">
            <template v-slot:item="{ item }">
                <tr>
                    <td>{{ item.buildingName }}</td>
                    <td>{{ item.buildingTag }}</td>
                    <td>{{ item.yearBuilt }}</td>
                    <td>{{ item.numStories }}</td>
                    <td>{{ item.sqFeet }}</td>
                    <td class="text-right">
                        <v-btn flat color="blue" size="small" @click="viewBuilding(item.id)">view</v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
        </div>
    </div>
</template>