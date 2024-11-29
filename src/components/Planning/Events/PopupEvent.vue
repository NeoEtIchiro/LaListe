<template>
  <div v-if="visible" class="edit-popup" :style="{ top: `${adjustedTop}px`, left: `${adjustedLeft}px` }">
    <div class="popup-header">
      <h3>Modifier l'évènement</h3>
      <button @click="saveEvent">X</button>
    </div>
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
        <label for="ressource">Ressource :</label>
        <select v-model="editableEvent.ressource" required>
            <option v-for="ressource in ressources" :key="ressource.id" :value="ressource.id">
              {{ ressource.name }}
            </option>
          </select>
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

      <button @click="$emit('delete')">Supprimer</button>
      <button type="submit">Sauvegarder</button>
    </form>
  </div>
</template>

  
<script>
import { fetchTaches } from '@/services/tacheService';
import { fetchRessources } from '@/services/ressourceService';
import { fetchProjects } from '@/services/projectService';

export default {
  props: ['event', 'position', 'visible'],
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
  computed: {
    adjustedLeft() {
      if (window.innerWidth - (this.position.left + this.position.width) >= this.popupWidth) {
        return this.position.left + this.position.width;
      } else if (this.position.left >= this.popupWidth) {
        return this.position.left - this.popupWidth;
      } else {
        return this.position.left;
      }
    },
    adjustedTop() {
      return this.position.top - this.popupHeight / 2;
    },
  },
  methods: {
    async loadOptions() {
      // Charger les tâches et ressources
      this.taches = await fetchTaches();
      this.ressources = await fetchRessources();
      this.projects = await fetchProjects();
    },
    setDates(){
      if(!this.event) return;

      this.editableEvent = { ...this.event };
      this.startDate = this.formatDate(this.event.date_debut, 'date');
      this.startTime = this.formatDate(this.event.date_debut, 'time');
      this.endDate = this.formatDate(this.event.date_fin, 'date');
      this.endTime = this.formatDate(this.event.date_fin, 'time');
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
      this.$emit('save', this.editableEvent);
    },
    handleClickOutside(event) {
      const popup = event.target.closest('.edit-popup');
      if (!popup && this.visible) {
        this.saveEvent();
      }
    },
  },
  mounted() {
    document.addEventListener('mousedown', this.handleClickOutside);
    this.loadOptions(); // Charger les options des selects au montage
  },
  unmounted(){
    document.removeEventListener('mousedown', this.handleClickOutside);
  },
  watch:{
    event: 'setDates',
  }
};
</script>


  
<style scoped>
  .edit-popup {
    position: absolute;
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
  