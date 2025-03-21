<template>
  <div class="w-full overflow-x-hidden overflow-y-auto" @wheel="handleWheel">
    <div :style="gridStyle">
      <YearsRow v-if="selectedView == 'Année'"
        :yearsArray="yearsArray" 
        :slotsLength="slotsForADay.slots.length"
        :selectedView="selectedView"
      />

      <MonthsRow
        :monthsArray="monthsArray" 
        :slotsLength="slotsForADay.slots.length"
        :selectedView="selectedView"
      />

      <WeeksRow v-if="selectedView != 'Jour'"
        :weeksArray="weeksArray" 
        :slotsLength="slotsForADay.slots.length"
        :selectedView="selectedView"
      />
      
      <DaysRow v-if="selectedView != 'Année'"
        :daysArray="daysArray" 
        :slotsLength="slotsForADay.slots.length"
        :selectedView="selectedView"
      />

      <HourRow v-if="selectedView == 'Jour'"
        :daysLength="daysArray.length"
        :slotGroups="slotsForADay.slotGroups"
        :slotInterval="slotInterval"
        :hourMaxTime="hourMaxTime"
      />

      <PlanningRow v-for="row in rows" 
        :key="row.id" 
        :row="row"
        :daysLength="daysArray.length"
        :slots="slotsForADay.slots"
      />
    </div>
  </div>
</template>

<script>
import PlanningRow from './Rows/PlanningRow.vue';
import HourRow from './Rows/HourRow.vue';
import DaysRow from './Rows/DaysRow.vue';
import WeeksRow from './Rows/WeeksRow.vue';
import MonthsRow from './Rows/MonthsRow.vue';
import YearsRow from './Rows/YearsRow.vue';

