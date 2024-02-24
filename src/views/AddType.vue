<script setup>
    import { onMounted, ref } from "vue";
    import Sidebar from "../components/SideBar.vue";
    import categorySerices from "../services/categorySerices";
    


    const categories = ref([]);
    const catNames = ref([]);
    const selectedCategoryId = ref(null);

    onMounted(async () =>{
        console.log("Starting up");
        await getAllCategories();
        
    })
    
    


    //get categories
    const getAllCategories = async()=>{
        try{
            categories.value = await categorySerices.getAll();
            console.log(categories.value.data);
            catNames.value = categories.value.data.map(category => category.catName);
            console.log(catNames.value);
        }
        catch(err){
            console.error(err);
        }
        // await categorySerices.getAll()
        // .then((response)=>{
        //     console.log("Category List");
        //     console.log(response.data);
        //     categories.value = response.data;
        //     catNames.value = categories.value.data.map(category => category.catName);
        //     console.log(catNames.value);
            
        // })
        // .catch((e)=>{
        //     console.log(e.response);
        // })
    };

</script>

<template>
    <Sidebar></Sidebar>
    <div class = "ma-15 mt-7">
        <v-form>
            <v-combobox 
            label="Category"
            v-model="selectedCategoryId"
            :items ="catNames"
            item-text = "id"
            :return-object = "true"></v-combobox>            
        </v-form>
    </div>
</template>