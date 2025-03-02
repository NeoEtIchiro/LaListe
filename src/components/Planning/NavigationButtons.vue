<template>
  <div class="h-9 flex justify-between items-center gap-1">
    <button
      class="w-9 rounded-xl m-0"
      @mousedown="startPress('previous')"
      @mouseup="stopPress"
      @mouseleave="stopPress"
    >
      ◄
    </button>
    <flat-pickr
      class="h-9 text-center rounded-xl border-none bg-gray-200 m-0 text-lg font-bold w-[150px]"
      v-model="selectedDate"
      :config="flatpickrOptions"
      @on-change="updateDate"
    />
    <button
      class="w-9 rounded-xl m-0"
      @mousedown="startPress('next')"
      @mouseup="stopPress"
      @mouseleave="stopPress"
    >
      ►
    </button>
  </div>
</template>

<script>
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.min.css';

export default {
  components: {
    FlatPickr,
  },
  props: {
    selectedView: String,
    dateDebut: Date, // Propriété pour afficher la date actuelle
  },
  data() {
    return {
      selectedDate: new Date(this.dateDebut), // Liaison avec Flatpickr
      pressInterval: null,
      pressTimeout: null,
      speed: 200,
      initialDelay: 200,
      flatpickrOptions: {
        dateFormat: 'd/m/Y',
        disableMobile: true,
        locale: {
          firstDayOfWeek: 1, // Lundi comme premier jour
          weekdays: {
            shorthand: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
            longhand: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
          },
          months: {
            shorthand: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
            longhand: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
          },
        },
      },
    };
  },
  methods: {
    startPress(direction) {
      this.$emit('navigate', direction);
      this.pressTimeout = setTimeout(() => {
        this.pressInterval = setInterval(() => {
          this.$emit('navigate', direction);
        }, this.speed);
      }, this.initialDelay);
    },
    stopPress() {
      clearTimeout(this.pressTimeout);
      clearInterval(this.pressInterval);
      this.pressTimeout = null;
      this.pressInterval = null;
    },
    changeSpeed() {
      switch (this.selectedView) {
        case 'Année':
          this.speed = 5;
          break;
        case 'Mois':
          this.speed = 50;
          break;
        case 'Semaine':
          this.speed = 100;
          break;
        case 'Jour':
          this.speed = 200;
          break;
        default:
          this.speed = 100;
      }
    },
    updateDate(selectedDates) {
      const newDate = selectedDates[0];
      if (!isNaN(newDate)) {
        this.$emit('update-date', new Date(newDate));
      }
    },
  },
  watch: {
    dateDebut: {
      immediate: true, // Synchronise dès le montage initial
      handler(newDate) {
        // Mettre à jour seulement si `selectedDate` est différent de `dateDebut`
        if (new Date(this.selectedDate).getTime() !== newDate.getTime()) {
          this.selectedDate = newDate; // Met à jour FlatPickr
        }
      },
    },
    selectedView: 'changeSpeed',
  },
  mounted() {
    this.changeSpeed();
  },
};
</script>

<style>
/* Conteneur principal */
.flatpickr-calendar {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  user-select: none;
  padding: 8px;
  box-sizing:content-box;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

/* Jours du mois */
.flatpickr-day {
  color: #333;
  border-radius: 50%;
}
.flatpickr-day:hover {
  background: #eaeaea;
  color: #000;
}

/* Jour sélectionné */
.flatpickr-day.selected {
  background: #007bff;
  color: white;
}

/* Week-headers */
.flatpickr-weekday {
  font-weight: bold;
  color: #555;
}

/* Mois */
.flatpickr-month {
  display: flex;
  justify-content: center;
  margin:0;
  font-size: 1em;
  border: 0px;
  font-weight: bold;
  color: #333;
}

/* Boutons de navigation */
.flatpickr-prev-month,
.flatpickr-next-month {
  background: none;
  border: none;
  font-size: 1em;
  color: #007bff;
  cursor: pointer;
}
.flatpickr-prev-month:hover,
.flatpickr-next-month:hover {
  color: #0056b3;
}

/* Bordure autour du jour courant */
.flatpickr-day.today {
  border: 2px solid #007bff;
}
</style>

