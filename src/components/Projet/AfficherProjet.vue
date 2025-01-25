<template>
  <div class="project-page">
    <div class="page-header">
      <h1>Vos projets en cours</h1>
      <button class="addButton callToAction" @click="addNewProject">
        Ajouter un projet
      </button>
    </div>

    <div class="projectDiv"
      v-for="(project, index) in projects"
      :key="index"
      @click="openProjectDetails(project.id)"
    >
      <div class="projectSemiDiv">
        <p class="titleP">{{ project.name }}{{getClientName(project.clientId)}}</p>
        <p class="littleP">{{ project.description }}</p>
      </div>
      <div class="separator"></div>
      <div class="projectSemiDiv">
        <p class="titleP">Du {{ formatDate(project.startDate) }} au {{ formatDate(project.endDate) }}</p>
        <p class="littleP">{{ project.type }}</p>
      </div>
      <div class="seeProjectDiv">
        <button class="callToAction seeProject">▶</button>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchProjects, addProject } from "@/services/projectService";
import { fetchClients } from "@/services/clientService";

export default {
  data() {
    return {
      projects: [],
      clients: [],
      projectTypes: []
    };
  },
  methods: {
    async fetchProjects() {
      this.projects = await fetchProjects();
      this.clients = await fetchClients();
    },
    getClientName(clientId) {
      const client = this.clients.find(client => client.id === clientId);
      return client ? " pour " + client.name : '';
    },
    async addNewProject() {
      const project = await addProject();
      this.projects.push(project);
      this.$router.push({ path: `/Projet/${project.id}` });
    },
    openProjectDetails(projectId) {
      this.$router.push({ path: `/Projet/${projectId}` });
    },
    formatDate(dateString) {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }
  },
  mounted() {
    this.fetchProjects();
  }
};
</script>
  
<style scoped>  
.project-page {
  padding: 0rem;
}

.page-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 42px;
  margin-bottom: 8px;
}

.addButton{
  border: 0px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 1em;
}
  
  h1 {
    text-align: left;
    margin-bottom: 1.5rem;
    font-size: 1.5em;
    margin: 0;
    color: #333;
  }

  
.projectDiv{
  background-color: #eaeaea;
  padding: 8px;
  height: fit-content;
  margin-bottom: 16px;
  text-align: left;
  border-radius: 8px;
  display: flex;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.projectSemiDiv{
  width: 100%;
  text-align: left;
}

.separator {
  width: 1px;
  background-color: #adadad;
  margin: 0 10px;
}

.titleP{
  margin: 0;
  font-weight: bold;
  font-size: 1.1em;
}

.littleP{
  margin: 8px 0 0 0;
  max-height: 50px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* Change this number to the maximum number of lines you want to display */
}

.seeProjectDiv{
  display: flex;
  justify-content: center;
  align-items: center;
}

.seeProject {
  width: 50px;
  height: 50px;
  font-size: 1.5em;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>