<script setup>
    import { ref, onMounted } from "vue";
    import { useRoute } from 'vue-router'
    import BuildingServices from "../services/buildingServices";
    import router from "../router";

    const route = useRoute();
    const requestId = route.params.id;
    const building = ref({});

    async function getBuilding() {
        try {
            const response = await BuildingServices.get(requestId);
            building.value = response.data;
        } catch (error) {
            console.error("Error fetching building:", error);
        }
    }

    onMounted(async () => {
        await getBuilding();
    });
</script>
<template>
    <div class="ma-15 mt-7">
        <div style="font-size: x-large;">View Building</div>

        <div class="pt-3">
            <v-text-field 
                label="Name" 
                color="blue" 
                variant="underlined" 
                style="width: 30%; 
                min-width: 10rem;" 
                readonly
                v-model="building.buildingName">
            </v-text-field>
            <v-text-field 
                label="Abbreviation" 
                color="blue" 
                variant="underlined" 
                style="width: 30%; 
                min-width: 10rem;" 
                readonly
                v-model="building.buildingTag">
            </v-text-field>
        </div>

        <div>
            <v-card color="gray" flat class="pa-3">
                <div style="font-size: large;" class="pb-2">Building Data</div>
                <v-row>
                    <v-col>
                        <v-text-field
                            label="Year Built"
                            color="blue"
                            variant="underlined"
                            style="width: 30%; 
                            min-width: 10rem;"
                            readonly
                            v-model="building.yearBuilt"
                        ></v-text-field>
                        <v-text-field
                            label="Square Feet"
                            color="blue"
                            variant="underlined"
                            style="width: 30%; 
                            min-width: 10rem;"
                            readonly
                            v-model="building.sqFeet"
                        ></v-text-field>
                        <v-text-field
                            label="value"
                            color="blue"
                            variant="underlined"
                            style="width: 30%; 
                            min-width: 10rem;"
                            readonly
                            v-model="building.value"
                        ></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field
                            label="# of Stories"
                            color="blue"
                            variant="underlined"
                            style="width: 30%; 
                            min-width: 10rem;"
                            readonly
                            v-model="building.numStories"
                        ></v-text-field>
                        <v-text-field
                            label="Construction"
                            color="blue"
                            variant="underlined"
                            style="width: 30%; 
                            min-width: 10rem;"
                            readonly
                            v-model="building.construction"
                        ></v-text-field>
                        <v-text-field
                            label="Fire/Smoke Notes"
                            color="blue"
                            variant="underlined"
                            style="width: 30%; 
                            min-width: 10rem;"
                            readonly
                            v-model="building.fireSmokeNotes"
                        ></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field
                            label="Has Fire Monitor"
                            color="blue"
                            variant="underlined"
                            style="width: 30%; 
                            min-width: 10rem;"
                            readonly
                            v-model="building.hasFireMonitor"
                        ></v-text-field>
                        <v-text-field
                            label="Has Fire Alarm"
                            color="blue"
                            variant="underlined"
                            style="width: 30%; 
                            min-width: 10rem;"
                            readonly
                            v-model="building.hasFireAlarm"
                        ></v-text-field>
                        <v-text-field
                            label="Has Elevator"
                            color="blue"
                            variant="underlined"
                            style="width: 30%; 
                            min-width: 10rem;"
                            readonly
                            v-model="building.hasElevator"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-card>
        </div>
    </div>
</template>