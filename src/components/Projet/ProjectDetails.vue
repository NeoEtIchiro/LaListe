<template>
    <div class="project-details">
      <label>Client associé :
        <select v-model="project.clientId" @change="updateProject">
          <option value="">Aucun client</option>
          <option v-for="client in clients" :key="client.id" :value="client.id">
            {{ client.name }}
          </option>
        </select>
      </label>
  
      <label>Type projet :
        <select @change="updateProject">
          <option value="">Autre</option>
          <option value="">Autonomie</option>
          <option value="">Cesi</option>
          <option value="">Chaudière</option>
        </select>
      </label>
  
      <label>Adresse : <input type="text" /></label>
      <label>Code postal : <input type="text" /></label>
      <label>Ville : <input type="text" /></label>
  
      <label>Date et heure de début :
        <input type="date" />
        <input type="time" />
      </label>
  
      <label>Date et heure de fin :
        <input type="date" />
        <input type="time" />
      </label>
  
      <label>Ressources (Humaines/Matérielles) :
        <div class="addRessourcesDiv">
          <div class="selectDiv">
            <select :value="selectedTeam">
              <option value="">Toutes les ressources</option>
              <option v-for="equipe in equipes" :key="equipe.id" :value="equipe.id">
                Équipe {{ equipe.name }}
              </option>
            </select>
  
            <select :value="selectedRessource">
              <option v-if="selectedTeam" value="">Toute l'équipe</option>
              <option v-else value="">Aucune ressource sélectionnée</option>
              <option
                v-for="ressource in availableRessources"
                :key="ressource.id"
                :value="ressource.id"
              >
                {{ ressource.name }}
              </option>
            </select>
          </div>
  
          <button
            class="addRessourceButton"
            @click="addRessource"
            :disabled="!selectedTeam && !selectedRessource"
          >
            Ajouter
          </button>
        </div>
  
        <div class="ressourcesDiv" v-if="project.ressources.length">
          <RessourceInProject
            v-for="ressourceProj in project.ressources"
            :key="ressourceProj.ressourceId"
            :ressourceProj="ressourceProj"
            :equipeName="getEquipeName(ressourceProj.teamId)"
            @delete="deleteRessource"
          />
        </div>
      </label>
  
      <label>Événements :
        <div class="eventsDiv">
          <EventInProject
            v-for="(event, index) in projectEvents"
            :key="index"
            :event="event"
          />
        </div>
      </label>
    </div>
  </template>
  
  <script>
  import RessourceInProject from "./RessourceInProject.vue";
  import EventInProject from "./EventInProject.vue";
  
  export default {
    name: "ProjectDetails",
    components: { RessourceInProject, EventInProject },
    props: {
      project: Object,
      clients: Array,
      equipes: Array,
      ressources: Array,
      events: Array,
      selectedRessource: String,
      selectedTeam: String,
    },
    computed: {
      projectEvents() {
        return this.events.filter((e) => e.project === this.project.id);
      },
      availableRessources() {
        if (this.selectedTeam) {
          const equipe = this.equipes.find((e) => e.id === this.selectedTeam);
          if (equipe) {
            const teamRessources = equipe.ressources.map((id) =>
              this.ressources.find((r) => r.id === id)
            );
            return teamRessources.filter(
              (resource) =>
                resource && !this.project.ressources.some((r) => r.ressourceId === resource.id)
            );
          }
        }
        return this.ressources.filter(
          (resource) =>
            !this.project.ressources.some((r) => r.ressourceId === resource.id)
        );
      },
    },
    methods: {
      updateProject() {
        this.$emit("updateProject", this.project);
      },
      addRessource() {
        this.$emit("addRessource", this.selectedTeam, this.selectedRessource);
      },
      deleteRessource(ressourceId) {
        this.$emit("deleteRessource", ressourceId);
      },
      getEquipeName(equipeId) {
        const equipe = this.equipes.find((e) => e.id === equipeId);
        return equipe ? `Équipe ${equipe.name}` : "Aucune équipe";
      },
    },
  };
</script>
  
  