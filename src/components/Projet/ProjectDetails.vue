<template class="project-details">
  <div class="project-details">
    <div class="header">
      <button class="backButton" @click="$router.go(-1)"><</button>
      <div id="title">
        <template v-if="isEditing">
          <input type="text" v-model="project.name" />
        </template>
        <template v-else>
          <div id="titleText">{{ project.name }}</div>
        </template>
      </div>
      <button class="callToAction" @click="toggleEditMode">{{ isEditing ? 'Annuler' : 'Modifier' }}</button>
      <button @click="deleteProject">Supprimer</button>
    </div>

    <div class="content">
      <div class="client">
        <label>Client :
          <select v-model="project.clientId" v-if="isEditing">
            <option value="">Aucun client</option>
            <option v-for="client in clients" :key="client.id" :value="client.id">
              {{ client.name }}
            </option>
          </select>
          <p v-else>{{ getClientName(project.clientId) }}</p>
        </label>
      </div>

      <div class="type">
        <label>Type projet :
          <input list="projectTypes" v-model="project.type" v-if="isEditing"/>
          <datalist id="projectTypes" v-if="isEditing">
            <option v-for="type in projectTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </datalist>
          <p v-else>{{ project.type }}</p>
        </label>
      </div>

      <div class="dateDebut">
        <label>Date de début :
          <input class="date" type="date" v-model="project.startDate" v-if="isEditing"/>
          <p v-else>{{ project.startDate }}</p>
        </label>
      </div>

      <div class="dateFin">
        <label>Date de fin :
          <input class="date" type="date" v-model="project.endDate" v-if="isEditing"/>
          <p v-else>{{ formatDate(project.endDate) }}</p>
        </label>
      </div>

      <div class="description">
        <label>Description :
          <textarea v-model="project.description" v-if="isEditing"></textarea>
          <p v-else>{{ project.description }}</p>
        </label>
      </div>

      <div class="ressources">
        <label>Ressources :
          <div class="addRessourcesDiv" v-if="isEditing">
            <div class="selectDiv">
              <select v-model="selectedTeam">
                <option value="">Toutes les ressources</option>
                <option v-for="equipe in equipes" :key="equipe.id" :value="equipe.id">
                  Équipe {{ equipe.name }}
                </option>
              </select>
              <select v-model="selectedRessource">
                <option v-if="selectedTeam" value="">Toute l'équipe</option>
                <option v-else value="">Aucune ressource sélectionnée</option>
                <option v-for="ressource in availableRessources" :key="ressource.id" :value="ressource.id">
                  {{ ressource.name }}
                </option>
              </select>
              <button :disabled="selectedRessource=='' && selectedTeam==''" @click="addRessource">Ajouter</button>
            </div>
          </div>
        </label>
      </div>
      <RessourceInProject v-for="ressource in project.ressources" :key="ressource.ressourceId" 
        :ressourceProj="ressource"
        :project="project"
        :isEditing="isEditing"
        :teams="equipes"
        @delete="deleteRessource"
        >
      </RessourceInProject>

      <div class="events">
        <label>Evènements :
          <div class="eventInput" v-if="isEditing">
            <button @click="selectedEvent = null; popupVisible = true">Ajouter</button>
          </div>
        </label>
      </div>
      <EventInProject v-for="event in projectEvents" :key="event.id" 
        :event="event"
        :isEditing="isEditing"
        @delete="deleteEvent"
        @dblclick="dblClickEvent(event)"
      </EventInProject>

      <div class="edit-buttons" v-if="isEditing">
        <button @click="cancelChanges">Annuler</button>
        <button class="callToAction" @click="saveChanges">Enregistrer</button>
      </div>

    </div>
  </div>
  <PopupEvent :visible="popupVisible" 
              :event="selectedEvent" 
              :equipes="equipes"
              @close="popupVisible = false" 
              @delete="deleteEvent"
              @add="addNewEvent"
              @update="updateExistingEvent"
              >
  </PopupEvent>
</template>

<script>
import RessourceInProject from "./RessourceInProject.vue";
import EventInProject from "./EventInProject.vue";
import PopupEvent from "../Popups/PopupEvent.vue";
import Popup from "../Popups/Popup.vue";
import { fetchClients } from "@/services/clientService";
import { fetchEquipes } from "@/services/equipeService";
import { fetchRessources } from "@/services/ressourceService";
import { fetchEvents, updateEvent, deleteEvent, addEvent } from "@/services/eventService";
import { fetchProjectDetails, updateProject, deleteProject, addRessourceToProject, deleteRessourceFromProject, fetchProjects } from "@/services/projectService";

