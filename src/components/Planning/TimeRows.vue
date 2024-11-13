<template>
    <thead class="timerows-container">
        <tr>
            <th class="topLeftCell"></th>
            <th class="otherCell" :colspan="12 * hours.length">{{ upperCaseFirstLetter(dateAct.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })) }}</th>
        </tr>
        <tr>
            <th class="topLeftCell"></th>
            <th class="otherCell" :colspan="12 * hours.length">{{ upperCaseFirstLetter(dateAct.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' })) }}</th>
        </tr>
        <tr>
            <th class="topLeftCell"></th>
            <th class="otherCell" v-for="hour in hours" :key="hour" :colspan="12">{{ hour }}</th>
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

<style scoped>
    .timerows-container {
        width: 100%;
        overflow-x: auto; /* Permet le défilement horizontal si nécessaire */
        margin-top: 20px;
    }

    .timerows-container .topLeftCell{
        width: 150px;
        height: 5px;
    }

    .timerows-container .otherCell {
        padding: 4px;
        text-align: center;
        background-color: #ffffff;
        border: 1px solid #ddd;
    }

    .otherCell{
        user-select: none;
    }
</style>