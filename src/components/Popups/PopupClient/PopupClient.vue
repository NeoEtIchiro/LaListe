<template>
    <Popup  :visible="visible" 
            :title="client ? 'Modifier le client' : 'Ajouter un client'"
            :add="!client"
            :addDisabled="false"
            @close="$emit('close')"
            @add="$emit('close'); $emit('add', editableClient)"
            @update="savePayment"
            @delete="$emit('delete', client.id)"
    >    

    <!-- Séparation -->
    <div class="w-full flex items-center">
        <span class="mr-2 mb-1">Adresse de facturation</span>
        <hr class="flex-grow border-gray-300">
    </div>
    
    <!-- Adresse -->
    <input type="text" 
        v-model="editableClient.adress" placeholder="Adresse" 
        class="w-full border border-gray-300 rounded-lg p-2 mb-2"
    >
    
    <div class="flex">
        <!-- Ville -->
        <input type="text" 
            v-model="editableClient.city" placeholder="Ville" 
            class="w-3/5 border border-gray-300 rounded-lg p-2 mr-1"
        >
        <!-- Code postal -->
        <input type="text" 
            v-model="editableClient.postalCode" placeholder="Code postal" 
            class="w-2/5 border border-gray-300 rounded-lg p-2 ml-1"
        >
    </div>

    <!-- Séparation -->
    <div class="w-full flex items-center mt-2">
        <span class="mr-2 mb-1 mt-1">Contacts</span>
        <hr class="flex-grow border-gray-300">
    </div>

    <!-- Contacts -->
    <div class="flex flex-col border-solid border-2 border-gray-300 rounded-lg p-2 mb-2">
        <ContactForm v-for="(contact, index) in editableClient.contacts" :key="index"
            :contact="contact"
        />
    </div>

    <!-- Bouton ajout contact -->
    <button 
        class="flex callToAction text-sm w-full h-6 justify-center items-center" 
        @click="editableClient.contacts.push(createEmptyContact())"
    >
        Ajouter un formulaire de contact
    </button>

    </Popup>
</template>


<script>
import Popup from '@/components/Popups/Popup.vue';
import updatePayment from '@/services/paymentService';
import ContactForm from './ContactForm.vue';

export default {
    props:['client', 'visible'],
    components: {
        Popup,
        ContactForm,
    },
    data() {
        return {
            editableClient: this.client ? { ...this.client } : this.createEmptyClient()
        };
    },
    methods: {
        createEmptyClient() {
            return {
                contacts: [this.createEmptyContact()],
                address: '',
                city: '',
                postalCode: ''
            };
        },
        createEmptyContact() {
            return {
                firstName: '',
                lastName: '',
                email: '',
                phone1: '',
                phone2: ''
            };
        },
        async savePayment(){
            Object.assign(this.client, this.editableClient);
            await updatePayment(this.editablePayment);
        }
    },
    mounted() {
        
    },
    watch: {
        visible(newVal) {
            if (newVal && !this.client) {
                this.editableClient = this.createEmptyClient();
            }
        },
        client: {
            handler(newClient) {
                this.editableClient = newClient ? { ...newClient } : this.createEmptyClient();
            },
            immediate: true
        }
    }
};
</script>

<style scoped>

</style>