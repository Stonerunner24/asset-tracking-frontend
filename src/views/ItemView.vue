<script setup>
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import ItemServices from '../services/itemServices';

    const item = ref({});
    const model = ref({});
    const type = ref({});
    const category = ref({});
    const modelFields = ref({});
    const itemFields = ref({});
    const typeFields = ref({});
    const repair = ref({});
    const assignment = ref({});
    const itemInfo = ref({});

    onMounted(async() => {
        const route = useRoute();
        await retrieveItemData(route);
    })

    const retrieveItemData = async(route) => {
        try{
            const data = await ItemServices.getOne(route.params.id);
            console.log(data);
            item.value = data.item;
            model.value = data.model;
            type.value = data.type;
            category.value = data.category;
            modelFields.value = data.modelFields;
            itemFields.value = data.itemFields;
            typeFields.value = data.typeFields;
            repair.value = data.repair;
            assignment.value = data.assignment;
            itemInfo.value = data.itemInfo;
            console.log("Data processed");
        }
        catch(err){
            console.log(err.message);
        }
    };

</script>