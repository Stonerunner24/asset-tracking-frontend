<script setup></script>
<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import ModelServices from "../services/modelServices";
import ItemServices from "../services/itemServices";
import typeServices from "../services/typeServices";
const type = ref({});
const models = ref([]);
const isActive = ref();
const typeName = ref();
const headers = [
    {title: "Model", value: 'model.model'}
]
onMounted(async()=>{
    const route = useRoute();
    await retrieveTypeData(route);
    await retrieveModels(route);
})
const retrieveTypeData = async(route) => {
    try{
        console.log("retrieve data for " + route.params.id);
        const response = await typeServices.get(route.params.id);
        console.log("type data")
        console.log(response.data);
        type.value = response.data;
        
        isActive.value = type.value.active;
        console.log(isActive.value);
        typeName.value = type.value.typeName;
    }
    catch(err){
        console.log(err.message);
    }
}

const retrieveModels = async(route) =>{
    try{
        console.log("retrieve models if any");
        const response = await ModelServices.getAllByType(route.params.id);
        models.value = response.data;
        console.log("models:\n");
        console.log(models.value.data);
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
    <div class="mr-21 ml-12">
        <v-data-table
        :headers="headers"
        :items="models">
        <template v-slot:item="{item}">
            <tr>
                <td>{{  item.model.model }}</td>
            </tr>
        </template>
    </v-data-table>
    </div>
</template>