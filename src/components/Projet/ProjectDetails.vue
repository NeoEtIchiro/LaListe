<template>
    <div class="project-details">
      <div class="header">
        <button class="backButton" @click="$router.go(-1)"><</button>
        <h2 id="title">{{ project.name }}</h2>
        <button class="editButton">Modifier</button>
      </div>
      

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
            <select v-model="selectedTeam">
              <option value="">Toutes les ressources</option>
              <option v-for="equipe in equipes" :key="equipe.id" :value="equipe.id">
                Équipe {{ equipe.name }}
              </option>
            </select>
  
            <select v-model="selectedRessource">
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
  import { fetchClients } from "@/services/clientService";
  import { fetchEquipes } from "@/services/equipeService";
  import { fetchRessources } from "@/services/ressourceService";
  import { fetchEvents } from "@/services/eventService";
  import { fetchProjectDetails } from "@/services/projectService";
  
  export default {
    name: "ProjectDetails",
    components: { RessourceInProject, EventInProject },
    props:{
      id: String
    },
    data() {
      return {
        project: {
          ressources: [] // Initialize ressources to an empty array
        },
        clients: [],
        equipes: [],
        ressources: [],
        events: [],
        selectedRessource: "",
        selectedTeam: ""
      };
    },
    computed: {
      projectEvents() {
        return this.events.filter((e) => e.project === this.project.id);
      },
      availableRessources() {
        if (this.selectedTeam && this.equipes.length > 0) {
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
      async fetchProjectData() {
        try {
          this.project = await fetchProjectDetails(this.id);
          this.clients = await fetchClients();
          this.equipes = await fetchEquipes();
          this.ressources = await fetchRessources();
          this.events = await fetchEvents();
        } catch (error) {
          console.error("Error fetching project data:", error);
        }
      },
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
    mounted() {
      this.fetchProjectData();
    }
  };
</script>

<style scoped>

.project-details {
  padding: 16px;
  text-align: left;
}

.header {
  display: flex;
  justify-content: space-between;
}

#title {
  width: 100%;
}

</style>