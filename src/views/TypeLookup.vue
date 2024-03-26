<script setup>
    import { ref, onMounted, computed } from "vue";
    import router from "../router";
    import TypeServices from "../services/typeServices";
    import CategoryServices from "../services/categoryServices";

    const types = ref([]);
    const search = ref('');
    const tab = ref("active");
    const hideBtn = ref("deactivate")
    const catNames = ref([]);

    const headers = ref([
        { title: 'Name', value: "typeName" },
        { title: 'Category',},
        { title: 'Action', align: "end"}
    ]);
    
    async function getTypes() {
        try {
            const response = await TypeServices.getAll();
            types.value = response.data;
            await getCategoryName();
        } catch (error) {
            console.log("Error fetching types:", error);
        }
    }

    async function toggleTab(selectedTab) {
        tab.value = selectedTab;
        if (selectedTab === 'inactive') {
            hideBtn.value = 'activate';
        } else {
            hideBtn.value = 'deactivate';
        }
        await getCategoryName();
    }

    async function hideType(type) {
        try {
            let data = { active: tab.value === 'inactive' ? 1 : 0 };
            await TypeServices.update(type.id, data);
        await getTypes();
        } catch (error) {
            console.error("Error hiding/unhiding type:", error);
        }
    }

    async function getCategoryName() {
        try {
            catNames.value = [];
            const typesToFetch = tab.value === 'active' ? currentTypes.value.filter(c => c.active) : currentTypes.value;
            for (let i = 0; i < typesToFetch.length; i++) {
                const response = await CategoryServices.get(typesToFetch[i].categoryId);
                catNames.value.push(response.data.catName);
            }
        } catch (error) {
            console.error("Error fetching category name:", error);
        }
    };


    function viewType(type){
        router.push(`/typeview/${type.id}`);
    }

    function addTypePage(){
        router.push(`/addtype`);
    }

    const currentTypes = computed(() => {
        return tab.value === "active"
        ? filteredTypes.value.filter(c => c.active)
        : filteredTypes.value.filter(c => !c.active);
    });

    const filteredTypes = computed(() =>{
        return types.value.filter(type => {
            return type.typeName.toLowerCase().includes(search.value.toLowerCase());
        });
    });

    onMounted(async () => {
        await getTypes();
    });
</script>
<template>
    <div  class="ma-15 mt-7">
        <div style="font-size: x-large;">Type Lookup</div>

        <div class="pt-5">
        <v-tabs v-model="tab" color="blue">
            <v-tab value="active" @click="toggleTab('active')">active</v-tab>
            <v-tab value="inactive" @click="toggleTab('inactive')">inactive</v-tab>
        </v-tabs>
        <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            single-line
            variant="outlined"
            hide-details
        ></v-text-field>
        <v-data-table :items="currentTypes" class="display" :headers="headers">
        <template v-slot:item="{ item, index }">
          <tr>
            <td>{{ item.typeName }}</td>
            <td>{{ catNames[index] }}</td>
            <td class="text-right">
                <!-- View button -->
                <v-btn elevation="1" size="small" color="blue" @click="viewType(item)" class="mr-10">View</v-btn>
                <!-- Hide button -->
                <v-btn elevation="1" size="small" color="gray" @click="hideType(item)">{{ hideBtn }}</v-btn>
            </td>
          </tr>
        </template>
        </v-data-table>
        </div>

        <div>
            <v-btn flat @click="addTypePage()" color="blue">
                <v-icon>mdi-plus</v-icon>
                Add New Type
            </v-btn>
        </div>
    </div>
</template>