<template>
    <thead class="timerows-container">
        <tr>
            <th class="topLeftCell"></th>
            <th :colspan="12 * hours.length">{{ upperCaseFirstLetter(dateAct.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })) }}</th>
        </tr>
        <tr>
            <th class="topLeftCell"></th>
            <th :colspan="12 * hours.length">{{ upperCaseFirstLetter(dateAct.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' })) }}</th>
        </tr>
        <tr>
            <th class="topLeftCell"></th>
            <th v-for="hour in hours" :key="hour" :colspan="12">{{ hour }}</th>
        </tr>
    </thead>
</template>

<script>
    export default{
        props:{
            hours: Array,
            dateAct: Date,
        },
        methods:{
            upperCaseFirstLetter(string){
                return string.charAt(0).toUpperCase() + string.slice(1);
            },
        }
    }
</script>

<style>
    .timerows-container {
        width: 100%;
        overflow-x: auto; /* Permet le défilement horizontal si nécessaire */
        margin-top: 20px;
    }

    .timerows-container .topLeftCell{
        width: 150px;
        height: 5px;
    }

    .timerows-container th {
        padding: 4px;
        text-align: center;
        background-color: #f4f4f4;
        border: 1px solid #ddd;
    }

</style>