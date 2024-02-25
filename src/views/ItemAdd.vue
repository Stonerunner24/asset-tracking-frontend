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
        if(activeCat.value == null){
            await retrieveData();
        }
        else if(activeCat.value && cascade){
            //clear active type and model
            activeType.value = null;
            activeModel.value = null;
            
            //set types to be only types within that category
            let catId = categories.value.data.find(cat => cat.catName).id;
            console.log(catId);

            try{
                types.value = await TypeServices.getAllForCategory(catId);
                typeNames.value = types.value.data.map(type => type.typeName);
                models.value = [];
                const promises = types.value.data.map(async (type) => {
                    models.value.push((await ModelServices.getAllByType(type.id)).data);
                });
                await Promise.all(promises);
                modelNames.value = models.value.flatMap(modelList => modelList.map(model => model.model));
            }
            catch(err){
                console.error(err);
            }
        }
        else cascade = true;
    };

    const changeType = async() => {
        //If category is empty, change category to category of type

        //set models to only be models within this type

    };

    const changeModel = async() => {
        //if type is empty, set type to be type of this model

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
                    chips
                    closable-chips
                    label="Category"
                    v-model="activeCat"
                    @update:modelValue="changeCategory"
                    :items="catNames"
                ></v-combobox>
            </v-col>
            <v-col class="text-left">
                <v-combobox
                    chips
                    closable-chips
                    label="Type"
                    v-model="activeType"
                    @update:modelValue="changeType"
                    :items="typeNames"
                ></v-combobox>
            </v-col>
            <v-col>
                <v-combobox
                    chips
                    closable-chips
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