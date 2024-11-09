<template>
    <div class="page">
      <h2>Calendrier</h2>
  
      <button @click="dayBefore">
        Day Before
      </button>
      <button @click="dayAfter">
        Day After
      </button>
      <!-- Conteneur scrollable pour le tableau -->
      <div class="table-container">
        <table>
          <TimeRows
            :hours="hours"
            :dateAct="dateDebut"
          />
          <tbody>
            <!-- Lignes de données, 12 colonnes par heure -->
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

      <div id="divButtonRessource" v-if="ressources.length < maxRessource">
        <button id="addRessource" @click="addRessource">
          +
        </button>
      </div>
      
      <EventsManager ref="events"
        :dateDebut="dateDebut"
        :dateFin="dateFin"/>

      <PopupRessource 
        :visible="isPopupVisible" 
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
  import EventsManager from './EventsManager.vue';
  import { addRessource, fetchRessources } from '@/services/ressourceService';

  export default {
    components: {
      PopupRessource,
      TimeRows,
      RessourceRow,
      EventsManager,
    },
    data() {
      return {
        // Liste des heures de 08:00 à 18:00
        hours: [
          "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
        ],
        // Exemple de lignes de données
        ressources: [{id: String, name:String}], // Ces lignes représentent des ressources ou des entrées de données,
        maxRessource: 5,
        selectedRes: 0,

        dateDebut: new Date(),
        dateFin: new Date(),

        isPopupVisible: false,
      };
    },
    methods:{
      async fetchRessources() {
        this.ressources = await fetchRessources();
      },
      async addRessource() {
        const ressource = await addRessource("Nouvelle Ressource");
        this.ressources.push(ressource);
        this.openPopup(this.ressources.length-1);
      },
      useStartOfEvent(event){
        this.$refs.events.startOfEvent(event);
      },
      dayAfter(){
        this.dateDebut = new Date(this.dateDebut.getTime() + 86400000);
        this.dateFin = new Date(this.dateFin.getTime() + 86400000);
      },
      dayBefore(){
        this.dateDebut = new Date(this.dateDebut.getTime() - 86400000);
        this.dateFin = new Date(this.dateFin.getTime() - 86400000);
      },
      openPopup(ressource) {
        this.selectedRes = ressource;
        this.isPopupVisible = true; // Affiche la popup
      },
      updateText(newText) {
        this.ressources[this.selectedRes] = newText; // Met à jour le texte avec celui de la popup
        this.isPopupVisible = false;
      },
      deleteRessource(){
        this.ressources.splice(this.selectedRes, 1);

        this.$refs.events.deleteEvents(this.selectedRes);
      }
    },
    mounted(){
      this.fetchRessources();

      const firstHour = this.hours[0];
      const lastHour = this.hours[this.hours.length - 1];
      // Remplace les heures de `date_debut` et `date_fin`
      this.dateDebut.setHours(firstHour.split(':').map(Number)[0]);
      this.dateDebut.setMinutes(firstHour.split(':').map(Number)[1]);
      this.dateDebut.setSeconds(0);

      this.dateFin.setHours(lastHour.split(':').map(Number)[0]);
      this.dateFin.setMinutes(lastHour.split(':').map(Number)[1]);
      this.dateFin.setSeconds(0);
    }
  };
  </script>
  
<style scoped>
  .page{
    width: 100%;
    padding: 8px;
  }

  /* Conteneur scrollable pour le tableau */
  .table-container {
    overflow-x: auto; /* Permet le défilement horizontal si nécessaire */
    margin-top: 20px;
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
    border:1px solid grey;
    width:150px;
    text-align: center;
    border-end-end-radius: 10px;
    border-end-start-radius: 10px;
    padding-left: 8px;
    padding-right: 8px;
  }
</style>
  