<template>
  <div class="project-page">
    <div class="page-header">
      <h1>Liste des projets</h1>
      <button class="addButton" @click="addNewProject">+</button>
    </div>

    <ProjectItem
      v-for="(project, index) in projects"
      :key="index"
      :project="project"
      :clients="clients"
      :equipes="equipes"
      :ressources="ressources"
      :events="events"
      :selectedRessource="selectedRessource"
      :selectedTeam="selectedTeam"
      @addRessource="addNewRessourceToProject"
      @deleteProject="deleteExistingProject"
      @updateProject="updateExistingProject"
      @toggleDetails="toggleDetails"
      @updateProjectName="updateProjectName"
      @deleteRessource="deleteRessourceInProject"
    />

    <button class="bigAddBox" @click="addNewProject">+</button>
  </div>
</template>

<script>
import ProjectItem from "./ProjectItem.vue";
import {
  fetchProjects,
  addProject,
  updateProject,
  deleteProject,
  fetchProjectRessource,
  addRessourceToProject,
  deleteRessourceFromProject,
} from "../../services/projectService";
import { fetchClients } from "../../services/clientService";
import { fetchRessources } from "../../services/ressourceService";
import { fetchEquipes } from "../../services/equipeService";
import { fetchEvents } from "@/services/eventService";

export default {
  name: "ProjectPage",
  components: { ProjectItem },
  data() {
    return {
      projects: [],
      ressources: [],
      events: [],
      clients: [],
      equipes: [],
      selectedRessource: {},
      selectedTeam: {},
    };
  },
  methods: {
    async loadProjects() {
      const loadedProjects = await fetchProjects();
      this.projects = loadedProjects.map((project) => ({
        ...project,
        showDetails: false,
      }));

      this.projects.forEach((p) => (this.selectedRessource[p.id] = ""));
      this.projects.forEach((p) => (this.selectedTeam[p.id] = ""));
    },
    async loadDatas() {
      this.events = await fetchEvents();
      this.clients = await fetchClients();
      this.ressources = await fetchRessources();
      this.equipes = await fetchEquipes();
    },
    async addNewProject() {
      console.log("Ajouter un projet");
      const project = await addProject("Nouveau Projet");
      this.projects.push({ ...project, showDetails: false });
      this.selectedRessource[project.id] = "";
    },
    async addNewRessourceToProject(project, teamId, ressourceId) {
      await addRessourceToProject(project.id, teamId, ressourceId);
      project.ressources.push({ teamId, ressourceId });
    },
    async deleteExistingProject(projectId) {
      console.log("Supprimer un projet");
      await deleteProject(projectId);
      this.projects = this.projects.filter((p) => p.id !== projectId);
    },
    async toggleDetails(projectId) {
      const project = this.projects.find((p) => p.id === projectId);
      if (project) {
        project.showDetails = !project.showDetails;
        if (project.showDetails && !project.ressources) {
          project.ressources = await fetchProjectRessource(projectId);
        }
      }
    },
    async updateProjectName(p) {
      const proj = this.projects.find((project) => project.id === p.id);
      proj.name = p.name;
      await updateProject(proj);
    },
    async updateExistingProject(project) {
      await updateProject(project);
    },
    async deleteRessourceInProject(project, ressourceId) {
      await deleteRessourceFromProject(project.id, ressourceId);
      project.ressources = project.ressources.filter(
        (r) => r.ressourceId !== ressourceId
      );
    },
  },
  mounted() {
    this.loadProjects();
    this.loadDatas();
  },
};
</script>
  
<style scoped>  
  .project-page {
    padding: 1rem;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  .project-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .project-item {
    display: flex;
    text-align: left;
    flex-direction: column;
    background-color: #eaeaea;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
  }

  .bigAddBox{
    background-color: #eaeaea;
    padding: 1rem;
    border-radius: 8px;
    margin-top: 1rem;
    border: 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    text-align: center;
    font-size: 4rem;
  }
  
  .project-status {
    display: flex;
    gap: 1.5rem;
    margin-top: 0.5rem;
  }
  
  .project-status label {
    font-size: 1rem;
    color: #555;
    display: flex;
    align-items: center;
  }

  p{
    text-align: left;
  }

  .page-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.addButton{
  border: 0px;
  background-color: #eaeaea;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 2em;
  width: 40px;
  height: 40px;
}

.addRessourceButton{
  border: 0px;
  background-color: #eaeaea;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding:4px;
  font-size: 1em;
}

.toggle-button {
  background: none;
  border: none;
  margin:0;
  padding:0;
  font-size: 1.5rem;
  cursor: pointer;
}

.comp-header{
  margin:0;
  padding:0;
}

.project-details {
  margin-top: 0.5rem;
  padding: 1rem;
  background-color: #dcdcdc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.addRessourcesDiv{
  margin-top: 0.5rem;
  padding: 8px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  justify-content: space-between;
}

.selectDiv{
  display: flex;
  justify-content: center;
  justify-content: space-between;
}

select{
  margin-right: 4px;
}

.ressourcesDiv{
  margin-top: 0.5rem;
  padding: 8px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.eventsDiv{
  margin-top: 0.5rem;
  padding: 8px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.project-details label {
  display: block;
  margin-bottom: 0.5rem;
}

.project-status {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>

  