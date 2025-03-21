<template>
    <!-- Première cellule vide pour la colonne fixe -->
    <div class="p-2 bg-white" :style="{ gridColumn: `span 1` }"></div>
  
    <!-- Pour chaque jour, pour chaque heure générée, on affichera l'heure avec un fond conditionnel -->
    <template v-for="(year, yIndex) in yearsArray" :key="'year-' + yIndex">
      <div 
        :class="[
          'bg-gray-200 rounded-2xl p-1 font-bold mb-1 truncate h-8',
          { 'ml-1': yIndex !== 0 }
        ]"
        :style="{ gridColumn: `span ${yearSpan(year, yIndex)}` }"
      >
        {{ formatYear(year) }}
      </div>
    </template>
      
  </template>
  
  <script>
  
  export default{
    props:{
      yearsArray: Array,
      slotsLength: Number,
      selectedView: String
    },
    methods:{
      yearSpan(year, yIndex){
        let minus = 0;
        if(this.selectedView === 'Jour'){ 
          if(yIndex === 0){ minus++;}
          if(yIndex === this.yearsArray.length - 1){ minus++;}
        }
  
        return (this.slotsLength * year.days) - minus;
      },
      formatYear(year) {
        return year.number;
      }
    }
  }
  
  </script>