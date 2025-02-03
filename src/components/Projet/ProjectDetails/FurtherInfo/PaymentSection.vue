<template>
    <div>
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
            class="max-h-80 overflow-y-auto" 
            :payments="filteredPayments" 
            @openPayment="selectedPayment = $event; isEditing ? popupVisible = true : popupVisible = false" 
        />
    </div>

    <!-- Popup payment -->
    <PopupPayment
        :visible="popupVisible" 
        :payment="selectedPayment"
        :project="project"
        @close="popupVisible = false" 
        @add="addNewPayment"
        @delete="deletePayment"
    >
    </PopupPayment>
  </template>
  
<script>
import PopupPayment from "@/components/Popups/PopupPayment.vue";
import PaymentList from "@/components/Cash/PaymentsList.vue";

import { addPayment, updatePayment, fetchPayments, deletePayment } from "@/services/paymentService";

export default {
    components: {
        PopupPayment,
        PaymentList
    },
    props: {
        isEditing: Boolean,
        project: {Object, required: true},
    },
    data() {
        return {
            popupVisible: false,
            selectedPayment: null,
            payments: [],
        };
    },
    computed:{
        // Filter payments by project id
        filteredPayments() {
            return this.payments.filter(payment => payment.projectId === this.project.id);
        },
    },
    methods:{
        // Add new payment
        async addNewPayment(payment) {
            if(!payment) return;

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
            const newPayment = await addPayment(payment);
            this.payments.push(newPayment);
            this.sortPaymentsByDate();
        },
        deletePayment(paymentId){
            if(!paymentId) return;

            this.payments = this.payments.filter(p => p.id !== paymentId);
            deletePayment(paymentId);
        },
        sortPaymentsByDate() {
            this.payments.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateA - dateB;
            });
        },
        async fetchDatas(){
            this.payments = await fetchPayments();
            this.sortPaymentsByDate();
        }
    },
    mounted(){
        this.fetchDatas();
        console.log(this.project.id);
    },
};
</script>
  
<style scoped>
  /* Vos styles ici */
</style>