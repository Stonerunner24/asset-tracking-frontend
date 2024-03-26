<script setup>
import {ref} from 'vue';

const note = ref();
</script>
<template>
    <v-container>
        <v-card elevation="5" rounded="lg" width="30rem" class="pb-4 pl-4 pr-4">
            <v-card-title>Add Note</v-card-title>
            <v-textarea label="Note" v-model="note"></v-textarea>
            <v-row class>
                <v-col class="text-right">
                    <v-btn
                        color="darkgray"
                        @click="$emit('closeModal')"
                        elevation="0"
                        class="mr-4"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        color="blue"
                        @click="$emit('saveNote', note)"
                        elevation="0"
                    >
                        Add Note
                    </v-btn>
                </v-col>
                
            </v-row>
        </v-card>
    </v-container>
</template>