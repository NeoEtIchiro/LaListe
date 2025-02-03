<template>
    <div>
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
        class="max-h-80 overflow-y-auto" 
        :payments="filteredPayments" 
        @openPayment="selectedPayment = $event; isEditing ? popupVisible = true : popupVisible = false" 
      />
  
      <!-- Popup pour ajouter/modifier un paiement -->
      <PopupPayment
        :visible="popupVisible"
        :payment="selectedPayment"
        :projectId="project.id"
        :projects="projects"
        @close="popupVisible = false"
        @save="savePayment"
        @delete="deletePayment"
      />
    </div>
  </template>
  
  <script>
  import PopupPayment from "@/components/Popups/PopupPayment.vue";
  import PaymentList from "@/components/PaymentList.vue";
  
  export default {
    components: {
      PopupPayment,
      PaymentList
    },
    props: {
      isEditing: Boolean,
      filteredPayments: Array,
      project: Object,
      projects: Array
    },
    data() {
      return {
        popupVisible: false,
        selectedPayment: null
      };
    },
    methods: {
      savePayment(payment) {
        if (payment.id) {
          this.updatePayment(payment);
        } else {
          this.addPayment(payment);
        }
      },
      async addPayment(payment) {
        const newPayment = await addPayment(payment);
        payment.id = newPayment.id;
        this.filteredPayments.push(payment);
      },
      async updatePayment(payment) {
        await updatePayment(payment);
        const index = this.filteredPayments.findIndex(p => p.id === payment.id);
        if (index !== -1) {
          this.filteredPayments.splice(index, 1, payment);
        }
      },
      async deletePayment(paymentId) {
        this.filteredPayments = this.filteredPayments.filter(p => p.id !== paymentId);
        await deletePayment(paymentId);
      }
    }
  };
  </script>
  
  <style scoped>
  /* Vos styles ici */
  </style>