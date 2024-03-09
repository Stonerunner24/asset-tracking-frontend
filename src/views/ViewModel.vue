<script setup>
import { onMounted, ref, computed } from "vue";
import ModelServices from "../services/modelServices";
import CategoryServices from "../services/categoryServices";
import TypeServices from "../services/typeServices";
import {useRoute} from "vue-router";


const model = ref([]);
const modelFields = ref([]);
const types = ref([]);
const activeType = ref();
const typeNames = ref([]);
const categories = ref([]);
const catNames = ref([]);
const activeCat = ref();

//TODO: ITEM DATA TABLE

const edit = ref(false);

onMounted(async() => {
    const route = useRoute();
    await retrieveData(route);
});

const retrieveData = async(route) => {
    try{
        //retrive models
        let response = await ModelServices.get(route.params.id);
        model.value = response.data;
        
        //retrieve categories
        response = await CategoryServices.getAll();
        categories.value = response.data;
        activeCat.value = model.value.type.category.catName;
        catNames.value = categories.value.map(category => category.catName);
        console.log(catNames.value);

        //assign active type
        let catId = categories.value.find(cat => cat.catName === activeCat.value).id;
        response = await TypeServices.getAllForCategory(catId);
        types.value = response.data;
        typeNames.value = types.value.map(type => type.typeName);
        activeType.value = model.value.type.typeName;

        //retrieve model fields
        response = await ModelServices.getAllFields(route.params.id);
        modelFields.value = response.data;
    }
    catch(err){
        console.error(err);
    }
    
};

const changeCategory = () => {

}

const changeEditMode = () => {
    edit.value = edit.value ? false : true;
};

const cancelEdit = () => {
    window.location.reload();
}

const saveChanges = async() => {


    changeEditMode();
}

</script>
<template>
    <div class="ml-8 mt-4">
        <v-title class="text-h5">View Model</v-title>
    </div>
    <div class="ml-12 mr-12">
        <v-row >
            <v-col>
                <v-combobox
                    chips
                    label="Category"
                    :disabled="!edit"
                    v-model="activeCat"
                    :items="catNames"
                ></v-combobox>
                <!-- FILTER OFF CATEGORY -->
            </v-col>
            <v-col class="text-left">
                <v-combobox
                    chips
                    label="Type"
                    :disabled="!edit"
                    v-model="activeType"
                    :items="typeNames"
                    color="blue"
                ></v-combobox>
                <!-- FILTER OFF TYPE -->
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="text-right" v-if="edit === false">
                <v-btn
                    class=""
                    color="blue"
                    size="large"
                    @click="changeEditMode"
                >
                    Edit Model
                </v-btn>
            </v-col>
            <v-col class="text-right" v-else-if="edit === true">
                <v-btn
                    class="mr-4"
                    color="darkgray"
                    size="large"
                    @click="cancelEdit"
                >
                    Cancel
                </v-btn>
                <v-btn
                    class=""
                    color="blue"
                    size="large"
                    @click="saveChanges"
                >
                    Save Changes
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
            <v-row class="mr-1 ml-1" v-if="modelFields">
                <v-col
                    v-for="m in modelFields"
                    cols="3"
                >
                    <v-text-field
                        :label="m.field.name"
                        v-model="m.value"
                        :disabled="!edit"
                    ></v-text-field>
                </v-col>
            </v-row>
        </v-card>
    </div>
</template>