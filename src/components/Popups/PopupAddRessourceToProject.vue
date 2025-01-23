<template>
    <Popup :visible="visible" @close="$emit('close')"
           :title="ressource ? 'Modifier une ressource' : 'Ajouter une ressource'"        
    >
    <form @submit.prevent="saveRessource">
        <select v-model="editableRessource.teamId">
            <option value="">Toutes les ressources</option>
            <option v-for="equipe in equipes" :key="equipe.id" :value="equipe.id">
                Équipe {{ equipe.name }}
            </option>
        </select>
        <select v-model="editableRessource.ressourceId">
            <option v-if="editableRessource.teamId" value="">Toute l'équipe</option>
            <option v-else value="">Aucune ressource sélectionnée</option>
            <option v-for="ressource in getAvailableRessources(editableRessource.teamId)" :key="ressource.id" :value="ressource.id">
                {{ ressource.name }}
            </option>
        </select>
        <input type="checkbox" v-model="editableRessource.responsable" />
        <div class="flex h-8 mb-2 justify-between">
            <button class="m-0 mt-2" @click="$emit('close')">Annuler</button>
            <button class="callToAction m-0 mt-2" type="submit" 
                    :disabled="editableRessource.ressourceId=='' && editableRessource.teamId==''" 
                    @click="$emit('close'); saveRessource()">
                Ajouter
            </button>
        </div>
      </form>
    </Popup>
  </template>
  
    
  <script>
  import Popup from '@/components/Popups/Popup.vue';
  import { fetchRessources } from '@/services/ressourceService';
  
  export default {
    props: ['ressource', 'position', 'visible', 'equipes', 'projectRessources'],
    components: {
      Popup,
    },
    data() {
      return {
        editableRessource: null,
        ressources: [],
        popupWidth: 250,
        popupHeight: 350,
      };
    },
    methods: {
        async loadOptions() {
            this.ressources = await fetchRessources();
        },
        setDatas(){
            if(!this.ressource) {
            this.editableRessource = {
                    responsable: false,
                    ressourceId: '',
                    teamId: '',
                };
            }
            else{
            this.editableRessource = { ...this.ressource };
            }
        },
        getAvailableRessources(teamId) {
            console.log(this.projectRessources);
            const projectRessourceIds = this.projectRessources.map(r => r.ressourceId);
            
            if (teamId) {
                const equipe = this.equipes.find(e => e.id === teamId);
                if (equipe) {
                return this.ressources.filter(r => 
                    equipe.ressources.includes(r.id) && !projectRessourceIds.includes(r.id)
                );
                }
            }
            return this.ressources.filter(r => !projectRessourceIds.includes(r.id));
        },
        saveRessource() {
            if(this.ressource == null){
                this.$emit('add', this.editableRessource); 
            } 
            else{
                this.$emit('update', this.editableRessource);
            } 
        },
    },
    mounted() {
        this.loadOptions(); // Charger les options des selects au montage
    },
    watch:{
      ressource: {
        handler() {
          // À chaque changement de 'ressource', on appelle setDatas
          this.setDatas();
        },
        deep: true,       // Surveille aussi les changements à l'intérieur de l'objet
        immediate: true   // Appelle le handler dès que le composant est monté
      },
      editableRessource: 'saveRessource',
    }
  };
  </script>
  
  
    
  <style scoped>
    .edit-popup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      border: 1px solid #ddd;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 1rem;
      border-radius: 8px;
      width: 250px;
      z-index: 10;
    }
    
    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  </style>