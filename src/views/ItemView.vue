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
    const repair = ref({});
    const assignment = ref({});
    const itemInfo = ref({});

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
            repair.value = data.data.repair;
            assignment.value = data.data.assignment;
            itemInfo.value = data.data.itemInfo;
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
                    disabled="true"
                    v-model="type.typeName"
                ></v-combobox>
                <!-- FILTER OFF TYPE -->
            </v-col>
            <v-col>
                <v-combobox
                    chips
                    label="Category"
                    disabled="true"
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
                        disabled="true"
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
                        disabled="true"
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
            <v-tabs color="blue">
                <v-tab :value="History">
                    History
                </v-tab>
                <v-tab :value="Repairs">
                    Repairs
                </v-tab>
                <v-tab :value="Notes">
                    Notes
                </v-tab>
            </v-tabs>
        </v-card>

    </div>
</template>