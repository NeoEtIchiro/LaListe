<template>
    <div class="flex-grow overflow-y-auto border border-gray-300 rounded-lg">
        <template v-for="(payment, index) in payments" :key="payment.id">
            <div v-if="index === 0 || new Date(payment.date).getMonth() !== new Date(payments[index - 1].date).getMonth()" class="w-full flex items-center">
                <span class="mr-2 mb-1 mt-1">{{ getMonthName(new Date(payment.date).getMonth()) }}</span>
                <hr class="flex-grow border-gray-300">
            </div>
            <div class="flex justify-center mb-1 w-full" @dblclick="$emit('dbClick', payment)">
                <div class="basicDiv mr-1 w-full overflow-hidden text-ellipsis whitespace-nowrap">{{ payment.name }}</div>
                <div class="basicDiv mr-1 whitespace-nowrap">{{ formatDate(payment.date) }}</div>
                <div class="basicDiv">{{ payment.amount }}€</div>
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
    }
}
</script>

<style scoped>

</style>