<template>
  <!-- Première cellule vide pour la colonne fixe -->
  <div class="p-2 bg-white" :style="{ gridColumn: `span 1` }"></div>

  <!-- Pour chaque jour, pour chaque heure générée, on affichera l'heure avec un fond conditionnel -->
  <template v-for="(month, mIndex) in monthsArray" :key="'month-' + mIndex">
    <div 
      @click="$emit('go-to', {date: month.startDate, view: 'Mois'})"
      :class="[
        'bg-gray-200 rounded-2xl p-1 font-bold mb-1 truncate h-8 select-none cursor-pointer hover:bg-gray-300',
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
  emits: ['go-to'],
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
      const formatter = new Intl.DateTimeFormat('fr-FR', { month: 'long' });
      const date = new Date();
      date.setMonth(month.number); // `month.number` est supposé être le numéro du mois (0-11)

      if(this.selectedView != 'Année'){
        return formatter.format(date).charAt(0).toUpperCase() + formatter.format(date).slice(1) + ' ' + month.year;
      }

      return formatter.format(date).charAt(0).toUpperCase() + formatter.format(date).slice(1);
    }
  }
}

</script>