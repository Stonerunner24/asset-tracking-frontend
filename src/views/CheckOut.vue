<script setup>
  import { ref } from 'vue';

    const startDate = ref('');
    const endDate = ref('');
    const temp = ref(false);

</script>
<template>
    <div class="ma-15 mt-7">
        <div style="font-size: x-large;">Check Out</div>
        <div>
            <v-row>
                <v-col class="text-left">
                    <v-text-field
                        variant="underlined"
                        color="blue"
                        label="Start Date"
                        placeholder="DD/MM/YYYY"
                        v-model="startDate"
                    ></v-text-field>
                </v-col>
                <v-col></v-col>
                <v-col class="text-right">
                    <v-btn color="blue" flat>Check Out</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <!-- ? Permanant loan instead of temporary loan -->
                    <v-checkbox
                        class="mt-n11 ml-n3"
                        color="blue"
                        v-model="temp"
                        label="Permanant Loan"
                    ></v-checkbox>
                    <v-text-field
                        class="mt-n10"
                        v-if="temp"
                        variant="underlined"
                        color="blue"
                        label="End Date"
                        placeholder="DD/MM/YYYY"
                        v-model="endDate"
                    ></v-text-field>
                </v-col>
                <v-col></v-col>
                <v-col></v-col>
            </v-row>
        </div>
    </div>
</template>