<template>
    <Popup  :visible="visible" 
            :title="client ? 'Modifier le client' : 'Ajouter un client'"
            :add="!client"
            :addDisabled="false"
            @close="$emit('close')"
            @add="$emit('close'); $emit('add')"
            @update="savePayment"
            @delete="$emit('delete', client.id)"
    >    
    
    
    </Popup>
</template>


<script>
import Popup from '@/components/Popups/Popup.vue';
import updatePayment from '@/services/paymentService';

export default {
    props:['client', 'visible'],
    components: {
        Popup,
    },
    data() {
        return {
            editableClient: this.client ? { ...this.client } : this.createEmptyClient()
        };
    },
    methods: {
        createEmptyClient() {
            return {
                name: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                postalCode: '',
                country: ''
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
.edit-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border: 1px solid #ddd;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    border-radius: 8px;
    width: 250px;
    z-index: 10;
}
</style>