<template>
    <Popup :visible="visible" 
           :title="ressource ? 'Modifier une ressource' : 'Ajouter une ressource'"
           :add="!ressource"
           :addDisabled="editableRessource.ressourceId=='' && editableRessource.teamId==''"
           @close="$emit('close')"
           @add="saveRessource"
           @update="saveRessource"
           @delete="$emit('delete', editableRessource.ressourceId)"    
    >
    <form>
      <div class="flex items-center">
        <select v-model="editableRessource.teamId" class="mr-1 h-8">
              <option v-if="!ressource" value="">Toutes les ressources</option>
              <option v-else value="">Aucune équipe</option>
              <option v-for="equipe in equipes" :key="equipe.id" :value="equipe.id">
                  Équipe {{ equipe.name }}
              </option>
        </select>
        <div class="divNom flex items-center w-auto h-8 mr-3 px-2 py-1  rounded-md" v-if="ressource" >{{ findRessourceName(editableRessource.ressourceId) }}</div>
        <select v-else v-model="editableRessource.ressourceId" class="mr-3">
              <option v-if="editableRessource.teamId" value="">Toute l'équipe</option>
              <option v-else value="">Aucune ressource sélectionnée</option>
              <option v-for="ressource in getAvailableRessources(editableRessource.teamId)" :key="ressource.id" :value="ressource.id">
                  {{ ressource.name }}
              </option>
        </select>
        <select v-model="editableRessource.role">
              <option value="Aucun rôle">Aucun rôle</option>
              <option value="Responsable">Responsable</option>
              <option value="Co-Responsable">Co-Responsable</option>
              <option value="Commercial">Commercial</option>
              <option value="Participant">Participant</option>
        </select>
      </div>
    </form>
    </Popup>
  </template>
  
    
  <script>
  import Popup from '@/components/Popups/Popup.vue';
  import { fetchRessources } from '@/services/ressourceService';
  
  export default {
    props:['ressource', 'position', 'visible', 'equipes', 'projectRessources'],
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
        findRessourceName(ressourceId){
            const ressource = this.ressources.find(r => r.id === ressourceId);
            return ressource ? ressource.name : '';
        },
        setDatas(){
            if(!this.ressource) {
                this.editableRessource = {
                        role: 'Aucun rôle',
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
            console.log("On emit l'ajout d'une ressource");
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
      visible: {
        handler() {
          // À chaque changement de 'ressource', on appelle setDatas
          this.setDatas();
        },
        deep: true,       // Surveille aussi les changements à l'intérieur de l'objet
        immediate: true   // Appelle le handler dès que le composant est monté
      },
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

    select{
        border-radius: 8px;
        height: 32px;    
    }

    .divNom{
      background-color: #f0f0f0;
      border: 1px solid black;
    }
  </style>