<template>
  <div class="ressource-page">
    <h1>Liste des ressources</h1>
    <button v-if="ressources.length < maxRessource" @click="addRessource">Ajouter une ressource</button>
    <div class="ressource-list">
      <div v-for="(ressource, index) in ressources" :key="index" class="ressource-item">
        <div class="ressource-header">
          <div @dblclick="enableEditing(ressource)" class="ressource-name">
            <template v-if="ressource.isEditing">
              <input
                v-model="ressource.name"
                @blur="updateRessourceName(ressource)"
                @keyup.enter="updateRessourceName(ressource)"
                class="edit-input"
                ref="ressourceInput"
              />
            </template>
            <template v-else>
              <h2>{{ ressource.name }}</h2>
            </template>
          </div>
          <div class="menu-container">
            <!-- Bouton menu (trois points) -->
            <div class="menu-button" @click="toggleMenu(ressource)">
              &#x22EE; <!-- Trois points verticaux -->
            </div>
            <!-- Menu contextuel de suppression -->
            <div
              v-if="activeRessourceId === ressource.id"
              class="context-menu"
            >
              <button @click="deleteRessource(ressource.id)">Supprimer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button v-if="ressources.length < maxRessource" class="bigAddBox" @click="addRessource">+</button>
  </div>
</template>

<script>
import { fetchRessources, addRessource as addNewRessource, updateRessource, deleteRessource as deleteRessourceFromService } from '../../services/ressourceService';

export default {
  name: "RessourcePage",
  data() {
    return {
      ressources: [],
      maxRessource: 5,
      activeRessourceId: null, // ID de la ressource dont le menu est ouvert
    };
  },
  methods: {
    async fetchRessources() {
      this.ressources = await fetchRessources();
      this.ressources.forEach(ressource => {
        ressource.isEditing = false;
      });
    },
    async addRessource() {
      const ressource = await addNewRessource("Nouvelle Ressource");
      ressource.isEditing = false;
      this.ressources.push(ressource);
    },
    enableEditing(ressource) {
      ressource.isEditing = true;
      this.$nextTick(() => {
        const input = this.$refs.ressourceInput;
        if (input && input[0]) {
          input[0].focus();
        }
      });
    },
    async updateRessourceName(ressource) {
      ressource.isEditing = false;
      await updateRessource(ressource);
    },
    toggleMenu(ressource) {
      // Définit l'ID de la ressource pour afficher son menu, ou le cache si déjà actif
      this.activeRessourceId = this.activeRessourceId === ressource.id ? null : ressource.id;
      if (this.activeRessourceId) {
        document.addEventListener("click", this.handleClickOutside);
      } else {
        document.removeEventListener("click", this.handleClickOutside);
      }
    },
    handleClickOutside(event) {
      // Vérifie si le clic est en dehors du menu ouvert
      const menuButton = event.target.closest(".menu-button");
      const contextMenu = event.target.closest(".context-menu");

      if (!menuButton && !contextMenu) {
        this.activeRessourceId = null;
        document.removeEventListener("click", this.handleClickOutside);
      }
    },
    async deleteRessource(ressourceId) {
      // Supprime la ressource de la liste et de Firestore
      this.ressources = this.ressources.filter(res => res.id !== ressourceId);
      await deleteRessourceFromService(ressourceId);
    },
  },
  mounted() {
    this.fetchRessources();
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  }
};
</script>

<style scoped>
  .ressource-name h2 {
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

.ressource-page {
  padding: 1rem;
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.ressource-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ressource-item {
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  text-align: left;
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

.ressource-status {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.ressource-status label {
  font-size: 1rem;
  color: #555;
  display: flex;
  align-items: center;
}

p{
  text-align: left;
}

.ressource-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-container {
  position: relative; /* Pour positionner le menu contextuel */
}

.menu-button {
  cursor: pointer;
  font-size: 1.5rem;
  padding: 5px;
}

.context-menu {
  position: absolute;
  top: 0; /* Aligne le menu au niveau des trois points */
  right: 20px; /* Décale le menu pour le placer à côté des trois points */
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 5px 10px;
  border-radius: 4px;
  z-index: 1;
}

.context-menu button {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 1rem;
  padding: 5px 0;
}
</style>