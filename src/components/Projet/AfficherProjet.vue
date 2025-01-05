<template>
  <div class="project-page">
    <div class="page-header">
      <h1>Liste des projets</h1>
      <button class="addButton" @click="addNewProject">+</button>
    </div>

    <div class="projectDiv"
      v-for="(project, index) in projects"
      :key="index"
      @click="openProjectDetails(project.id)"
    >
      <p>{{ project.name }}</p>
    </div>
  </div>
</template>

<script>
import { fetchProjects, addProject } from "@/services/projectService";

export default {
  data() {
    return {
      projects: []
    };
  },
  methods: {
    async fetchProjects() {
      this.projects = await fetchProjects();
    },
    async addNewProject() {
      const project = await addProject();
      this.projects.push(project);
      this.$router.push({ path: `/Projet/${project.id}` });
    },
    openProjectDetails(projectId) {
      this.$router.push({ path: `/Projet/${projectId}` });
    }
  },
  mounted() {
    this.fetchProjects();
  }
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

  
.projectDiv{
  background-color: rgb(199, 199, 199);
  padding: 8px;
  margin-bottom: 8px;
  text-align: left;
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
  background-color: #eaeaea;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 2em;
  width: 40px;
  height: 40px;
}
</style>