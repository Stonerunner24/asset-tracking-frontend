<script setup>
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import ItemServices from '../services/itemServices';

    const item = ref({});
    const model = ref({});
    const type = ref({});
    const category = ref({});
    const modelFields = ref({});
    const itemFields = ref({});
    const typeFields = ref({});
    const repairs = ref({});
    const assignments = ref({});
    const itemInfos = ref({});

    const tab = ref('History');

    onMounted(async() => {
        const route = useRoute();
        await retrieveItemData(route);
    })

    const retrieveItemData = async(route) => {
        try{
            const data = await ItemServices.getOne(route.params.id);
            console.log(data.data.item);
            item.value = data.data.item;
            model.value = data.data.model;
            type.value = data.data.type;
            category.value = data.data.category;
            modelFields.value = data.data.modelFields;
            itemFields.value = data.data.itemFields;
            typeFields.value = data.data.typeFields;
            repairs.value = data.data.repair;
            assignments.value = data.data.assignment;
            itemInfos.value = data.data.itemInfo;
            console.log(type);
        }
        catch(err){
            console.log(err.message);
        }
    };

</script>
<template>
    <div class="ml-8 mt-4">
        <v-title class="text-h5">View Item</v-title>
    </div>
    <div class="ml-12 mr-12">
        <v-row >
            <v-col class="text-left">
                <v-combobox
                    chips
                    label="Type"
                    disabled=true
                    v-model="type.typeName"
                ></v-combobox>
                <!-- FILTER OFF TYPE -->
            </v-col>
            <v-col>
                <v-combobox
                    chips
                    label="Category"
                    disabled=true
                    v-model="category.catName"
                ></v-combobox>
                <!-- FILTER OFF CATEGORY -->
            </v-col>
            <v-col>
            </v-col>
            <v-col class="text-right">
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
        >
            <v-row class="mr-1 ml-1">
                <v-col
                    v-for="m in modelFields"
                    cols="3"
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
            title="Item Fields"
            class="elevation-0"
        >
            <v-row class="mr-1 ml-1">
                <v-col
                    v-for="i in itemFields"
                    cols="3"
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
            <v-window v-model="tab">
                <v-window-item value="History" key="History">
                    <!-- <v-card class="elevation-0"> -->
                        <v-data-table
                            :headers="[
                                {title: 'Checked Out'},
                                {title: 'Checked In'},
                                {title: 'Person'},
                                {title: 'Status'}
                            ]"
                        >
                        </v-data-table>
                    <!-- </v-card> -->
                </v-window-item>
                <v-window-item value="Repairs" key="Repairs">
                    <!-- <v-card class="elevation-0"> -->
                        <v-data-table
                            :headers="[
                                {title: 'Repair Completed'},
                                {title: 'Repair Type'},
                                {title: 'Worker'},
                                {title: 'Action'}
                            ]"
                        >
                        </v-data-table>
                    <!-- </v-card> -->
                </v-window-item>
                <v-window-item value="Notes" key="Notes">
                    <!-- <v-card class="elevation-0"> -->
                        <v-data-table
                            :headers="[
                                {title: 'Title'},
                                {title: 'Information'},
                            ]"
                        >
                        </v-data-table>
                    <!-- </v-card> -->
                </v-window-item>
            </v-window>
        </v-card>

    </div>
</template>