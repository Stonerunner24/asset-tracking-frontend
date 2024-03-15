<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import TypeServices from "../services/typeServices";
import ModelServices from "../services/modelServices";
import ItemServices from "../services/itemServices";
import typeServices from "../services/typeServices";

const type = ref({});
const modelsOfType = ref([]);


onMounted(async()=>{
    const route = useRoute();
})

const retrieveViewData = async(route) => {
    try{
        const response = await typeServices.get(route.params.id);

    }
    catch(err){
        console.log(err.message);
    }
}




</script>
<template></template>