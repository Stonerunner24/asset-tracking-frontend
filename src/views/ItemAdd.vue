<script setup>
import { onMounted, ref, computed } from "vue";
import ItemServices from "../services/itemServices";
import CategoryServices from "../services/categoryServices";
import TypeServices from "../services/typeServices";
import ModelServices from "../services/modelServices";
import router from "../router";

const categories = ref([]);
const catNames = ref([]);
const activeCat = ref();

const types = ref([]);
const typeNames = ref([]);
const activeType = ref();
const typeFields = ref([]);

const models = ref([]);
const modelNames = ref([]);
const activeModel = ref();
const modelFields = ref([]);
var cascade = true;

const serialNum = ref(null);
const prodYear = ref(null);
const warrantyEnd = ref(null);

const fieldValues = ref(Array.from({ length: typeFields.value.length }, () => ''));
var response;

onMounted(async () => {
    await retrieveData();
});

const retrieveData = async () => {
    try {
        //Retrieve categories
        response = await CategoryServices.getAll();
        categories.value = response.data;
        console.log(categories.value);
        catNames.value = categories.value.map(category => category.catName);

        //retrieve types
        response = await TypeServices.getAll();
        types.value = response.data;
        typeNames.value = types.value.map(type => type.typeName);

        //retrieve models
        response = await ModelServices.getAll();
        models.value = response.data;
        modelNames.value = models.value.map(model => model.model);
    }
    catch (err) {
        console.error("There was some issue retrieving the categories: " + err);
    }
}

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
            response = await TypeServices.getAllForCategory(catId)
            types.value = response.data;
            typeNames.value = types.value.map(type => type.typeName);
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
                modelNames.value = models.value.map(model => model.model);
            }
        }
        catch (err) {
            console.error(err);
        }
    }
    cascade = true;
};

const changeType = async (clearModel) => {
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

    response = await TypeServices.getAllItemFields(type.id);
    typeFields.value = response.data;
    console.log(typeFields.value);

    //set models to only be models within this type
    response = await ModelServices.getAllByType(type.id);
    models.value = response.data;
    modelNames.value = models.value.map(model => model.model);
    console.log(modelFields);
    if (clearModel) modelFields.value = [];
};

const changeModel = async () => {
    //if type is empty, set type to be type of this model
    console.log(models.value);
    var model = models.value.find(model => model.model === activeModel.value);

    // let model = models.value.data.find(model => model.model === activeModel.value);
    if (activeType.value == null) {

        activeType.value = types.value.find(type => type.id === model.typeId).typeName;
        cascade = false;
        await changeType(false);
    }

    try {
        const response = await ModelServices.getAllFields(model.id);
        modelFields.value = response.data;
        console.log(modelFields.value);
    }
    catch (err) {
        console.error(err);
    }
};

/*************************************************
 *  BEGIN BUTTON FUNCTIONS
 ************************************************/
const saveItem = async () => {
    const itemFields = typeFields.value.map((typeField, index) => ({
        ...typeField,
        value: fieldValues.value[index],
    }));
    console.log(itemFields);

    const data = {
        serialNum: serialNum.value,
        productionYear: prodYear.value,
        warrantyEnd: warrantyEnd.value,
        modelId: models.value.find(model => model.model === activeModel.value).id,
        itemFields: itemFields
    };
    console.log(data);
    try {
        await ItemServices.create(data);
        console.log('created item');
        clearFields();
    }
    catch (err) {
        console.error(err);
    }
};

const cancel = () => {
    router.push({ name: 'itemlookup' });
};

const clearFields = () => {
    serialNum.value = null;
    warrantyEnd.value = null;
    prodYear.value = null;
    console.log(fieldValues.value);
    //had to use a classic for loop here because the fancy ones weren't doing what I wanted them to.
    for (let x = 0; x < fieldValues.value.length; x++) {
        fieldValues.value[x] = null;
    }
    console.log(fieldValues.value);
};

const clearAll = async () => {
    clearFields();
    activeModel.value = null;
    activeCat.value = null;
    activeType.value = null;
    modelFields.value = null;
    await retrieveData();
}
</script>

<template>
    <div class="ml-8 mt-4">
        <v-title class="text-h5">Add New Item</v-title>
    </div>
    <div class="ml-12 mr-12 mt-8">
        <v-row>
            <v-col class="text-left">
                <v-combobox label="Category" v-model="activeCat" @update:modelValue="changeCategory"
                    :items="catNames"></v-combobox>
            </v-col>
            <v-col class="text-left">
                <v-combobox label="Type" v-model="activeType" @update:modelValue="changeType(true)"
                    :items="typeNames"></v-combobox>
            </v-col>
            <v-col>
                <v-combobox label="Model" v-model="activeModel" @update:modelValue="changeModel"
                    :items="modelNames"></v-combobox>
            </v-col>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
        </v-row>
    </div>
    <div class="ml-12 mr-12">
        <v-card v-if="activeModel" :title="activeModel" color="card" class="pb-4">
            <v-row class="mr-1 ml-1" v-if="modelFields">
                <v-col v-for="m in modelFields" cols="3">
                    <v-text-field :label="m.field.name" v-model="m.value" disabled=true></v-text-field>
                </v-col>
            </v-row>
        </v-card>
    </div>
    <div class="ml-12 mr-12 mt-4">
        <v-card v-if="activeType" title="Item Fields" class="elevation-0">
            <v-row class="mr-1 ml-1">
                <v-col class="text-left">
                    <v-text-field label="Serial Number" v-model="serialNum">
                    </v-text-field>
                </v-col>
                <v-col class="text-left">
                    <v-text-field label="Production Year" v-model="prodYear">
                    </v-text-field>
                </v-col>
                <v-col class="text-left">
                    <v-text-field label="Warranty End" v-model="warrantyEnd">
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row class="mr-1 ml-1">
                <v-col v-for="(t, index) in typeFields" :key="index" cols="3">
                    <v-text-field :label="t.field.name" v-model="fieldValues[index]">
                    </v-text-field>
                </v-col>
            </v-row>
        </v-card>
    </div>
    <div class="ml-12 mr-12" style="float:right">
        <v-row>
            <v-col class="ml-16 text-right">
                <v-btn color="gray" @click="cancel">
                    Cancel
                </v-btn>
            </v-col>
            <v-col class="text-right">
                <v-btn color="darkgray" @click="clearAll">
                    Clear
                </v-btn>
            </v-col>
            <v-col class="text-right" v-if="activeModel">
                <v-btn color="blue" @click="saveItem">
                    Add New Item
                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>