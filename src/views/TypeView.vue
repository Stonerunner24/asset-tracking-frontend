<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import ModelServices from "../services/modelServices";
import ItemServices from "../services/itemServices";
import typeServices from "../services/typeServices";

const type = ref({});
const modelsOfType = ref([]);
const isActive = ref();
const typeName = ref();


onMounted(async()=>{
    const route = useRoute();
    retrieveTypeData(route);
})

const retrieveTypeData = async(route) => {
    try{
        console.log("retrieve data for " + route.params.id);
        const response = await typeServices.get(route.params.id);
        console.log("type data")
        console.log(response.data);
        type.value = response.data;
        modelsOfType.value = await ModelServices.getAllByType(route.params.id);
        console.log("models (if any)");
        console.log(modelsOfType.value.data);
        isActive.value = type.value.active;
        console.log(isActive.value);
        typeName.value = type.value.typeName;
    }
    catch(err){
        console.log(err.message);
    }
}




</script>
<template>
    <div class="ml-8 mt-4">
        <v-title class="text-h5">View type</v-title>
    </div>
    <div class="ml-12 mr-12">
        <v-row>
            <v-col>
                <v-checkbox label="active" v-model="isActive" :disabled="true"></v-checkbox>
            </v-col>
            <v-col class="text-left">
                <v-text-field label="name" v-model="typeName" :disabled="true"></v-text-field>

            </v-col>
        </v-row>
    </div>
</template>