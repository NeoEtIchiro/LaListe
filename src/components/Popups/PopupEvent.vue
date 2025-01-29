<template>
  <Popup :visible="visible" @close="$emit('close')"
         :title="event ? 'Modifier un événement' : 'Ajouter un événement'"        
  >
    <form @submit.prevent="saveEvent">
      <div class="form-group">
        <input class="w-full h-8 m-0 mb-2 rounded-lg border" 
              v-model="editableEvent.title" type="text" id="title" required placeholder="Entrez le titre" /> 
      </div>

      <div class="form-group">
        <label for="tache">Tâche</label>
          <select v-model="editableEvent.tache" class="w-full h-8 m-0 mb-2 rounded-lg">
            <option value="">Aucune tâche</option>
            <option v-for="tache in taches" :key="tache.id" :value="tache.id">
              {{ tache.name }}
            </option>
          </select>
      </div>

      <div class="form-group">
        <label for="project">Projet</label>
        <select v-model="editableEvent.project" class="w-full h-8 m-0 mb-2 rounded-lg">
            <option v-for="project in projects" :key="project.id" :value="project.id">
              {{ project.name }}
            </option>
          </select>
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea class="w-full min-h-[50px] max-h-[200px] text-base rounded-lg font-sans mb-2"
           v-model="editableEvent.description" id="description" placeholder="Entrez une description"></textarea>
      </div>

      <div class="form-group">
        <label>Date et heure de début</label>
        <div class="flex mb-2">
          <input class="rounded-lg h-8 mr-1 border" v-model="startTime" type="time"/>
          <input class="rounded-lg h-8 w-full border" v-model="startDate" type="date"/>
        </div>
      </div>

      <div class="form-group">
        <label>Date et heure de fin</label>
        <div class="flex mb-2">
          <input class="rounded-lg h-8 mr-1 border" v-model="endTime" type="time"/>
          <input class="rounded-lg h-8 w-full border" v-model="endDate" type="date"/>
        </div>
      </div>

      <div class="flex h-8 mb-2 justify-between">
        <template v-if="event">
          <button class="m-0 mt-2" @click="$emit('delete', event); $emit('close')">Supprimer</button>
          <button class="callToAction m-0 mt-2" type="submit" @click="$emit('close'); saveEvent()">Enregistrer </button>
        </template>
        <template v-else>
          <button class="m-0 mt-2" @click="$emit('close')">Annuler</button>
          <button class="callToAction m-0 mt-2" type="submit" @click="$emit('close'); saveEvent()">Ajouter</button>
        </template>
      </div>
    </form>
  </Popup>
</template>

  
<script>
import Popup from '@/components/Popups/Popup.vue';
import { fetchTaches } from '@/services/tacheService';
import { fetchRessources } from '@/services/ressourceService';
import { fetchProjects } from '@/services/projectService';

export default {
  props: ['event', 'project', 'position', 'visible', 'equipes'],
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
                ressources: this.project ? this.project.ressources : [],
                date_debut: new Date(),
                date_fin: new Date(),
                title: "",
                description: "",
                tache: "",
                project: this.project ? this.project.id : "",
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
        this.$emit('add', this.editableEvent); 
      } 
      else{
        this.$emit('update', this.editableEvent);
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
    event: {
      handler() {
        // À chaque changement de 'event', on appelle setDatas
        this.setDatas();
      },
      deep: true,       // Surveille aussi les changements à l'intérieur de l'objet
      immediate: true   // Appelle le handler dès que le composant est monté
    },
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

  label{
    text-align: left;
  }

  textarea{
    resize: vertical;
  }
</style>