<template>
    <div class="project-page">
      <h1>Liste des Projets</h1>
      <button @click="addNewProject">Ajouter un projet</button>
      
      <div class="project-list">
        <div v-for="(project, index) in projects" :key="index" class="project-item">
          
          <div class="project-header">
            <!-- Nom du projet avec édition en ligne -->
            <div @dblclick="enableEditing(project)" class="project-name">
              <template v-if="project.isEditing">
                  <input 
                  v-model="project.name" 
                  @blur="updateProjectName(project)" 
                  @keyup.enter="updateProjectName(project)" 
                  class="edit-input"
                  ref="projectInput"
                  />
              </template>
              <template v-else>
                  <h2>{{ project.name }}</h2>
              </template>
            </div>

            <ContextMenu
              :id="project.id"
              :deleteFunc="deleteExistingProject"
            />
          </div>
  
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
  
  export default {
    name: "ProjectPage",
    components:{
      ContextMenu,
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
        // Ajouter l'état "isEditing" pour chaque projet
        this.projects.forEach(project => project.isEditing = false);
      },
      async loadClients() {
        this.clients = await fetchClients();
      },
      async addNewProject() {
        const project = await addProject("Nouveau Projet");
        project.isEditing = false;
        this.projects.push(project);
      },
      enableEditing(project) {
        project.isEditing = true;
        this.$nextTick(() => {
            // Donne le focus à l'input dès qu'il est visible
            const input = this.$refs.projectInput;
            if (input && input[0]) {
            input[0].focus();
            }
        });
        },
      async updateProjectName(project) {
        project.isEditing = false;
        await updateProject(project); // Met à jour le nom du projet en base de données
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
  
  .project-name h2 {
    margin: 0;
    margin-bottom: 15px;
    font-size: 1.5rem;
  }
  
  .edit-input {
    font-size: 1.5rem;
    margin-bottom: 15px;
    font-weight: bold;
    padding: 0;
    border: none;
    background-color: transparent;
    outline: none; /* Supprime le contour de focus */
    color: inherit; /* Conserve la couleur du texte */
    width: 100%;
    cursor: text; /* Affiche le curseur de texte pour indiquer que c’est éditable */
  }
  
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
    background-color: #f7f7f7;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
  }

  .bigAddBox{
    background-color: #f7f7f7;
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

  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
  