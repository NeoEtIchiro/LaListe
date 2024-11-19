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
        <div class="insideCell bottomCell" @click="$emit('change-view', getView(timeRow.act), column.dates[0])"
          v-html="column.titles[timeRow.form]"
        >
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
            return [{act:this.years, form:0, col:1}, {act:this.months, form:1, col:1}, {act:this.weeks, form:1, col:1}];
          case "Mois":
            return [{act:this.months, form:0, col:4}, {act:this.weeks, form:0, col:4}, {act:this.days, form:1, col:4}];
          case "Semaine":
            const hourCol = this.hours.length*2-1;
            return [{act:this.months, form:0, col:hourCol}, {act:this.weeks, form:0, col:hourCol}, {act:this.days, form:0, col:hourCol}];
          case "Jour":
            const hourMap = this.hours.map((hour) => ({ titles:[hour], dates: [hour]}));
            const hourMult = this.hours.length* 12;
            return [{act:this.months, form:0, col:hourMult}, {act:this.days, form:0, col:hourMult}, {act: hourMap, form: 0, col:12}];
          default:
            return [];
        }
      },
    },
    methods: {
      getView(timeColl){
        console.log("Clique sur une date");

        switch(timeColl){
          case this.years:
            this.resetTimes();
            return 'Année';
          case this.months:
            this.resetTimes();
            return 'Mois';
          case this.weeks:
            this.resetTimes();
            return 'Semaine';
          case this.days:
            this.resetTimes();
            return 'Jour';
          default:
            return 'Null';
        }
      },
      resetTimes(){
        this.years = [];
        this.months = [];
        this.weeks = [];
        this.days = [];
      },
      getTimes() {
        console.log("Get times");
        // 1. Mettre à jour les jours
        this.updateDays();
      },
      updateDays() {
        this.filterTimes();

        // Ajouter le jour de départ si `this.days` est vide
        if (this.days.length === 0) {
          this.addDay(this.dateDebut);
        }

        // Initialiser les bornes de la période
        let lastDate = new Date(this.days[this.days.length - 1]?.dates[0] || this.dateDebut);
        lastDate.setHours(8, 0, 0, 0);
        lastDate.setDate(lastDate.getDate() + 1);

        let firstDate = new Date(this.days[0]?.dates[0]);
        firstDate.setHours(8,0,0,0);

        let startDate = new Date(this.dateDebut);
        startDate.setHours(8, 0, 0, 0);

        // Ajouter des jours après la fin existante
        if (lastDate <= this.dateFin) {
          while (lastDate <= this.dateFin) {
            this.addDay(lastDate);
            lastDate.setDate(lastDate.getDate() + 1);
          }
        }
        // Ajouter des jours avant le début existant
        if (startDate < firstDate) {
          while (startDate < firstDate) {
            this.addDay(startDate, true); // Ajoute au début
            startDate.setDate(startDate.getDate() + 1);
          }
        }
      },
      addDay(date, prepend = false) {
        const newDay = {
          dates: [new Date(date)],
          titles: [
            this.upperCaseFirstLetter(date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' })),
            this.upperCaseFirstLetter(date.toLocaleDateString('fr-FR', { weekday: 'short'}) + "<br>" + 
            date.toLocaleDateString('fr-FR', { day: 'numeric' })),
          ],
        };

        if (prepend) {
          this.days.unshift(newDay);
        } else {
          this.days.push(newDay);
        }

        const compareWeeks = (existingDate, newDate) => 
                              getWeek(existingDate, { weekStartsOn: 1 }) 
                              === getWeek(newDate, { weekStartsOn: 1 });

        const compareMonths = (existingDate, newDate) =>
                              existingDate.getMonth() === newDate.getMonth() &&
                              existingDate.getFullYear() === newDate.getFullYear();

        const compareYears = (existingDate, newDate) =>
                              existingDate.getFullYear() === newDate.getFullYear();

        // Gestion des semaines
        this.addToPeriod(
          this.weeks,
          date,
          ["Semaine " + getWeek(date, { weekStartsOn: 1 }), "S<br>" + getWeek(date, { weekStartsOn: 1 })],
          prepend,
          compareWeeks
        );

        this.addToPeriod(
          this.months,
          date,
          [this.upperCaseFirstLetter(date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })), 
           this.upperCaseFirstLetter(date.toLocaleDateString('fr-FR', { month: 'short'}))],
          prepend,
          compareMonths
        );

        this.addToPeriod(
          this.years,
          date,
          [date.toLocaleDateString('fr-FR', { year: 'numeric' })],
          prepend,
          compareYears
        );
      },

      addToPeriod(periodArray, date, titles, prepend, compareFn) {
        const periodDates = prepend ? periodArray[0]?.dates : periodArray[periodArray.length - 1]?.dates;

        // Vérifie si une période avec le même identifiant existe
        const periodExists = periodArray.length &&
          periodDates &&
          compareFn(periodDates[0], date);

        if (!periodExists) {
          const newPeriod = {
            dates: [new Date(date)],
            titles: titles,
          };

          if (prepend) {
            periodArray.unshift(newPeriod);
          } else {
            periodArray.push(newPeriod);
          }
        } else {
          // Ajoute la date à la période existante
          if (prepend) {
            periodArray[0].dates.unshift(new Date(date));
          } else {
            periodArray[periodArray.length - 1].dates.push(new Date(date));
          }
        }
      },

      filterTimes() {
        // Filtrer les jours
        this.days = this.days.filter(
          (day) => day.dates[0] >= this.dateDebut && day.dates[0] <= this.dateFin
        );

        // Filtrer les semaines
        this.weeks = this.weeks
          .map((week) => {
            const filteredDates = week.dates.filter(
              (date) => date >= this.dateDebut && date <= this.dateFin
            );
            return filteredDates.length > 0
              ? {
                  ...week,
                  dates: filteredDates,
                }
              : null;
          })
          .filter((week) => week !== null); // Supprimer les semaines vides

        this.months = this.months
          .map((month) => {
            const filteredDates = month.dates.filter(
              (date) => date >= this.dateDebut && date <= this.dateFin
            );
            return filteredDates.length > 0
              ? {
                  ...month,
                  dates: filteredDates,
                }
              : null;
          })
          .filter((month) => month !== null); // Supprimer les semaines vides

        this.years = this.years
          .map((year) => {
            const filteredDates = year.dates.filter(
              (date) => date >= this.dateDebut && date <= this.dateFin
            );
            return filteredDates.length > 0
              ? {
                  ...year,
                  dates: filteredDates,
                }
              : null;
          })
          .filter((year) => year !== null); // Supprimer les semaines vides
      },
      upperCaseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
    },
    watch: {
      dateFin: 'getTimes', // Appelle getTimes() quand dateDebut change
      selectedView: 'getTimes'
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
    min-width: 0;
    padding: 0px;
    white-space: normal;
    align-items: center; /* Centre verticalement */
    justify-content: center; /* Centre horizontalement */
    height: 40px;
  }
</style>
  