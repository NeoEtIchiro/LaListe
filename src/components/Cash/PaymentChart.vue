<template>
    <div>
        <h3>Graphiques</h3>
        <Line class="chartDiv" :data="data" :options="options"></Line>
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
            }
        },
        data() {
            return {
                data: {
                    labels: ['Jan.', 'Fev.', 'Mar.', 'Avr.', 'Mai.', 'Juin.', 'Juil.', 'Aout.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],
                    datasets: [
                        {
                            label: 'Trésorerie',
                            backgroundColor: '#f87979',
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            }
        },
        methods:{
            updateChart(){
                this.data.datasets[0].data = [167, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            }
        },
        watch: {
            payments: {
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
.chartDiv{
    height: 400px;
}
</style>