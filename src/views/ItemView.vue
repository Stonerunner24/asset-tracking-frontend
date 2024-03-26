<script setup>
    import { onMounted, ref, computed } from 'vue';
    import { useRoute } from 'vue-router';
    import {format, addMonth} from "@formkit/tempo";
    import ItemServices from '../services/itemServices';
    import NoteModel from "../components/NotesModal.vue";
    import NotesModal from '../components/NotesModal.vue';

    //Reference Variables
    const item = ref({});
    const model = ref({});
    const type = ref({});
    const category = ref({});
    const modelFields = ref({});
    const itemFields = ref({});
    const typeFields = ref({});
    const repairs = ref([]);
    const repairSchedule = ref();
    const assignments = ref([]);
    const itemInfos = ref({});

    const editMode = ref(false);
    const repairTimes = ref([]);
    const tab = ref('History');
    const hasWarranty = ref();
    const hasMaintenance = ref();

    const notesModal = ref(false);

    //Computed Variables
    const receivedDate = computed(() => format(item.value.receivedDate, 'short'));
    const warrantyStatus = computed(() => {
        let warranty = new Date(item.value.warrantyEnd);
        let curDate = new Date();
        return warranty > curDate ? 'Under Warranty' : 'Past Warranty';
    });
    const lastRepair = computed(() => {
        return repairs.value[0] ? repairs.value[repairs.value.length - 1].date : 'No maintenance history.';
    });
    const nextRepair = computed(() => {
        let date = repairs.value[0] ? new Date(lastRepair.value) : new Date(item.value.receivedDate);
        // console.log(item.value.receivedDate);
        return format(addMonth(date, item.value.repairSchedule, true), 'short');
    });
    
    //Functions
    onMounted(async() => {
        const route = useRoute();
        await retrieveItemData(route);
    })

    //Data Retrieval and Parsing
    const retrieveItemData = async(route) => {
        try{
            const response = await ItemServices.getOne(route.params.id);
            item.value = response.data.item;
            repairSchedule.value = item.value.repairSchedule + ' Months'
            item.value.warrantyEnd = format(item.value.warrantyEnd, "short");

            //Warranty and Maintenance info
            hasWarranty.value = item.value.warrantyEnd != null ? true : false;
            hasMaintenance.value = item.value.repairSchedule != null ? true : false;
            console.log(hasMaintenance.value);

            //Model Type and Category
            model.value = response.data.model;
            type.value = response.data.type;
            category.value = response.data.category;

            //Fields
            modelFields.value = response.data.modelFields;
            itemFields.value = response.data.itemFields;
            typeFields.value = response.data.typeFields;

            //Repairs assignments and notes
            repairs.value = response.data.repair;
            for (let repair of repairs.value){
                repair.date = format(repair.date, "short");
            }
            console.log(repairs.value);
            assignments.value = response.data.assignment;
            itemInfos.value = response.data.itemInfo;
            console.log(item.value);
        }
        catch(err){
            console.error(err.message);
        }
    };

    const findAssignee = (assignment) => {
        if(assignment.person){
            return assignment.person.fName + ' ' + assignment.person.lName;
        }
        else if(assignment.building){
            return assignment.building.buildingName;
        }
        else return assignment.room.building.buildingTag + ' ' + assignment.room.roomNum;
    };

    //Edit and Save Functions
    const changeEditMode = () => {
        if(editMode.value){
            editMode.value = false;
            repairTimes.value = [];
        }
        else{
            editMode.value = true;
            repairTimes.value = ['6 Months', '12 Months', '18 Months', '24 Months'];
        }
    };

    const changeRepairSchedule = () => {
        let newRepair = repairSchedule.value.split(' ');
        item.value.repairSchedule = parseInt(newRepair[0]);
    };

    const saveChanges = async() => {
        if(!hasWarranty.value){
            item.value.warrantyEnd = null;
        }
        if(!hasMaintenance.value){
            item.value.repairSchedule = null;
        }
        const data = {
            'item': item.value,
            'itemFields': itemFields.value
        };
        console.log(data);
        try{
            await ItemServices.update(item.value.id, data);
        }
        catch(err){
            console.error(err);
        }
        changeEditMode();
    };

    const cancelChanges = () => {
        window.location.reload();
    }

    //Navigation Functions
    const viewRepair = (repairId) => {
        //TODO: NAVIGATE TO VIEW REPAIR PAGE
    };

    const addRepair = () => {
        //TODO: NAVIGATE TO ADD REPAIR PAGE
    };

    const addNote = () => { 
        notesModal.value = true;
    };

    const saveNote = async(note) => {
        let data = {
            'information': note,
            'itemId': item.value.id
        };
        try{
            await ItemServices.createInfo(data);
            let response = await ItemServices.getAllInfoForItem(item.value.id);
            itemInfos.value = response.data;
        }
        catch(err){
            console.error(err);
        }
        notesModal.value = false;
    }

