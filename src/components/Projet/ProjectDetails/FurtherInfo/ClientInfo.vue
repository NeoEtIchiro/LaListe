<template>
    <!-- Client -->
    <div class="flex items-center h-6">
        <!-- Select du client -->
        <div v-if="isEditing" class="flex w-full">
            <select class="h-6 w-full rounded-lg" v-model="project.clientId">
                <option class="text-center" value="">----- Sélectionner un client -----</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">
                    {{ client.contacts[0].lastName }} {{ client.contacts[0].firstName }}
                </option>
                <option class="text-center font-bold" value="add">Ajouter un client</option>
            </select>

            <!-- Bouton de modification de client -->
            <button 
                v-if="project.clientId != '' && project.clientId != 'add'"
                class="callToAction h-6 px-2 text-sm flex items-center !mx-0 !ml-1" 
                @click="popupVisible = true"
            >
                Modifier
            </button>
        </div>

        <!-- Label client -->
        <div class="flex h-6 items-center" v-else>
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
            return client ? client.contacts[0].lastName + ' ' + client.contacts[0].firstName : "Aucun client";
        },
        getClient(clientId){
            return this.clients.find(c => c.id === clientId);
        },
        async addClient(client){
            if(!client) return;

            const newClient = await addClient(client);
            this.clients.push(newClient);
            this.project.clientId = newClient.id;
        },
        deleteClient(clientId){
            this.project.clientId = '';
            this.clients = this.clients.filter(c => c.id !== clientId);
            deleteClient(clientId);
        }
    },
    async mounted(){
        this.clients = await fetchClients();
        console.log(this.clients);
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