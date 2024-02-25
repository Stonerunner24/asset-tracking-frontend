<script setup>
    import { onMounted, ref } from "vue";
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

    const models = ref([]);
    const modelNames = ref([]);
    const activeModel = ref();
    var cascade = true;

    onMounted (async() => {
        await retrieveData();
    });
    
    const retrieveData = async() => {
        try{
            //Retrieve categories
            categories.value = await CategoryServices.getAll();
            catNames.value = categories.value.data.map(category => category.catName);

            //retrieve types
            types.value = await TypeServices.getAll();
            typeNames.value = types.value.data.map(type => type.typeName);

            //retrieve models
            models.value = await ModelServices.getAll();
            modelNames.value = models.value.data.map(model => model.model);
        }
        catch(err){
            console.error("There was some issue retrieving the categories: " + err);
        }
    }

    const changeCategory = async() => {
        console.log("changing category");
        if(activeCat.value == null){
            await retrieveData();
            activeType.value = null;
            activeModel.value = null;
        }
        else if(activeCat.value){
            //clear active type and model
            if(cascade){
                activeType.value = null;
                activeModel.value = null;
            }

            //set types to be only types within that category
            let catId = categories.value.data.find(cat => cat.catName === activeCat.value).id;
            console.log(catId);

            try{
                types.value = await TypeServices.getAllForCategory(catId);
                typeNames.value = types.value.data.map(type => type.typeName);
                models.value = [];
                if (cascade) {
                const promises = types.value.data.map(async (type) => {
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
            catch(err){
                console.error(err);
            }
        }
        cascade = true;
    };

    const changeType = async() => {
        if(cascade){
            activeModel.value = null;
        }
        let type = types.value.data.find(type => type.typeName === activeType.value);
        console.log(type);
        //If category is empty, change category to category of type
        if(activeCat.value == null){
            cascade = false;
            activeCat.value = categories.value.data.find(cat => cat.id === type.categoryId).catName;
            await changeCategory();
        }

        //set models to only be models within this type
        models.value = await ModelServices.getAllByType(type.id);
        modelNames.value = models.value.data.map(model => model.model);
    };

    const changeModel = async() => {
        //if type is empty, set type to be type of this model
        console.log(models.value);
        // let model = models.value.data.find(model => model.model === activeModel.value);
        if(activeType.value == null){
            let model = activeCat.value ? 
                models.value.find(model => model.model === activeModel.value) :
                models.value.data.find(model => model.model === activeModel.value);

            activeType.value = types.value.data.find(type => type.id === model.typeId).typeName;
            cascade = false;
            changeType();
        }

        const findTypeFields = async(typeId) => {
            
        }
    };
</script>
<template>
    <div class="ml-8 mt-4">
        <v-title class="text-h5">Add New Item</v-title>
    </div>
    <div class="ml-12 mr-12 mt-8">
        <v-row>
            <v-col class="text-left">
                <v-combobox
                    clearable
                    label="Category"
                    v-model="activeCat"
                    @update:modelValue="changeCategory"
                    :items="catNames"
                ></v-combobox>
            </v-col>
            <v-col class="text-left">
                <v-combobox
                    clearable
                    label="Type"
                    v-model="activeType"
                    @update:modelValue="changeType"
                    :items="typeNames"
                ></v-combobox>
            </v-col>
            <v-col>
                <v-combobox
                    clearable
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
</template>