export default {
  name: "ProjectDetails",
  components: { RessourceInProject, EventInProject, PopupEvent, Popup},
  props: {
    id: String,
  },
  data() {
    return {
      project: {
        ressources: [] // Initialize ressources to an empty array
      },
      originalProject: null, // To store the original project data
      originalEvents: null,
      clients: [],
      equipes: [],
      ressources: [],
      events: [],
      projectTypes: [],
      selectedRessource: "",
      selectedTeam: "",
      isEditing: false,
      popupVisible: false,
      selectedEvent: null
    };
  },
  computed: {
    projectEvents() {
      return this.events.filter((e) => e.project === this.project.id);
    },
    availableRessources() {
      if (this.selectedTeam && this.equipes.length > 0) {
        const equipe = this.equipes.find((e) => e.id === this.selectedTeam);
        if (equipe) {
          const teamRessources = equipe.ressources.map((id) =>
            this.ressources.find((r) => r.id === id)
          );
          return teamRessources.filter(
            (resource) =>
              resource && !this.project.ressources.some((r) => r.ressourceId === resource.id)
          );
        }
      }
      return this.ressources.filter(
        (resource) =>
          !this.project.ressources.some((r) => r.ressourceId === resource.id)
      );
    }
  },
  methods: {
    async fetchProjectData() {
      try {
        this.projectTypes = (await fetchProjects()).map(p => p.type);
        
        const projectData = await fetchProjectDetails(this.id);
        
        this.project = {
          ...projectData,
          startDate: new Date(projectData.startDate).toISOString().slice(0, 10), // Convert to YYYY-MM-DD
          endDate: new Date(projectData.endDate).toISOString().slice(0, 10) // Convert to YYYY-MM-DD
        };
        this.clients = await fetchClients();
        this.equipes = await fetchEquipes();
        this.ressources = await fetchRessources();
        this.events = await fetchEvents();
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    },
    dblClickEvent(event) {
    if (this.isEditing) {
      this.selectedEvent = event;
      this.popupVisible = true;
    }
  },
    updateProject() {
      updateProject(this.project);
    },
    deleteProject(){
      deleteProject(this.project.id);
      this.$router.go(-1);
    },
    async addRessource() {
      if(this.selectedRessource == "") {
        for(let ressource of this.equipes.find(e => e.id == this.selectedTeam).ressources){
          
          if (!this.project.ressources.some(r => r.ressourceId === ressource)) {
            await addRessourceToProject(this.project.id, this.selectedTeam, ressource);
            this.project.ressources.push({ressourceId: ressource, responsable: false, teamId: this.selectedTeam});
          }
        }
        return;
      };

      await addRessourceToProject(this.project.id, this.selectedTeam, this.selectedRessource);
      this.project.ressources.push({ressourceId: this.selectedRessource, responsable: false, teamId: this.selectedTeam});
    },
    deleteRessource(ressourceId) {
      this.project.ressources = this.project.ressources.filter(r => r.ressourceId !== ressourceId);
      deleteRessourceFromProject(this.project.id, ressourceId);
    },
    async addNewEvent(event){
      const newEvent = await addEvent(event);
      this.events.push(newEvent);
    },
    updateExistingEvent(event){
      const index = this.events.findIndex(e => e.id === event.id);
      if (index !== -1) {
        this.events.splice(index, 1, event);
      }
      updateEvent(event);
    },
    deleteEvent(event) {
      const e = this.events.find(e => e.id === event.id);
      if (e) {
        e.project = "";
      }
      updateEvent(event);
    },
    getEquipeName(equipeId) {
      const equipe = this.equipes.find((e) => e.id === equipeId);
      return equipe ? `Équipe ${equipe.name}` : "Aucune équipe";
    },
    getClientName(clientId) {
      const client = this.clients.find((c) => c.id === clientId);
      return client ? client.name : "Aucun client";
    },
    getRessourcesNames() {
      return this.project.ressources.map((r) => {
        const ressource = this.ressources.find((res) => res.id === r.ressourceId);
        return ressource ? ressource.name : "Ressource inconnue";
      }).join(", ");
    },
    toggleEditMode() {
      if (this.isEditing) {
        // Exiting edit mode, restore original project data
        this.project = JSON.parse(JSON.stringify(this.originalProject));
        this.updateProject();

        this.events = this.originalEvents;
        this.events.forEach((event) => {
          if (!this.originalEvents.some(originalEvent => originalEvent.id === event.id)) {
            deleteEvent(event);
          } else {
            updateEvent(event);
          }
        });
      } else {
        // Entering edit mode, save original project data
        this.originalProject = JSON.parse(JSON.stringify(this.project));
        this.originalEvents = JSON.parse(JSON.stringify(this.events));
      }
      this.isEditing = !this.isEditing;
    },
    saveChanges() {
      // Logic to save changes
      this.isEditing = false;
      this.updateProject();
    },
    cancelChanges() {
      // Restore original project data and exit edit mode
      this.toggleEditMode();
    },
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    formatDateForInput(date) {
      const d = new Date(date);
      const month = '' + (d.getMonth() + 1);
      const day = '' + d.getDate();
      const year = d.getFullYear();
      return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
    }
  },
  mounted() {
    this.fetchProjectData();
  },
  watch: {
    project: {
      handler() {
        this.updateProject();
      },
      deep: true
    }
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  margin: 8px;
  height: 36px;
}

button {
  border: 0px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 1em;
  font-weight: bold;
  padding: 8px;
  height: 36px;
  margin: 0px 4px;
}

p{
  width:fit-content;
  margin: 0;
}

#title {
  text-align: left;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0;
  width: 100%;
}

#title #titleText{
  margin: 0px 8px;
  height: 100%;
  width: 100%;
  font-size: 1.2rem;
  text-align: left;
  display: flex;
  align-items: center;
}

#title input {
  margin: 0px 8px;
  height: 90%;
  width: 100%;
  font-size: 1.2rem;
  border-radius: 8px;
}

input, select{
  border-radius: 4px;
  font-size: 1em;
}

.content{
  padding: 8px;
  text-align: left;
}

.addRessourcesDiv{
  margin-bottom: 0;
}

.selectDiv{
  margin-bottom: 0;
}

.eventInput{
  margin-bottom: 0;
}

.content div:not(.addRessourcesDiv):not(.selectDiv) {
  margin-bottom: 8px;
  height: 32px;
}

label{
  display: flex;
  align-items: center;
  height: 32px;
}

label input{
  margin: 0;
  height: 24px;
}

label select{
  margin: 0;
  height: 24px;
}

.edit-buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>