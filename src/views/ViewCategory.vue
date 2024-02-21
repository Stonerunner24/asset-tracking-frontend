<script setup>
    import { ref, onMounted } from "vue";
    import { useRoute } from 'vue-router'
    import CategoryServices from '../services/categorySerices.js'

    const route = useRoute();
    const category = ref({});
    const requestId = route.params.id;

    async function getCategory() {
        try {
            const response = await CategoryServices.get(requestId);
            category.value = response.data;
            console.log(category)
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    onMounted(async () => {
        await getCategory();
    });

</script>
<template>
    <div>
        {{ category }}
    </div>
</template>