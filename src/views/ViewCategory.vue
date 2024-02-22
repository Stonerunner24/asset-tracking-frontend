<script setup>
    import { ref, onMounted } from "vue";
    import { useRoute } from 'vue-router'
    import CategoryServices from '../services/categoryServices.js'
    import TypeServices from '../services/typeServives.js'
    import Sidebar from '../components/SideBar.vue'

    const route = useRoute();
    const category = ref({});
    const types = ref([]);
    const requestId = route.params.id;
    const comboValue = ref(['active', 'inactive']);
    const activeBox = ref(null);

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
            console.error("Error fetching categories:", error);
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

     <div class="ma-15 mt-3">
            <!-- Page Title -->
        <div style="font-size: x-large;" class="pb-5">Category View</div>

        <div class="ml-5 mt-5" style="font-size: large;">Category Data</div>

        <div class="pl-5 pt-4">Name</div>
        <v-text-field readonly small class="pl-5 pb-4" style="width: 25rem;">{{ category.catName }}</v-text-field>

        <div class="pl-5">Activity</div>
        <v-combobox  v-model="activeBox" class="pl-5 " style="width: 25rem;" :items="comboValue"></v-combobox>

        <v-btn color="blue" class="pl-5" @click="saveCategory()">save</v-btn>

        <!-- TODO Add item viewer for all types in category -->
        <div>{{ types }}</div>
        <v-data-table :items="types" class="display">
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.catName }}</td>
            <td class="text-right">
                <!-- View button -->
                <v-btn elevation="1" size="small" color="blue" @click="viewCategory(item)" class="mr-10">View</v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
</template>