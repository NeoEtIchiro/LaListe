<template>
    <!-- Client -->
    <div class="flex items-center h-6">
        <!-- Select du client -->
        <select class="h-6 w-full rounded-lg" v-model="project.clientId" v-if="isEditing">
            <option class="text-center" value="">----- Sélectionner un client -----</option>
            <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.name }}
            </option>
            <option class="text-center font-bold" value="add">Ajouter un client</option>
        </select>

        <!-- Label client -->
        <div class="flex" v-else>
            <div class="font-semibold">Client :&nbsp;</div>
            <div class="">{{ getClientName(project.clientId) }}</div>
        </div>
    </div>
</template>
  
<script>

import { fetchClients } from '@/services/clientService';

export default {
    props: {
        isEditing: Boolean,
        project: Object,
    },
    data() {
        return {
            popupVisible: false,
            clients: [],
        };
    },
    methods: {
        // Get client name by id
        getClientName(clientId) {
            const client = this.clients.find((c) => c.id === clientId);
            return client ? client.name : "Aucun client";
        },
    },
    async mounted(){
        this.clients = await fetchClients();
    }
};
</script>
  
<style scoped>
    /* Vos styles ici */
</style>