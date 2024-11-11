<template>
    <div class="project-page">
      <div class="page-header">
        <h1>Liste des projets</h1>
        <button class="addButton" @click="addNewProject">+</button>
      </div>
      
      <div class="project-list" ref="projectList">
        <div v-for="(project, index) in projects" :key="index" class="project-item">
          
          <Header
            :deleteFunc="deleteExistingProject"
            :updateFunc="updateProjectName"
            :editable="project"
          >
          </Header>
  
          <!-- Sélection du client -->
          <label>Client associé :
            <select v-model="project.clientId" @change="updateExistingProject(project)">
              <option value="">Aucun client</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.name }}
              </option>
            </select>
          </label>
  
          <!-- Statut du projet -->
          <div class="project-status">
            <label>
              <input type="checkbox" v-model="project.status.started" @change="updateExistingProject(project)" /> 
              Projet commencé
            </label>
            <label>
              <input type="checkbox" v-model="project.status.testing" @change="updateExistingProject(project)" /> 
              Projet en phase de test
            </label>
            <label>
              <input type="checkbox" v-model="project.status.completed" @change="updateExistingProject(project)" /> 
              Projet terminé
            </label>
          </div>
        </div>
      </div>
      
      <button class="bigAddBox" @click="addNewProject">+</button>
    </div>
  </template>
  
  <script>
  import { fetchProjects, addProject, updateProject, deleteProject } from '../../services/projectService';
  import { fetchClients } from '../../services/clientService';
  import ContextMenu from '../Others/ContextMenu.vue';
  import Header from '../Others/Header.vue';

  export default {
    name: "ProjectPage",
    components:{
      ContextMenu,
      Header
    },
    data() {
      return {
        projects: [],
        clients: [] // Liste des clients pour sélection
      };
    },
    methods: {
      async loadProjects() {
        this.projects = await fetchProjects();
      },
      async loadClients() {
        this.clients = await fetchClients();
      },
      async addNewProject() {
        const project = await addProject("Nouveau Projet");
        this.projects.push(project);

        this.$nextTick(() => {
          // Récupère le conteneur de la liste des projets
          const projectList = this.$refs.projectList;

          // Défile jusqu'au bas du conteneur
          if (projectList) {
            projectList.lastElementChild.scrollIntoView({ behavior: 'smooth' });
          }
        });
      },
      async updateProjectName(p = {id: String, name: String}) {
        const proj = this.projects.find(project => project.id === p.id);
        proj.name = p.name;
        await updateProject(proj); // Met à jour le nom du projet en base de données
      },
      async updateExistingProject(project) {
        await updateProject(project);
      },
      async deleteExistingProject(projectId) {
        await deleteProject(projectId);
        this.projects = this.projects.filter(p => p.id !== projectId); // Met à jour la liste localement
      }
    },
    mounted() {
      this.loadProjects();
      this.loadClients();
    }
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
</style>
  