<template>
  <div>
    <button
      class="header-button"
      @mousedown="startPress('previous')"
      @mouseup="stopPress"
      @mouseleave="stopPress"
    >
      ◄
    </button>
    <flat-pickr
      class="date-input"
      v-model="selectedDate"
      :config="flatpickrOptions"
      @on-change="updateDate"
    />
    <button
      class="header-button"
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
      selectedDate: this.dateDebut, // Liaison avec Flatpickr
      pressInterval: null,
      pressTimeout: null,
      speed: 200,
      initialDelay: 200,
      flatpickrOptions: {
        dateFormat: 'Y-m-d', // Format YYYY-MM-DD
        disableMobile: true, // Désactiver le sélecteur natif mobile
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
    selectedView: 'changeSpeed',
  },
  mounted() {
    this.changeSpeed();
  },
};
</script>

<style scoped>
.navigation-buttons {
  display: flex;
  align-items: center;
}
.header-button {
  border: none;
  vertical-align: middle;
  background-color: #eaeaea;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 1.5em;
  width: 40px;
  height: 40px;
}
.date-input {
  border: none;
  vertical-align: middle;
  font-size: 1.2em;
  text-align: center;
  margin: 0 8px;
  width: 150px;
  height: 40px;
}
</style>
