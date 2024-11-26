<template>
    <div class="tache-page">
      <div class="page-header">
        <h1>Liste des taches</h1>
        <button class="addButton" @click="addNewTache">+</button>
      </div>
      
      <div class="tache-list" ref="tacheList">
        <div v-for="(tache, index) in taches" :key="index" class="tache-item">
          
          <Header
            :deleteFunc="deleteExistingTache"
            :updateFunc="updateTacheName"
            :editable="tache"
          >
          </Header>
        </div>
      </div>
      
      <button class="bigAddBox" @click="addNewTache">+</button>
    </div>
  </template>
  
  <script>
  import { fetchTaches, addTache, updateTache, deleteTache } from '../../services/tacheService';
  import { fetchClients } from '../../services/clientService';
  import ContextMenu from '../Others/ContextMenu.vue';
  import Header from '../Others/Header.vue';

  export default {
    name: "TachePage",
    components:{
      ContextMenu,
      Header
    },
    data() {
      return {
        taches: []
      };
    },
    methods: {
      async loadTaches() {
        this.taches = await fetchTaches();
      },
      async addNewTache() {
        const tache = await addTache("Nouvelle Tache");
        this.taches.push(tache);

        this.$nextTick(() => {
          // Récupère le conteneur de la liste des projets
          const tacheList = this.$refs.tacheList;

          // Défile jusqu'au bas du conteneur
          if (tacheList) {
            tacheList.lastElementChild.scrollIntoView({ behavior: 'smooth' });
          }
        });
      },
      async updateTacheName(t = {id: String, name: String}) {
        const tac = this.taches.find(tache => tache.id === t.id);
        tac.name = t.name;
        await updateTache(tac); // Met à jour le nom du projet en base de données
      },
      async updateExistingTache(tache) {
        await updateTache(tache);
      },
      async deleteExistingTache(tacheId) {
        await deleteTache(tacheId);
        this.taches = this.taches.filter(t => t.id !== tacheId); // Met à jour la liste localement
      }
    },
    mounted() {
      this.loadTaches();
    }
  }
  </script>
  
<style scoped>  
  .tache-page {
    padding: 1rem;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  .tache-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .tache-item {
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
</style>
  