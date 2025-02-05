<template>
  <div class="flex flex-col" :style="{ height: getHeight() }">
    <!-- Header -->
    <div class="flex mb-0">
      <h1 class="text-left mb-0 text-2xl m-0 text-gray-800 mr-2">
        Trésorerie
      </h1>
      <select v-model="selectedYear" class="border border-gray-300 rounded p-1 font-bold text-xl">
        <option class="font-bold" v-for="year in years" :key="year" :value="year">{{ year }}</option>
      </select>
    </div>

    <!-- Contenu -->
    <div class="flex flex-grow overflow-hidden">
      <div class="w-3/5 h-full">
        <PaymentChart class="h-full" :payments="payments" :selectedYear="selectedYear" />
      </div>
      <div class="w-2/5 h-full flex flex-col">
        <div class="flex justify-between items-center m-0 mb-2">
          <label class="font-bold">Paiments sur la période</label>
          <button @click="popupVisible = true" class="callToAction">Ajouter</button>
        </div>
        <PaymentList class="flex-grow overflow-y-auto" :payments="filteredPayments" @openPayment="selectedPayment = $event; popupVisible = true" />
      </div>
    </div>
    
    <PopupPayment :visible="popupVisible" :payment="selectedPayment" 
                  @close="popupVisible=false; sortPaymentsByDate(); selectedPayment=null"
                  @add="addNewPayment"
                  @delete="deletePayment"/>
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
      years: Array.from({ length: 80 }, (v, k) => 2020 + k)
    };
  },
  computed: {
    filteredPayments() {
      return this.payments.filter(payment => new Date(payment.date).getFullYear() === this.selectedYear);
    }
  },
  methods: {
    getHeight() {
      return (window.innerHeight - 132) + 'px';
    },
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
    deletePayment(paymentId) {
      deletePayment(paymentId);
      this.payments = this.payments.filter((payment) => payment.id !== paymentId);
    }
  },
  async mounted() {
    this.payments = await fetchPayments();
    this.sortPaymentsByDate();
  }
});
</script>

<style scoped>

</style>