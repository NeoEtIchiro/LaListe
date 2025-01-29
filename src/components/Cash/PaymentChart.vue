<template>
    <div class="h-full">
        <Line class="h-full" :data="data" :options="options"></Line>
    </div>
</template>

<script>
    import { Line } from 'vue-chartjs'
    import {
        Chart as ChartJS,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    } from 'chart.js'

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    )

    export default {
        name: 'PaymentChart',
        components: {
            Line
        },
        props: {
            payments: {
                type: Array,
                required: true
            },
            selectedYear: {
                type: Number,
                required: true
            }
        },
        data() {
            return {
                data: {
                    labels: ['Jan.', 'Fev.', 'Mar.', 'Avr.', 'Mai', 'Juin.', 'Juil.', 'Aout.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],
                    datasets: [
                        {
                            label: 'Trésorerie',
                            backgroundColor: '#E8535D',
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            pointBackgroundColor: function(context) {
                                const value = context.raw;
                                return value < 0 ? 'red' : '#E8535D';
                            },
                            pointRadius: function(context) {
                                const value = context.raw;
                                return value < 0 ? 5 : 4;
                            }
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            suggestedMin: 0,
                            ticks: {
                                font: {
                                    weight: 'bold'
                                }
                            },
                            grid: {
                                display: true,
                                lineWidth: 1,
                                color: function(context) {
                                    return context.tick.value === 0 ? '#000' : '#ccc';
                                },
                                borderDash: function(context) {
                                    return context.tick.value === 0 ? [0, 0] : [5, 5];
                                }
                            }
                        }
                    }
                }
            };
        },
        methods: {
            updateChart() {
                if(this.payments.length == 0) {
                    return;
                }

                const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let somme = 0;
                
                this.payments.forEach(payment => {
                    const date = new Date(payment.date);
                    const month = date.getMonth();
                    somme += payment.amount;

                    if(date.getFullYear() == this.selectedYear) {
                        data[month] = somme;
                    }
                });

                // Remplir les mois sans paiements avec la dernière valeur de trésorerie connue
                for (let i = 0; i < data.length; i++) {;
                    const lastPayment = this.payments[this.payments.length-1];
                    const paymentDate = new Date(lastPayment.date);
                    if(i == 0 && data[i] == 0 && paymentDate.getFullYear() < this.selectedYear) {
                        data[i] = somme;
                    }
                    else if (data[i] == 0) {
                        data[i] = data[i - 1];
                    }
                }

                this.data = {
                    labels: ['Jan.', 'Fev.', 'Mar.', 'Avr.', 'Mai', 'Juin.', 'Juil.', 'Aout.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],
                    datasets: [
                        {
                            label: 'Trésorerie',
                            backgroundColor: '#f87979',
                            data: data
                        }
                    ]
                };
            }
        },
        watch: {
            payments: {
                handler() {
                    this.updateChart();
                },
                deep: true
            },
            selectedYear: {
                handler() {
                    this.updateChart();
                },
                deep: true
            }
        },
        mounted(){
            this.updateChart();
        }
    }
</script>

<style scoped>

</style>