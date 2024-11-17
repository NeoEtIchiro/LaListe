<template>
  <thead class="timerows-container">
    <!-- Dynamique pour toutes les visualisations -->
    <tr v-for="(timeRow, index) in computedRows" :key="index">
      <th class="topLeftCell"></th>
      <th
        v-for="column in timeRow.act"
        :key="column"
        
        :colspan="timeRow.col * column.colspan"
      >
      <div v-if="index!=computedRows.length-1" class="otherCell">
        <div class="insideCell">{{ column.title[timeRow.form] }}</div>
      </div>
      <div v-else class="bottomOtherCell">
        <div class="insideCell bottomCell">{{ column.title[timeRow.form] }}</div>
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
  