<template>
  <!-- Section Paiements -->
  <div>
    <!-- Liste des paiements -->
    <div class="max-h-[516px] h-[516px] flex flex-col">
      <!-- Paiements Entrée -->
      <div class="h-1/2 flex flex-col mb-1">
        <div class="flex justify-between items-center m-0 mb-2">
          <label class="font-bold">Entrée</label>
          <button v-if="isEditing" @click="negative = false; popupVisible = true" class="callToAction mx-0">Ajouter</button>
        </div>
        <PaymentList 
          class="flex-grow overflow-y-auto" 
          :payments="filteredPayments.positivePayments" 
          @openPayment="selectedPayment = $event; isEditing ? popupVisible = true : popupVisible = false" 
        /> 
      </div>
      <!-- Paiements Sortie -->
      <div class="h-1/2 flex flex-col mt-1">
        <div class="flex justify-between items-center m-0 mb-2">
          <label class="font-bold">Sortie</label>
          <button v-if="isEditing" @click="negative = true; popupVisible = true" class="callToAction mx-0">Ajouter</button>
        </div>
        <PaymentList 
          class="flex-grow overflow-y-auto" 
          :payments="filteredPayments.negativePayments" 
          @openPayment="selectedPayment = $event; isEditing ? popupVisible = true : popupVisible = false" 
        /> 
      </div>
    </div>
  </div>

  <!-- Popup Payment -->
  <PopupPayment
    :visible="popupVisible" 
    :payment="selectedPayment"
    :project="project"
    :negative="negative"
    @close="popupVisible = false; selectedPayment = null; sortPaymentsByDate()"
    @add="addNewPayment"
    @update="updateExistingPayment"
    @delete="deletePayment"
  />
</template>

<script>
import PopupPayment from "@/components/Popups/PopupPayment.vue";
import PaymentList from "@/components/Cash/PaymentsList.vue";
import { 
  fetchPayments, 
  addPayment, 
  updatePayment, 
  updateRecurringPayments, 
  deletePayment, 
  addRecurringPayments, 
  deleteRecurringPayments
} from "@/services/paymentService";

export default {
  components: {
    PopupPayment,
    PaymentList
  },
  props: {
    isEditing: Boolean,
    project: { type: Object, required: true }
  },
  data() {
    return {
      popupVisible: false,
      selectedPayment: null,
      payments: [],
      // Pour filtrer par année et mois
      selectedYear: new Date().getFullYear(),
      selectedMonth: '',
      // Détermine si le paiement est négatif (sortie) ou positif (entrée)
      negative: false,
    };
  },
  computed: {
    // Filtrage des paiements par année, mois et project.id
    filteredPayments() {
      if (!this.payments || this.payments.length === 0) {
        return {
          positivePayments: [],
          negativePayments: []
        };
      }
      const filtered = this.payments.filter(payment => {
        const paymentDate = new Date(payment.date);
        const paymentYear = paymentDate.getFullYear();
        const paymentMonth = paymentDate.getMonth();
        return (
          payment.projectId === this.project.id &&
          paymentYear === this.selectedYear &&
          (this.selectedMonth === '' || paymentMonth === parseInt(this.selectedMonth))
        );
      });

      return {
        positivePayments: filtered.filter(payment => payment.negative === false),
        negativePayments: filtered.filter(payment => payment.negative === true)
      };
    }
  },
  methods:{
        // Add new payment
    async addNewPayment(payment) {
      if (!payment) return;

      if (!payment.amount) payment.amount = 0;
      // Ajout selon la fréquence
      switch (payment.frequency) {
        case 'unique':
          await this.addPayment(payment);
          break;
        case 'mensuel':
          const newPaymentsMensuel = await addRecurringPayments(payment);
          newPaymentsMensuel.forEach(newPayment => {
            this.payments.push(newPayment);
          });
          break;
        case 'trimestriel': {
          const newPaymentsTrim = await addRecurringPayments(payment, 3);
          newPaymentsTrim.forEach(newPayment => {
            this.payments.push(newPayment);
          });
          break;
        }
        case 'annuel': {
          const newPaymentsAnnuel = await addRecurringPayments(payment, 12);
          newPaymentsAnnuel.forEach(newPayment => {
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
      this.payments.sort((a, b) => new Date(a.date) - new Date(b.date));
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
    async fetchDatas() {
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