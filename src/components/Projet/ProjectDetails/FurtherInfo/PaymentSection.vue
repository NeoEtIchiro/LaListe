<template>
    <!-- Section Paiements -->
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
            class="max-h-[480px] h-[480px] overflow-y-auto" 
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

import { addPayment, fetchPayments, deletePayment } from "@/services/paymentService";

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
            if (!payment) return;

            if (!payment.amount) payment.amount = 0;
            // Selon la fréquence, utiliser la fonction appropriée
            switch (payment.frequency) {
                case 'unique':
                    await this.addPayment(payment);
                    break;
                case 'mensuel':
                    // Utilisation de la fonction addRecurringPayments
                    const newPayments = await addRecurringPayments(payment);
                    newPayments.forEach(newPayment => {
                        this.payments.push(newPayment);
                    });
                    break;
                case 'trimestriel': {
                    const newPayments = await addRecurringPayments(payment, 3);
                    newPayments.forEach(newPayment => {
                        this.payments.push(newPayment);
                    });
                    break;
                }
                case 'annuel': {
                    const newPayments = await addRecurringPayments(payment, 12);
                    newPayments.forEach(newPayment => {
                        this.payments.push(newPayment);
                    });
                    break;
                }
                default:
                    console.warn('Fréquence non gérée :', payment.frequency);
            }
            this.sortPaymentsByDate();
        },
        async addPayment(payment) {
            const newPayment = await addPayment(payment);
            this.payments.push(newPayment);
            this.sortPaymentsByDate();
        },
        async updateExistingPayment(updatedPayment) {
            if (!updatedPayment) {
                console.warn("updateExistingPayment : aucun paiement fourni");
                return;
            }
            // Pour un paiement récurrent
            if (updatedPayment.recurringId) {
                // Si les dates ont été modifiées, on regénère la série complète
                if (updatedPayment.date && updatedPayment.dateEnd) {
                // Supprimer la série existante depuis Firestore
                await deleteRecurringPayments(updatedPayment.recurringId);
                // Mettre à jour localement : retirer les paiements de cette série
                this.payments = this.payments.filter(p => p.recurringId !== updatedPayment.recurringId);
                
                // Déterminer le pas de fréquence en fonction de la fréquence
                let frequencyStep = 1;
                if (updatedPayment.frequency === 'trimestriel') frequencyStep = 3;
                else if (updatedPayment.frequency === 'annuel') frequencyStep = 12;
                // Regénérer la série avec les nouvelles dates
                const newPayments = await addRecurringPayments(updatedPayment, frequencyStep);
                newPayments.forEach(newPayment => {
                    this.payments.push(newPayment);
                });
                } else {
                // Sinon, mettre à jour les autres champs (excluant date et dateEnd)
                const { date, dateEnd, ...fieldsToUpdate } = updatedPayment;
                await updateRecurringPayments(updatedPayment.recurringId, fieldsToUpdate);
                    this.payments = this.payments.map(p =>
                        p.recurringId === updatedPayment.recurringId ? { ...p, ...fieldsToUpdate } : p
                    );
                }
            } else {
                // Mise à jour d'un paiement unique
                await updatePayment(updatedPayment);
                this.payments = this.payments.map(p =>
                p.id === updatedPayment.id ? { ...p, ...updatedPayment } : p
                );
            }
            this.sortPaymentsByDate();
            },
        sortPaymentsByDate() {
            this.payments.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateA - dateB;
            });
        },
        async deletePayment(paymentId) {
            if (!paymentId) return;
            
            // Rechercher le paiement correspondant dans le tableau local
            const payment = this.payments.find(p => p.id === paymentId);
            
            if (payment && payment.recurringId) {
                // Suppression de tous les paiements de la série récurrente
                await deleteRecurringPayments(payment.recurringId);
                // Mettre à jour localement : supprimer tous les paiements de cette série
                this.payments = this.payments.filter(p => p.recurringId !== payment.recurringId);
            } else {
                // Suppression d'un paiement unique
                this.payments = this.payments.filter(p => p.id !== paymentId);
                await deletePayment(paymentId);
            }
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