export default {
  name: "PlanningGrid",
  components: {
    PlanningRow,
    HourRow,
    DaysRow,
    WeeksRow,
    MonthsRow,
    YearsRow
  },
  props: {
    startDate:  Date,
    endDate:  Date,
    startHour:  Number,
    endHour:  Number,
    rows:  Array,
    selectedView:  String,
    daysArray:  Array,
    weeksArray:  Array,
    monthsArray:  Array,
    yearsArray:  Array
  },
  data() {
    return {
      hourMaxTime: 60,
      slotInterval: 15
    };
  },
  computed: {
    slotsForADay(){
      const slots = [];
      const slotGroups = [];

      // Fonction pour ajouter un slot inactif
      const addInactiveSlot = (start, end) => {
        const slot = this.generateInactiveTimeSlot(start, end);
        if (slot) {
          slots.push(slot);
          slotGroups.push({
            startHour: slot.startMinute,
            endHour: slot.endMinute,
            span: 1,
            active: false
          });
        }
      };

      // Fonction pour ajouter des slots actifs
      const addActiveSlots = (start, end) => {
        const activeSlots = this.generateActiveSlot(start, end);
        if (activeSlots.length > 0) {
          slots.push(...activeSlots);
          slotGroups.push({
            startHour: activeSlots[0].startMinute,
            endHour: activeSlots[activeSlots.length - 1].endMinute,
            span: activeSlots.length,
            active: true
          });
        }
      };

      if (this.startHour < this.endHour) {
        this.selectedView == "Jour" ? addInactiveSlot(0, this.startHour * 60) : null;
        addActiveSlots(this.startHour * 60, this.endHour * 60);
        this.selectedView == "Jour" ? addInactiveSlot(this.endHour * 60, 3600) : null;
      } else {
        if (this.selectedView == "Jour") {
          addActiveSlots(this.endHour * 60, this.startHour * 60);
        } else {
          addActiveSlots(0, this.endHour * 60);
          addInactiveSlot(this.endHour * 60, this.startHour * 60);
          addActiveSlots(this.startHour * 60, 3600);
        }
      }
      
      return { slots, slotGroups };
    },
    gridStyle() {
      const inactiveWidth = 50 / this.daysArray.length; // Largeur fixe pour les slots inactifs
      const columns = ['200px']; // colonne fixe pour l'en-tête (ex. la ressource)
      const { slots: daySlots } = this.slotsForADay;
      let slots = [];
      // On s'assure que daysArray contient 7 jours (ou le nombre voulu)
      for (let i = 0; i < this.daysArray.length; i++) {
        slots.push(...daySlots);
      }
      
      if(!slots[0].active){
        slots.shift();
        slots.pop();
      }

      // Nombre de slots inactifs
      const inactiveCount = slots.filter(s => !s.active).length;
      
      // Calcul du temps total (en minutes) pour les slots actifs
      const activeSlots = slots.filter(s => s.active);
      const totalDuration = activeSlots.reduce((acc, s) => acc + (s.endMinute - s.startMinute), 0);
      
      // Espace disponible pour les slots actifs : réductions des 200px fixes + 25px par slot inactif
      const availableActiveWidth = `calc(100% - ${columns[0]} - ${inactiveCount * inactiveWidth}px)`;
      
      slots.forEach(s => {
        if (!s.active) {
          // Pour chaque slot inactif, largeur fixe de 25px
          columns.push(`${inactiveWidth}px`);
        } else {
          // Pour un slot actif, on calcule sa largeur proportionnelle à sa durée
          const duration = s.endMinute - s.startMinute;
          // On s'assure de ne pas diviser par zéro
          if (totalDuration > 0) {
            columns.push(`calc(${availableActiveWidth} * (${duration} / ${totalDuration}))`);
          } else {
            columns.push('0px');
          }
        }
      });
      
      return {
        display: "grid",
        width: "100%",
        gridTemplateColumns: columns.join(' '),
        gridTemplateRows: `auto auto repeat(${this.rows.length}, auto)`
      };
    },
    calculateSlotsProperties() {
      const dateDiff = this.endDate - this.startDate;
      const days = Math.round(dateDiff / (1000 * 60 * 60 * 24)) + 1;
      
      const config = [
        { maxDays: 1, slotInterval: 15, hourMaxTime: 60 },
        { maxDays: 2, slotInterval: 15, hourMaxTime: 120 },
        { maxDays: 3, slotInterval: 30, hourMaxTime: 120 },
        { maxDays: 4, slotInterval: 30, hourMaxTime: 180 },
        { maxDays: 5, slotInterval: 30, hourMaxTime: 180 },
        { maxDays: 6, slotInterval: 30, hourMaxTime: 180 },
        { maxDays: 14, slotInterval: 60, hourMaxTime: 180 },
        { maxDays: 28, slotInterval: 180, hourMaxTime: 180 },
        { maxDays: 60, slotInterval: 60 * 24, hourMaxTime: 240 },
        { maxDays: 90, slotInterval: 60 * 24, hourMaxTime: 240 },
        { maxDays: 180, slotInterval: 60 * 24, hourMaxTime: 240 },
        { maxDays: 365, slotInterval: 60 * 24, hourMaxTime: 240 },
        { maxDays: Infinity, slotInterval: 60 * 24, hourMaxTime: 240 }
      ];

      const selectedConfig = config.find(cfg => days <= cfg.maxDays);
      this.slotInterval = selectedConfig.slotInterval;
      this.hourMaxTime = selectedConfig.hourMaxTime;
    }
  },
  methods: {
    // compute les heures en fonction du jour (dIndex)
    generateInactiveTimeSlot(start, end) {
      if(start - end == 0) return null;
      return {startMinute: start, endMinute: end, active: false}; 
    },
    generateActiveSlot(start, end){
      const slots = [];
      // On bloucle de la première minutes à la dernière
      let actMinute = start;
      while (actMinute < end) {
        const slot = {startMinute: actMinute, endMinute: actMinute, active: true};

        const mDif = actMinute % this.slotInterval;
        if(mDif != 0) actMinute += this.slotInterval - mDif;
        
        actMinute += this.slotInterval;

        slot.endMinute = actMinute;

        slots.push(slot);
      }

      slots[slots.length - 1].endMinute = end;
      
      return slots;
    },
    handleWheel(event) {
      // Empêche le scroll vertical si nécessaire
      event.preventDefault();

      if (event.deltaY < 0) {
        // Zoom in
        this.$emit("navigate", "zoom");
      } else if (event.deltaY > 0) {
        // Dezoom
        this.$emit("navigate", "dezoom");
      }
    }
  },
  watch: {
    startDate(newVal, oldVal) {
      this.calculateSlotsProperties;
    },
    endDate(newVal, oldVal) {
      this.calculateSlotsProperties;
    }
  }
};
</script>

<style scoped>
/* Vous pouvez ajouter des ajustements spécifiques si besoin */
</style>