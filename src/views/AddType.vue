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
        //console.log("num Fields" + numSelectedModels);
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


    //takes the selected item and models and returns an array of their respective fieldIds. 
    const getFieldIds = () =>{
     
        let fieldIds = [];
        
       
        selectedItemId.value.forEach(function(data){
            //console.log(data);
            let d = data;
            fields.value.data.forEach(function(fieldData){
                if(d === fieldData.name){
                    fieldIds.push(fieldData.id);
                }
                else{
                    //console.log("false");
                }
            })  
        })
        selectedModelId.value.forEach(function(data){
            let d = data;
            fields.value.data.forEach(function(fieldData){
                if(d===fieldData.name){
                    fieldIds.push(fieldData.id);
                }
            })
        })
        return fieldIds;
        
    }

    const getAreItems = () =>{
        let x = [];
        selectedItemId.value.forEach(function(data){
            //fieldIds.push(data);
            x.push(1);
        });

        selectedModelId.value.forEach(function(data){
            //fieldIds.push(data);
            x.push(0);
        });
        return x;

    }


    const printStuff = () =>{
        console.log(selectedCategoryId.value);
        console.log(getCatId());
        console.log(selectedModelId.value);
        console.log(selectedItemId.value);
        console.log(nameType.value);
        //console.log(categoryServices.findByTitle(selectedCategoryId.value));


    }
    const clearSelections = () =>{
        selectedCategoryId.value = null;
        nameType.value = null;
        selectedItemId.value = [];
        selectedModelId.value = []
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

        await typeServices.create(type)
        .then(newType =>{
            newType.value = newType;
            console.log(newType.value.data.id);
            let fieldIds = [];
            let areItems = [];
            let idOfType = newType.value.data.id;
            fieldIds = getFieldIds();
            areItems = getAreItems();
            const typeField = {
                isItem: areItems,
                fieldId: fieldIds,
            }
            console.log(JSON.stringify(typeField));
            typeServices.createTypeFields(idOfType, typeField);

            clearSelections();

        })
        .catch(error=>{
            console.error(error);
        })



        
    }

</script>

<template>
    <Sidebar></Sidebar>
    <div class = "ma-15 mt-7">
        <v-form>
            <div>
                <v-row align-self="end">
                    <v-col cols="12" md="6">
                        <v-combobox 
                            color="blue"
                            variant="underlined"
                            label="Category"
                            v-model="selectedCategoryId"
                            :items ="catNames"                     
                            :return-object = "true"></v-combobox> 
                
                    </v-col>
                    
                    <v-col cols="12" md="6" class = "text-right">
                        
                        
                        <v-btn 
                            color = "blue" 
                            @click="handleTypeCreate()"
                            >Save
                        </v-btn>
                    </v-col>
                    
                
                </v-row>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field
                            color="blue"
                            variant="underlined"
                            label = "Name"
                            placeholder = "Type name"
                            v-model = "nameType"
                        ></v-text-field>
                    </v-col>
                    
                </v-row>
                
                   
            
               
         
            </div>
            
            

            <br><br><br>
            <div style = "font-size: large;">
                <p>Model Fields</p>
            </div>
            <v-card color="gray" class = "pa-4">
                <v-combobox 
                    color="blue"
                    chips
                    closable-chips
                    multiple
                    label = "Model Field"
                    v-model="selectedModelId"
                    :items="fieldNames"
                    :return-object="true">
                </v-combobox>
            </v-card>

            <br><br><br>
            <div style = "font-size: large;">
                <p>Item Fields</p>
            </div>
            
            <v-card color = "gray" class = "pa-4">
                <v-combobox 
                color="blue" 
                chips 
                closable-chips 
                multiple label="Item Field" 
                v-model = "selectedItemId" 
                :items="fieldNames" 
                :return-object = "true">
            </v-combobox></v-card>   
        </v-form>
    </div>
</template>