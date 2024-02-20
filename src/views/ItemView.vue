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
    <v-container>
        <v-row >
                <v-col class="text-left">
                    <v-combobox
                        chips
                        closable-chips
                        label="Type"
                        disabled="true"
                        v-model="type.typeName"
                    ></v-combobox>
                    <!-- FILTER OFF TYPE -->
                </v-col>
                <v-col>
                    <v-combobox
                        chips
                        closable-chips
                        label="Category"
                        disabled="true"
                        v-model="category.catName"
                    ></v-combobox>
                    <!-- FILTER OFF CATEGORY -->
                </v-col>
                <v-col>
                    <v-combobox
                        chips
                        closable-chips
                        label="Model"
                        disabled="true"
                        v-model="model.model"
                    ></v-combobox>
                    <!-- FILTER OFF MODEL    -->
                </v-col>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
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
    </v-container>
</template>