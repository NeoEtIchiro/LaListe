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

    <!-- Intégration du PlanningGrid -->
    <PlanningGrid
      :rows="rows"
      :hours="hours"
      :events="events"
      :startDate="dateDebut"
      :endDate="dateFin"
      @cell-clicked="handleCellClicked"
    />
  </div>
</template>

<script>
import ViewSelector from '@/components/Planning/ViewSelector.vue';
import NavigationButtons from '@/components/Planning/NavigationButtons.vue';
import PlanningGrid from '@/components/Planning/PlanningGrid.vue';

export default {
  components: {
    ViewSelector,
    NavigationButtons,
    PlanningGrid
  },
  data() {
    return {
      views: ['Jour', 'Semaine', 'Mois', 'Année'],
      selectedView: 'Jour',
      selectedRows: 'Ressources',
      hours: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      rows: [
        { id: 'r1', name: 'Resource 1' },
        { id: 'r2', name: 'Resource 2' },
        { id: 'r3', name: 'Resource 3' }
      ],
      events: [
        { resourceId: 'r1', hour: '09:00', title: 'Réunion' },
        { resourceId: 'r2', hour: '14:00', title: 'Entretien' }
      ],
      dateDebut: new Date(),
      dateFin: new Date()
    };
  },
  methods: {
    setView(view) {
      this.selectedView = view;
    },
    navigateDay(direction) {
      // Implémentez la navigation (ex: décalage de dateDebut)
      console.log("Naviguer d'un jour :", direction);
    },
    updateStartDate(newDate) {
      this.dateDebut = newDate;
    },
    handleCellClicked({ resource, hour }) {
      console.log("Cellule cliquée pour", resource, "à", hour);
      // Ici, vous pourriez ouvrir un modal pour créer/modifier un événement
    }
  },
  mounted() {
    
  },
};
</script>

<style scoped>

</style>
