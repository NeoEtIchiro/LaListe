<template>
    <thead class="timerows-container">
      <!-- Première ligne: Mois et année -->
      <tr v-if="selectedView === 'Mois' || selectedView === 'Année'">
        <th class="topLeftCell"></th>
        <th v-for="year in years" :key="year" class="otherCell" :colspan="year.colspan">
          {{ year.title }}
        </th>
      </tr>

      <tr>
        <th class="topLeftCell"></th>
        <th v-for="month in months" :key="month" class="otherCell" :colspan="month.colspan">
          <div v-if="selectedView === 'Année'">{{ month.title[1] }}</div>
          <div v-else-if="selectedView === 'Mois'">{{ month.title[2] }}</div>
          <div v-else>{{ month.title[0] }}</div>
        </th>
      </tr>
  
      <tr v-if="selectedView !== 'Jour'">
        <th class="topLeftCell"></th>
        <th v-for="week in weeks" :key="week" class="otherCell" :colspan="week.colspan">
          <div id="SemaineAnnée" v-if="selectedView === 'Année'">{{ week.title[1] }}</div>
          <div v-else-if="selectedView !== 'Jour'">{{ week.title[0] }}</div>
        </th>
      </tr>

      <tr v-if="selectedView === 'Jour' || selectedView === 'Semaine'">
        <th class="topLeftCell"></th>
        <th v-for="day in days" :key="day" class="otherCell" :colspan="day.colspan">
          <div v-if="selectedView === 'Semaine'">{{ day.title[1] }}</div>
          <div v-else-if="selectedView === 'Jour'">{{ day.title[0] }}</div>
        </th>
      </tr>

      <tr v-if="selectedView === 'Jour'">
        <th class="topLeftCell"></th>
        <th v-for="hour in hours" :key="hour" class="otherCell" :colspan="12">
          <div>{{ hour }}</div>
        </th>
      </tr>
    </thead>
  </template>
  
  <script>
  import { getWeek } from 'date-fns';

  export default {
    props: {
      hours: Array,
      dateDebut: Date,
      dateFin: Date,
      selectedView: String,
    },
    data(){
        return{
            years: [],
            months: [],
            weeks: [],
            days: []
        }
    },
    methods: {
        getTimes(){
          this.years = [];
          this.months = [];
          this.weeks = [];
          this.days = [];
          let currentDate = new Date(this.dateDebut);

          while (currentDate <= this.dateFin) {
            const actYear = currentDate.toLocaleDateString('fr-FR', { year: 'numeric' });
            const actMonth = [currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
                              currentDate.toLocaleDateString('fr-FR', { month: 'short' }),
                              currentDate.toLocaleDateString('fr-FR', { month: 'long' })
                            ];
            const actWeek = [ "Semaine " + getWeek(currentDate, { weekStartsOn: 1 }),
                              "S " + getWeek(currentDate, { weekStartsOn: 1 })
                            ];
            const actDay = [currentDate.toLocaleDateString('fr-FR', {day: 'long', day:'numeric'}),
                            currentDate.toLocaleDateString('fr-FR', {day: 'short', day:'numeric'})
                           ];

            if(this.years.filter(y => y.title == actYear).length==0){
              this.years.push({title:actYear, colspan:1});}
            else{ this.years.filter(y => y.title == actYear)[0].colspan++;}

            if(this.months.filter(m => m.title[0] == actMonth[0]).length==0){
              this.months.push({title:actMonth, colspan:1});}
            else{ this.months.filter(m => m.title[0] == actMonth[0])[0].colspan++;}

            if(this.weeks.filter(w => w.title[0] == actWeek[0]).length==0){
              this.weeks.push({title:actWeek, colspan:1});}
            else{ this.weeks.filter(w => w.title[0] == actWeek[0])[0].colspan++;}

            if(this.days.filter(d => d.title[0] == actDay[0]).length==0){
              this.days.push({title:actDay, colspan:1});}
            else{ this.days.filter(d => d.title[0] == actDay[0])[0].colspan++;}

            currentDate.setDate(currentDate.getDate() + 1); // Ajoute un jour à currentDate
          }
        },
        upperCaseFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
    },
    watch: {
      dateDebut: 'getTimes', // Appelle getTimes() quand dateDebut change
      dateFin: 'getTimes'    // Appelle getTimes() quand dateFin change
    },
    mounted(){
        this.getTimes();
    }
  };
  </script>
  
  <style scoped>
  .timerows-container {
    width: 100%;
    overflow-x: auto;
    margin-top: 20px;
  }
  
  .timerows-container .topLeftCell {
    width: 150px;
    height: 5px;
  }
  
  .timerows-container .otherCell {
    padding: 4px;
    text-align: center;
    background-color: #ffffff;
    border: 1px solid #ddd;
    user-select: none;
    overflow: hidden;
  }

  #SemaineAnnée{
    font-size: 0.7pc;
  }
</style>
  