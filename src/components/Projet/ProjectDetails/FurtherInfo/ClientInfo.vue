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

    <!-- Popup d'ajout de client -->
    <PopupClient 
        :client="getClient(project.clientId)"
        :visible="popupVisible"
        @close="popupVisible = false" 
        @add="addClient"
        @delete="deleteClient" 
    />
</template>
  
<script>

import { addClient, fetchClients, deleteClient } from '@/services/clientService';
import PopupClient from '@/components/Popups/PopupClient/PopupClient.vue';

export default {
    components: {
        PopupClient,
    },
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
        getClient(clientId){
            return this.clients.find(c => c.id === clientId);
        },
        async addClient(client){
            const newClient = await addClient(client);
            this.clients.push(newClient);
            this.project.clientId = newClient.id;
        },
        deleteClient(clientId){
            this.clients = this.clients.filter(c => c.id !== clientId);
            this.project.clientId = '';
            deleteClient(clientId);
        }
    },
    async mounted(){
        this.clients = await fetchClients();
    },
    watch: {
        'project.clientId': {
            handler(newVal) {
                if (newVal === 'add') {
                    this.project.clientId = '';
                    this.popupVisible = true;
                }
            },
            deep: true
        }
    },
};
</script>
  
<style scoped>
    /* Vos styles ici */
</style>