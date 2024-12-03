<template>
  <div class="project-page">
    <div class="page-header">
      <h1>Liste des projets</h1>
      <button class="addButton" @click="addNewProject">+</button>
    </div>
    
    <div class="project-list" ref="projectList">
      <div v-for="(project, index) in projects" :key="index" class="project-item">
        
        <div class="project-header">
          <Header class="comp-header"
            :deleteFunc="deleteExistingProject"
            :updateFunc="updateProjectName"
            :editable="project"
          ></Header>
          <!-- Bouton pour afficher ou masquer les détails -->
          <button @click="toggleDetails(project.id)" class="toggle-button">
            <span v-if="project.showDetails">▲</span>
            <span v-else>▼</span>
          </button>
        </div>

        <!-- Conteneur pour les détails -->
        <div v-if="project.showDetails" class="project-details">
          <label>Client associé :
            <select v-model="project.clientId" @change="updateExistingProject(project)">
              <option value="">Aucun client</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.name }}
              </option>
            </select>
          </label>

          <label>Type projet :
            <select @change="updateExistingProject(project)">
              <option value="">Autre</option>
              <option value="">Autonomie</option>
              <option value="">Cesi</option>
              <option value="">Chaudière</option>
            </select>
          </label>

          <label>Adresse :
            <input type="text">
          </label>

          <label>Code postal :
            <input type="text">
          </label>

          <label>Ville :
            <input type="text">
          </label>

          <label>Date et heure de début :
            <input v-model="startDate" type="date" />
            <input v-model="startTime" type="time" />
          </label>

          <label>Date et heure de fin :
            <input v-model="endDate" type="date" />
            <input v-model="endTime" type="time" />
          </label>

          <label>Ressources (Humaines/Matérielles) :
            <div class="ressourcesDiv">
              <RessourceInProject v-for="(ressourceProj, index) in getProjectRessources(project)" :key="index" :ressourceProj="ressourceProj"></RessourceInProject>
            </div>
          </label>

          <label>Evènements :
            <div class="eventsDiv">
              <EventInProject v-for="(event, index) in getProjectEvents(project)" :key="index" :event="event"></EventInProject>
            </div>
          </label>
        </div>
      </div>
    </div>
    
    <button class="bigAddBox" @click="addNewProject">+</button>
  </div>
</template>

  
<script>
  import { fetchProjects, addProject, updateProject, deleteProject, fetchProjectRessource, addProjectRessource, updateProjectRessource, deleteProjectRessource } from '../../services/projectService';
  import { fetchClients } from '../../services/clientService';
  import { fetchEvents } from '@/services/eventService';
  import ContextMenu from '../Others/ContextMenu.vue';
  import Header from '../Others/Header.vue';
  import EventInProject from './EventInProject.vue';
  import RessourceInProject from './RessourceInProject.vue';

export default {
  name: "ProjectPage",
  components: {
    ContextMenu,
    Header,
    EventInProject,
    RessourceInProject
  },
  data() {
    return {
      projects: [],
      clients: [], // Liste des clients pour sélection
      events: []
    };
  },
  methods: {
    async loadProjects() {
      const loadedProjects = await fetchProjects();
      this.projects = loadedProjects.map(project => ({
        ...project,
        showDetails: false, // Ajouter la propriété showDetails
      }));
    },
    async loadDatas() {
      this.clients = await fetchClients();
      this.events = await fetchEvents();
    },
    async addNewProject() {
      const project = await addProject("Nouveau Projet");
      this.projects.push({
        ...project,
        showDetails: false, // Initialiser la propriété showDetails
      });

      this.$nextTick(() => {
        const projectList = this.$refs.projectList;
        if (projectList) {
          projectList.lastElementChild.scrollIntoView({ behavior: 'smooth' });
        }
      });
    },
    getProjectEvents(project){
      return this.events.filter((e) => e.project == project.id);
    },
    getProjectRessources(project){
      return fetchProjectRessource(project.id);
    },
    toggleDetails(projectId) {
      const project = this.projects.find(p => p.id === projectId);
      if (project) {
        project.showDetails = !project.showDetails;
      }
    },
    async updateProjectName(p = { id: String, name: String }) {
      const proj = this.projects.find(project => project.id === p.id);
      proj.name = p.name;
      await updateProject(proj);
    },
    async updateExistingProject(project) {
      await updateProject(project);
    },
    async deleteExistingProject(projectId) {
      await deleteProject(projectId);
      this.projects = this.projects.filter(p => p.id !== projectId);
    },
  },
  mounted() {
    this.loadProjects();
    this.loadDatas();
    addProjectRessource("OMlS5gWf46hBxB8x04uE", "GDFW4BC4LWnb4yi6rIns");
  },
}
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

  