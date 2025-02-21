<template>
    <Popup  :visible="visible" 
            :title="client ? 'Modifier le client' : 'Ajouter un client'"
            :add="!client"
            :addDisabled="false"
            @close="$emit('close')"
            @add="$emit('close'); $emit('add', editableClient)"
            @update="saveClient"
            @delete="$emit('delete', client.id)"
    >
    
    <div class="flex flex-col gap-4 w-full">
        <!-- Adresse -->
        <div class="relative w-full">
            <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                Adresse de facturation
            </span>
            <input type="text" 
                v-model="editableClient.adress" placeholder="15 rue du puit" 
                class="w-full basicInput"
                ref="focusInput"
            >
        </div>
        
        
        <div class="flex gap-2">
            <!-- Ville -->
            <div class="relative w-3/5">
                <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                    Ville
                </span>
                <input type="text" 
                    v-model="editableClient.city" placeholder="Paris" 
                    class="w-full basicInput"
                >
            </div>
            
            <!-- Code postal -->
            <div class="relative w-2/5">
                <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                    Code postal
                </span>
                <input type="text" 
                    v-model="editableClient.postalCode" placeholder="68400" 
                    class="w-full basicInput"
                >
            </div>
        </div>
    </div>

    <!-- Contacts -->
    <div class="flex flex-col basicContainer gap-4 relative pt-5">
        <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
            Contact
        </span>

        <ContactForm 
            :contact="editableClient.contacts[0]"
            :isOpened="true"
            :showDelete="false"
        />
        <ContactForm 
            v-for="(contact, index) in editableClient.contacts.slice(1)" 
            :key="index + 1"
            :contact="contact"
            :isOpened="openedContactIndex === index + 1"
            :showDelete="true"
            @toggle="toggleContactForm(index + 1)"
            @remove="removeContact(index + 1)"
        />

        <!-- Bouton ajout contact -->
        <button 
            class="flex callToAction text-sm w-full justify-center items-center py-1" 
            @click="editableClient.contacts.push(createEmptyContact()); toggleContactForm(editableClient.contacts.length - 1)"
            type="button"
        >
            Ajouter un formulaire de contact
        </button>
    </div>

    </Popup>
</template>


<script>
import Popup from '@/components/Popups/Popup.vue';
import ContactForm from './ContactForm.vue';

import { updateClient } from '@/services/clientService';

export default {
    props:['client', 'visible'],
    components: {
        Popup,
        ContactForm,
    },
    data() {
        return {
            editableClient: this.client ? { ...this.client } : this.createEmptyClient(),
            openedContactIndex: 0
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
        async saveClient(){
            Object.assign(this.client, this.editableClient);
            await updateClient(this.client);
        },
        toggleContactForm(index) {
            this.openedContactIndex = this.openedContactIndex === index ? null : index;
        },
        removeContact(index) {
            this.editableClient.contacts.splice(index, 1);
            if (this.openedContactIndex === index) {
                this.openedContactIndex = null;
            } else if (this.openedContactIndex > index) {
                this.openedContactIndex--;
            }
        }
    },
    watch: {
        visible(newVal) {
            if(newVal) {
                this.$nextTick(() => {
                    this.$refs.focusInput && this.$refs.focusInput.focus();
                });
                // Réinitialisation de editablePayment lorsqu'on ouvre la popup
                this.editableClient = this.client ? { ...this.client } : this.createEmptyClient();
            }
        }
    }
};
</script>

<style scoped>

</style>