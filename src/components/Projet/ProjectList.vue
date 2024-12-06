<template>
    <div class="project-list">
      <ProjectItem
        v-for="(project, index) in projects"
        :key="index"
        :project="project"
        :clients="clients"
        :equipes="equipes"
        :ressources="ressources"
        :events="events"
        :selectedRessource="selectedRessource[project.id]"
        :selectedTeam="selectedTeam[project.id]"
        @addRessource="(teamId, ressourceId) => $emit('addRessource', project, teamId, ressourceId)"
        @deleteProject="() => $emit('deleteProject', project.id)"
        @updateProject="() => $emit('updateProject', project)"
        @toggleDetails="() => $emit('toggleDetails', project.id)"
        @updateProjectName="(name) => $emit('updateProjectName', { id: project.id, name })"
        @deleteRessource="(ressourceId) => $emit('deleteRessource', project, ressourceId)"
      />
    </div>
  </template>
  
  <script>
  import ProjectItem from "./ProjectItem.vue";
  
  export default {
    name: "ProjectList",
    components: { ProjectItem },
    props: {
      projects: Array,
      clients: Array,
      equipes: Array,
      ressources: Array,
      events: Array,
      selectedRessource: Object,
      selectedTeam: Object,
    },
  };
  </script>
  