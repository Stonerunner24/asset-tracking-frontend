<script setup>
    import { onMounted, ref, computed } from 'vue';
    import { useRoute } from 'vue-router';
    import {format, addMonth} from "@formkit/tempo";
    import ItemServices from '../services/itemServices';

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

    //Computed Variables
    const hasWarranty = computed(() => {
        return item.value.warrantyEnd != null ? true : false;
    });
    const warrantyStatus = computed(() => {
        let warranty = new Date(item.value.warrantyEnd);
        let curDate = new Date();
        return warranty > curDate ? 'Under Warranty' : 'Past Warranty';
    });
    const hasMaintenance = computed(() => {
        return item.value.repairSchedule != null ? true : false;
    });
    const lastRepair = computed(() => {
        return repairs.value[repairs.value.length - 1].date;
    });
    const nextRepair = computed(() => {
        let date = new Date(lastRepair.value);
        return format(addMonth(date, item.value.repairSchedule, true), 'short');
    });

    //Hardcoded variables
    const repairTimes = ['6 Months', '12 Months', '18 Months', '24 Months']
    const tab = ref('History');
    
    //Functions
    onMounted(async() => {
        const route = useRoute();
        await retrieveItemData(route);
    })

    const retrieveItemData = async(route) => {
        try{
            const response = await ItemServices.getOne(route.params.id);
            item.value = response.data.item;
            repairSchedule.value = item.value.repairSchedule + ' Months'
            item.value.warrantyEnd = format(item.value.warrantyEnd, "short");
            console.log(item.value);
            model.value = response.data.model;
            type.value = response.data.type;
            category.value = response.data.category;
            modelFields.value = response.data.modelFields;
            itemFields.value = response.data.itemFields;
            typeFields.value = response.data.typeFields;
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
        console.log(assignment);
        if(assignment.person){
            return assignment.person.fName + ' ' + assignment.person.lName;
        }
        else if(assignment.building){
            return assignment.building.buildingName;
        }
        else return assignment.room.building.buildingTag + ' ' + assignment.room.roomNum;
    };

    const viewRepair = (repairId) => {
        //TODO: NAVIGATE TO VIEW REPAIR PAGE
    };

</script>
<template>
    <div class="ml-8 mt-4">
        <v-title class="text-h5">View Item</v-title>
    </div>
    <div class="ml-12 mr-12">
        <v-row >
            <v-col cols="12" sm="12" md="4" lg="3">
                <v-combobox
                    chips
                    label="Category"
                    disabled=true
                    v-model="category.catName"
                ></v-combobox>
                <!-- FILTER OFF CATEGORY -->
            </v-col>
            <v-col class="text-left" cols="12" sm="12" md="4" lg="3">
                <v-combobox
                    chips
                    label="Type"
                    disabled=true
                    v-model="type.typeName"
                ></v-combobox>
                <!-- FILTER OFF TYPE -->
            </v-col>
            <v-col>
            </v-col>
            <v-col class="text-right pb-8">
                <v-btn
                    class=""
                    color="blue"
                    size="large"
                >
                    Edit Item
                </v-btn>
            </v-col>
        </v-row>
    </div>
    <div class="mr-12 ml-12">
        <v-card
            :title="model.model"
            color="card"
            class="pb-4"
        >
            <v-row class="mr-1 ml-1">
                <v-col
                    v-for="m in modelFields"
                    cols="12" sm="12" md="4" lg="3"
                >
                    <v-combobox
                        :label="m.field.name"
                        v-model="m.value"
                        disabled=true
                    ></v-combobox>
                </v-col>
            </v-row>
        </v-card>
    </div>
    <div class="mr-12 ml-12 mt-8">
        <v-card
            title="Item Data"
            class="elevation-0 pb-4"
        >
            <v-row 
                class="mr-1 ml-1">
                <v-col cols="12" sm="12" md="4" lg="3">
                    <v-text-field
                        label="Serial Number"
                        v-model="item.serialNum"
                        :disabled="!editMode"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" lg="3">
                    <v-text-field
                        label="Purchase Price"
                        v-model="item.initialValue"
                        :disabled="!editMode"
                    >

                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" lg="3">
                    <v-text-field
                        label="Status"
                        v-model="item.status"
                        disabled="true"
                    >
                    </v-text-field>
                </v-col>
               
            </v-row>
            <v-row class="mr-1 ml-1">
                <v-col
                    v-for="i in itemFields"
                    cols="12" sm="12" md="4" lg="3"
                >
                    <v-combobox
                        :label="i.field.name"
                        v-model="i.value"
                        disabled=true
                    ></v-combobox>
                </v-col>
            </v-row>
        </v-card>
    </div>

    <div class="mr-12 ml-12 mt-8">
        <v-card
            title="Warranty/Maintenance"
            class="elevation-0" 
        >
            <v-checkbox
                label="Has Warranty"
                v-model="hasWarranty"
                :disabled="!editMode"
                color="blue"
                class="mr-1 ml-1"
            >
            </v-checkbox>
            <v-row class="mr-1 ml-1" v-if="hasWarranty">
                <v-col cols="12" sm="12" md="4" lg="3">
                    <v-text-field
                        label="Warranty End Date"
                        v-model="item.warrantyEnd"
                        :disabled="!editMode"
                    >
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" lg="3">
                    <v-text-field
                        label="Warranty Status"
                        v-model="warrantyStatus"
                        disabled="true"
                    >
                    </v-text-field>
                </v-col>
            </v-row>
            <v-checkbox
                label="Preventative Maintenance"
                v-model="hasMaintenance"
                :disabled="!editMode"
                color="blue"
                class="mr-1 ml-1"
            >
            </v-checkbox>
            <v-row class="mr-1 ml-1" v-if="hasMaintenance">
                <v-col cols="12" sm="12" md="4" lg="3">
                    <v-combobox
                        label="Maintenance Schedule"
                        v-model="repairSchedule"
                        :items="repairTimes"
                        :disabled="!editMode"
                    ></v-combobox>
                </v-col>
                <v-col cols="12" sm="12" md="4" lg="3">
                    <v-text-field
                        label="Last Maintained"
                        v-model="lastRepair"
                        disabled="true"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" lg="3">
                    <v-text-field
                        label="Next Maintenance Date"
                        v-model="nextRepair"
                        disabled="true"
                    ></v-text-field>
                </v-col>
            </v-row>
        </v-card>
    </div>

    <div class="mr-12 ml-12 mt-8">
        <v-card
            title="Additional Information"
            class="elevation-0"
        >
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
                <v-data-table v-if="tab === 'History'"
                    :headers="[
                        {title: 'Checked Out'},
                        {title: 'Checked In'},
                        {title: 'Assignee'},
                        {title: 'Status'}
                    ]"
                    :items="assignments"
                >
                    <template v-slot:item="{item}">
                        <tr>
                            <td>{{ item.startDate }}</td>
                            <td>{{ item.endDate}}</td>
                            <td>{{ findAssignee(item) }}</td>
                            <td>{{ item.status }}</td>
                        </tr>
                    </template>
                </v-data-table>
                <v-data-table v-else-if="tab === 'Repairs'"
                    :headers="[
                        {title: 'Repair Completed'},
                        {title: 'Repair Type'},
                        {title: 'Worker'},
                        {title: 'Action'}
                    ]"
                    :items="repairs"
                >
                    <template v-slot:item="{item}">
                        <tr>
                            <td>{{ item.date }}</td>
                            <td>{{ item.type }}</td>
                            <td>{{ item.person.fName + ' ' + item.person.lName }}</td>
                            <td>
                                <v-btn elevation="1" size="small" color="blue" @click="viewRepair(item.id)" >View</v-btn>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
                <v-data-table v-else-if="tab === 'Notes'"
                    :headers="[
                        {title: 'Information'},
                    ]"
                    :items="itemInfos"
                >
                    <template v-slot:item="{item}">
                        <tr>
                            <td>{{ item.information }}</td>
                        </tr>
                    </template>
                </v-data-table>
                <v-btn elevation="0" size="large" color="blue" v-if="tab === 'Notes'">Add Note</v-btn>
            </v-card>
        </v-card>

    </div>
</template>