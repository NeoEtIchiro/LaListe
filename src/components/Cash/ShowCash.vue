<template>
  <div>
    <div class="mb-6">
      <h1 class="text-left mb-6 text-2xl m-0 text-gray-800">
        Trésorerie
      </h1>
    </div>
    <div class="flex w-full">
        <div class="chartDiv w-3/5">
            <PaymentChart class="chartDiv" :payments="payments" />
        </div>
        <div class="w-2/5">
            <button @click="addNewPayment" class="bg-blue-500 text-white px-4 py-2 rounded">Ajouter un paiement</button>
            <div class="mt-6">
                <h2 class="text-xl mb-4">Liste des paiements</h2>
                <div class="flex justify-center w-full mb-1" v-for="payment in payments" :key="payment.id">
                    <div class="basicDiv mr-1 w-full whitespace-nowrap">{{ payment.name }}</div>
                    <div class="basicDiv mr-1 whitespace-nowrap">{{ payment.date }}</div>
                    <div class="basicDiv mr-1">{{ payment.amount }}€</div>
                    <button class="border-0 font-bold w-8 h-8 rounded-lg pl-2 pr-2" @click="deletePayment(payment.id)">X</button>
                </div>
            </div>
        </div>
    </div>
    
    <PopupPayment :visible="popupVisible" :payment="selectedPayment" :title="'Modifier un paiement'" 
                  @close="popupVisible=false; sortPaymentsByDate()"/>
  </div>
</template>

<script>
import PopupPayment from '@/components/Popups/PopupPayment.vue';
import { defineComponent } from 'vue';
import PaymentChart from './PaymentChart.vue';
import { fetchPayments, addPayment, deletePayment } from '@/services/paymentService';

export default defineComponent({
  name: 'ShowCash',
  components: {
    PopupPayment,
    PaymentChart,
  },
  data() {
    return {
      payments: [],
      selectedPayment: null,
      popupVisible: false,
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Payments',
            backgroundColor: '#f87979',
            data: [],
          },
        ],
      },
      chartOptions: {},
    };
  },
  methods: {
    async addNewPayment() {
      const newPayment = await addPayment();
      this.selectedPayment = newPayment;
      this.popupVisible = true;
      this.payments.push(newPayment);
      this.sortPaymentsByDate();
    },
    sortPaymentsByDate() {
        this.payments.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
        });
        console.log(this.payments);
    },
    deletePayment(paymentId) {
      deletePayment(paymentId);
      this.payments = this.payments.filter((payment) => payment.id !== paymentId);
    },
  },
  async mounted() {
    this.payments = await fetchPayments();
    this.sortPaymentsByDate();
  },
});
</script>

<style scoped>
.chartDiv{
    height: 400px;
}
</style>