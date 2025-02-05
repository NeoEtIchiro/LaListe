<template>
  <div class="project-details">
    <!-- Header -->
    <ProjectHeader class="mb-4" 
      :project="project" 
      :isEditing="isEditing" 
      @toggle-editing="isEditing = !isEditing"
    />

    <!-- Partie hautes --> 
    <div class="flex justify-between h-[500px] mb-4 gap-4">
      <div class="w-3/5 h-full flex flex-col">
        <!-- Informations générales -->
        <GeneralInfo 
          :project="project" 
          :isEditing="isEditing" 
          class="mb-4 flex-grow"
        />

        <!-- Ressources -->
        <Ressources 
          :project="project" 
          :isEditing="isEditing" 
          :equipes="equipes"
          class="flex-grow"
        />
      </div>

      <!-- Informations complémentaires -->
      <div class="w-2/5 h-[500px] flex flex-col">
        <FurtherInfo 
          :project="project"
          :isEditing="isEditing"
          class="flex-grow"
        />
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
</template>

<script>
import ProjectHeader from "./ProjectHeader.vue";
import EventInProject from "./Events/EventInProject.vue";
import PopupEvent from "@/components/Popups/PopupEvent.vue";

import GeneralInfo from "./GeneralInfo.vue";
import Ressources from "./Ressources/Ressources.vue";
import FurtherInfo from "./FurtherInfo/FurtherInfo.vue";

import { fetchEquipes } from "@/services/equipeService";
import { fetchEvents, updateEvent, deleteEvent, addEvent } from "@/services/eventService";
import { fetchProjectDetails, updateProject } from "@/services/projectService";
import { deleteTaskAndSubTasks, fetchTasks } from "@/services/taskService";

export default {
  name: "ProjectDetails",
  components: { GeneralInfo, ProjectHeader, FurtherInfo, Ressources, EventInProject, PopupEvent },
  props: {
    id: String,
  },
  data() {
    return {
      project: {
        ressources: [], // Initialize ressources to an empty array
        clientId: ''
      },
      equipes: [],
      events: [],
      tasks: [],
      isEditing: false,
      popupVisible: false,
      popupSelected: "",
      selectedEvent: null,
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
        const projectData = await fetchProjectDetails(this.id);
        
        this.project = {
          ...projectData,
          startDate: new Date(projectData.startDate).toISOString().slice(0, 10), // Convert to YYYY-MM-DD
          endDate: new Date(projectData.endDate).toISOString().slice(0, 10) // Convert to YYYY-MM-DD
        };
        
        this.equipes = await fetchEquipes();
        this.events = await fetchEvents();
        this.tasks = await fetchTasks();
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
.flex-grow {
  flex-grow: 1;
}
</style>