</script>
<template>
    <div class="ml-8 mt-4">
        <v-title class="text-h5">View Item</v-title>
    </div>
    <div class="ml-12 mr-12">
        <v-row>
            <v-col cols="12" sm="12" md="4" lg="3">
                <v-combobox chips label="Category" readonly v-model="category.catName" bg-color="#FFFFFF"></v-combobox>
                <!-- FILTER OFF CATEGORY -->
            </v-col>
            <v-col class="text-left" cols="12" sm="12" md="4" lg="3">
                <v-combobox chips label="Type" readonly v-model="type.typeName" bg-color="#FFFFFF"></v-combobox>
                <!-- FILTER OFF TYPE -->
            </v-col>
            <v-col>
            </v-col>
            <v-col class="text-right pb-8" v-if="editMode">
                <v-btn v-if="editMode" class="mr-4" color="darkgray" size="large" @click="cancelChanges()">
                    Cancel
                </v-btn>
            </v-col>
            <v-col class="text-right pb-8">
                <v-btn v-if="!editMode" class="" color="blue" size="large" @click="changeEditMode()">
                    Edit Item
                </v-btn>
                <v-btn v-else-if="editMode" class="" color="blue" size="large" @click="saveChanges()">
                    Save Changes
                </v-btn>
            </v-col>
        </v-row>
    </div>
    <div class="mr-12 ml-12">
        <v-card :title="model.model" color="card" class="pb-4 elevation-0">
            <v-row class="mr-1 ml-1">
                <v-col v-for="m in modelFields" cols="12" sm="12" md="4" lg="3">
                    <v-text-field :label="m.field.name" v-model="m.value" readonly :disabled="editMode"></v-text-field>
                </v-col>
            </v-row>
        </v-card>
    </div>
    <div class="mr-12 ml-12 mt-8">
        <v-card title="Item Data" class="elevation-0 pb-4">
            <v-row class="mr-1 ml-1">
                <v-col cols="12" sm="12" md="4" lg="3">
                    <v-text-field label="Serial Number" v-model="item.serialNum" :readonly="!editMode"></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" lg="3">
                    <v-text-field label="Purchase Price" v-model="item.initialValue" :readonly="!editMode">

                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" lg="3">
                    <v-text-field label="Received" v-model="receivedDate" readonly :disabled="editMode">
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" lg="3">
                    <v-text-field label="Status" v-model="item.status" readonly :disabled="editMode">
                    </v-text-field>
                </v-col>
                <v-col v-for="i in itemFields" cols="12" sm="12" md="4" lg="3">
                    <v-combobox :label="i.field.name" v-model="i.value" readonly></v-combobox>
                </v-col>
            </v-row>
        </v-card>
    </div>

    <div class="mr-12 ml-12 mt-8">
        <v-card title="Warranty/Maintenance" class="elevation-0">
            <v-checkbox label="Has Warranty" v-model="hasWarranty" :readonly="!editMode" color="blue" class="mr-1 ml-1">
            </v-checkbox>
            <v-row class="mr-1 ml-1" v-if="hasWarranty">
                <v-col cols="12" sm="12" md="4" lg="3">
                    <v-text-field label="Warranty End Date" v-model="item.warrantyEnd" :readonly="!editMode">
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" lg="3">
                    <v-text-field label="Warranty Status" v-model="warrantyStatus" readonly :disabled="editMode">
                    </v-text-field>
                </v-col>
            </v-row>
            <v-checkbox label="Preventative Maintenance" v-model="hasMaintenance" :readonly="!editMode" color="blue"
                class="mr-1 ml-1">
            </v-checkbox>
            <v-row class="mr-1 ml-1" v-if="hasMaintenance">
                <v-col cols="12" sm="12" md="4" lg="3">
                    <v-combobox label="Maintenance Schedule" v-model="repairSchedule" :items="repairTimes"
                        :readonly="!editMode" @update:modelValue="changeRepairSchedule()"></v-combobox>
                </v-col>
                <v-col cols="12" sm="12" md="4" lg="3">
                    <v-text-field label="Last Maintained" v-model="lastRepair" readonly
                        :disabled="editMode"></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" lg="3">
                    <v-text-field label="Next Maintenance Date" v-model="nextRepair" readonly
                        :disabled="editMode"></v-text-field>
                </v-col>
            </v-row>
        </v-card>
    </div>

    <div class="mr-12 ml-12 mt-8">
        <v-card title="Additional Information" class="elevation-0">
            <v-tabs v-model="tab" color="blue">
                <v-tab value="History" :eager="true">
                    History
                </v-tab>
                <v-tab value="Repairs" :eager="true">
                    Repairs
                </v-tab>
                <v-tab value="Notes" :eager="true">
                    Notes
                </v-tab>
            </v-tabs>
            <v-card class="elevation-0">
                <v-data-table v-if="tab === 'History'" :headers="[
                        {title: 'Checked Out'},
                        {title: 'Checked In'},
                        {title: 'Assignee'},
                        {title: 'Status'}
                    ]" :items="assignments">
                    <template v-slot:item="{item}">
                        <tr>
                            <td>{{ item.startDate }}</td>
                            <td>{{ item.endDate}}</td>
                            <td>{{ findAssignee(item) }}</td>
                            <td>{{ item.status }}</td>
                        </tr>
                    </template>
                </v-data-table>
                <v-data-table v-else-if="tab === 'Repairs'" :headers="[
                        {title: 'Repair Completed'},
                        {title: 'Repair Type'},
                        {title: 'Worker'},
                        {title: 'Action'}
                    ]" :items="repairs">
                    <template v-slot:item="{item}">
                        <tr>
                            <td>{{ item.date }}</td>
                            <td>{{ item.type }}</td>
                            <td>{{ item.person.fName + ' ' + item.person.lName }}</td>
                            <td>
                                <v-btn elevation="1" size="small" color="blue" @click="viewRepair(item.id)">View</v-btn>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
                <v-btn elevation="0" size="large" color="blue" v-if="tab === 'Repairs'" class="mb-4"
                    @click="addRepair()">Add Repair</v-btn>

                <v-data-table v-else-if="tab === 'Notes'" :headers="[
                        {title: 'Information'},
                    ]" :items="itemInfos">
                    <template v-slot:item="{item}">
                        <tr>
                            <td>{{ item.information }}</td>
                        </tr>
                    </template>
                </v-data-table>
                <v-btn elevation="0" size="large" color="blue" v-if="tab === 'Notes'" class="mb-4"
                    @click="addNote()">Add Note</v-btn>
            </v-card>
        </v-card>
        <v-dialog
            v-model="notesModal"
            width="auto"
        >
            <NotesModal 
                @closeModal="(notesModal = false)"
                @saveNote="saveNote"
            />
        </v-dialog>
    </div>
</template>