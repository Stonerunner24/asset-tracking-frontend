<script setup>
import { onMounted, ref, computed } from "vue";
import ModelServices from "../services/modelServices";
import typeServices from "../services/typeServices";
import categoryServices from "../services/categoryServices";
import router from "../router";

const models = ref([]);
const filteredModels = ref([]);
const types = ref([]);
const typeNames = ref([]);
const activeType = ref();
const categories = ref([]);
const catNames = ref([]);
const activeCat = ref();
const search = ref();
const headers = [
    {title: 'Name', value: 'model'},
    {title: 'Type', value: 'type'},
    {title: 'Category', value: 'category'},
    {title: 'Actions',}
];

onMounted(async() => {
    await retrieveData();
});

const retrieveData = async() => {
    try{
        let response = await ModelServices.getAll();
        models.value = response.data;
        filteredModels.value = models.value;
        console.log(models.value);
        response = await typeServices.getAll();
        types.value = response.data;
        typeNames.value = types.value.map(type => type.typeName)
        response = await categoryServices.getAll();
        categories.value = response.data;
        catNames.value = categories.value.map(category => category.catName);
    }
    catch(err){
        console.error(err);
    }
};

const changeCategory = async() => {
    if(!activeCat.value){
        await retrieveData();
    }
    else{
        let catId = categories.value.find(cat => cat.catName === activeCat.value).id;
        filteredModels.value = models.value.filter((model) => model.type.category.id === catId);
        let response = await typeServices.getAllForCategory(catId);
        types.value = response.data;
        typeNames.value = types.value.map(type => type.typeName);
    }
    activeType.value = null;

};

const changeType = async() => {
    let type = types.value.find(type => type.typeName === activeType.value);
    
    if(!activeCat.value){
        activeCat.value = categories.value.find(cat => cat.id === type.categoryId).catName;
    }

    if(!activeType.value){
        await changeCategory();
    }
    else{
        let typeId = types.value.find(type => type.typeName === activeType.value).id;
        filteredModels.value = models.value.filter((model) => model.typeId === typeId);
        
    }
};

const clearFilters = async() => {
    if(activeCat.value || activeType.value){
        activeCat.value = null;
        activeType.value = null;
        await retrieveData();
    }
};

const viewModel = (modelId) => {
    router.push(({name: 'viewModel', params: {id: modelId}}));
};

const addModel = () => {
    console.log('Navigating to add model page');
    router.push(({name: 'addModel'}));
}


</script>

<template>
    <div class="ml-8 mt-4">
        <v-title class="text-h5">Model Lookup</v-title>
    </div>
    <v-card
        class="ma-12 mr-16"
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
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-col class="text-right">
                    <v-btn
                        class=""
                        color="blue"
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
            :items="filteredModels"
            :search="search"
        >
            <template v-slot:item="{item}">
                <tr>
                    <td>{{ item.model }}</td>
                    <td>{{ item.type.typeName }}</td>
                    <td>{{ item.type.category.catName }}</td>
                    <td>
                        <v-btn elevation="1" size="small" color="blue" @click="viewModel(item.id)" >View</v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <v-btn
            color="blue"
            size="large"
            @click="addModel()"
        >
            Add Model
        </v-btn>
    </div>
    
</template>