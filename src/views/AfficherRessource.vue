<template>
    <div class="ressource-page">
        <div class="flex justify-between items-center mb-4">
            <h1 class="m-0 text-2xl select-none">Ressources humaines et matérielles</h1>
            <button class="callToAction px-4 select-none" v-if="ressources.length < maxRessource" @click="selectedRessource=null; popupVisible=true">Ajouter une ressource</button>
        </div>
        
        <div 
            v-for="ressource in ressources" 
            :key="ressource.id" 
            class="basicContainer mb-8"
            @dblclick="selectedRessource=ressource; popupVisible=true"
        >
            <div class="select-none w-full text-left">
                {{ ressource.firstName }}
            </div>
        </div>
        
        <!-- Popup pour ajouter/modifier une ressource -->
        <PopupRessource
            :visible="popupVisible"
            :ressource="selectedRessource"
            :ressources="ressources"
            @close="popupVisible=false"
            @add="handleAddRessource"
            @update="handleUpdateRessource"
            @delete="handleDeleteRessource"
        />
    </div>
</template>

<script>
import { fetchRessources, addRessource, updateRessource, deleteRessource } from '@/services/ressourceService';
import Header from '@/components/Others/Header.vue';
import PopupRessource from '@/components/Popups/PopupRessource.vue';

export default {
  name: "RessourcePage",
  components: {
    Header,
    PopupRessource,
  },
  data() {
    return {
      ressources: [],
      maxRessource: 5,
      popupVisible: false,
      selectedRessource: null, // s'il s'agit d'une édition, sinon null pour ajouter
    };
  },
  methods: {
    async fetchRessources() {
      this.ressources = await fetchRessources();
      this.ressources.forEach(ressource => {
        ressource.isEditing = false;
      });
    },
    async handleAddRessource(newRessource) {
      if(!newRessource) return;

      console.log("Add ressource");
      // Appel au service pour ajouter la ressource
      const added = await addRessource(newRessource);
      
      this.ressources.push(added);

      this.$nextTick(() => {
        const ressourceList = this.$refs.ressourceList;
        if (ressourceList) {
          ressourceList.lastElementChild.scrollIntoView({ behavior: 'smooth' });
        }
      });
    },
    async handleUpdateRessource(updatedRessource) {
      if(!updatedRessource) return;

      const index = this.ressources.findIndex(res => res.id === updatedRessource.id);
      if(index !== -1) {
        // On met à jour la ressource locale et dans le service
        this.ressources.splice(index, 1, { ...updatedRessource, isEditing: false });
        await updateRessource(updatedRessource);
      }
    },
    async handleDeleteRessource(ressourceId) {
      if(!ressourceId) return;

      this.ressources = this.ressources.filter(res => res.id !== ressourceId);
      await deleteRessource(ressourceId);
    },
    async updateRessource(updatedRessource) {
      const index = this.ressources.findIndex(ress => ress.id === updatedRessource.id);
      if (index !== -1) {
        Object.assign(this.ressources[index], updatedRessource);
        await updateRessource(updatedRessource);
      }
    },
  },
  mounted() {
    this.fetchRessources();
  }
};
</script>

<style scoped>

</style>