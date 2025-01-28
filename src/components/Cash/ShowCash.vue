<template>
  <div class="h-full max-h-full flex flex-col">
    <div class="flex mb-0">
      <h1 class="text-left mb-0 text-2xl m-0 text-gray-800 mr-2">
        Trésorerie
      </h1>
      <select v-model="selectedYear" class="border border-gray-300 rounded p-1 font-bold text-xl">
        <option class="font-bold" v-for="year in years" :key="year" :value="year">{{ year }}</option>
      </select>
    </div>
    <div class="flex w-full h-full flex-grow">
        <div class="w-3/5 max-h-screen">
            <PaymentChart class="h-full" :payments="payments" :selectedYear="selectedYear" />
        </div>
        <div class="w-2/5 h-full flex flex-col">
          <div class="flex justify-between items-center m-0 mb-2">
            <label class="font-bold">Paiments sur la période</label>
            <button @click="popupVisible = true" class="callToAction">Ajouter</button>
          </div>
          <div class="flex-grow overflow-y-auto border border-gray-300 rounded-lg">
            <template v-for="(payment, index) in filteredPayments" :key="payment.id">
              <div v-if="index === 0 || new Date(payment.date).getMonth() !== new Date(filteredPayments[index - 1].date).getMonth()" class="w-full flex items-center">
                <span class="mr-2 mb-1 mt-1">{{ getMonthName(new Date(payment.date).getMonth()) }}</span>
                <hr class="flex-grow border-gray-300">
              </div>
              <div class="flex justify-center mb-1 w-full" @dblclick="selectedPayment = payment; popupVisible = true">
                <div class="basicDiv mr-1 w-full overflow-hidden text-ellipsis whitespace-nowrap">{{ payment.name }}</div>
                <div class="basicDiv mr-1 whitespace-nowrap">{{ formatDate(payment.date) }}</div>
                <div class="basicDiv">{{ payment.amount }}€</div>
              </div>
            </template>
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
    getMonthName(monthIndex) {
      const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ];
      return monthNames[monthIndex];
    },
    formatDate(dateStr) {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
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
    },
  },
  async mounted() {
    this.payments = await fetchPayments();
    this.sortPaymentsByDate();
  },
});
</script>

<style scoped>
.basicDiv {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
}

.test{
  height: 100%;
}

.listPayments{
  border: 1px black;
}
</style>