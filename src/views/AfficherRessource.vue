<template>
  <div class="ressource-page">
    <div class="page-header">
      <h1>Liste des ressources</h1>
      <button class="addButton" v-if="ressources.length < maxRessource" @click="addRessource">+</button>
    </div>
    
    <div class="ressource-list" ref="ressourceList">
      <div v-for="(ressource) in ressources" :key="ressource.id" class="ressource-item">
        <Header
          :deleteFunc="deleteRessource"
          :updateFunc="updateRessource"
          :editable="ressource">
        </Header>
        <form>
          <label>Email : </label>
          <input :value="ressource.email">
          <label>Téléphone : </label>
          <input :value="ressource.phone">
        </form>
      </div>
    </div>
    <button v-if="ressources.length < maxRessource" class="bigAddBox" @click="addRessource">+</button>
  </div>
</template>

<script>
import { fetchRessources, addRessource as addNewRessource, updateRessource, deleteRessource as deleteRessourceFromService } from '@/services/ressourceService';
import Header from '@/components/Others/Header.vue';

export default {
  name: "RessourcePage",
  components:{
    Header,
  },
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
      const ressource = await addNewRessource({
        name: "Nouvelle Ressource",
        email: "",
        telephone: ""
      });
      ressource.isEditing = false;
      this.ressources.push(ressource);

      this.$nextTick(() => {
        // Défile jusqu'au bas du conteneur
        const ressourceList = this.$refs.ressourceList;
        if (ressourceList) {
          ressourceList.lastElementChild.scrollIntoView({ behavior: 'smooth' });
        }
      });
    },
    async updateRessource(updatedRessource) {
      const res = this.ressources.find(ressource => ressource.id === updatedRessource.id);
      if (res) {
        res.name = updatedRessource.name;
        res.email = updatedRessource.email;
        res.telephone = updatedRessource.telephone;
        res.isEditing = false;
        await updateRessource(res);
      }
    },
    async deleteRessource(ressourceId) {
      this.ressources = this.ressources.filter(res => res.id !== ressourceId);
      await deleteRessourceFromService(ressourceId);
    },
  },
  mounted() {
    this.fetchRessources();
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
  background-color: #eaeaea;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  text-align: left;
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