<script setup>
  import { ref, onMounted, computed } from "vue";
  import CategoryServices from "../services/categorySerices";
  import Sidebar from "../components/SideBar.vue";
  
  const categories = ref([]);
  const tab = ref("visible");
  const hideBtn = ref("hide")
  const newCategory = ref("");

  const headers = ref([
    { title: 'Name', value: "catName" },
    { title: 'Action', align: "end"}
  ])
  
  async function getCategory() {
    try {
      const response = await CategoryServices.getAll();
      categories.value = response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }
  
  const currentCategories = computed(() => {
    return tab.value === "visible"
      ? categories.value.filter(c => c.active)
      : categories.value.filter(c => !c.active);
  });
  
  function toggleTab(selectedTab) {
    tab.value = selectedTab;
    if (selectedTab === 'hidden') {
      hideBtn.value = 'Unhide';
    } else {
      hideBtn.value = 'Hide';
    }
}

  
  async function saveCategory() {
    // TODO Implement saving of new category using CategoryServices
    // & saves new category
  }
  
  function viewCategory(category) {
    // TODO Implement viewing of category details
    // & view single category
    // ? not necessary if clickable?
    // * eli and trina want clickable
  }
  
  function hideCategory(category) {
    console.log('hiding...')
  }
  
  onMounted(async () => {
    await getCategory();
  });
</script>
  
<template>
  <v-container>
    <Sidebar />
  </v-container>

    <div class="ma-15 mt-7">
      <!-- Page Title -->
      <div style="font-size: x-large;">Category Lookup</div>
  
      <!-- Category Data Table -->
      <v-tabs color="blue">
        <v-tab :value="tab" @click="toggleTab('visible')">Visible</v-tab>
        <v-tab :value="tab" @click="toggleTab('hidden')">Hide</v-tab>
      </v-tabs>
  
      <v-data-table :items="currentCategories" class="display" :headers="headers">
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.catName }}</td>
            <td class="text-right">
                <!-- View button -->
                <v-btn elevation="1" size="small" color="blue" @click="viewCategory(item)" class="mr-10">View</v-btn>
                <!-- Hide button -->
                <v-btn elevation="1" size="small" color="gray" @click="hideCategory(item)">{{ hideBtn }}</v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
  
      <!-- Add Category Display -->
      <div class="pt-10">
        <v-card color="gray" class="pa-4">
          <v-row align="center" class="mr-2">
            <v-col cols="4">
              <v-text-field v-model="newCategory" label="Category Name"></v-text-field>
            </v-col>
            <v-col cols="8" class="text-right">
              <v-btn color="blue" @click="saveCategory">Save</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </div>
  </template>
  