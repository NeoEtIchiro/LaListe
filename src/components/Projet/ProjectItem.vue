<template>
    <div class="project-item">
      <div class="project-header">
        <Header
          class="comp-header"
          :editable="project"
          :updateFunc="(name) => $emit('updateProjectName', name)"
          :deleteFunc="$emit('deleteProject')">
        </Header>
        <button @click="$emit('toggleDetails')" class="toggle-button">
          <span v-if="project.showDetails">▲</span>
          <span v-else>▼</span>
        </button>
      </div>
  
      <ProjectDetails
        v-if="project.showDetails"
        :project="project"
        :clients="clients"
        :equipes="equipes"
        :ressources="ressources"
        :events="events"
        :selectedRessource="selectedRessource"
        :selectedTeam="selectedTeam"
        @addRessource="$emit('addRessource', $event)"
        @deleteRessource="$emit('deleteRessource', $event)"
      />
    </div>
  </template>
  
  <script>
  import Header from "../Others/Header.vue";
  import ProjectDetails from "./ProjectDetails.vue";
  
  export default {
    name: "ProjectItem",
    components: { Header, ProjectDetails },
    props: {
      project: Object,
      clients: Array,
      equipes: Array,
      ressources: Array,
      events: Array,
      selectedRessource: String,
      selectedTeam: String,
    },
  };
  </script>
  