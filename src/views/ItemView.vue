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
            const response = await ItemServices.getOne(route.params.id);
            console.log(response.data.item);
            item.value = response.data.item;
            model.value = response.data.model;
            type.value = response.data.type;
            category.value = response.data.category;
            modelFields.value = response.data.modelFields;
            itemFields.value = response.data.itemFields;
            typeFields.value = response.data.typeFields;
            repairs.value = response.data.repair;
            assignments.value = response.data.assignment;
            itemInfos.value = response.data.itemInfo;
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
            <v-card class="elevation-0">
                <v-data-table v-if="tab === 'History'"
                    :headers="[
                        {title: 'Checked Out'},
                        {title: 'Checked In'},
                        {title: 'Person'},
                        {title: 'Status'}
                    ]"
                >
                </v-data-table>
                <v-data-table v-else-if="tab === 'Repairs'"
                    :headers="[
                        {title: 'Repair Completed'},
                        {title: 'Repair Type'},
                        {title: 'Worker'},
                        {title: 'Action'}
                    ]"
                >
                </v-data-table>
                <v-data-table v-else-if="tab === 'Notes'"
                    :headers="[
                        {title: 'Title'},
                        {title: 'Information'},
                    ]"
                >
                </v-data-table>
            </v-card>
        </v-card>

    </div>
</template>