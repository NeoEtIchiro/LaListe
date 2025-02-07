<template>
  <div class="project-details">
    <!-- Header -->
    <ProjectHeader class="mb-4" 
      :project="project" 
      :isEditing="isEditing" 
      @toggle-editing="isEditing = !isEditing"
    />

    <!-- Partie hautes --> 
    <div class="flex justify-between h-[616px] gap-4 mb-4">
      <div class="w-3/5 m-0">
        <!-- Informations générales -->
        <GeneralInfo 
          :project="project" 
          :isEditing="isEditing" 
          class="h-[350px] max-h-[350px] min-h-[350px] mb-4"
        />

        <!-- Ressources -->
        <Ressources 
          :project="project" 
          :isEditing="isEditing" 
          :equipes="equipes"
          class="flex-grow !h-[250px] !max-h-[250px] !min-h-[250px] m-0"
        />
      </div>

      <!-- Informations complémentaires -->
      <div class="w-2/5 h-full flex flex-col m-0">
        <FurtherInfo 
          :project="project"
          :isEditing="isEditing"
          class="h-full m-0"
        />
      </div>
    </div>

    <!-- Etapes -->
    <div>
      <Events
        :project="project"
        :isEditing="isEditing"
        :equipes="equipes"
      />
    </div>
  </div>
</template>

<script>
import ProjectHeader from "./ProjectHeader.vue";

import GeneralInfo from "./GeneralInfo.vue";
import Ressources from "./Ressources/Ressources.vue";
import FurtherInfo from "./FurtherInfo/FurtherInfo.vue";
import Events from "./Events/Events.vue";

import { fetchEquipes } from "@/services/equipeService";
import { fetchProjectDetails, updateProject } from "@/services/projectService";

export default {
  name: "ProjectDetails",
  components: { GeneralInfo, ProjectHeader, FurtherInfo, Ressources, Events },
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
      isEditing: false,
    };
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
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    },
    updateProject() {
      updateProject(this.project);
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
.flex-grow {
  flex-grow: 1;
}
</style>