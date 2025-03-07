<template>
  <div class="flex flex-col" :style="{ height: getHeight() }">
    <!-- Header -->
    <div class="flex mb-0">
      <h1 class="text-left mb-0 text-2xl m-0 text-gray-800 mr-2">
        Trésorerie
      </h1>
      <select v-model="selectedYear" class="border border-gray-300 rounded p-1 font-bold text-xl mr-2">
        <option class="font-bold" v-for="year in years" :key="year" :value="year">{{ year }}</option>
      </select>
      <select v-model="selectedMonth" class="border border-gray-300 rounded p-1 font-bold text-xl">
        <option class="font-bold" value="">Toute l'année</option>
        <option class="font-bold" v-for="(month, index) in months" :key="index" :value="index">{{ month }}</option>
      </select>
    </div>

    <!-- Contenu -->
    <div class="flex flex-grow overflow-hidden">
      <div class="w-3/5 h-full mr-2">
        <PaymentChart class="h-full" :payments="payments" :selectedYear="selectedYear" :selectedMonth="selectedMonth"/>
      </div>
      <div class="w-2/5 h-full flex flex-col">
        <div class="h-1/2 flex flex-col mb-1">
          <div class="flex justify-between items-center m-0 mb-2">
            <label class="font-bold">Entrée</label>
            <button @click="negative = false; popupVisible = true" class="callToAction mx-0">Ajouter</button>
          </div>
          <PaymentList class="flex-grow overflow-y-auto" :payments="filteredPayments.positivePayments" @openPayment="selectedPayment = $event; popupVisible = true" /> 
        </div>
        <div class="h-1/2 flex flex-col mt-1">
          <div class="flex justify-between items-center m-0 mb-2">
            <label class="font-bold">Sortie</label>
            <button @click="negative = true; popupVisible = true" class="callToAction mx-0">Ajouter</button>
          </div>
          <PaymentList class="flex-grow overflow-y-auto" :payments="filteredPayments.negativePayments" @openPayment="selectedPayment = $event; popupVisible = true" /> 
        </div>
      </div>
    </div>
    
    <!-- Popup payment -->
    <PopupPayment
        :visible="popupVisible" 
        :payment="selectedPayment"
        :project="null"
        :negative="negative"
        @close="popupVisible = false; selectedPayment = null; sortPaymentsByDate()" 
        @add="addNewPayment"
        @update="updateExistingPayment"
        @delete="deletePayment"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import PopupPayment from '@/components/Popups/PopupPayment.vue';
import PaymentList from '@/components/Cash/PaymentsList.vue';
import PaymentChart from '@/components/Cash/PaymentChart.vue';
import { 
  fetchPayments, addPayment, updatePayment, updateRecurringPayments, deletePayment, addRecurringPayments, deleteRecurringPayments
} from '@/services/paymentService';

export default defineComponent({
  name: 'ShowCash',
  components: {
    PopupPayment,
    PaymentChart,
    PaymentList,
  },
  data() {
    return {
      payments: [],
      selectedPayment: null,
      negative: false,
      popupVisible: false,
      selectedYear: 2025,
      selectedMonth: '',
      months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
      years: Array.from({ length: 80 }, (v, k) => 2020 + k)
    };
  },
  computed: {
    filteredPayments() {
      if (!this.payments || this.payments.length === 0) {
        return {
          positivePayments: [],
          negativePayments: []
        };
      }
      // Filtrer les paiements par année et mois sélectionnés
      const filtered = this.payments.filter(payment => {
        const paymentDate = new Date(payment.date);
        const paymentYear = paymentDate.getFullYear();
        const paymentMonth = paymentDate.getMonth();
        return (
          paymentYear === this.selectedYear &&
          (this.selectedMonth === '' ||
            paymentMonth === parseInt(this.selectedMonth))
        );
      });
      
      return {
        positivePayments: filtered.filter(payment => payment.negative === false),
        negativePayments: filtered.filter(payment => payment.negative === true)
      };
    }
  },
  methods: {
    getHeight() {
      return (window.innerHeight - 132) + 'px';
    },
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
  },
  async mounted() {
    this.payments = await fetchPayments();
    this.sortPaymentsByDate();
  }
});
</script>

<style scoped>

</style>