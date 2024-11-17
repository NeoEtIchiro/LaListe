<template>
    <thead class="timerows-container">
      <!-- Dynamique pour toutes les visualisations -->
      <tr v-for="(timeRow, index) in computedRows" :key="index">
        <th class="topLeftCell"></th>
        <th
          v-for="column in timeRow.act"
          :key="column"
          class="otherCell"
          :colspan="timeRow.col * column.colspan"
        >
          {{ column.title[timeRow.form] }}
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
    computed: {
      computedRows() {
        switch (this.selectedView) {
          case "Année":
            return [{act:this.years, form:0, col:1}, {act:this.months, form:1, col:1}, {act:this.weeks, form:1, col:1}];
          case "Mois":
            return [{act:this.months, form:0, col:4}, {act:this.weeks, form:0, col:4}, {act:this.days, form:1, col:4}];
          case "Semaine":
            const hourCol = this.hours.length*2-1;
            return [{act:this.months, form:0, col:hourCol}, {act:this.weeks, form:0, col:hourCol}, {act:this.days, form:0, col:hourCol}];
          case "Jour":
            const hourMap = this.hours.map((hour) => ({ title: [hour], colspan: 1}));
            const hourMult = this.hours.length* 12;
            return [{act:this.months, form:0, col:hourMult}, {act:this.days, form:0, col:hourMult}, {act:hourMap, form:0, col:12}];
          default:
            return [];
        }
      },
    },
    methods: {
        getTimes(){
          this.years = [];
          this.months = [];
          this.weeks = [];
          this.days = [];
          let currentDate = new Date(this.dateDebut);

          while (currentDate <= this.dateFin) {
            const actYear = [currentDate.toLocaleDateString('fr-FR', { year: 'numeric' })];
            const actMonth = [this.upperCaseFirstLetter(currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })),
                              this.upperCaseFirstLetter(currentDate.toLocaleDateString('fr-FR', { month: 'short' })),
                              this.upperCaseFirstLetter(currentDate.toLocaleDateString('fr-FR', { month: 'long' }))
                            ];
            const actWeek = [ "Semaine " + getWeek(currentDate, { weekStartsOn: 1 }),
                              "S " + getWeek(currentDate, { weekStartsOn: 1 })
                            ];
            const actDay = [this.upperCaseFirstLetter(currentDate.toLocaleDateString('fr-FR', {weekday: 'long', day:'numeric'})),
                            this.upperCaseFirstLetter(currentDate.toLocaleDateString('fr-FR', {weekday: 'short', day:'numeric'}))
                           ];

            // Mise à jour dynamique des colonnes
            this.addOrIncrement(this.years, actYear);
            this.addOrIncrement(this.months, actMonth);
            this.addOrIncrement(this.weeks, actWeek);
            this.addOrIncrement(this.days, actDay);

            currentDate.setDate(currentDate.getDate() + 1); // Ajoute un jour
          }
        },
        addOrIncrement(array, title) {
          const existing = array.find((item) => item.title[0] === title[0]);
          if (existing) {
            existing.colspan += 1;
          } else {
            array.push({ title: title || title, colspan: 1 });
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
  