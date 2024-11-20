<!-- PlanningPage.vue -->
<template>
  <div class="page">
    <div class="page-header">
      <h1>Planning</h1>

      <!-- Sélecteur de vue -->
      <ViewSelector :views="views" :selectedView="selectedView" @change-view="setView" />

      <!-- Boutons de navigation -->
      <NavigationButtons @navigate="navigateDay" :selectedView="selectedView" />
    </div>

    <!-- Conteneur scrollable pour le tableau -->
    <div class="table-container">
      <table>
        <TimeRows :hours="hours" 
                  :dateDebut="dateDebut" 
                  :dateFin="dateFin" 
                  :selectedView="selectedView" 
                  @change-view="setView"
        />
        <tbody>
          <tr v-for="ressource in ressources" :key="ressource.id">
            <RessourceRow
              :ressource="ressource"
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

    <!-- Message si aucune ressource n'est présente -->
    <div v-if="!ressources.length" class="add-ressource">
      <router-link to="/AfficherRessource" class="add-button">Ajouter votre première ressource</router-link>
    </div>

    <EventsManager ref="events" :dateDebut="dateDebut" :dateFin="dateFin" />

    <PopupRessource
      :visible="isPopupVisible"
      :initialText="selectedRes.name"
      @save="updateText"
      @close="isPopupVisible = false"
      @deleteRes="deleteRessource"
    />
  </div>
</template>

<script>
import ViewSelector from './ViewSelector.vue';
import NavigationButtons from './NavigationButtons.vue';
import PopupRessource from './PopupRessource.vue';
import TimeRows from './TimeRows.vue';
import RessourceRow from './RessourceRow.vue';
import EventsManager from './Events/EventsManager.vue';
import {
  addRessource,
  fetchRessources,
  updateRessource,
  deleteRessource,
} from '@/services/ressourceService';

export default {
  components: {
    ViewSelector,
    NavigationButtons,
    PopupRessource,
    TimeRows,
    RessourceRow,
    EventsManager,
  },
  data() {
    return {
      views: ['Jour', 'Semaine', 'Mois', 'Année'],
      selectedView: 'Jour',
      hours: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      ressources: [],
      selectedRes: { id: '', name: '' },
      dateDebut: new Date(new Date().setHours(8,0,0,0)),
      dateFin: new Date(new Date().setHours(19,0,0,0)),
      isPopupVisible: false,
    };
  },
  methods: {
    setView(view, date) {
      if (view === 'Null') return;

      this.selectedView = view;

      // Si une date est spécifiée, l'utiliser pour définir le début et ajuster la période
      if (date) {
        this.dateDebut = this.adjustStartDate(view, new Date(date));
      }

      // Calculer la fin de la période selon la vue sélectionnée
      this.dateFin = this.calculateEndDate(view, this.dateDebut);
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
          console.log(adjustedDate);
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
    async fetchRessources() {
      this.ressources = await fetchRessources();
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
    this.fetchRessources();
    const [firstHour, lastHour] = [this.hours[0], this.hours[this.hours.length - 1]];
    this.setDateRange(firstHour, lastHour);
  },
};
</script>

<style scoped>
.page {
  width: 100%;
  padding: 8px;
}
.table-container {
  overflow-x: hidden;
}
table {
  width: 100%;
  overflow-x:hidden;
  border-collapse: collapse;
  table-layout: fixed;
}
.table-container::-webkit-scrollbar {
  display: none; /* Masque la barre de défilement */
}
.add-ressource {
  text-align: left;
}
.add-button {
  display: inline-block;
  background-color: #eaeaea;
  padding: 8px;
  border-radius: 10px;
  text-align: center;
  font-size: 1em;
  text-decoration: none;
  color: #101010;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
