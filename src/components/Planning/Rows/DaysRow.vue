<template>
  <!-- Première cellule vide pour la colonne fixe -->
  <div class="p-2 bg-white" :style="{ gridColumn: `span 1` }"></div>

  <!-- Pour chaque jour, pour chaque heure générée, on affichera l'heure avec un fond conditionnel -->
  <template v-for="(day, dIndex) in daysArray" :key="'day-' + dIndex">
    <div 
      :class="[
        'bg-gray-200 p-1 font-bold truncate h-8',
        { 'ml-1': dIndex !== 0 && selectedView == 'Jour' },
        { 'rounded-2xl mb-1': selectedView === 'Jour', 'rounded-t-xl': selectedView !== 'Jour' }
      ]"
      :style="{ gridColumn: `span ${daySpan(dIndex)}` }"
    >
      {{ formatDate(day) }}
    </div>
  </template>
    
</template>

<script>

export default{
  props:{
    daysArray: Array,
    slotsLength: Number,
    selectedView: String
  },
  methods:{
    daySpan(dIndex){
      let minus = 0;
      if(this.selectedView === 'Jour'){ 
        if(dIndex === 0){ minus++;}
        if(dIndex === this.daysArray.length - 1){ minus++;}
      }

      return this.slotsLength - minus;
    },
    formatDate(date) {
      let formatted;
      if (this.selectedView === 'Jour') {
        formatted = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' });
      } else if (this.selectedView === 'Semaine') {
        formatted = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
      } else if (this.selectedView === 'Mois') {
        formatted = date.toLocaleDateString('fr-FR', { day: 'numeric' });
      }
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }
  }
}

</script>