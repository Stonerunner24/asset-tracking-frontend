<script setup>
    import { onMounted, ref, computed } from "vue";
    import Sidebar from "../components/SideBar.vue";
    import categorySerices from "../services/categorySerices";
    import fieldServices from "../services/fieldServices";


    const categories = ref([]);
    const catNames = ref([]);
    const fields = ref([]);
    const fieldNames = ref([]);
    const selectedCategoryId = ref(null);
    const selectedModelId = ref(null);
    const selectedItemId = ref(null);
    const nameType = ref(null);
    let numSelectedModels;

   




    

    onMounted(async () =>{
        console.log("Starting up");
        //incrementModelCount();
        console.log("num Fields" + numSelectedModels);
        await getAllCategories();
        await getAllFields();
    })
    
    
    const getAllFields = async()=>{
        try{
            fields.value = await fieldServices.getAll();
            console.log("fields value data\n", fields.value.data);
            fieldNames.value = fields.value.data.map(field => field.name);
            console.log(fieldNames.value);
            //numModels = fieldNames.value.length;
            //console.log("numModels: ", numModels);
        }
        catch(err){
            console.error(err);
        }
    };
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

    const printStuff = () =>{
        console.log(selectedCategoryId);
        console.log(selectedModelId.value);
        console.log(selectedItemId.value);
        console.log(nameType.value);
        //console.log(categoryServices.findByTitle(selectedCategoryId.value));


    }

    const handleTypeCreate = async() =>{

        let catIdNum = await categorySerices.findByTitle(selectedCategoryId.value);
        console.log(catIdNum.value);

        
        const type = {
            typeName: nameType.value,
            active: true,
            categoryId: selectedCategoryId.value
        };
    }

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
            v-model = "nameType"
            ></v-text-field>

            <br>

            <p>Model Fields</p>

            <v-combobox 
            chips
            closable-chips
            multiple
            label = "Model Field"
            v-model="selectedModelId"
            :items="fieldNames"
            :return-object="true">
            </v-combobox>

            <p>Item Fields</p>

            <v-combobox chips closable-chips multiple label="Item Field" v-model = "selectedItemId" :items="fieldNames" :return-object = "true"></v-combobox>

            <v-btn
            @click="printStuff()">Save</v-btn>

            <v-btn
            @click="handleTypeCreate()">Save</v-btn>

            

            

            
        </v-form>
    </div>
</template>