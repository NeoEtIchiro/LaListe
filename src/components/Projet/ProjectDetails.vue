<template>
  <div class="project-details">
    <!-- Header -->
    <ProjectHeader class="mb-4"
      :project="project" 
      :isEditing="isEditing" 
      @toggle-editing="isEditing = !isEditing"
    />

    <div class="flex justify-between h-[500px] mb-4 gap-4">
      <div class="w-3/5 h-full flex flex-col">
        <!-- Informations générales -->
        <GeneralInfo 
          :project="project" 
          :isEditing="isEditing" 
          class="mb-4"
        />

        <!-- Ressources -->
        <Ressources 
          :project="project" 
          :isEditing="isEditing" 
          :equipes="equipes"
        ></Ressources>
      </div>
      <div class="w-2/5 h-full flex flex-col">
        <div class="squareHeader">
          <label class="squareTitle">Informations supplémentaires</label>
        </div>
        <div class="squareDiv h-auto flex-grow">
          <div class="flex items-center">
            <select class="clientSlect mb-2" v-model="project.clientId" v-if="isEditing">
              <option class="text-center" value="">----- Sélectionner un client -----</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.name }}
              </option>
              <option class="text-center font-bold" value="add">Ajouter un client</option>
            </select>
            <div class="flex" v-else>
              <label class="font-semibold">Client :&nbsp;</label>
              <label class="">{{ getClientName(project.clientId) }}</label>
            </div>
          </div>

          <div class="flex w-full justify-between">
            <label class="font-semibold">Paiments {{ isEditing ? '' : ':'}}</label>
            <button class="callToAction squareButton h-6" v-if="isEditing" @click="popupVisible = true; popupSelected = 'payment'; selectedPayment = null">
              Ajouter
            </button>
          </div>
          <PaymentList class="max-h-40 overflow-y-auto" 
                      :payments="filteredPayments" 
                      @dbClick="selectedPayment = $event; isEditing ? popupVisible = true : popupVisible = false; popupSelected = 'payment'" />
        </div>
      </div>
    </div>

    <!-- Etapes -->
    <div class="bottomDivs">
      <div class="etapeDiv">
        <div class="squareHeader">
          <label class="squareTitle">Étapes</label>
          <button class="callToAction squareButton" v-if="isEditing" @click="selectedEvent = null; popupVisible = true; popupSelected = 'event'">
            Ajouter
          </button>
        </div>
        <div class="squareDiv">
          <template v-for="(event, index) in projectEvents" :key="event.id">
            <div v-if="index != 0" class="w-full flex items-center">
              <hr class="flex-grow border-gray-300">
            </div>
            
            <EventInProject 
              :event="event"
              :isEditing="isEditing"
              @delete="deleteEvent"
              @open="dblClickEvent(event)"
            </EventInProject>
          </template>
        </div>
      </div>
    </div>

    <div class="content !mb-4">
      <div class="edit-buttons" v-if="isEditing">
        <button @click="cancelChanges">Annuler</button>
        <button class="callToAction" @click="saveChanges">Enregistrer</button>
      </div>
    </div>
  </div>
  <PopupEvent v-if="popupSelected == 'event'"
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

  <PopupPayment v-if="popupSelected == 'payment'"
              :visible="popupVisible" 
              :payment="selectedPayment"
              :projectId="project.id"
              @close="popupVisible = false" 
              @add="addNewPayment"
              @delete=""
              >
  </PopupPayment>
</template>

<script>
import RessourceInProject from "./ProjectDetails/RessourceInProject.vue";
import EventInProject from "./EventInProject.vue";
import PopupEvent from "../Popups/PopupEvent.vue";
import PopupAddRessourceToProject from "../Popups/PopupAddRessourceToProject.vue";
import PopupPayment from "../Popups/PopupPayment.vue";
import PaymentList from "../Cash/PaymentsList.vue";

import GeneralInfo from "./ProjectDetails/GeneralInfo.vue";
import ProjectHeader from "./ProjectDetails/ProjectHeader.vue";
import Ressources from "./ProjectDetails/Ressources.vue";

import { fetchClients } from "@/services/clientService";
import { fetchEquipes } from "@/services/equipeService";
import { fetchRessources } from "@/services/ressourceService";
import { fetchEvents, updateEvent, deleteEvent, addEvent } from "@/services/eventService";
import { fetchProjectDetails, updateProject, addRessourceToProject, updateRessourceFromProject, deleteRessourceFromProject, fetchProjects } from "@/services/projectService";
import { addPayment, updatePayment, fetchPayments } from "@/services/paymentService";
import { deleteTaskAndSubTasks, fetchTasks } from "@/services/taskService";

export default {
  name: "ProjectDetails",
  components: { RessourceInProject, GeneralInfo, ProjectHeader, Ressources, EventInProject, PopupEvent, PopupAddRessourceToProject, PopupPayment, PaymentList},
  props: {
    id: String,
  },
  data() {
    return {
      project: {
        ressources: [], // Initialize ressources to an empty array
      },
      originalProject: null, // To store the original project data
      originalEvents: null,
      clients: [],
      equipes: [],
      ressources: [],
      events: [],
      payments: [],
      projectTypes: [],
      tasks: [],
      isEditing: false,
      popupVisible: false,
      popupSelected: "",
      selectedEvent: null,
      selectedRessource: null,
      selectedPayment: null
    };
  },
  computed: {
    projectEvents() {
      return this.events.filter((e) => e.project === this.project.id);
    },
    filteredPayments() {
      return this.payments.filter(payment => payment.projectId === this.project.id);
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
        this.tasks = await fetchTasks();
        this.payments = await fetchPayments();
        this.sortPaymentsByDate();
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    },
    dblClickEvent(event) {
      if (this.isEditing) {
        console.log("Lancement popup event");
        this.selectedEvent = event;
        this.popupSelected = 'event';
        this.popupVisible = true;
      }
    },
    updateProject() {
      updateProject(this.project);
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
    async deleteEvent(eventId) {
      console.log(this.tasks);
      this.events = this.events.filter(e => e.id !== eventId);

      const tasksToDelete = this.tasks.filter(task => task.eventId === eventId);
      for (const task of tasksToDelete) {
        await deleteTaskAndSubTasks(task.id);
      }

      await deleteEvent(eventId);
    },
    async addNewPayment(payment) {
        switch (payment.frequency) {
            case 'unique':
                this.addPayment(payment);
                break;
            case 'mensuel':
                const startDate = new Date(payment.date);
                const endDate = new Date(payment.dateEnd);
                let currentDate = new Date(startDate);

                while (currentDate <= endDate) {
                    const monthlyPayment = { ...payment, date: currentDate.toISOString().substr(0, 10) };
                    await this.addPayment(monthlyPayment);
                    currentDate.setMonth(currentDate.getMonth() + 1);
                }
                break;
        }
    },
    async addPayment(payment){
        const newPayment = await addPayment();
        payment.id = newPayment.id;
        await updatePayment(payment);
        this.payments.push(payment);
        this.sortPaymentsByDate();
    },
    sortPaymentsByDate() {
        this.payments.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
        });
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