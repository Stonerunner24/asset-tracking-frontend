<script setup>
    import Sidebar from "../components/SideBar.vue";
</script>

<template>
    <Sidebar></Sidebar>
    <div class = "ma-15 mt-7">
        <v-form>
            <v-combobox label="Category"
            :items = "['thing1','thing2', 'thing3']"></v-combobox>

            <p>do a thing</p>
            
        </v-form>
    </div>
</template>