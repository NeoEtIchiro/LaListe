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
            <button @click="popupVisible = true" class="bg-blue-500 text-white px-4 py-2 rounded">Ajouter un paiement</button>
            <div class="mt-6">
                <h2 class="text-xl mb-4">Liste des paiements</h2>
                <div class="flex justify-center w-full mb-1" v-for="payment in payments" :key="payment.id" @dblclick="selectedPayment = payment; popupVisible = true">
                    <div class="basicDiv mr-1 w-full whitespace-nowrap">{{ payment.name }}</div>
                    <div class="basicDiv mr-1 whitespace-nowrap">{{ payment.date }}</div>
                    <div class="basicDiv">{{ payment.amount }}€</div>
                </div>
            </div>
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
import { defineComponent } from 'vue';
import PaymentChart from './PaymentChart.vue';
import { fetchPayments, addPayment, deletePayment, updatePayment } from '@/services/paymentService';

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