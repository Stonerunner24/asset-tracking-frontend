<script setup>
import { onMounted, ref, computed } from "vue";
import ModelServices from "../services/modelServices";
import CategoryServices from "../services/categoryServices";
import TypeServices from "../services/typeServices";
import ItemServices from "../services/itemServices";
import {useRoute} from "vue-router";


const model = ref([]);
const modelFields = ref([]);
const items = ref([]);
const types = ref([]);
const activeType = ref();
const typeNames = computed(() => types.value.map(type => type.typeName));
const categories = ref([]);
const catNames = computed(() => categories.value.map(category => category.catName));
const activeCat = ref();

//TODO: ITEM DATA TABLE

const editFields = ref(false);
const editCatType = ref(false);
const typeChange = ref(false);

onMounted(async() => {
    const route = useRoute();
    await retrieveData(route);
});

const retrieveData = async(route) => {
    try{
        //retrive models
        let response = await ModelServices.get(route.params.id);
        model.value = response.data;
        console.log(model.value);

        response = await ItemServices.getAllForModel(route.params.id);
        items.value = response.data;
        console.log(items.value.length);

        
        //retrieve categories and types if there are items assigned to the model
        if(items.value.length === 0){
            response = await CategoryServices.getAll();
            categories.value = response.data;
            activeCat.value = model.value.type.category.catName;        

            console.log(categories.value);
            let catId = categories.value.find(cat => cat.catName === activeCat.value).id;
            response = await TypeServices.getAllForCategory(catId);
            types.value = response.data;
        }
        else activeCat.value = model.value.type.category.catName;  
        activeType.value = model.value.type.typeName;

        //retrieve model fields
        response = await ModelServices.getAllFields(route.params.id);
        modelFields.value = response.data;
    }
    catch(err){
        console.error(err);
    }
};

const changeCategory = async() => {
    activeType.value = null;
    modelFields.value = [];
    let catId = categories.value.find(cat => cat.catName === activeCat.value).id;
    try{
        let response = await TypeServices.getAllForCategory(catId);
        types.value = response.data;
    }
    catch(err){
        console.error(err);
    }
};

const changeType = async() => {
    let typeId = types.value.find(type => type.typeName === activeType.value).id;
    try{
        let response = await TypeServices.getAllModelFields(typeId);
        let data = response.data;
        console.log(data);
        modelFields.value = [];
        for(let field of data){
            modelFields.value.push({
                "value": "",
                "fieldId": field.fieldId,
                "field": {
                    "name": field.field.name
                }
            });
        }
        typeChange.value = true;
    }
    catch(err){
        console.error(err);
    }
};

const changeEditMode = () => {
    editFields.value = editFields.value ? false : true;
    if(items.value.length === 0){
        editCatType.value = editCatType.value ? false : true;
    }
};

const cancelEdit = () => {
    window.location.reload();
};

const saveChanges = async() => {
    const data = {
        'typeChange': typeChange.value,
        'model': model.value,
        'modelFields': modelFields.value
    };
    console.log(data);
    try{
        await ModelServices.update(model.value.id, data);
    }
    catch(err){
        console.error(err);
    }
    changeEditMode();
};

</script>
<template>
    <div class="ml-8 mt-4">
        <v-title class="text-h5">View Model</v-title>
    </div>
    <div class="ml-12 mr-12">
        <v-row>
            <v-col>
                <v-combobox chips label="Category" :disabled="!editCatType" v-model="activeCat" :items="catNames"
                    @update:modelValue="changeCategory"></v-combobox>
                <!-- FILTER OFF CATEGORY -->
            </v-col>
            <v-col class="text-left">
                <v-combobox chips label="Type" :disabled="!editCatType" v-model="activeType" :items="typeNames"
                    color="blue" @update:modelValue="changeType"></v-combobox>
                <!-- FILTER OFF TYPE -->
            </v-col>
            <v-col v-if="editFields">
                <v-text-field label="Model Name" v-model="model.model">

                </v-text-field>
            </v-col>
            <v-spacer v-if="!editFields"></v-spacer>
            <v-col class="text-right" v-if="editFields === false">
                <v-btn class="" color="blue" size="large" @click="changeEditMode">
                    Edit Model
                </v-btn>
            </v-col>
            <v-col class="text-right" v-else-if="editFields === true">
                <v-btn class="mr-4" color="darkgray" size="large" @click="cancelEdit">
                    Cancel
                </v-btn>
                <v-btn class="" color="blue" size="large" @click="saveChanges">
                    Save Changes
                </v-btn>
            </v-col>
        </v-row>
    </div>
    <div class="mr-12 ml-12">
        <v-card :title="model.model" color="card" class="pb-4">
            <v-row class="mr-1 ml-1" v-if="modelFields">
                <v-col v-for="m in modelFields" cols="4">
                    <v-text-field :label="m.field.name" v-model="m.value" :disabled="!editFields"></v-text-field>
                </v-col>
            </v-row>
        </v-card>
    </div>
</template>