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
    console.log("field computed: ", isFilled, " modelName value: ", modelName.value);
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
    //had to use a classic for loop here because the fancy ones weren't doing what I wanted them to.
    for (let x = 0; x < fieldValues.value.length; x++) {
        fieldValues.value[x] = '';
    }
};

function saveModel() {
    // Compose object for passing
    
}

onMounted(async () => {
    await getCategories();
    await getAllTypes();
});

</script>

<template>
    <div class="ma-15 mt-7">
        <!-- Page Title -->
        <div style="font-size: x-large;">Add Model</div>

        <!-- Category combobox. Needs to eventually restrict categories to only those assigned to user -->
        <!-- If only one category, do not show this box. Instead, show text. -->
        <v-combobox clearable label="Category" v-model="activeCat" @update:modelValue="changeCategory"
            :items="categoryNames"></v-combobox>

        <!-- Type combo box -->
        <v-combobox clearable label="Type" v-model="activeType" @update:modelValue="changeType"
            :items="typeNames"></v-combobox>

        <!-- Name text entry -->
        <v-text-field clearable label="Name" v-model="modelName"></v-text-field>

        <!-- Model fields -->
        <div>
            <v-card v-if="activeType" title="Model Fields" class="elevation-0">
                <v-row no-gutters class="text-left">
                    <v-col v-for="(field, index) in modelFields" :key="index" cols="12" sm="5" md="4" lg="4">
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