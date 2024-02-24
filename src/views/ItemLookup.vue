<script setup>
    import { onMounted, ref } from "vue";
    import ItemServices from "../services/itemServices";
    import router from "../router";
    //IMPORT MODEL, TYPE, AND CATEGORY FOR FILTRATION PURPOSES

    const items = ref([]);
    const search = ref();
    const headers = [
        {title: 'Serial Number', value: 'serialNum'},
        {title: 'Status', value: 'status'},
        {title: 'Model', value: 'model.model'},
        {title: 'Type', value: 'model.type.typeName'},
        {title: 'Actions', }
    ];

    onMounted(async() => {
        await retrieveItems();
    });

    const retrieveItems = async() => {
        await ItemServices.getAll()
            .then((response) => {
                items.value = response.data;
                console.log(items.value);
            })
            .catch(async(err) => {
                if(err.response && err.response.status === 404){
                    console.log(err);
                }
            })
    };

    const viewItem = (itemId) => {
        //TODO: NAVIGATE TO PROPER ITEM PAGE ON CLICK
        router.push(({name: 'itemview', params: {id: itemId}}));
    }

    const addItem = () => {
        router.push(({name: 'itemadd'}));
    }

</script>

<template>
    <div class="ml-8 mt-4">
        <v-title class="text-h5">Item Lookup</v-title>
    </div>
    <v-card
        class="ma-12 mr-16"
        title="Filters"
        color="card"
    >
        <div class="ml-12 mr-12">
            <v-row >
                <v-col class="text-left">
                    <v-combobox
                        chips
                        closable-chips
                        label="Type"
                    ></v-combobox>
                    <!-- FILTER OFF TYPE -->
                </v-col>
                <v-col>
                    <v-combobox
                        chips
                        closable-chips
                        label="Category"
                    ></v-combobox>
                    <!-- FILTER OFF CATEGORY -->
                </v-col>
                <v-col>
                    <v-combobox
                        chips
                        closable-chips
                        label="Model"
                    ></v-combobox>
                    <!-- FILTER OFF MODEL    -->
                </v-col>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-col class="text-right">
                    <v-btn
                        class=""
                        color="blue"
                        size="large"
                    >
                        Filter
                    </v-btn>
                </v-col>
            </v-row>
        </div>
    </v-card>
    <div class="ml-12 mr-12">
        <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            single-line
            variant="outlined"
            hide-details
        ></v-text-field>
        <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
        >
            <template v-slot:item="{item}">
                <tr>
                    <td>{{ item.serialNum }}</td>
                    <td>{{ item.status }}</td>
                    <td>{{ item.model.model }}</td>
                    <td>{{ item.model.type.typeName }}</td>
                    <td>
                        <v-btn elevation="1" size="small" color="blue" @click="viewItem(item.id)" >View</v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <v-btn
            color="blue"
            size="large"
            @click="addItem()"
        >
            Add Item
        </v-btn>
    </div>
    
</template>