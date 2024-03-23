<script setup>
    import { ref, onMounted } from 'vue';
    import CategoryServices from '../services/categoryServices';
    import TypeServices from '../services/typeServices';
    import ModelServices from '../services/modelServices';
    import ItemServices from '../services/itemServices';

    const startDatePicker = ref(null);
    const endDatePicker = ref(null);
    const startDate = ref(startDisplayDate());
    const endDate = ref(endDisplayDate());
    const temp = ref(false);
    const startDateBoole = ref(false);
    const endDateBoole = ref(false);

    const category = ref({});
    const type = ref({});
    const model = ref({});
    const item = ref({});

    const categories = ref([]);
    const types = ref([]);
    const models = ref([]);
    const itemList = ref([]);

    var response;
    var cascade = true;

    function startDisplayDate() {
        if (startDatePicker.value == null) {
            const today = new Date();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const year = today.getFullYear();
            startDatePicker.value = today;
            return `${day}/${month}/${year}`;
        } else {
            const date = startDatePicker.value;
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }   
    }
    function endDisplayDate() {
        if (endDatePicker.value == null) {
            return null;    
        } else {
            const date = endDatePicker.value;
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }   
    }

    function handleStartDateChange() {
        startDate.value = startDisplayDate();
    }
    function handleEndDateChange() {
        endDate.value = endDisplayDate();
    }

    function isStartBeforeEnd(){
        return (startDatePicker.value <= endDatePicker.value) ? true : false;
    }

    const retrieveData = async() => {
        try{
            //Retrieve categories
            response = await CategoryServices.getAll();
            categories.value = response.data;

            //retrieve types
            response = await TypeServices.getAll();
            types.value = response.data;

            //retrieve models
            response = await ModelServices.getAll();
            models.value = response.data;

            // retrieve items
            response = await ItemServices.getAll();
            itemList.value = response.data;
        }
        catch(err){
            console.error("There was some issue retrieving the data: " + err);
        }
    }

    async function changeCategory(){
        if (category.value == null){
            await retrieveData();
            activeType.value = null;
            activeModel.value = null;
        }
        else if (categories.value) {
            if (cascade) {
                type.value = null;
                model.value = null
            }
            let catId = categories.value.find(cat => cat.catName === category.value).id;
            try {
                response = await TypeServices.getAllForCategory(catId);
                types.value =response.data;
                models.value = [];
                if (cascade){
                    const promises = types.value.map(async (type) => {
                        const typeModels = (await ModelServices.getAllByType(type.id)).data; 
                        return typeModels;
                    });

                    const resolvedModels = await Promise.all(promises);


                    models.value = resolvedModels.flat();
                }
            } catch (err) {
                console.log(err);
            }
        }
        cascade = true;
    }

    onMounted(async () => {
        await retrieveData();
    })
</script>

<template>
    <div>{{ category }}</div>
    <div class="ma-15 mt-7">
        <v-row>
            <v-col><div style="font-size: x-large;">Check Out</div></v-col>
            <v-col></v-col>
            <v-col class="text-right"><v-btn color="blue" flat>Check Out</v-btn></v-col>
        </v-row>
        <div class="mt-7">
            <v-row>
                <v-col class="text-left">
                    <div>
                    <v-text-field
                        variant="underlined"
                        color="blue"
                        label="Start Date"
                        placeholder="dd/MM/yyyy"
                        v-model="startDate"
                        style="display: inline-block; min-width: 50%; width: 75%;"
                        class="pr-3"
                    ></v-text-field>
                    <v-icon 
                        size="xx-large" 
                        class="hover-primary mt-n15"
                        @click="startDateBoole = !startDateBoole"
                        style="display: inline-block;"
                    >mdi-calendar</v-icon>
                    <v-overlay v-model="startDateBoole" class="align-center justify-center" contained>
                        <v-container v-if="startDateBoole" class="datePickerDialog">
                            <v-row justify="space-around">
                            <v-date-picker elevation="24" v-model="startDatePicker" :picker-date-format="'dd/MM/yyyy'" @click="handleStartDateChange"></v-date-picker>
                            </v-row>
                        </v-container>
                    </v-overlay> 
                    </div>
                </v-col>
                <v-col></v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-checkbox
                        class="mt-n11 ml-n3"
                        color="blue"
                        v-model="temp"
                        label="Permanant Loan"
                    ></v-checkbox>
                    <div v-if="!temp">
                    <v-text-field
                        class="mt-n10 pr-3"
                        variant="underlined"
                        color="blue"
                        label="End Date"
                        placeholder="dd/MM/yyyy"
                        v-model="endDate"
                        style="display: inline-block; min-width: 50%; width: 75%;"
                    ></v-text-field>
                    <v-icon 
                        size="xx-large" 
                        class="hover-primary mt-n15"
                        @click="endDateBoole = !endDateBoole"
                        style="display: inline-block;"
                    >mdi-calendar</v-icon>
                    <v-overlay v-model="endDateBoole" class="align-center justify-center" contained>
                        <v-container v-if="endDateBoole" class="datePickerDialog">
                            <v-row justify="space-around">
                            <v-date-picker elevation="24" v-model="endDatePicker" :picker-date-format="'dd/MM/yyyy'" @click="handleEndDateChange"></v-date-picker>
                            </v-row>
                        </v-container>
                    </v-overlay> 
                    </div>
                </v-col>
                <v-col></v-col>
            </v-row>
        </div>

        <div>
            <v-row>
                <v-col>
                    <v-card flat color="gray" class="pa-5" style="width:80%">
                        <div>Item</div>
                        <div style="width: 100%;">
                            <v-combobox color="blue" label="Category" placeholder="Category Name" v-model="category" :title="category.catName" :items="categories" item-title="catName" @update:modelValue="changeCategory()"></v-combobox>
                            <v-combobox color="blue" label="Type" placeholder="Type Name" v-bind="type" :items="types" item-title="typeName"></v-combobox>
                            <v-combobox color="blue" label="Model" placeholder="Model Name" v-bind="model" :items="models" item-title="model"></v-combobox>
                            <v-combobox color="blue" label="Serial Number" placeholder="Item Serial Number" v-bind="item" :items="itemList" item-title="serialNum"></v-combobox>
                        </div>
                    </v-card>
                </v-col>
                <v-col></v-col>
            </v-row>
        </div>
    </div>
</template>
<style scoped>
    .hover-primary:hover {
        color: #1976D2;
    }
</style>