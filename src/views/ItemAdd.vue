<script setup>
import { onMounted, ref, computed } from "vue";
import {format, parse} from "@formkit/tempo";
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

const hasWarranty = ref(false);
const warrantyEnd = ref(null);

const hasMaintenance = ref(false);
const repairSchedule = ref('');

const fieldValues = ref(Array.from({ length: typeFields.value.length }, () => ''));

const items = ref([{
    serialNum: '',
    initialValue: '', 
    prodYear: '', 
    warrantyEnd: null,
    repairSchedule: null,
    modelId: null,
    itemFields: []
}]);

var response;

onMounted(async () => {
    await retrieveData();
});

const retrieveData = async () => {
    try {
        console.log(items.value);
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
    for(let item of items.value){
        item.itemFields = Array.from({ length: typeFields.value.length }, (_, index) => ({
            fieldId: typeFields.value[index].fieldId,
            value: ""
        }));
    }
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
        console.log(items.value);
    }
    catch (err) {
        console.error(err);
    }
};

/*************************************************
 *  BEGIN BUTTON FUNCTIONS
 ************************************************/
const saveItem = async () => {
    let model = models.value.find(model => model.model === activeModel.value);
    if(warrantyEnd.value){
        console.log(warrantyEnd.value);
        warrantyEnd.value = parse(warrantyEnd.value, 'DD-MM-YYYY', 'en-US');
    }
    if(repairSchedule.value){
        var schedule = repairSchedule.value.split(' ');
    }
    for (let item of items.value) {
        console.log(item);
        try {
            item.modelId = model.id;
            item.warrantyEnd = warrantyEnd.value ?? null;
            item.repairSchedule = schedule ?? null;

            let response = await ItemServices.create(item);
            let itemId = response.data.id;

            await ItemServices.bulkCreateFields(itemId, item.itemFields);
        } catch (error) {
            console.error('Error processing item:', error);
        }
    }
    await clearAll();
};

const cancel = () => {
    router.push({ name: 'itemlookup' });
};

const clearFields = () => {
    for(let item of items.value){
        item.serialNum = '';
        item.initialValue = '';
        item.prodYear = '';
        for(let field of item.itemFields){
            field.value = '';
        }
        warrantyEnd.value = null;
        repairSchedule.value = null;
    }
    console.log(fieldValues.value);
};

const clearAll = async () => {
    clearFields();
    activeCat.value = null;
    activeType.value = null;
    activeModel.value = null;
    hasMaintenance.value = false;
    hasWarranty.value = false;
    await retrieveData();
};

const addNew = () => {
    let newItem = {
        serialNum: '', 
        initialValue: '', 
        prodYear: '', 
        itemFields: Array.from({ length: typeFields.value.length }, (_, index) => ({
            fieldId: typeFields.value[index].fieldId,
            value: ""
        }))
    }
    items.value.push(newItem);
}
</script>

<template>
    <div class="ml-8 mt-4">
        <v-title class="text-h5">Add New Item</v-title>
    </div>
    <div class="ml-12 mr-12 mt-8">
        <v-row>
            <v-col class="text-left">
                <v-combobox 
                    label="Category" 
                    v-model="activeCat" 
                    @update:modelValue="changeCategory"
                    :items="catNames"
                ></v-combobox>
            </v-col>
            <v-col class="text-left">
                <v-combobox 
                    label="Type" 
                    v-model="activeType" 
                    @update:modelValue="changeType(true)"
                    :items="typeNames"
                ></v-combobox>
            </v-col>
            <v-col>
                <v-combobox 
                    label="Model" 
                    v-model="activeModel" 
                    @update:modelValue="changeModel"
                    :items="modelNames"
                ></v-combobox>
            </v-col>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
        </v-row>
    </div>
    <div class="ml-12 mr-12">
        <v-card 
            v-if="activeModel" 
            :title="activeModel" 
            color="card" 
            class="pb-4"
        >
            <v-row class="mr-1 ml-1" v-if="modelFields">
                <v-col v-for="m in modelFields" cols="3">
                    <v-text-field 
                        :label="m.field.name" 
                        v-model="m.value" 
                        :disabled='true'
                    ></v-text-field>
                </v-col>
            </v-row>
        </v-card>
    </div>
    <div class="ml-12 mr-12 mt-4" v-for="item in items">
        <v-card v-if="activeType" title="Item Fields" class="elevation-0">
            <v-row class="mr-1 ml-1">
                <v-col cols="12" sm="12" md="4" lg="3">
                    <v-text-field 
                        label="Serial Number" 
                        v-model="item.serialNum" 
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" lg="3">
                    <v-text-field 
                        label="Purchase Price" 
                        v-model="item.initialValue" 
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" lg="3">
                    <v-text-field 
                        label="Production Year" 
                        v-model="item.prodYear" 
                    ></v-text-field>
                </v-col>
                <v-col 
                    cols="12" sm="12" md="4" lg="3" 
                    v-for="(t, index) in typeFields" 
                    :key="index"
                >
                    <v-text-field 
                        :label="t.field.name" 
                        v-model="item.itemFields[index].value"
                    ></v-text-field>
                </v-col>
            </v-row>
        </v-card>
    </div>
    <div class="mr-12 ml-12 mt-8" v-if="activeModel">
        <v-card title="Warranty/Maintenance" class="elevation-0">
            <v-checkbox label="Has Warranty" v-model="hasWarranty" color="blue" class="mr-1 ml-1">
            </v-checkbox>
            <v-row class="mr-1 ml-1" v-if="hasWarranty">
                <v-col cols="12" sm="12" md="4" lg="3">
                    <v-text-field label="Warranty End Date" v-model="warrantyEnd" >
                    </v-text-field>
                </v-col>
            </v-row>
            <v-checkbox label="Preventative Maintenance" v-model="hasMaintenance" color="blue"
                class="mr-1 ml-1">
            </v-checkbox>
            <v-row class="mr-1 ml-1" v-if="hasMaintenance">
                <v-col cols="12" sm="12" md="4" lg="3">
                    <v-combobox 
                        label="Maintenance Schedule" 
                        v-model="repairSchedule" 
                        :items="['6 Months', '12 Months', '18 Months', '24 Months']"
                    ></v-combobox>
                </v-col>
            </v-row>
        </v-card>
    </div>
    <div class="ml-12 mr-12">
        <v-row>
            <v-col class="text-left" style="display:flex; justify-content: left;">
                <v-btn color="darkgray" @click="addNew" v-if="activeModel">
                    Add Another Item
                </v-btn>
            </v-col>
            <v-col>
                <v-row style="float:right">
                    <v-col class="ml-16 text-right">
                        <v-btn color="gray" @click="cancel">
                            Cancel
                        </v-btn>
                    </v-col>
                    <v-col class="text-right">
                        <v-btn color="darkgray" @click="clearFields">
                            Clear
                        </v-btn>
                    </v-col>
                    <v-col class="text-right" v-if="activeModel">
                        <v-btn color="blue" @click="saveItem">
                            Save Item(s)
                        </v-btn>
                    </v-col>
                </v-row>
            </v-col>
            
        </v-row>
    </div>
</template>