<script setup>
    import { ref } from 'vue';

    const startDatePicker = ref(null);
    const endDatePicker = ref(null);
    const startDate = ref(startDisplayDate());
    const endDate = ref(endDisplayDate());
    const temp = ref(false);
    const startDateBoole = ref(false);
    const endDateBoole = ref(false);

    function startDisplayDate() {
        if (startDatePicker.value == null) {
            const today = new Date();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const year = today.getFullYear();
            startDatePicker.value = today;
            return `${day}/${month}/${year}`;
        } else {
            const date = startDatePicker.value;
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }   
    }
    function endDisplayDate() {
        if (endDatePicker.value == null) {
            return null;    
        } else {
            const date = endDatePicker.value;
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }   
    }

    function handleStartDateChange() {
        startDate.value = startDisplayDate();
    }
    function handleEndDateChange() {
        endDate.value = endDisplayDate();
    }

    function isStartBeforeEnd(){
        return (startDatePicker.value <= endDatePicker.value) ? true : false;
    }
</script>

<template>
    <div class="ma-15 mt-7">
        <v-row>
            <v-col><div style="font-size: x-large;">Check Out</div></v-col>
            <v-col></v-col>
            <v-col class="text-right"><v-btn color="blue" flat>Check Out</v-btn></v-col>
        </v-row>
        <div class="mt-7">
            <v-row>
                <v-col class="text-left">
                    <v-text-field
                        variant="underlined"
                        color="blue"
                        label="Start Date"
                        placeholder="dd/MM/yyyy"
                        v-model="startDate"
                    ></v-text-field>
                </v-col>
                <v-col>
                    <v-icon 
                        size="xx-large" 
                        class="hover-primary"
                        @click="startDateBoole = !startDateBoole"
                    >mdi-calendar</v-icon>
                    <v-overlay v-model="startDateBoole" class="align-center justify-center" contained>
                        <v-container v-if="startDateBoole" class="datePickerDialog">
                            <v-row justify="space-around">
                            <v-date-picker elevation="24" v-model="startDatePicker" :picker-date-format="'dd/MM/yyyy'" @click="handleStartDateChange"></v-date-picker>
                            </v-row>
                        </v-container>
                    </v-overlay> 
                </v-col>
                <v-col></v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-checkbox
                        class="mt-n11 ml-n3"
                        color="blue"
                        v-model="temp"
                        label="Permanant Loan"
                    ></v-checkbox>
                    <v-text-field
                        class="mt-n10"
                        variant="underlined"
                        v-if="!temp"
                        color="blue"
                        label="End Date"
                        placeholder="dd/MM/yyyy"
                        v-model="endDate"
                    ></v-text-field>
                </v-col>
                <v-col v-if="!temp">
                    <v-icon 
                        size="xx-large" 
                        class="hover-primary"
                        @click="endDateBoole = !endDateBoole"
                    >mdi-calendar</v-icon>
                    <v-overlay v-model="endDateBoole" class="align-center justify-center" contained>
                        <v-container v-if="endDateBoole" class="datePickerDialog">
                            <v-row justify="space-around">
                            <v-date-picker elevation="24" v-model="endDatePicker" :picker-date-format="'dd/MM/yyyy'" @click="handleEndDateChange"></v-date-picker>
                            </v-row>
                        </v-container>
                    </v-overlay> 
                </v-col>
                <v-col></v-col>
            </v-row>
        </div>
    </div>
</template>
<style scoped>
    .hover-primary:hover {
        color: #1976D2;
    }
</style>