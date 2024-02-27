<script setup>
  import { ref, onMounted, computed } from "vue";
  import CategoryServices from "../services/categoryServices";
  import router from "../router";
  
  const categories = ref([]);
  const tab = ref("active");
  const hideBtn = ref("deactivate")
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
    return tab.value === "active"
      ? categories.value.filter(c => c.active)
      : categories.value.filter(c => !c.active);
  });
  
  function toggleTab(selectedTab) {
    tab.value = selectedTab;
    if (selectedTab === 'inactive') {
      hideBtn.value = 'activate';
    } else {
      hideBtn.value = 'deactivate';
    }
  }
  
  async function saveCategory() {
    console.log(newCategory.value)
    let data = { 
      id: null,
      catName: newCategory.value,
      active: 1,
    }
    await CategoryServices.create(data);
    await getCategory();
    newCategory.value = '';
  }
  
  function viewCategory(category) {
    router.push(`/viewCategory/${category.id}`);
  }
  
  async function hideCategory(category) {
  try {
    let data = { active: tab.value === 'inactive' ? 1 : 0 };
    await CategoryServices.update(category.id, data);

    await getCategory();
  } catch (error) {
    console.error("Error hiding/unhiding category:", error);
  }
}

  onMounted(async () => {
    await getCategory();
  });
</script>
  
<template>

    <div class="ma-15 mt-7">
      <!-- Page Title -->
      <div style="font-size: x-large;">Category Lookup</div>
  
      <!-- Category Data Table -->
      <v-tabs v-model="tab" color="blue">
        <v-tab value="active" @click="toggleTab('active')">active</v-tab>
        <v-tab value="inactive" @click="toggleTab('inactive')">inactive</v-tab>
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
      <!-- ? does not call only Associated types but all types -->
      <div class="pt-10">
        <div style="font-size: large;">Add New Category</div>
        <v-card color="gray" class="pa-4">
          <v-row align="center" class="mr-2">
            <v-col cols="4">
              <v-text-field v-model="newCategory" label="Category Name" clearable></v-text-field>
            </v-col>
            <v-col cols="8" class="text-right">
              <v-btn color="blue" @click="saveCategory">Save</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </div>
  </template>
  