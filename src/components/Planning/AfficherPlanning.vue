<template>
  <div class="page">
    <div class="page-header">
      <h1>Planning</h1>

      <!-- Boutons de sélection de la vue -->
      <div class="view-selector">
        <button
          v-for="view in views"
          :key="view"
          :class="['view-button', { active: selectedView === view }]"
          @click="setView(view)"
        >
          {{ view }}
        </button>
      </div>

      <!-- Boutons de navigation -->
      <div>
        <button class="headerButton" @click="dayBefore">
          ◄
        </button>
        <button class="headerButton" @click="dayAfter">
          ►
        </button>
      </div>
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

    <div id="divButtonRessource" v-if="ressources.length == 0">
      <button id="addRessource">
        <router-link to="/AfficherRessource">Ajouter votre première ressource</router-link>
      </button>
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
    PopupRessource,
    TimeRows,
    RessourceRow,
    EventsManager,
  },
  data() {
    return {
      views: ['Jour', 'Semaine', 'Mois', 'Année'], // Options de vues
      selectedView: 'Jour', // Vue par défaut
      hours: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      ressources: [{ id: String, name: String }],
      maxRessource: 5,
      selectedRes: { id: '', name: '' },
      dateDebut: new Date(),
      dateFin: new Date(),
      isPopupVisible: false,
    };
  },
  methods: {
    setView(view) {
      this.selectedView = view; // Mettre à jour la vue sélectionnée
      // Vous pouvez ajouter ici la logique de mise à jour de l'affichage en fonction de la vue sélectionnée
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
    dayAfter() {
      this.dateDebut = new Date(this.dateDebut.getTime() + 86400000);
      this.dateFin = new Date(this.dateFin.getTime() + 86400000);
    },
    dayBefore() {
      this.dateDebut = new Date(this.dateDebut.getTime() - 86400000);
      this.dateFin = new Date(this.dateFin.getTime() - 86400000);
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
      this.ressources = this.ressources.filter((res) => res.id !== this.selectedRes.id);
      this.$refs.events.removeEventsByRessource(this.selectedRes.id);
      await deleteRessource(this.selectedRes.id);
      this.selectedRes = { id: '', name: '' };
      this.isPopupVisible = false;
    },
  },
  mounted() {
    this.fetchRessources();
    const firstHour = this.hours[0];
    const lastHour = this.hours[this.hours.length - 1];
    this.dateDebut.setHours(firstHour.split(':').map(Number)[0]);
    this.dateDebut.setMinutes(firstHour.split(':').map(Number)[1]);
    this.dateFin.setHours(lastHour.split(':').map(Number)[0]);
    this.dateFin.setMinutes(lastHour.split(':').map(Number)[1]);
  },
};
</script>

<style scoped>
.view-selector {
  display: flex;
  gap: 0px;
}

.view-button {
  padding: 0.5em 1em;
  background-color: #eaeaea;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  height: 40px;
  font-size: 1em;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.view-button.active {
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0.1);
  background-color: #555;
  color: white;
}

.headerButton {
  border: none;
  background-color: #eaeaea;
  user-select: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 1.5em;
  margin-left: 10px;
  width: 40px;
  height: 40px;
}

  .page{
    width: 100%;
    padding: 8px;
  }

  /* Conteneur scrollable pour le tableau */
  .table-container {
    overflow-x: auto; /* Permet le défilement horizontal si nécessaire */
  }

  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  #divButtonRessource{
    text-align: left;
  }

  #addRessource{
    border:0px solid grey;
    background-color: #eaeaea;
    margin-left:150px;
    margin-right: 8px;
    height: 35px;
    text-align: center;
    border-end-end-radius: 10px;
    border-end-start-radius: 10px;
    padding-left: 8px;
    padding-right: 8px;
    font-size: 1em;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  #addRessource a{
    color: #101010;
    text-decoration: none;
  }

  .page-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .headerButton{
    border: 0px;
    background-color: #eaeaea;
    user-select: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    font-size: 1.5em;
    margin-left: 10px;
    width: 40px;
    height: 40px;
  }
</style>
  