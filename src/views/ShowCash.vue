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
        @delete="deletePayment"
    >
    </PopupPayment>
  </div>
</template>

<script>
import PopupPayment from '@/components/Popups/PopupPayment.vue';
import PaymentList from '@/components/Cash/PaymentsList.vue';
import { defineComponent } from 'vue';
import PaymentChart from '@/components/Cash/PaymentChart.vue';
import { fetchPayments, addPayment, deletePayment } from '@/services/paymentService';

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

      console.log(this.payments);
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
      console.log(filtered);
      
      return {
        positivePayments: filtered.filter(payment => payment.negative == false),
        negativePayments: filtered.filter(payment => payment.negative == true)
      };
    }
  },
  methods: {
    getHeight() {
      return (window.innerHeight - 132) + 'px';
    },
    async addNewPayment(payment) {
      console.log(payment);
      if(!payment) return;

      if(!payment.amount) payment.amount = 0;

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
    async addPayment(payment){
      const newPayment = await addPayment(payment);
      this.payments.push(newPayment);
      this.sortPaymentsByDate();
    },
    sortPaymentsByDate() {
        this.payments.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
        });
    },
    deletePayment(paymentId){
      if(!paymentId) return;

      this.payments = this.payments.filter(p => p.id !== paymentId);
      deletePayment(paymentId);
    },
  },
  async mounted() {
    this.payments = await fetchPayments();
    console.log(this.payments);
    this.sortPaymentsByDate();
  }
});
</script>

<style scoped>

</style>