<template>
  <div class="equipe-page">
    <div class="page-header">
      <h1>Vos Équipes</h1>
      <button class="addButton" @click="addNewEquipe">+</button>
    </div>
    
    <div class="equipe-list" ref="equipeList">
      <div v-for="(equipe, index) in equipes" :key="index" class="equipe-item">
        
        <div class="equipe-header">
          <Header class="comp-header"
            :deleteFunc="deleteExistingEquipe"
            :updateFunc="updateEquipeName"
            :editable="equipe"
          ></Header>
          <!-- Bouton pour afficher ou masquer les détails -->
          <button @click="toggleDetails(equipe.id)" class="toggle-button">
            <span v-if="equipe.showDetails">▲</span>
            <span v-else>▼</span>
          </button>
        </div>

        <!-- Conteneur pour les détails -->
        <div v-if="equipe.showDetails" class="equipe-details">
          <label>Ressources (Humaines/Matérielles) :
            <div class="addRessourcesDiv">
              <select v-model="selectedRessource[equipe.id]">
                <option value="">Aucune ressource selectionnée</option>
                <option
                  v-for="ressource in availableRessources(equipe)"
                  :key="ressource.id"
                  :value="ressource.id"
                >
                  {{ ressource.name }}
                </option>
              </select>

              <button
                class="addRessourceButton"
                @click="addNewRessourceToEquipe(equipe)"
                :disabled="!selectedRessource[equipe.id]"
              >
                Ajouter
              </button>
            </div>

            <div class="ressourcesDiv">
              <RessourceInEquipe
                v-for="ressourceEquipe in equipe.ressources"
                :key="ressourceEquipe"
                :ressourceEquipe="ressourceEquipe"
                :equipe="equipe"
                @delete="deleteRessourceInEquipe"
              ></RessourceInEquipe>
            </div>
          </label>
        </div>
      </div>
    </div>
    
    <button class="bigAddBox" @click="addNewEquipe">+</button>
  </div>
</template>

<script>
import {
  addEquipe,
  fetchEquipes,
  deleteEquipe,
  updateEquipe,
  addRessourceToEquipe,
} from "@/services/equipeService";
import { fetchRessources } from "@/services/ressourceService";
import Header from "../Others/Header.vue";
import RessourceInEquipe from "./RessourceInEquipe.vue";
import { removeRessourceFromEquipe } from "@/services/equipeService";

export default {
  name: "EquipePage",
  components: {
    Header,
    RessourceInEquipe,
  },
  data() {
    return {
      equipes: [],
      ressources: [],
      selectedRessource: {}, // Tracks selected resource for each team
    };
  },
  methods: {
    async loadEquipes() {
      const loadedEquipes = await fetchEquipes();
      this.equipes = loadedEquipes.map((equipe) => ({
        ...equipe,
        ressources: equipe.ressources || [], // Ensure resources are initialized
        showDetails: false,
      }));

      // Initialize selectedRessource tracking
      this.equipes.forEach((e) => (this.selectedRessource[e.id] = ""));
    },
    async addNewEquipe() {
      const equipe = await addEquipe("Nouvelle équipe");
      this.equipes.push({
        ...equipe,
        showDetails: false,
      });

      this.selectedRessource[equipe.id] = "";

      this.$nextTick(() => {
        const equipeList = this.$refs.equipeList;
        if (equipeList) {
          equipeList.lastElementChild.scrollIntoView({ behavior: "smooth" });
        }
      });
    },
    availableRessources(equipe) {
      return this.ressources.filter(
        (ressource) =>
          !equipe.ressources?.includes(ressource.id)
      );
    },
    async addNewRessourceToEquipe(equipe) {
      const selectedId = this.selectedRessource[equipe.id];
      if (!selectedId) {
        alert("Veuillez sélectionner une ressource.");
        return;
      }

      // Add the resource to the database
      await addRessourceToEquipe(equipe.id, selectedId);

      // Ensure `equipe.ressources` is initialized
      if (!equipe.ressources) {
        equipe.ressources = []; // Initialize as an empty array
      }

      // Add the new resource ID to the team's resources
      equipe.ressources.push(selectedId);

      // Reset the selected resource for this team
      this.selectedRessource[equipe.id] = "";
    },
    async toggleDetails(equipeId) {
      const equipe = this.equipes.find((p) => p.id === equipeId);
      if (equipe) {
        equipe.showDetails = !equipe.showDetails;

        // Fetch resources when expanding for the first time
        if (equipe.showDetails && !equipe.ressources) {
          equipe.ressources = await fetchEquipeRessource(equipeId);
        }
      }
    },
    async deleteRessourceInEquipe(equipe, ressourceId) {
      // Remove the resource from the database
      await removeRessourceFromEquipe(equipe.id, ressourceId);

      // Update the resources array without directly modifying it
      equipe.ressources = equipe.ressources.filter(
        (existingRessourceId) => existingRessourceId !== ressourceId
      );

      // Reset the selected resource for this team (optional)
      this.selectedRessource[equipe.id] = "";
    },
    async updateEquipeName(p = { id: String, name: String }) {
      const proj = this.equipes.find((equipe) => equipe.id === p.id);
      proj.name = p.name;
      await updateEquipe(proj);
    },
    async deleteExistingEquipe(equipeId) {
      await deleteEquipe(equipeId);
      this.equipes = this.equipes.filter((p) => p.id !== equipeId);
    },
  },
  async mounted() {
    await this.loadEquipes();
    this.ressources = await fetchRessources();
  },
};
</script>
  
<style scoped>  
  .equipe-page {
    padding: 1rem;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  .equipe-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .equipe-item {
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
  
  .equipe-status {
    display: flex;
    gap: 1.5rem;
    margin-top: 0.5rem;
  }
  
  .equipe-status label {
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

.equipe-details {
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

.ressourcesDiv{
  margin-top: 0.5rem;
  padding: 8px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.equipe-details label {
  display: block;
  margin-bottom: 0.5rem;
}

.equipe-status {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>

  