<template>
  <div>
    <div class="mb-6">
      <h1 class="text-left mb-6 text-2xl m-0 text-gray-800">
        Trésorerie
      </h1>
    </div>
    <button @click="addNewPayment" class="bg-blue-500 text-white px-4 py-2 rounded">Ajouter un paiement</button>
    <div class="mt-6">
      <h2 class="text-xl mb-4">Liste des paiements</h2>
      <ul>
        <li v-for="payment in payments" :key="payment.id">
          {{ payment.date }} - {{ payment.amount }} €
        </li>
      </ul>
    </div>
    
    <PopupPayment :visible="popupVisible" :payment="selectedPayment" :title="'Modifier un paiement'" 
                  @close="popupVisible=false"/>
  </div>
</template>

<script>
import PopupPayment from '@/components/Popups/PopupPayment.vue';
import { defineComponent } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { fetchPayments, addPayment } from '@/services/paymentService';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

export default defineComponent({
  name: 'ShowCash',
  components: {
    PopupPayment,
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
      this.updateChartData();
    },
    updateChartData() {
      const groupedPayments = this.groupPaymentsByMonth(this.payments);
      this.chartData.labels = Object.keys(groupedPayments);
      this.chartData.datasets[0].data = Object.values(groupedPayments);
    },
    groupPaymentsByMonth(payments) {
      return payments.reduce((acc, payment) => {
        const month = new Date(payment.date).toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!acc[month]) {
          acc[month] = 0;
        }
        acc[month] += payment.amount;
        return acc;
      }, {});
    },
  },
  async mounted() {
    this.payments = await fetchPayments();
    this.updateChartData();
  },
});
</script>

<style scoped>
/* Ajoutez des styles supplémentaires ici si nécessaire */
</style>