<!-- PlanningPage.vue -->
<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="m-0 text-2xl select-none">Planning</h1>

      <!-- Sélecteur de vue -->
      <ViewSelector :views="views" :selectedView="selectedView" @change-view="setView" />

      <!-- Boutons de navigation -->
      <NavigationButtons 
        @navigate="navigateDay" 
        :selectedView="selectedView" 
        :dateDebut="dateDebut" 
        @update-date="updateStartDate"
      />
    </div>

  </div>
</template>

<script>
import ViewSelector from '@/components/Planning/ViewSelector.vue';
import NavigationButtons from '@/components/Planning/NavigationButtons.vue';

export default {
  components: {
    ViewSelector,
    NavigationButtons
  },
  data() {
    return {
      views: ['Jour', 'Semaine', 'Mois', 'Année'],
      selectedView: 'Jour',
      selectedRows: 'Ressources',
      hours: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      rows: [],
      dateDebut: new Date(new Date().setHours(8,0,0,0)),
      dateFin: new Date(new Date().setHours(19,0,0,0))
    };
  },
  methods: {
    setView(view) {
      this.selectedView = view;
    },
  },
  mounted() {
    
  },
};
</script>

<style scoped>

</style>
