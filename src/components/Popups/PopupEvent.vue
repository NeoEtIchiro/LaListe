<template>
  <Popup :visible="visible" @close="$emit('close')"
         :title="event ? 'Modifier un événement' : 'Ajouter un événement'"        
  >
    <form @submit.prevent="saveEvent">
      <div class="form-group">
        <label for="title">Titre :</label>
        <input v-model="editableEvent.title" type="text" id="title" required />
      </div>

      <div class="form-group">
        <label for="tache">Tâche :</label>
          <select v-model="editableEvent.tache">
            <option value="">Aucune tâche</option>
            <option v-for="tache in taches" :key="tache.id" :value="tache.id">
              {{ tache.name }}
            </option>
          </select>
      </div>

      <div class="form-group">
        <label for="ressource">Ressources :</label>
        <table>
          <thead>
            <tr>
              <th>Équipe</th>
              <th>Ressource</th>
              <th>Responsable</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ressource, index) in editableEvent.ressources" :key="index">
              <td>
                <select v-model="ressource.teamId">
                  <option value="">Toutes les ressources</option>
                  <option v-for="equipe in equipes" :key="equipe.id" :value="equipe.id">
                    Équipe {{ equipe.name }}
                  </option>
                </select>
              </td>
              <td>
                <select v-model="ressource.ressourceId">
                  <option v-if="ressource.teamId" value="">Toute l'équipe</option>
                  <option v-else value="">Aucune ressource sélectionnée</option>
                  <option v-for="r in getAvailableRessources(ressource.teamId)" :key="r.id" :value="r.id">
                    {{ r.name }}
                  </option>
                </select>
              </td>
              <td>
                <input type="checkbox" v-model="ressource.responsable" />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="button" @click="addRessourceRow">Ajouter</button>
      </div>

      <div class="form-group">
        <label for="project">Projet :</label>
        <select v-model="editableEvent.project">
            <option v-for="project in projects" :key="project.id" :value="project.id">
              {{ project.name }}
            </option>
          </select>
      </div>

      <div class="form-group">
        <label for="description">Description :</label>
        <textarea v-model="editableEvent.description" id="description"></textarea>
      </div>

      <div class="form-group">
        <label>Date et heure de début :</label>
        <input v-model="startDate" type="date" required />
        <input v-model="startTime" type="time" required />
      </div>

      <div class="form-group">
        <label>Date et heure de fin :</label>
        <input v-model="endDate" type="date" required />
        <input v-model="endTime" type="time" required />
      </div>

      <template v-if="event">
        <button @click="$emit('delete', event); $emit('close')">Supprimer</button>
        <button type="submit" @click="$emit('close')">Enregistrer </button>
      </template>
      <template v-else>
        <button @click="$emit('close')">Annuler</button>
        <button type="submit" @click="$emit('close')">Ajouter</button>
      </template>
    </form>
  </Popup>
</template>

  
<script>
import Popup from '@/components/Popups/Popup.vue';
import { fetchTaches } from '@/services/tacheService';
import { fetchRessources } from '@/services/ressourceService';
import { fetchProjects } from '@/services/projectService';

export default {
  props: ['event', 'position', 'visible', 'equipes'],
  components: {
    Popup,
  },
  data() {
    return {
      editableEvent: { ...this.event }, // Copie de l'événement passé en props
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      taches: [], // Liste des tâches à charger
      ressources: [], // Liste des ressources à charger
      projects: [],
      popupWidth: 250,
      popupHeight: 350,
    };
  },
  methods: {
    async loadOptions() {
      this.taches = await fetchTaches();
      this.ressources = await fetchRessources();
      this.projects = await fetchProjects();
    },
    setDatas(){
      if(!this.event) {
        this.editableEvent = {
                ressources: [],
                date_debut: new Date(),
                date_fin: new Date(),
                title: "Gros titre",
                description: "Petite description",
                tache: "",
                project: "",
                isFinished: false,
                orderInProject: 0,
            };
      }
      else{
        this.editableEvent = { ...this.event };
        if (!this.editableEvent.ressources) {
          this.editableEvent.ressources = []; // Initialiser ressources si elle est indéfinie
        }
      }

      this.startDate = this.formatDate(this.editableEvent.date_debut, 'date');
      this.startTime = this.formatDate(this.editableEvent.date_debut, 'time');
      this.endDate = this.formatDate(this.editableEvent.date_fin, 'date');
      this.endTime = this.formatDate(this.editableEvent.date_fin, 'time');
    },
    getAvailableRessources(teamId) {
      if (teamId) {
        const equipe = this.equipes.find(e => e.id === teamId);
        if (equipe) {
          return this.ressources.filter(r => equipe.ressources.includes(r.id));
        }
      }
      return this.ressources;
    },
    formatDate(datetimeString, type) {
      if (!datetimeString) return '';
      const dateObj = new Date(datetimeString);
      if (type === 'date') {
        return dateObj.toISOString().slice(0, 10); // Format YYYY-MM-DD
      } else if (type === 'time') {
        return dateObj.toTimeString().slice(0, 5); // Format HH:MM
      }
    },
    parseDate(date, time) {
      return `${new Date(`${date}T${time}:00`)}`;
    },
    saveEvent() {
      this.editableEvent.date_debut = this.parseDate(this.startDate, this.startTime);
      this.editableEvent.date_fin = this.parseDate(this.endDate, this.endTime);

      if(this.event == null){
        this.$emit('save', this.editableEvent); 
        console.log(this.editableEvent);
      } 
      else{
        this.$emit('update', this.editableEvent);
        console.log("update");
      } 
    },
    addRessourceRow() {
      if(!this.editableEvent.ressources) {
        this.editableEvent.ressources = [];
      }

      this.editableEvent.ressources.push({
        teamId: '',
        ressourceId: '',
        responsable: false,
      });
    },
  },
  mounted() {
    this.loadOptions(); // Charger les options des selects au montage
  },
  watch:{
    event: 'setDatas',
    editableEvent: 'saveEvent',
  }
};
</script>


  
<style scoped>
  .edit-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border: 1px solid #ddd;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    border-radius: 8px;
    width: 250px;
    z-index: 10;
  }
  
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .form-group{
    text-align: left;
  }
  
  input {
    margin-bottom: 1rem;
  }

  label{
    text-align: left;
  }

  button {
    background-color: #ff2424;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 4px;
  }
  
  button[type="submit"] {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 4px;
  }

  select {
    appearance: none;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
    color: #333;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 14px;
    width: 100%;
    cursor: pointer;
  }

  select:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
  }
</style>