<script setup>
import { onMounted, ref, computed } from "vue";
import ItemServices from "../services/itemServices";
import CategoryServices from "../services/categoryServices";
import TypeServices from "../services/typeServices";
import ModelServices from "../services/modelServices";
import router from "../router";

//IMPORT MODEL, TYPE, AND CATEGORY FOR FILTRATION PURPOSES

const categories = ref([]);
const catNames = computed(() => categories.value.map(category => category.catName));
const activeCat = ref();

const types = ref([]);
const typeNames = computed(() => types.value.map(type => type.typeName));
const activeType = ref();

const models = ref([]);
const modelNames = computed(() => models.value.map(model => model.model));
const activeModel = ref();
var cascade = true;

const items = ref([]);
const search = ref();
const headers = [
    {title: 'Serial Number', value: 'serialNum'},
    {title: 'Status', value: 'status'},
    {title: 'Model', value: 'model.model'},
    {title: 'Type', value: 'model.type.typeName'},
    {title: 'Actions', }
];

onMounted(async() => {
    await retrieveData();
});

const retrieveData = async() => {
    try{
        let response = await ItemServices.getAll();
        items.value = response.data;

        response = await CategoryServices.getAll();
        categories.value = response.data;
        console.log(categories.value);

        //retrieve types
        response = await TypeServices.getAll();
        types.value = response.data;

        //retrieve models
        response = await ModelServices.getAll();
        models.value = response.data;
    }
    catch(err){
        console.error(err);
    }
};

const changeCategory = async () => {
    console.log("changing category");
    if (activeCat.value == null) {
        await retrieveData();
        activeType.value = null;
        activeModel.value = null;
    }
    else if (activeCat.value) {
        //clear active type and model
        if (cascade) {
            activeType.value = null;
            activeModel.value = null;
        }

        //set types to be only types within that category
        let catId = categories.value.find(cat => cat.catName === activeCat.value).id;
        console.log(catId);

        try {
            let response = await TypeServices.getAllForCategory(catId)
            types.value = response.data;
            models.value = [];
            if (cascade) {
                const promises = types.value.map(async (type) => {
                    const typeModels = (await ModelServices.getAllByType(type.id)).data;
                    return typeModels;
                });

                // Wait for all promises to resolve
                const resolvedModels = await Promise.all(promises);

                // Flatten the array of arrays
                models.value = resolvedModels.flat();

                console.log(models);
            }
        }
        catch (err) {
            console.error(err);
        }
    }
    cascade = true;
};

const changeType = async (clearModel) => {
    if(activeType.value == null){
        await changeCategory();
        return;
    }
    if (cascade) {
        activeModel.value = null;
    }
    let type = types.value.find(type => type.typeName === activeType.value);
    console.log(type);
    //If category is empty, change category to category of type
    if (activeCat.value == null) {
        cascade = false;
        activeCat.value = categories.value.find(cat => cat.id === type.categoryId).catName;
        await changeCategory();
    }
    //set models to only be models within this type
    try{
        let response = await ModelServices.getAllByType(type.id);
        models.value = response.data;
        const promises = models.value.map(async(model) => {
            const modelItems = (await ItemServices.getAllForModel(model.id)).data;
            return modelItems;
        });
        const resolvedItems = await Promise.all(promises);
        items.value = resolvedItems.flat();
    }
    catch(err){
        console.error(err);
    }
    
};

const changeModel = async () => {
    //if type is empty, set type to be type of this model
    if(activeModel.value == null){
        await changeType(true);
        return;
    }
    
    console.log(models.value);
    var model = models.value.find(model => model.model === activeModel.value);

    // let model = models.value.data.find(model => model.model === activeModel.value);
    if (activeType.value == null) {

        activeType.value = types.value.find(type => type.id === model.typeId).typeName;
        cascade = false;
        await changeType(false);
    }

    try {
        let response = await ItemServices.getAllForModel(model.id);
        items.value = response.data;
    }
    catch (err) {
        console.error(err);
    }

};

const clearFilters = async() => {
    activeModel.value = null;
    activeCat.value = null;
    activeType.value = null;
    await retrieveData();
};

const viewItem = (itemId) => {
    //TODO: NAVIGATE TO PROPER ITEM PAGE ON CLICK
    router.push(({name: 'itemview', params: {id: itemId}}));
}

const addItem = () => {
    router.push(({name: 'itemadd'}));
}

</script>

<template>
    <div class="ml-8 mt-4">
        <v-title class="text-h5">Item Lookup</v-title>
    </div>
    <v-card
        class="ma-12 mr-16 elevation-0"
        title="Filters"
        color="card"
    >
        <div class="ml-12 mr-12">
            <v-row >
                <v-col class="text-left">
                    <v-combobox
                        chips
                        closable-chips
                        label="Category"
                        v-model="activeCat"
                        :items="catNames"
                        @update:modelValue="changeCategory"
                    ></v-combobox>
                    <!-- FILTER OFF TYPE -->
                </v-col>
                <v-col>
                    <v-combobox
                        chips
                        closable-chips
                        label="Type"
                        v-model="activeType"
                        :items="typeNames"
                        @update:modelValue="changeType"
                    ></v-combobox>
                    <!-- FILTER OFF CATEGORY -->
                </v-col>
                <v-col>
                    <v-combobox
                        chips
                        closable-chips
                        label="Model"
                        v-model="activeModel"
                        :items="modelNames"
                        @update:modelValue="changeModel"
                    ></v-combobox>
                    <!-- FILTER OFF MODEL    -->
                </v-col>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-col class="text-right">
                    <v-btn
                        flat
                        class=""
                        color="darkgray"
                        size="large"
                        @click="clearFilters"
                    >Clear Filters</v-btn>
                </v-col>
            </v-row>
        </div>
    </v-card>
    <div class="ml-12 mr-12">
        <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            single-line
            variant="outlined"
            hide-details
        ></v-text-field>
        <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
        >
            <template v-slot:item="{item}">
                <tr>
                    <td>{{ item.serialNum }}</td>
                    <td>{{ item.status }}</td>
                    <td>{{ item.model.model }}</td>
                    <td>{{ item.model.type.typeName }}</td>
                    <td>
                        <v-btn elevation="1" size="small" color="blue" @click="viewItem(item.id)" >View</v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <v-btn
            color="blue"
            size="large"
            @click="addItem()"
        >
            Add Item
        </v-btn>
    </div>
    
</template>