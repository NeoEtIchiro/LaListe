<template>
  <thead class="timerows-container">
    <!-- Dynamique pour toutes les visualisations -->
    <tr v-for="(timeRow, index) in computedRows" :key="index">
      <th class="topLeftCell"></th>
      <th
        v-for="column in timeRow.act"
        :key="column"
        
        :colspan="timeRow.col * column.dates.length"
      >
      <div v-if="index!=computedRows.length-1" class="otherCell">
        <div class="insideCell" @click="$emit('change-view', getView(timeRow.act), column.dates[0])">
          {{ column.titles[timeRow.form] }}
        </div>
      </div>
      <div v-else class="bottomOtherCell">
        <div class="insideCell bottomCell" @click="$emit('change-view', getView(timeRow.act), column.dates[0])">
          {{ column.titles[timeRow.form] }}
        </div>
      </div>
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
            return [{act:this.years, form:0, col:1}, {act:this.months, form:1, col:1}, {act:this.weeks, form:1, col:1}, {act:this.days, form:0, col:1}];
          case "Mois":
            return [{act:this.months, form:0, col:4}, {act:this.weeks, form:0, col:4}, {act:this.days, form:1, col:4}];
          case "Semaine":
            const hourCol = this.hours.length*2-1;
            return [{act:this.months, form:0, col:hourCol}, {act:this.weeks, form:0, col:hourCol}, {act:this.days, form:0, col:hourCol}];
          case "Jour":
            const hourMap = this.hours.map((hour) => ({ title: [hour], colspan: 1}));
            const hourMult = this.hours.length* 12;
            return [{act:this.days, form:0, col:hourMult}];
          default:
            return [];
        }
      },
    },
    methods: {
      getView(timeColl){
        switch(timeColl){
          case this.years:
            return 'Année';
          case this.months:
            return 'Mois';
          case this.weeks:
            return 'Semaine';
          case this.days:
            return 'Jour';
          default:
            return 'Null';
        }
      },
      getTimes() {
        // 1. Mettre à jour les jours
        this.updateDays();
      },
      updateDays() {
        this.filterTimes();
        this.createFirstDay();

        // Initialiser les bornes de la période
        let lastDate = new Date(this.days[this.days.length - 1]?.dates[0] || this.dateDebut);
        lastDate.setDate(lastDate.getDate() + 1);

        let firstDate = new Date(this.days[0]?.dates[0] || this.dateDebut);

        let tempDays = [...this.days];
        let startDate = new Date(this.dateDebut);

        // Ajouter des jours après la fin existante
        if (lastDate <= this.dateFin) {
          while (lastDate <= this.dateFin) {
            tempDays.push({
              dates: [new Date(lastDate)],
              titles: [
                lastDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' }),
                lastDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
              ],
            });
            lastDate.setDate(lastDate.getDate() + 1);
          }
          this.days = tempDays;
        }

        // Ajouter des jours avant le début existant
        if (startDate < firstDate) {
          const newDays = [];
          while (startDate < firstDate) {
            newDays.push({
              dates: [new Date(startDate)],
              titles: [
                startDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' }),
                startDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
              ],
            });
            startDate.setDate(startDate.getDate() + 1);
          }
          this.days = [...newDays, ...tempDays];
        }
      },
      createFirstDay(){
        if(this.days.length == 0){
          this.days.push({dates: [new Date(this.dateDebut)], 
                          titles: [
                            this.dateDebut.toLocaleDateString('fr-FR', {weekday: 'long', day:'numeric'}),
                            this.dateDebut.toLocaleDateString('fr-FR', {weekday: 'short', day:'numeric'}),
                          ]});
        }
      },
      filterTimes(){
        this.days = this.days.filter((day) => day.dates[0] >= this.dateDebut
                                              && day.dates[0] <= this.dateFin);
      },
      upperCaseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
    },
    watch: {
      dateFin: 'getTimes', // Appelle getTimes() quand dateDebut change
    },
    mounted(){
      this.getTimes();
    }
  };
  </script>
  
  <style scoped>
  th, td {
    padding: 0; /* Supprime le padding par défaut */
    margin: 0; /* Supprime les marges par défaut */
    border: 0; /* Supprime toute bordure implicite */
  }

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
    text-align: center;
    user-select: none;
    overflow: hidden;
    padding-left: 2px;
    padding-right: 2px;
    padding-bottom: 4px;
  }

  .insideCell:hover{
    background-color: rgb(151, 151, 151);
  }

  .insideCell{
    user-select: none;
    color: white;
    overflow: hidden;
    border-radius: 8px;
    padding: 4px;
    height: 25px;
    background-color: #292929;
    white-space: nowrap; /* Empêche les sauts de ligne */
    overflow: hidden;    /* Masque le débordement */
    text-overflow: ellipsis; /* Ajoute "..." si le texte dépasse */
  }

  .bottomCell{
    border-end-end-radius: 0px;
    border-end-start-radius: 0px;
    font-size: smaller;
    display: flex;
    white-space: normal;
    align-items: center; /* Centre verticalement */
    justify-content: center; /* Centre horizontalement */
    height: 40px;
  }
</style>
  