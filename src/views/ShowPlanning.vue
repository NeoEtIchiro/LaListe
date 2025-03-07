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

    <!-- Conteneur scrollable pour le tableau -->
    <div class="w-full">
      <table>
        <TimeRows ref="timeRows"
                  :hours="hours" 
                  :dateDebut="dateDebut" 
                  :dateFin="dateFin" 
                  :selectedView="selectedView" 
                  @change-view="setView"
                  @change-rows="fetchRows"
        />
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <RessourceRow
              :row="row"
              :hours="hours"
              :dateDebut="dateDebut"
              :dateFin="dateFin"
              :startOfEvent="useStartOfEvent"
              :openPopup="openPopup"
              :selectedView="selectedView"
            />
          </tr>
        </tbody>
      </table>
    </div>

    <EventsManager ref="events" :dateDebut="dateDebut" :dateFin="dateFin" :selectedRow="selectedRows"/>
  </div>
</template>

<script>
import ViewSelector from '@/components/Planning/ViewSelector.vue';
import NavigationButtons from '@/components/Planning/NavigationButtons.vue';
import TimeRows from '@/components/Planning/TimeRows.vue';
import RessourceRow from '@/components/Planning/RessourceRow.vue';
import EventsManager from '@/components/Planning/Events/EventsManager.vue';
import {
  addRessource,
  fetchRessources,
  updateRessource,
  deleteRessource,
} from '@/services/ressourceService';
import { fetchTaches } from '@/services/taskService';

export default {
  components: {
    ViewSelector,
    NavigationButtons,
    TimeRows,
    RessourceRow,
    EventsManager,
  },
  data() {
    return {
      views: ['Jour', 'Semaine', 'Mois', 'Année'],
      selectedView: 'Jour',
      selectedRows: 'Ressources',
      hours: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      rows: [],
      selectedRes: { id: '', name: '' },
      dateDebut: new Date(new Date().setHours(8,0,0,0)),
      dateFin: new Date(new Date().setHours(19,0,0,0)),
      isPopupVisible: false,
    };
  },
  methods: {
    updateStartDate(date){
      this.dateDebut = new Date(date);
      this.dateDebut.setHours(8,0,0,0);

      this.dateFin = this.calculateEndDate(this.selectedView, new Date(this.dateDebut));
    },
    setView(view, date) {
      if (view == 'Null') return;
      this.selectedView = view;

      // Si une date est spécifiée, l'utiliser pour définir le début et ajuster la période
      if (date) {
        this.dateDebut = this.adjustStartDate(this.selectedView, new Date(date));
      }

      // Calculer la fin de la période selon la vue sélectionnée
      this.dateFin = this.calculateEndDate(this.selectedView, new Date(this.dateDebut));
    },
    async fetchRows(newRows) {
      this.selectedRows = newRows;
      
      switch(this.selectedRows){
        case 'Ressource':
          this.rows = await fetchRessources();
          break;
        case 'Tâches':
          this.rows = await fetchTaches();
          break;
        case 'Équipe':
          break;
        default:
          break;
      }
    },
    adjustStartDate(view, date) {
      // Ajuster la date de début selon la vue
      const adjustedDate = new Date(date);
      switch (view) {
        case 'Semaine':
          // Calcul pour ISO 8601 : lundi comme début de la semaine
          const day = adjustedDate.getDay(); // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
          const offset = day === 0 ? -6 : 1 - day; // Dimanche (-6), sinon (1 - day)
          adjustedDate.setDate(adjustedDate.getDate() + offset);
          break;
        case 'Mois':
          // Début du mois
          adjustedDate.setDate(1);
          break;
        case 'Année':
          // Début de l'année
          adjustedDate.setMonth(0);
          adjustedDate.setDate(1);
          break;
      }

      return adjustedDate;
    },
    calculateEndDate(view, startDate) {
      // Calculer la date de fin en fonction de la vue
      const endDate = new Date(startDate);

      switch (view) {
        case 'Jour':
          break; // La fin est le même jour que le début
        case 'Semaine':
          endDate.setDate(startDate.getDate() + 6);
          break;
        case 'Mois':
          endDate.setDate(startDate.getDate() + 30);
          break;
        case 'Année':
          endDate.setDate(startDate.getDate() + 364);
          break;
      }

      return endDate;
    },
    async addRessource() {
      const ressource = await addRessource('Nouvelle Ressource');
      this.ressources.push(ressource);
    },
    useStartOfEvent(event) {
      this.$refs.events.startOfEvent(event);
    },
    navigateDay(direction) {
      const dayInMs = 86400000;
      const offset = direction === 'next' ? dayInMs : -dayInMs;
      this.dateDebut = new Date(this.dateDebut.getTime() + offset);
      this.dateFin = new Date(this.dateFin.getTime() + offset);
    },
    openPopup(ressource) {
      this.selectedRes = ressource;
      this.isPopupVisible = true;
    },
    async updateText(newText) {
      this.selectedRes.name = newText;
      await updateRessource(this.selectedRes);
      this.isPopupVisible = false;
    },
    async deleteRessource() {
      this.ressources = this.ressources.filter(res => res.id !== this.selectedRes.id);
      this.$refs.events.removeEventsByRessource(this.selectedRes.id);
      await deleteRessource(this.selectedRes.id);
      this.selectedRes = { id: '', name: '' };
      this.isPopupVisible = false;
    },
    setDateRange(startTime, endTime) {
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
      this.dateDebut.setHours(startHour, startMin);
      this.dateFin.setHours(endHour, endMin);
    },
  },
  mounted() {
    this.fetchRows('Ressource');
    const [firstHour, lastHour] = [this.hours[0], this.hours[this.hours.length - 1]];
    this.setDateRange(firstHour, lastHour);
  },
};
</script>

<style scoped>

</style>
