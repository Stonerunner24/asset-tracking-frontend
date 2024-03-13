<script setup>
    import { ref, onMounted } from "vue";
    import { useRoute } from 'vue-router'
    import BuildingServices from "../services/buildingServices";
    import RoomServices from "../services/roomServices";
    import ItemServices from "../services/itemServices";
    import AssignmentServices from "../services/assignmentServices";
    import router from "../router";

    const route = useRoute();
    const requestId = route.params.id;
    const building = ref({});
    const rooms = ref([]);
    const assignments = ref([]);
    const tab = ref("Rooms");

    const roomHeaders = ref([
        { title: 'Room Name', value: "room.roomNum" },
        { title: 'Action', align: "end" },
    ]) 
    const itemHeaders = ref([
        { title: 'Serial Number', value: "item.serialNum" },
        { title: 'Action', align: "end" },
    ])       

    async function getBuilding() {
        try {
            const response = await BuildingServices.get(requestId);
            building.value = response.data;
        } catch (error) {
            console.error("Error fetching building:", error);
        }
    }
    async function getRooms() {
        try {
            const response = await RoomServices.getAllForBuilding(requestId);
            rooms.value = response.data;
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    }
    async function getAssignments() {
        try {
            const response = await AssignmentServices.getAllForBuilding(requestId);
            assignments.value = response.data;
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    }
    async function getItems() {
        try {
            const response = await ItemServices.getAllForBuilding(requestId);
            assignments.value = response.data;
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    }

    function toggleTabItem() {
        tab.value = "Item";
    }
    function toggleTabRooms() {
        tab.value = "Rooms";
    }
    function toggleTabReno() {
        tab.value = "Reno";
    }

    function viewRoom(roomId){
        router.push(`/roomview/${roomId}`);
    }

    onMounted(async () => {
        await getBuilding();
        await getRooms();
        await getAssignments();
        await getItems();
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

        <div style="font-size: large;" class="pa-2 pt-3">Additional Data</div>

        <v-tabs v-model="tab" color="blue">
        <v-tab value="Item" @click="toggleTabItem()">Item</v-tab>
        <v-tab value="Rooms" @click="toggleTabRooms()">Rooms</v-tab>
        <v-tab value="Reno" @click="toggleTabReno()">Reno</v-tab>
      </v-tabs>
  
        <div>
            <v-data-table v-if="tab === 'Item' "class="display" :items="assignments" :headers="itemHeaders">
                <template v-slot:item="{ item }">
                    <tr>
                        <td>{{ item.serialNum }}</td>
                        <td class="text-right">
                            <v-btn 
                                elevation="1" 
                                size="small" 
                                color="blue"
                                @click="viewRoom(item.id)" 
                                class="mr-n3">
                            View</v-btn>
                        </td>
                    </tr>
                </template>
            </v-data-table>
            <v-data-table v-else-if="tab === 'Rooms'" :items="rooms" class="display" :headers="roomHeaders">
                <template v-slot:item="{ item }">
                    <tr>
                        <td>{{ building.buildingTag }} - {{ item.roomNum }}</td>
                        <td class="text-right">
                            <v-btn 
                                elevation="1" 
                                size="small" 
                                color="blue"
                                @click="viewRoom(item.id)" 
                                class="mr-n3">
                            View</v-btn>
                        </td>
                    </tr>
                </template>
            </v-data-table>
            <v-data-table v-else-if="tab === 'Reno'"class="display">
            </v-data-table>
        </div>
    </div>
</template>