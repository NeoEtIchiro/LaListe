<template>
    <div class="border-solid border-2 border-gray-300 rounded-lg p-1">
        <!-- Pour chaque payments trié par date -->
        <template v-for="(payment, index) in payments" :key="payment.id">
            <!-- Si c'est le premier payment ou si le mois du payment actuel est différent du mois du payment précédent, ajouter une séparation-->
            <div v-if="index === 0 || new Date(payment.date).getMonth() !== new Date(payments[index - 1].date).getMonth()" class="w-full flex items-center">
                <span class="mr-2 mb-1 mt-1">{{ getMonthName(new Date(payment.date).getMonth()) }}</span>
                <hr class="flex-grow border-gray-300">
            </div>

            <!-- Afficher le payment -->
            <div class="flex justify-center mb-1 w-full" 
                @dblclick="$emit('openPayment', payment)"
            >
                <div class="basicDiv mr-1 w-full overflow-hidden text-ellipsis whitespace-nowrap" :style="{ backgroundColor: payment.color }">{{ payment.name }}</div>
                <div class="basicDiv mr-1 whitespace-nowrap" :style="{ backgroundColor: payment.color }">{{ formatDate(payment.date) }}</div>
                <div class="basicDiv" :style="{ backgroundColor: payment.color }">{{ payment.amount }}€</div>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        payments: {Array, required: true},
    },
    methods: {
        // Retourne le nom du mois correspondant à l'index
        getMonthName(monthIndex) {
            const monthNames = [
                'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
            ];
            return monthNames[monthIndex];
        },
        // Formate une dateInput au format jj/mm/aaaa
        formatDate(dateStr) {
            const [year, month, day] = dateStr.split('-');
            return `${day}/${month}/${year}`;
        },
    }
}
</script>

<style scoped>

</style>