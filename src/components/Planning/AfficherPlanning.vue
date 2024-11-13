<!-- PlanningPage.vue -->
<template>
  <div class="page">
    <div class="page-header">
      <h1>Planning</h1>

      <!-- Sélecteur de vue -->
      <ViewSelector :views="views" :selectedView="selectedView" @change-view="setView" />

      <!-- Boutons de navigation -->
      <NavigationButtons @navigate="navigateDay" />
    </div>

    <!-- Conteneur scrollable pour le tableau -->
    <div class="table-container">
      <table>
        <TimeRows :hours="hours" :dateAct="dateDebut" />
        <tbody>
          <tr v-for="ressource in ressources" :key="ressource.id">
            <RessourceRow
              :ressource="ressource"
              :hours="hours"
              :dateAct="dateDebut"
              :startOfEvent="useStartOfEvent"
              :openPopup="openPopup"
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
      dateDebut: new Date(),
      dateFin: new Date(),
      isPopupVisible: false,
    };
  },
  methods: {
    setView(view) {
      this.selectedView = view;
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
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
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
