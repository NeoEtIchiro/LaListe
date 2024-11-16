<template>
    <td class="ressource">
        <div class="ressourceContent" @dblclick="openPopup(ressource)">
            <div>{{ressource.name}}</div>
        </div>
    </td>
    <template v-for="hour in hours.length" :key="hours[hour]">
        <template v-if="hour%2 != 0">
            <td class="minutesCell heurePair" v-for="segment in 12" :key="segment"
                @mousedown="startOfEvent($event)" 
                :data-ressource="ressource.id" :data-date="dateFromDateHourMinute(dateAct, convertHourToInt(hours[hour-1]), (segment-1)*5)"></td>
        </template>
        <template v-else>
            <td class="minutesCell" v-for="segment in 12" :key="segment"
                @mousedown="startOfEvent($event)" 
                :data-ressource="ressource.id" :data-date="dateFromDateHourMinute(dateAct, convertHourToInt(hours[hour-1]), (segment-1)*5)"></td>
        </template>
    </template>
</template>

<script>
export default {
    props:{
        ressource: {id: String, name: String},
        hours: Array,
        dateAct: Date,

        startOfEvent: Function,
        openPopup: Function,
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
    }
}
</script>

<style scoped>
    .ressource {
        height: 70px;
        text-align: left;
        padding: 8px;
        border: 1px solid #ddd;
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
        background-color: rgb(112, 255, 255);
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
