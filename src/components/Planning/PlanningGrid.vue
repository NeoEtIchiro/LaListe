<!-- filepath: /c:/Users/Néo/Desktop/Bordel/Programme/Vue.js/Vue.js/LaListe/src/components/planning/PlanningGrid.vue -->
<template>
  <div class="w-full overflow-x-hidden overflow-y-auto">
    <div :style="gridStyle">
      <!-- Ligne 1 : En-tête des jours -->
      <!-- Première cellule vide pour la colonne fixe (noms de ressources) -->
      <div class="border p-2 bg-white" style="grid-column: 1 / 2;"></div>
      <!-- Pour chaque jour, une cellule qui s'étend sur toutes les colonnes correspondant à ce jour -->
      <template v-for="(dayItem, dIndex) in daysArray" :key="'day-' + dIndex">
        <div class="p-[1px]"
          :style="{ gridColumn: `span ${computedSlots(dIndex).length}` }">
          <div class="border p-2 bg-gray-200 font-bold text-center rounded-xl">
            {{ formatDate(dayItem) }}
          </div>
        </div>
      </template>

      <!-- Ligne 2 : En-tête des heures -->
      <!-- Première cellule vide pour la colonne fixe -->
      <div class="border p-2 bg-white" style="grid-column: 1 / 2;"></div>

      <!-- Pour chaque jour, pour chaque heure générée, on affichera l'heure avec un fond conditionnel -->
      <template v-for="(dayItem, dIndex) in daysArray" :key="'hour-row-' + dIndex">
        <template v-for="(slot, sIndex) in computedSlots(dIndex)" :key="'day-' + dIndex + 'slot-' + sIndex">
          <div v-if="sIndex%slotsPerHour == 0" class="border py-2 text-center p-0 text-sm font-bold bg-gray-200 rounded-t-xl"
               :style="{ gridColumn: `span ${slotSpan(dIndex, sIndex)}` }">
            {{ slot }}
          </div>
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
          <template v-for="slot in computedSlots(dIndex)" :key="'res-' + rIndex + '-day-' + dIndex + '-slot-' + slot">
            <div :class="[ 
                    'border', 'hover:bg-blue-100', 'cursor-pointer', 
                    'w-full', 'min-w-0', hourClass(slot)
                  ]"
                  class="p-0"
                  @click="cellClicked(row, formatTime(slot))">
              <!-- Optionnel : affichage éventuel d'un événement -->
              <div v-if="getEventFor(row, formatTime(slot))"
                    class="bg-blue-500 text-white p-1 rounded text-xs">
                {{ getEventFor(row, formatTime(slot)).title }}
              </div>
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
    }
  },
  data() {
    return {
      slotsPerHour: 4
    };
  },
  computed: {
    // Génère un tableau de dates allant de startDate à endDate (inclus)
    daysArray() {
      const days = [];
      const current = new Date(this.startDate);
      while (current <= this.endDate) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      return days;
    },
    gridStyle() {
      let totalDynamicColumns = 0;
      // Pour chaque jour, on prend le nombre de colonnes selon computedHours(dIndex) multiplié par slotsPerHour
      for (let i = 0; i < this.daysArray.length; i++) {
        totalDynamicColumns += this.computedSlots(i).length;
      }
      return {
        display: "grid",
        width: "100%",
        gridTemplateColumns: `200px repeat(${totalDynamicColumns}, calc((100% - 200px) / ${totalDynamicColumns}))`,
        gridTemplateRows: `auto auto repeat(${this.rows.length}, auto)`
      };
    }
  },
  methods: {
    // compute les heures en fonction du jour (dIndex)
    computedSlots(dIndex) {
      const slots = [];
      const slotTime = 60;
      
      // Valeurs par défaut : de 0 à 24
      let startMinute = 0;
      let endMinute = 24 * 60;
      // Pour le premier jour, on commence à this.startHour
      if (dIndex === 0) {
        startMinute = this.startHour * 60;
      }
      // Pour le dernier jour, on s'arrête à this.endHour
      if (dIndex === this.daysArray.length - 1) {
        endMinute = this.endHour * 60;
      }

      for (let m = startMinute; m < endMinute; m += slotTime) {
        const minutePart = m % 60;
        const hourPart = (m - minutePart) / 60;
        slots.push(String(hourPart).padStart(2, "0") + ":" + String(minutePart).padStart(2, "0"));
      }
      console.log(slots);
      return slots;
    },
    slotSpan(dIndex, sIndex){
      const slotLength = this.computedSlots(dIndex).length;

      if(sIndex + this.slotsPerHour > slotLength){
        return slotLength - sIndex;
      }

      return this.slotsPerHour;
    },
    hourClass(slot) {
      const hNum = parseInt(slot.split(":")[0], 10);
      const activeStart = this.startHour;
      const activeEnd = this.endHour;

      if(hNum < activeStart || hNum >= activeEnd){
        return "bg-gray-300";
      }
      if(hNum % 2 == 1){
        return "bg-gray-200";
      }
      return "bg-white";
    },
    formatTime(slot) {
      const [h,m] = slot.split(':');
      return `${h}:${m}`;
    },
    formatDate(dateObj) {
      return dateObj.toLocaleDateString();
    },
    getEventFor(row, time) {
      return this.events.find(ev => ev.rowId === row.id && ev.time === time);
    },
    cellClicked(row, time) {
      this.$emit("cell-clicked", { row, time });
    }
  }
};
</script>

<style scoped>
/* Vous pouvez ajouter des ajustements spécifiques si besoin */
</style>