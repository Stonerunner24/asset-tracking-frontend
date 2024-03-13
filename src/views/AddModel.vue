<script setup>
import { ref, onMounted, computed, watch } from "vue";
import modelServices from "../services/modelServices";
import categoryServices from "../services/categoryServices";
import typeServices from "../services/typeServices";
import router from "../router";

const categories = ref([]);
const categoryNames = computed(() => categories.value.map(category => category.catName));
const activeCat = ref();

const types = ref([]);
const typeNames = computed(() => types.value.map(type => type.typeName));
const activeType = ref();

const modelFields = ref([]);
const fieldValues = ref(['']);

const modelName = ref('');

watch(modelFields, (newModelFields) => {
    fieldValues.value = Array.from({ length: newModelFields.length }, () => '');
});

// Computed property to check if all fields have values
const allFieldsFilled = computed(() => {
    const isFilled = fieldValues.value.every(value => value !== '') && !(modelName.value == '' || modelName.value == null);
    return isFilled;
});
async function getCategories() {
    // This eventually needs to be altered to only fetch the categories the user is assigned to
    try {
        const response = await categoryServices.getAll();
        categories.value = response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

async function getAllTypes() {
    try {
        const response = await typeServices.getAll();
        types.value = response.data;
    } catch (error) {
        console.error("Error fetching types:", error);
    }
}

async function getTypesForCategory(categoryId) {
    try {
        const response = await typeServices.getAllForCategory(categoryId);
        types.value = response.data;
    } catch (error) {
        console.error("Error fetching types:", error);
    }
}

async function getFieldsForType(typeId) {
    console.log("In getFieldsForType");
    try {
        const response = await typeServices.getAllModelFields(typeId);
        console.log(response.data);
        modelFields.value = response.data;
        console.log(modelFields.value);
    } catch (error) {
        console.error("Error fetching typeFields: ", error);
    }
}

async function changeCategory(clearType) {

    // 1: category is reset. Result: type is unfiltered
    if (activeCat.value == null) {
        await getAllTypes();
        clearType = true;
    }
    // 2: category is changed. Result: type is filtered
    else {
        // Get active category id from categories list and update types
        let catId = categories.value.find(cat => cat.catName === activeCat.value).id;
        await getTypesForCategory(catId);
    }
    if (clearType) {
        activeType.value = null;
    }
}

async function changeType() {
    // Get full active type object
    let type = types.value.find(type => type.typeName === activeType.value);
    if (type != null) {
        await getFieldsForType(type.id);
    }
    // 1: Category is empty. Change category to category of type
    if (activeCat.value == null) {
        activeCat.value = categories.value.find(cat => cat.id === type.categoryId).catName;
        await changeCategory(false);
    }
}

const clearFields = () => {
    for (let x = 0; x < fieldValues.value.length; x++) {
        fieldValues.value[x] = '';
    }
};

function clearAll() {
    clearFields();
    activeCat.value = null;
    modelName.value = '';
    changeCategory();
}

async function saveModel() {
    // Create model
    const modelData = {
        model: modelName.value,
        typeId: types.value.find(type => type.typeName === activeType.value).id,
    }
    try {
        var modelId = (await modelServices.create(modelData)).data.id;
        console.log("Model created", modelId);
        await saveModelFields(modelId);
        clearAll();
    } catch(error) {
        console.error(error);
    }
}

async function saveModelFields(modelId) {
    // Map arrays
    const fieldIds = modelFields.value.map(modelField => modelField.fieldId);

    if (fieldIds.length !== fieldValues.value.length) {
        console.log("FieldId array: ", fieldIds);
        console.log("FieldValue array: ", fieldValues);
        throw new Error("FieldId and FieldValues lengths do not match.");
    }

    // Create request data
    const data = {
        fieldId: fieldIds,
        value: fieldValues.value
    }

    console.log("Data:", data);

    try {
        await modelServices.bulkCreateFields(modelId, data);
        console.log("ModelFields created");
    } catch (error) {
        console.error(error);
        throw error;
    }
}

onMounted(async () => {
    await getCategories();
    await getAllTypes();
});

</script>

<template>
    <div class="ma-15 mt-7">
        <!-- Page Title and Save Button -->
        <div class="d-flex justify-space-between align-center">
            <div style="font-size: x-large;">Add Model</div>
            <v-btn color="blue" :disabled="!allFieldsFilled" @click="saveModel">
                Save
            </v-btn>
        </div>

        <!-- Comboboxes and Text Field -->
        <v-row no-gutters>
            <v-col cols="12" sm="5" md="4" lg="3">
                <!-- Category combobox -->
                <v-combobox clearable label="Category" v-model="activeCat" @update:modelValue="changeCategory"
                    :items="categoryNames" style="width: 100%;"></v-combobox>
            </v-col>
        </v-row><v-row no-gutters>
            <v-col cols="12" sm="5" md="4" lg="3">
                <!-- Type combobox -->
                <v-combobox clearable label="Type" v-model="activeType" @update:modelValue="changeType"
                    :items="typeNames" style="width: 100%;"></v-combobox>
            </v-col>
        </v-row><v-row no-gutters>
            <v-col cols="12" sm="5" md="4" lg="3">
                <!-- Name text field -->
                <v-text-field clearable label="Name" v-model="modelName" style="width: 100%;"></v-text-field>
            </v-col>
        </v-row>
        <!-- Model fields -->
        <div>
            <v-card v-if="activeType" title="Model Fields" class="elevation-0">
                <v-row no-gutters class="text-left">
                    <v-col v-for="(field, index) in modelFields" :key="index" cols="12" sm="5" md="4" lg="3">
                        <v-text-field class="ma-1" :label="field.field.name"
                            v-model="fieldValues[index]"></v-text-field>
                    </v-col>
                </v-row>
            </v-card>
        </div>

        <!-- Buttons -->
        <div class="ml-12 mr-12">
            <v-row>
                <v-col class="text-right">
                    <v-btn color="darkgray" class="ma-2" @click="clearFields">
                        Clear fields
                    </v-btn>
                    <v-btn color="blue" :disabled="!allFieldsFilled" @click="saveModel">
                        Save
                    </v-btn>
                </v-col>
            </v-row>
        </div>
    </div>
</template>