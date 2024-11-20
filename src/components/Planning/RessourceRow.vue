<template>
    <td class="ressource">
        <div class="ressourceContent" @dblclick="openPopup(ressource)">
            <div>{{ressource.name}}</div>
        </div>
    </td>
    <template v-for="timeIndex in computedRows.coll.length" :key="timeIndex">
        <template v-if="timeIndex%2 != 0">
            <td class="minutesCell heurePair" v-for="seg in computedRows.segment" :key="seg" :colspan="computedRows.col"
                @mousedown="startOfEvent($event)" 
                :data-ressource="ressource.id" 
                :data-dateDebut="new Date(computedRows.coll[timeIndex-1].getTime() + computedRows.interval * (seg-1) * 60000)"
                :data-dateFin="new Date(computedRows.coll[timeIndex-1].getTime() + computedRows.interval * (seg) * 60000)" ></td>
        </template>
        <template v-else>
            <td class="minutesCell" v-for="seg in computedRows.segment" :key="seg" :colspan="computedRows.col"
                @mousedown="startOfEvent($event)" 
                :data-ressource="ressource.id"
                :data-dateDebut="new Date(computedRows.coll[timeIndex-1].getTime() + computedRows.interval * (seg-1) * 60000)"
                :data-dateFin="new Date(computedRows.coll[timeIndex-1].getTime() + computedRows.interval * (seg) * 60000)" ></td>
        </template>
    </template>
</template>

<script>
import { startOfWeek } from 'date-fns';

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
            dates: [],
            weeks: []
        }
    },
    computed: {
        computedRows() {
            switch (this.selectedView) {
                case "Année":
                    return {coll:this.weeks, segment:1, interval:3600*7, col:7};
                case "Mois":
                    const inter = ((this.convertHourToInt(this.hours[this.hours.length-1])+1
                                    -this.convertHourToInt(this.hours[0]))/4)*60;
                    
                    return {coll:this.dates, segment:4, interval:inter, col:1 };
                case "Semaine":
                    return {coll:this.dates, segment:this.hours.length*2, interval:30, col:1};
                case "Jour":
                    const hourMap = this.hours.map((hour) => {
                        const date = new Date(this.dates[0]);
                        date.setHours(this.convertHourToInt(hour), 0, 0, 0);
                        return date;
                    });
                    return {coll:hourMap, segment:12, interval:5, col:1};
                default:
                    return {coll:hourMap, segment:12, interval:5};
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
        getDates() {
            this.dates = [];
            this.weeks = []; // Réinitialiser les semaines

            let currentDate = new Date(this.dateDebut);
            currentDate.setHours(8,0,0,0);
            let endDate = new Date(this.dateFin);
            endDate.setHours(19,0,0,0);

            while (currentDate <= endDate) {
                // Ajouter chaque jour à `this.dates`
                this.dates.push(new Date(currentDate));

                // Déterminer le début de la semaine
                const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

                // Si cette semaine n'est pas déjà ajoutée à `this.weeks`, l'ajouter
                if (!this.weeks.some((weekDate) => weekDate.getTime() === weekStart.getTime())) {
                    this.weeks.push(new Date(weekStart)); // Ajouter la date du lundi
                }

                currentDate.setDate(currentDate.getDate() + 1); // Passer au jour suivant
            }
        },
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
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
    }

    .minutesCell:hover{
        background-color: rgb(112, 255, 255);
    }
</style>
