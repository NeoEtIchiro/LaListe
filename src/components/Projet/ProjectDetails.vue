<template>
  <div class="project-details">
    <div class="header">
      <button class="backButton" @click="$router.go(-1)">◀</button>
      <div id="title">
        <template v-if="isEditing">
          <input class="border" type="text" v-model="project.name" />
        </template>
        <template v-else>
          <div id="titleText">{{ project.name }}</div>
        </template>
      </div>
      <template v-if="isEditing">
        <button @click="toggleEditMode">{{ 'Annuler' }}</button>
      </template>
      <template v-else>
        <button class="callToAction" @click="toggleEditMode">{{ 'Modifier' }}</button>
      </template>
      <button @click="deleteProject">Supprimer</button>
    </div>

    <div class="topDivs">
      <div class="w-3/5">
        <div class="squareHeader">
          <label class="squareTitle">Informations générales</label>
        </div>
        <div class="squareDiv">
          <div class="flex items-center">
            <label class="h-6 font-semibold">Du&nbsp;</label>
            <input class="h-6 text-2xl border" type="date" v-model="project.startDate" v-if="isEditing"/>
            <span v-else>{{ formatDate(project.startDate) }}</span>
            <label class="h-6 font-semibold">&nbsp;au&nbsp;</label>
            <input class="h-6 text-2xl border" type="date" v-model="project.endDate" v-if="isEditing"/>
            <span v-else>{{ formatDate(project.endDate) }}</span>
          </div>

          <div class="flex items-center">
            <label class="font-semibold">Type de projet :&nbsp;</label>
            <input class="border" list="projectTypes" v-model="project.type" v-if="isEditing"/>
            <datalist id="projectTypes" v-if="isEditing">
              <option v-for="type in projectTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </datalist>
            <p v-else>{{ project.type }}</p>
          </div>

          <div>
            <label class="font-semibold">Description</label>
            <textarea class="w-full max-w-full min-w-full min-h-[70px] text-base rounded-lg font-sans" 
                      v-model="project.description" v-if="isEditing"></textarea>
            <p v-else>{{ project.description }}</p>
          </div>
        </div>
      </div>
      <div class="w-2/5">
        <div class="squareHeader">
          <label class="squareTitle">Informations supplémentaires</label>
        </div>
        <div class="squareDiv">
          <select class="clientSlect" v-model="project.clientId" v-if="isEditing">
            <option class="text-center" value="">----- Sélectionner un client -----</option>
            <option v-for="client in clients" :key="client.id" :value="client.id">
              {{ client.name }}
            </option>
            <option class="text-center font-bold" value="add">Ajouter un client</option>
          </select>
          <p v-else>{{ getClientName(project.clientId) }}</p>
        </div>
      </div>
    </div>

    <div class="bottomDivs">
      <div class="ressourceDiv">
        <div class="squareHeader">
          <label class="squareTitle">Ressources</label>
          <button class="callToAction squareButton" v-if="isEditing" @click="popupVisible = true; popupSelected = 'ressource'">
            Ajouter
          </button>
        </div>
        <div class="squareDiv !pb-0">
          <RessourceInProject v-for="ressource in project.ressources" :key="ressource.ressourceId" 
            :ressourceProj="ressource"
            :project="project"
            :isEditing="isEditing"
            :teams="equipes"
            @delete="deleteRessource"
            >
          </RessourceInProject>
        </div>
      </div>
      <div class="etapeDiv">
        <div class="squareHeader">
          <label class="squareTitle">Étapes</label>
          <button class="callToAction squareButton" v-if="isEditing" @click="selectedEvent = null; popupVisible = true; popupSelected = 'event'">
            Ajouter
          </button>
        </div>
        <div class="squareDiv !pb-0">
          <EventInProject v-for="event in projectEvents" :key="event.id" 
            :event="event"
            :isEditing="isEditing"
            @delete="deleteEvent"
            @dblclick="dblClickEvent(event)"
          </EventInProject>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="edit-buttons" v-if="isEditing">
        <button @click="cancelChanges">Annuler</button>
        <button class="callToAction" @click="saveChanges">Enregistrer</button>
      </div>
    </div>
  </div>
  <PopupEvent v-if="popupSelected === 'event'"
              :ressource="null"
              :visible="popupVisible" 
              :event="selectedEvent" 
              :project="project"
              :equipes="equipes"
              @close="popupVisible = false" 
              @delete="deleteEvent"
              @add="addNewEvent"
              @update="updateExistingEvent"
              >
  </PopupEvent>

  <PopupAddRessourceToProject v-if="popupSelected === 'ressource'"
              :visible="popupVisible" 
              :projectRessources="project.ressources"
              :equipes="equipes"
              @close="popupVisible = false" 
              @add="addNewRessource"
              >
  </PopupAddRessourceToProject>
</template>

<script>
import RessourceInProject from "./RessourceInProject.vue";
import EventInProject from "./EventInProject.vue";
import PopupEvent from "../Popups/PopupEvent.vue";
import PopupAddRessourceToProject from "../Popups/PopupAddRessourceToProject.vue";
import { fetchClients } from "@/services/clientService";
import { fetchEquipes } from "@/services/equipeService";
import { fetchRessources } from "@/services/ressourceService";
import { fetchEvents, updateEvent, deleteEvent, addEvent } from "@/services/eventService";
import { fetchProjectDetails, updateProject, deleteProject, addRessourceToProject, deleteRessourceFromProject, fetchProjects } from "@/services/projectService";

export default {
  name: "ProjectDetails",
  components: { RessourceInProject, EventInProject, PopupEvent, PopupAddRessourceToProject},
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
      popupSelected: "",
      selectedEvent: null
    };
  },
  computed: {
    projectEvents() {
      return this.events.filter((e) => e.project === this.project.id);
    },
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
    async addNewRessource(ressourceCont) {
      console.log(ressourceCont);
      if(ressourceCont.ressourceId == "") {
        for(let ressource of this.equipes.find(e => e.id == ressourceCont.teamId).ressources){
          if (!this.project.ressources.some(r => r.ressourceId === ressource)) {
            await addRessourceToProject(this.project.id, ressourceCont.teamId, ressource);
            this.project.ressources.push({ressourceId: ressource, role: ressourceCont.role, teamId: ressourceCont.teamId});
          }
        }
        return;
      };

      await addRessourceToProject(this.project.id, ressourceCont.teamId, ressourceCont.ressourceId);
      this.project.ressources.push({ressourceId: ressourceCont.ressourceId, role: ressourceCont.role, teamId: ressourceCont.teamId});
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
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
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
  margin: 0px 0px 16px 0px;
  height: 36px;
}

.backButton{
  height: 100%;
  width: 36px;
  margin: 0;
}

.squareDiv{
  border: 1px solid #bebebe;
  border-radius: 8px;
  padding: 8px;
  height: fit-content;
}

.squareHeader{
  display: flex;
  justify-content: space-between;
  height: 32px;
  margin-bottom: 4px;
}

.squareTitle{
  font-weight: bold;
}

.squareButton{
  height: 32px;
  margin: 0;
}

.clientSlect{
  width: 100%;
  height: 32px;
  border-radius: 8px;
}

.topDivs, .bottomDivs {
  display: flex;
  justify-content: space-between;
  height: fit-content;
  margin-bottom: 16px;
  gap: 16px;
}

.infoDiv{
  width: 60%;
}

.otherDiv{
  width: 40%;
}

.ressourceDiv, .etapeDiv{
  width: 100%;
}

p{
  width:fit-content;
  margin: 0;
  text-align: left;
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