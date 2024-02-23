<script setup>
    import { ref, onMounted } from "vue";
    import { useRoute } from 'vue-router'
    import CategoryServices from '../services/categoryServices.js'
    import TypeServices from '../services/typeServives.js'
    import Sidebar from '../components/SideBar.vue'
    import router from "../router";

    const route = useRoute();
    const category = ref({});
    const types = ref([]);
    const requestId = route.params.id;
    const comboValue = ref(['active', 'inactive']);
    const activeBox = ref(null);

    const headers = ref([
    { title: 'Type Name', value: "typeName" },
  ])

    async function getCategory() {
        try {
            const response = await CategoryServices.get(requestId);
            category.value = response.data;
            console.log(category)
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    async function getTypes() {
        try {
            const response = await TypeServices.getAllForCategory(requestId);
            types.value = response.data;
            console.log(types)
        } catch (error) {
            console.error("Error fetching types:", error);
        }
    }

    async function setComboBox() {
        activeBox.value = category.value.active === true ? 'active' : 'inactive';
    }

    async function saveCategory() {
        try{
            let data = { active: activeBox.value === 'active' ? 1 : 0 };
            await CategoryServices.update(category.value.id, data);
            await getCategory();
        } catch(error) {
            console.log(error);
        }
    }

    function viewCategory(type) {
        router.push(`/viewtype/${type.id}`);
    }

    onMounted(async () => {
        await getCategory();
        await setComboBox();
        await getTypes();
    });

</script>
<template>
    <v-container>
        <Sidebar/>
    </v-container>

    <div class="ma-15 mt-3 pl-5">
            <!-- Page Title -->
        <div style="font-size: x-large;" class="pb-5">Category View</div>

        <div style="font-size: large;">Category Data</div>

        <div class="pt-4">Name</div>
        <v-text-field readonly small class="pb-4" style="width: 25rem;">{{ category.catName }}</v-text-field>

        <div>Activity</div>
        <v-combobox  v-model="activeBox" style="width: 25rem;" :items="comboValue"></v-combobox>

        <div>
            <v-btn color="blue" class="" @click="saveCategory()">set activity</v-btn>
        </div>

        <div style="font-size: large;" class="pt-5">Associated Types</div>
        <v-data-table :items="types" :headers="headers" class="display">
            <template v-slot:item="{ item }">
                <tr>
                    <td>{{ item.typeName }}</td>
                    <!-- Add more columns if necessary -->
                    <td class="text-right">
                        <!-- View button -->
                        <v-btn elevation="1" size="small" color="blue" @click="viewCategory(item)" class="mr-10">View</v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
    </div>
</template>