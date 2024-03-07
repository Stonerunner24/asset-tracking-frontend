<script setup>
    import BuildingServices from "../services/buildingServices";
    import { ref, onMounted } from "vue";

    const buildings = ref([]);

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

    onMounted(async () => {
        await getBuildings();
    });
</script>
<template>
    <div class="ma-15 mt-7">
        <div style="font-size: x-large;">Building Lookup</div>
        <v-data-table :items="buildings" class="display" :headers="headers">
            <template v-slot:item="{ item }">
                <tr>
                    <td>{{ item.buildingName }}</td>
                    <td>{{ item.buildingTag }}</td>
                    <td>{{ item.yearBuilt }}</td>
                    <td>{{ item.numStories }}</td>
                    <td>{{ item.sqFeet }}</td>
                    <td class="text-right">
                        <v-btn flat color="blue" size="small">view</v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
    </div>
</template>