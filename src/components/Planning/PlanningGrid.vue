<template>
  <div class="w-full overflow-x-hidden overflow-y-auto" @wheel="handleWheel">
    <div :style="gridStyle">
      <!-- Ligne 1 : En-tête des jours -->
      <!-- Pour chaque jour, une cellule qui s'étend sur toutes les colonnes correspondant à ce jour -->

      <!-- Ligne 2 : En-tête des heures -->
      <template v-if="selectedView == 'Jour'">
        <!-- Première cellule vide pour la colonne fixe -->
        <div class="border p-2 bg-white" :style="{ gridColumn: `span 1` }"></div>
        <!-- Pour chaque jour, pour chaque heure générée, on affichera l'heure avec un fond conditionnel -->
        <template v-for="(dayItem, dIndex) in daysArray" :key="'hour-row-' + dIndex">
          <template v-for="(slotGroup, sIndex) in slotsForADay.slotGroups" :key="'day-slot-group-' + sIndex">
            <div v-if="!(dIndex === 0 && sIndex === 0 && !slotGroup.active) && !(dIndex === daysArray.length - 1 && sIndex === slotsForADay.slotGroups.length - 1 && !slotGroup.active)"
              class="border pt-2 text-left flex text-sm font-bold bg-gray-200 rounded-t-xl"
              :style="{ gridColumn: `span ${slotGroup.span}` }"
            >
              <div
                style="display: grid; width: 100%;"
                :style="{ gridTemplateColumns: `repeat(${slotGroup.span}, 1fr)` }"
              >
                <div v-for="hourSub in hourSubdivision(slotGroup)" :key="hourSub" class="flex gap-1 text-xs text-gray-600"
                      style="width: 100%;"
                      :style="{ gridColumn: `span ${hourSub.span}` }"      
                >
                  <div class="w-[1px] m-0 bg-gray-500 h-full"></div>
                  <div>{{ ("0" + Math.floor(hourSub.startHour / 60)).slice(-2) }}:{{ ("0" + (hourSub.startHour % 60)).slice(-2) }}</div>
                </div>
              </div>
            </div>
          </template>
        </template>
      </template>

      <!-- Lignes pour chaque ressource -->
      <template v-for="(row, rIndex) in rows" :key="row.id">
        <!-- Colonne avec le nom de la ressource -->
        <div class="border p-2 bg-gray-200 font-bold">
          {{ row.name }}
        </div>
        <!-- Pour chaque jour -->
        <template v-for="(dayItem, dIndex) in daysArray" :key="'res-day-' + rIndex + '-' + dIndex">
          <!-- Pour chaque créneau -->
            <template v-for="(slot, sIndex) in slotsForADay.slots" :key="'res-' + rIndex + '-day-' + dIndex + '-slot-' + slot.startMinute">
              <div v-if="!(dIndex === 0 && sIndex === 0 && !slot.active) && !(dIndex === daysArray.length - 1 && sIndex === slotsForADay.slots.length - 1 && !slot.active)"
                   :class="[
                     slot.active ? 'bg-white' : 'bg-gray-300',
                     'border',
                     'hover:bg-blue-100',
                     'cursor-pointer',
                     'w-full',
                     'min-w-0',
                     'col-span-1'
                   ]"
                   class="p-0">
              </div>
            </template>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlanningGrid",
  props: {
    startDate: { 
      type: Date,
      required: true
    },
    endDate: {  
      type: Date,
      required: true
    },
    startHour: {
      type: Number,
      required: true
    },
    endHour: {
      type: Number,
      required: true
    },
    rows: {
      type: Array,
      default: () => [],
      validator: (value) => value.every(item => item.hasOwnProperty('name'))
    },
    events: {
      type: Array,
      default: () => []
    },
    selectedView: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      days: [],
      hourMaxTime: 60,
      slotInterval: 15
    };
  },
  computed: {
    // Génère un tableau de dates allant de startDate à endDate (inclus)
    daysArray() {
      if(this.days.length === 0) {
        const current = new Date(this.startDate);
        while (current <= this.endDate) {
          this.days.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
        return this.days;
      }

      if(this.startDate > this.days[0]) this.days.shift();
      else if (this.startDate < this.days[0]) this.days.unshift(this.startDate);

      if(this.endDate < this.days[this.days.length - 1]) this.days.pop();
      else if (this.endDate > this.days[this.days.length - 1]) this.days.push(this.endDate);

      return this.days;
    },
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
        addInactiveSlot(0, this.startHour * 60);
        addActiveSlots(this.startHour * 60, this.endHour * 60);
        addInactiveSlot(this.endHour * 60, 3600);
      } else {
        addActiveSlots(0, this.endHour * 60);
        addInactiveSlot(this.endHour * 60, this.startHour * 60);
        addActiveSlots(this.startHour * 60, 3600);
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
        if(mDif != 0) actMinute -= mDif;
        
        actMinute += this.slotInterval;

        slot.endMinute = actMinute;

        slots.push(slot);
      }

      slots[slots.length - 1].endMinute = end;
      
      return slots;
    },
    hourSubdivision(slotGroup){
      const hourSub = [];

      let hourM = slotGroup.startHour;
      while (hourM < slotGroup.endHour) {
        const hourGroup = {startHour: hourM, endHour: hourM, span: 0, colored: false};
        
        let actM = hourM % 60;

        while (actM < this.hourMaxTime) {
          if(actM % this.slotInterval != 0){
            actM -= actM % this.slotInterval;
          }

          actM += this.slotInterval;
          hourM += this.slotInterval;

          hourGroup.endHour = hourM;
          hourGroup.span++;
        }

        hourSub.push(hourGroup);
      }

      console.log(hourSub);
      return hourSub;
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
    },
    calculateSlotsProperties() {
      const dateDiff = this.endDate - this.startDate;
      const days = Math.round(dateDiff / (1000 * 60 * 60 * 24)) + 1;
      
      if (days <= 1) {
        this.slotsPerHour = 4;
        this.slotTime = 15;
      } else if (days <= 2) {
        this.slotsPerHour = 4;
        this.slotTime = 30;
      } else if (days <= 4) {
        this.slotsPerHour = 8;
        this.slotTime = 30;
      } else if (days <= 6) {
        this.slotsPerHour = 8;
        this.slotTime = 60;
      } else if (days <= 28) {
        this.slotsPerHour = 4;
        this.slotTime = 60 * 4;
      }
    }
  },
  mounted(){
    
  },
  watch: {
    endDate() {
      this.calculateSlotsProperties();
    }
  }
};
</script>

<style scoped>
/* Vous pouvez ajouter des ajustements spécifiques si besoin */
</style>