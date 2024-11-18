<template>
    <td class="ressource">
        <div class="ressourceContent" @dblclick="openPopup(ressource)">
            <div>{{ressource.name}}</div>
        </div>
    </td>
    <template v-for="timeIndex in computedRows.coll.length" :key="timeIndex">
        <template v-if="timeIndex%2 != 0">
            <td class="minutesCell heurePair" v-for="seg in computedRows.segment" :key="seg"
                @mousedown="startOfEvent($event)" 
                :data-ressource="ressource.id" ></td>
        </template>
        <template v-else>
            <td class="minutesCell" v-for="seg in computedRows.segment" :key="seg"
                @mousedown="startOfEvent($event)" 
                :data-ressource="ressource.id" ></td>
        </template>
    </template>
</template>

<script>
export default {
    props:{
        ressource: {id: String, name: String},
        hours: Array,
        dateDebut: Date,
        dateFin: Date,

        startOfEvent: Function,
        openPopup: Function,
        selectedView: String,
    },
    data(){
        return{
            dates: []
        }
    },
    computed: {
        computedRows() {
            switch (this.selectedView) {
                case "Année":
                    return {coll:this.dates, segment:1};
                case "Mois":
                    return {coll:this.dates, segment:4};
                case "Semaine":
                    return {coll:this.dates, segment:this.hours.length*2-1};
                case "Jour":
                    const hourMap = this.hours.map((hour) => ({ title: [hour], colspan: 1}));
                    return {coll:this.hours, segment:12};
                default:
                    return {coll:this.hours, segment:12};
            }
        },
    },
    methods:{
        dateFromDateHourMinute(date, hour, minute) {
            const newDate = new Date(date); // Crée une nouvelle instance de la date
            newDate.setHours(hour);
            newDate.setMinutes(minute);
            newDate.setSeconds(0);
            return newDate;
        },
        convertHourToInt(hour) {
            return parseInt(hour.split(':')[0], 10); // Récupère la partie heure et convertit en entier
        },
        getDates(){
            this.dates = []

            let currentDate = new Date(this.dateDebut);

            while (currentDate <= this.dateFin) {
                this.dates.push(currentDate);
                currentDate.setDate(currentDate.getDate() + 1); // Ajoute un jour
            }
        }
    },
    watch: {
      dateDebut: 'getDates', // Appelle getTimes() quand dateDebut change
      dateFin: 'getDates'    // Appelle getTimes() quand dateFin change
    },
    mounted(){
        this.getDates();
    }
}
</script>

<style scoped>
    .ressource {
        height: 70px;
        text-align: left;
        padding: 8px;
        background-color: #292929;
        border-start-start-radius: 8px;
        border-end-start-radius: 8px;
        color: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    }

    .ressourceContent {
        width: 100%;
        height: 100%;
        align-content: center;
    }

    .ressourceContent div{
        user-select: none;
    }

    .ressource:hover{
        background-color: rgb(151, 151, 151);
    }

    .heurePair{
        background-color: rgb(255, 221, 221);
    }

    .minutesCell {
        width: 12%;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
    }

    .minutesCell:hover{
        background-color: rgb(112, 255, 255);
    }
</style>
