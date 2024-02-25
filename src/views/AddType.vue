<script setup>
    import { onMounted, ref, computed } from "vue";
    import Sidebar from "../components/SideBar.vue";
    import categorySerices from "../services/categorySerices";
    import modelServices from "../services/modelServices"
    


    const categories = ref([]);
    const catNames = ref([]);
    //const models = ref([]);
    //const modelNames = ref([]);
    const selectedCategoryId = ref(null);
    var numModels = 0;

   




    const incrementModelCount = () =>{
        numModels = numModels + 1;
        console.log(numModels);
    }

    onMounted(async () =>{
        console.log("Starting up");
        incrementModelCount();
        console.log(numModels);
        await getAllCategories();
        
    })
    
    
    //get models
    // const getAllModels = async()=>{
    //     try{
    //         models.value = await modelServices.getAll();
    //         console.log("model value data");
    //         console.log(model.value.data);
    //         modelNames.value = models.value.data.map(model => model.na)
    //     }
    // };

    //get categories
    const getAllCategories = async()=>{
        try{
            categories.value = await categorySerices.getAll();
            console.log("category value data");
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
            :return-object = "true"></v-combobox>     
            
            <v-text-field
            label = "Name"
            placeholder = "Type name"
            ></v-text-field>

            <br>

            <p>Model Fields</p>

            <v-combobox 
            v-for="n in numModels"
            label = "Model Field">
            </v-combobox>

            <v-btn
            @click = "incrementModelCount"
            ><v-icon left>mdi-plus</v-icon>Add New Model</v-btn>

            

            
        </v-form>
    </div>
</template>