<template>
  <!-- Première cellule vide pour la colonne fixe -->
  <div class="p-2 bg-white" :style="{ gridColumn: `span 1` }"></div>

  <!-- Pour chaque jour, pour chaque heure générée, on affichera l'heure avec un fond conditionnel -->
  <template v-for="(week, wIndex) in weeksArray" :key="'week-' + wIndex">
    <div 
      :class="[
        'bg-gray-200 p-1 font-bold truncate',
        { 'ml-1': dIndex !== 0 && selectedView !== 'Année' },
        { 'rounded-2xl mb-1': selectedView !== 'Année', 'rounded-t-xl': selectedView == 'Année' }
      ]"
      :style="{ gridColumn: `span ${weekSpan(week, wIndex)}` }"
    >
      {{ formatWeek(week) }}
    </div>
  </template>
    
</template>

<script>

export default{
  props:{
    weeksArray: Array,
    slotsLength: Number,
    selectedView: String
  },
  methods:{
    weekSpan(week, wIndex){
      let minus = 0;
      if(this.selectedView === 'Jour'){ 
        if(wIndex === 0){ minus++;}
        if(wIndex === this.weeksArray.length - 1){ minus++;}
      }

      return (this.slotsLength * week.days) - minus;
    },
    formatWeek(week) {
      let formatted;
      if (this.selectedView === 'Année') {
        formatted = "S." + week.number;
      }
      else {
        formatted = "Semaine " + week.number;
      }
      return formatted;
    }
  }
}

</script>