<template>
  <!-- Première cellule vide pour la colonne fixe -->
  <div class="p-2 bg-white" :style="{ gridColumn: `span 1` }"></div>

  <!-- Pour chaque jour, pour chaque heure générée, on affichera l'heure avec un fond conditionnel -->
  <template v-for="(month, mIndex) in monthsArray" :key="'month-' + mIndex">
    <div 
      :class="[
        'bg-gray-200 rounded-2xl p-1 font-bold mb-1 truncate',
        { 'ml-1': mIndex !== 0 }
      ]"
      :style="{ gridColumn: `span ${monthSpan(month, mIndex)}` }"
    >
      {{ formatMonth(month) }}
    </div>
  </template>
    
</template>

<script>

export default{
  props:{
    monthsArray: Array,
    slotsLength: Number,
    selectedView: String
  },
  methods:{
    monthSpan(month, mIndex){
      let minus = 0;
      if(this.selectedView === 'Jour'){ 
        if(mIndex === 0){ minus++;}
        if(mIndex === this.monthsArray.length - 1){ minus++;}
      }

      return (this.slotsLength * month.days) - minus;
    },
    formatMonth(month) {
      let formatted;
      if (this.selectedView === 'Année') {
        formatted = month.number;
      }
      else {
        formatted = month.number;
      }
      return formatted;
    }
  }
}

</script>