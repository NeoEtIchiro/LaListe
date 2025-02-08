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
        props: ['payments', 'selectedYear', 'selectedMonth'],
        data() {
            return {
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Trésorerie',
                            backgroundColor: '#f87979',
                            data: [],
                            pointBackgroundColor: function(context) {
                                const value = context.raw;
                                return value < 0 ? 'red' : '#f87979';
                            },
                            pointRadius: function(context) {
                                const value = context.raw;
                                return value < 0 ? 5 : 3;
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
                let labels = [];
                let data = [];

                if (this.selectedMonth === '') {
                    // Afficher les paiements de toute l'année
                    labels = ['Jan.', 'Fév.', 'Mar.', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
                    data = new Array(12).fill(0);
                    let somme = 0;

                    if (this.payments.length > 0) {
                        this.payments.forEach(payment => {
                            const date = new Date(payment.date);
                            const month = date.getMonth();
                            if (payment.negative) somme -= payment.amount;
                            else somme += payment.amount;
                            
                            if (date.getFullYear() === this.selectedYear) {
                                data[month] = somme;
                            } else if (date.getFullYear() < this.selectedYear) {
                                data.fill(somme);
                            }
                        });

                        // Remplir les mois sans paiements avec la dernière valeur connue
                        for (let i = 1; i < data.length; i++) {
                            if (!this.payments.some(payment => 
                                    new Date(payment.date).getFullYear() === this.selectedYear && 
                                    new Date(payment.date).getMonth() === i)) {
                                data[i] = data[i - 1];
                            }
                        }
                    }
                } else {
                    // Afficher les paiements du mois sélectionné
                    const daysInMonth = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
                    labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
                    data = new Array(daysInMonth).fill(0);
                    let somme = 0;

                    if (this.payments.length > 0) {
                        this.payments.forEach(payment => {
                            const date = new Date(payment.date);
                            const day = date.getDate();
                            if (payment.negative) somme -= payment.amount;
                            else somme += payment.amount;
                            
                            if (date.getFullYear() === this.selectedYear && date.getMonth() === this.selectedMonth) {
                                data[day - 1] = somme;
                            }
                            else if(date.getFullYear() == this.selectedYear && date.getMonth() < this.selectedMonth
|| date.getFullYear() < tis.selectedYear){
                                data.fill(somme);

                            }
                        });

                        // Remplir les jours sans paiements avec la dernière valeur connue
                        for (let i = 1; i < data.length; i++) {
                            if (!this.payments.some(payment => 
                                    new Date(payment.date).getFullYear() === this.selectedYear && 
                                    new Date(payment.date).getMonth() === this.selectedMonth && 
                                    new Date(payment.date).getDate() === i + 1)) {
                                data[i] = data[i - 1];
                            }
                        }
                    }
                }

                // Met à jour le graphique, même si data est uniquement composée de zéros
                this.data = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Trésorerie',
                            backgroundColor: '#f87979',
                            data: data,
                            pointBackgroundColor: function(context) {
                                const value = context.raw;
                                return value < 0 ? 'red' : '#f87979';
                            },
                            pointRadius: function(context) {
                                const value = context.raw;
                                return value < 0 ? 5 : 3;
                            }
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
                }
            },
            selectedMonth: {
                handler() {
                    this.updateChart();
                }
            }
        },
        mounted() {
            this.updateChart();
        }
    }
</script>

<style scoped>

</style>