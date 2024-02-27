<script setup>
    import { onMounted, ref, computed } from "vue";
    import Sidebar from "../components/SideBar.vue";
    import categorySerices from "../services/categorySerices";
    import fieldServices from "../services/fieldServices";
    import typeServices from "../services/typeServives";


    const categories = ref([]);
    const catNames = ref([]);
    const fields = ref([]);
    const fieldNames = ref([]);
    const selectedCategoryId = ref(null);
    const selectedModelId = ref(null);
    const selectedItemId = ref(null);
    const nameType = ref(null);
    let numSelectedModels;
    //let selectedCat = ref(null);

   




    

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

    const getCatId = () =>{
        let catId = categories.value.data.find(cat => cat.catName === selectedCategoryId.value).id;
        return catId;
    }


    const printStuff = () =>{
        console.log(selectedCategoryId.value);
        console.log(getCatId());
        console.log(selectedModelId.value);
        console.log(selectedItemId.value);
        console.log(nameType.value);
        //console.log(categoryServices.findByTitle(selectedCategoryId.value));


    }

    const handleTypeCreate = async() =>{

        let catIdNum = getCatId();

        
        const type = {
            typeName: nameType.value,
            active: true,
            categoryId: catIdNum
        };

        console.log(type);

        const newType = ref({});

        newType.value = await typeServices.create(type);

        let fieldIds = [];
        let areItems = [];
        let idType = newType.value.data.id;

        selectedItemId.value.forEach(function(data){
            fieldIds.push(data);
            areItems.push(1);
        });

        selectedModelId.value.forEach(function(data){
            fieldIds.push(data);
            areItems.push(0);
        });

        console.log(newType);
        console.log(newType.value.data.id);
        console.log(idType);
        console.log(fieldIds);
        console.log(areItems);

        const typeField = {
            isItem: areItems,
            fieldId: fieldIds,
            typeId: idType,
        };

        //console.log(typeField.value);
        //console.log(typeField.data);
        console.log("TypeField JSON");
        //console.log(typeField);
        console.log(JSON.stringify(typeField));

        //console.log(typeServices.getAll());
        //console.log(typeServices.getAllTypeFields(1));
        typeServices.createTypeFields(idType, JSON.stringify(typeField));
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

            <!-- <v-btn @click="printStuff()">Save</v-btn> -->

            <v-btn
            @click="handleTypeCreate()">Save</v-btn>

            

            

            
        </v-form>
    </div>
</template>