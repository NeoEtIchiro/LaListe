<!-- filepath: /c:/Users/Néo/Desktop/Bordel/Programme/Vue.js/Vue.js/LaListe/src/components/planning/PlanningGrid.vue -->
<template>
  <div class="w-full overflow-x-hidden overflow-y-auto">
    <div :style="gridStyle">
      <!-- Ligne 1 : En-tête des jours -->
      <!-- Première cellule vide pour la colonne fixe (noms de ressources) -->
      <div class="border p-2 bg-gray-200" style="grid-column: 1 / 2;"></div>
      <!-- Pour chaque jour, une cellule qui s'étend sur toutes les colonnes correspondant à ce jour -->
      <template v-for="(dayItem, dIndex) in daysArray" :key="'day-' + dIndex">
        <div class="border p-2 bg-gray-200 font-bold text-center"
             :style="{ gridColumn: `span ${hours.length * slotsPerHour}` }">
          {{ formatDate(dayItem) }}
        </div>
      </template>

      <!-- Ligne 2 : En-tête des heures -->
      <!-- Première cellule vide pour la colonne fixe -->
      <div class="border p-2 bg-gray-200" style="grid-column: 1 / 2;"></div>
      <!-- Pour chaque jour, pour chaque heure, une cellule étendue sur le nombre de créneaux pour cette heure -->
      <template v-for="(dayItem, dIndex) in daysArray" :key="'hour-row-' + dIndex">
        <template v-for="(hour, hIndex) in hours" :key="'hour-' + dIndex + '-' + hIndex">
          <div class="border p-2 bg-gray-200 text-center font-bold"
               :style="{ gridColumn: `span ${slotsPerHour}` }">
            {{ hour }}
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
          <!-- Pour chaque heure -->
          <template v-for="(hour, hIndex) in hours" :key="'res-day-' + rIndex + '-' + dIndex + '-hour-' + hIndex">
            <!-- Pour chaque créneau -->
            <template v-for="slot in slotsPerHour" :key="'res-' + rIndex + '-day-' + dIndex + '-hour-' + hIndex + '-slot-' + slot">
              <div :class="[
                      'border', 'hover:bg-blue-100', 'cursor-pointer', 
                      'w-full', 'min-w-0', 
                      // Alterne la couleur de fond selon hIndex
                      hIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                    ]"
                   class="p-0"
                   @click="cellClicked(row, formatTime(hour, slot-1))">
                <!-- Optionnel : affichage éventuel d'un événement -->
                <div v-if="getEventFor(row, formatTime(hour, slot-1))"
                     class="bg-blue-500 text-white p-1 rounded text-xs">
                  {{ getEventFor(row, formatTime(hour, slot-1)).title }}
                </div>
              </div>
            </template>
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
        startDate: { // Date de début (instance de Date)
            type: Date,
            required: true
        },
        endDate: {  // Date de fin (instance de Date)
            type: Date,
            required: true
        },
        rows: {
            type: Array,
            default: () => []
        },
        // Ex. : ["08:00", "09:00", ...]
        hours: {
            type: Array,
            default: () => []
        },
        // Chaque événement doit comporter rowId et time (ex: "08:05")
        events: {
            type: Array,
            default: () => []
        }
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
        // Si un seul jour alors 12 slots par heure, sinon slotsPerHour = 12 divisé par le nombre de jours
        slotsPerHour() {
            const dayCount = this.daysArray.length; 
            return dayCount === 1 ? 12 : Math.floor(12 / dayCount);
        },
        gridStyle() {
            // Calcul du nombre total de colonnes dynamiques
            // Pour chaque jour, pour chaque heure, il y a slotsPerHour colonnes
            const totalDynamicColumns = this.daysArray.length * this.hours.length * this.slotsPerHour;
            return {
                display: "grid",
                width: "100%",
                // La première colonne est fixe à 200px, puis on répartit uniformément l'espace restant
                gridTemplateColumns: `200px repeat(${totalDynamicColumns}, calc((100% - 200px) / ${totalDynamicColumns}))`,
                // On a 2 lignes d'en-tête (jours et heures) puis une ligne par ressource
                gridTemplateRows: `auto auto repeat(${this.rows.length}, auto)`
            };
        }
    },
    methods: {
        // Format d'une heure et d'un créneau : ex. pour "08:00" et slotIndex 2 => "08:10"
        formatTime(hour, slotIndex) {
            const [h,] = hour.split(':');
            const minutes = String(slotIndex * 5).padStart(2, '0');
            return `${h}:${minutes}`;
        },
        // Formate la date en chaîne (ex. "Lundi 12/04/2025")
        formatDate(dateObj) {
            return dateObj.toLocaleDateString();
        },
        getEventFor(row, time) {
            return this.events.find(ev => ev.rowId === row.id && ev.time === time);
        },
        cellClicked(row, time) {
            this.$emit("cell-clicked", { row, time });
        }
    },
    mounted() {
        console.log("PlanningGrid monté !");
        console.log(this.rows);
    }
};
</script>

<style scoped>
/* Vous pouvez ajouter des ajustements spécifiques si besoin */
</style>