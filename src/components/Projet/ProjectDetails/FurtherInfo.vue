<template>
    <div class="flex flex-col">
        <!-- Titre -->
        <div class="text-left flex items-center h-8 font-bold mb-1">Informations générales</div>

        <!-- Div info -->
        <div class="flex-grow flex flex-col border-solid border-2 border-gray-300 rounded-lg p-2">
            <!-- Client -->
            <div class="flex items-center h-6">
                <select class="h-6 w-full rounded-lg" v-model="project.clientId" v-if="isEditing">
                    <option class="text-center" value="">----- Sélectionner un client -----</option>
                    <option v-for="client in clients" :key="client.id" :value="client.id">
                        {{ client.name }}
                    </option>
                    <option class="text-center font-bold" value="add">Ajouter un client</option>
                </select>

                <div class="flex" v-else>
                    <div class="font-semibold">Client :&nbsp;</div>
                    <div class="">{{ getClientName(project.clientId) }}</div>
                </div>
            </div>

            <!-- Séparation -->
            <hr class="flex-grow border-gray-300 w-full">

            <!-- Header Paiments -->
            <div class="flex items-center justify-between h-8 mb-1">
                <!-- Titre -->
                <div class="font-semibold text-left">Paiments {{ isEditing ? '' : ':'}}</div>

                <!-- Bouton d'ajout -->
                <button class="callToAction !h-full !m-0 px-3" v-if="isEditing" @click="popupVisible = true; selectedPayment = null">
                    Ajouter
                </button>
            </div>

            <!-- Liste des paiments -->
            <PaymentList 
                class="max-h-40 overflow-y-auto" 
                :payments="filteredPayments" 
                @dbClick="selectedPayment = $event; isEditing ? popupVisible = true : popupVisible = false" 
            />
        </div>
    </div>

    <!-- Popup payment -->
    <PopupPayment
        :visible="popupVisible" 
        :payment="selectedPayment"
        :projectId="project.id"
        @close="popupVisible = false" 
        @add="addNewPayment"
        @delete=""
    >
    </PopupPayment>
</template>

<script>

import PaymentList from "@/components/Cash/PaymentsList.vue";
import PopupPayment from "@/components/Popups/PopupPayment.vue";

import { addPayment, updatePayment, fetchPayments } from "@/services/paymentService";
import { fetchClients } from "@/services/clientService";

export default{
    components: {
        PaymentList,
        PopupPayment,
    },
    props: ['project', 'isEditing'],
    data(){
        return{
            popupVisible: false,
            selectedPayment: null,
            clients: [],
            payments: [],
        }
    },
    computed:{
        // Filter payments by project id
        filteredPayments() {
            return this.payments.filter(payment => payment.projectId === this.project.id);
        },
    },
    methods:{
        // Get client name by id
        getClientName(clientId) {
            const client = this.clients.find((c) => c.id === clientId);
            return client ? client.name : "Aucun client";
        },
        // Add new payment
        async addNewPayment(payment) {
            switch (payment.frequency) {
                case 'unique':
                    this.addPayment(payment);
                    break;
                case 'mensuel':
                    const startDate = new Date(payment.date);
                    const endDate = new Date(payment.dateEnd);
                    let currentDate = new Date(startDate);

                    while (currentDate <= endDate) {
                        const monthlyPayment = { ...payment, date: currentDate.toISOString().substr(0, 10) };
                        await this.addPayment(monthlyPayment);
                        currentDate.setMonth(currentDate.getMonth() + 1);
                    }
                    break;
            }
        },
        // Add one payment
        async addPayment(payment){
            const newPayment = await addPayment();
            payment.id = newPayment.id;

            await updatePayment(payment);

            this.payments.push(payment);
            this.sortPaymentsByDate();
        },
        sortPaymentsByDate() {
            this.payments.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateA - dateB;
            });
        },
        async fetchDatas(){
            this.clients = await fetchClients();
            this.payments = await fetchPayments();
            this.sortPaymentsByDate();
        }
    },
    mounted(){
        this.fetchDatas();
    },
}

</script>