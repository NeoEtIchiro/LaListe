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
      <div class="w-3/5 h-full">
        <PaymentChart class="h-full" :payments="payments" :selectedYear="selectedYear" :selectedMonth="selectedMonth"/>
      </div>
      <div class="w-2/5 h-full flex flex-col">
        <div class="flex justify-between items-center m-0 mb-2">
          <label class="font-bold">Paiments sur la période</label>
          <button @click="popupVisible = true" class="callToAction">Ajouter</button>
        </div>
        <PaymentList class="flex-grow overflow-y-auto" :payments="filteredPayments" @openPayment="selectedPayment = $event; popupVisible = true" />
      </div>
    </div>
    
    <!-- Popup payment -->
    <PopupPayment
        :visible="popupVisible" 
        :payment="selectedPayment"
        :project="null"
        @close="popupVisible = false; selectedPayment = null; sortPaymentsByDate()" 
        @add="addNewPayment"
        @delete="deletePayment"
    >
    </PopupPayment>
  </div>
</template>

<script>
import PopupPayment from '@/components/Popups/PopupPayment.vue';
import PaymentList from './PaymentsList.vue';
import { defineComponent } from 'vue';
import PaymentChart from './PaymentChart.vue';
import { fetchPayments, addPayment, deletePayment, updatePayment } from '@/services/paymentService';

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
      popupVisible: false,
      selectedYear: 2025,
      selectedMonth: '',
      months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
      years: Array.from({ length: 80 }, (v, k) => 2020 + k)
    };
  },
  computed: {
    filteredPayments() {
      return this.payments.filter(payment => {
        const paymentDate = new Date(payment.date);
        const paymentYear = paymentDate.getFullYear();
        const paymentMonth = paymentDate.getMonth();
        return paymentYear === this.selectedYear && (this.selectedMonth === '' || paymentMonth === this.selectedMonth);
      });
    }
  },
  methods: {
    getHeight() {
      return (window.innerHeight - 132) + 'px';
    },
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
    this.sortPaymentsByDate();
  }
});
</script>

<style scoped>

</style>