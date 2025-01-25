<template>
  <Popup :visible="visible" @close="$emit('close')"
         :title="payment ? 'Modifier un événement' : 'Ajouter un événement'"        
  >
    <form @submit.prevent="savePayment">
      
    </form>
  </Popup>
</template>

  
<script>
import Popup from '@/components/Popups/Popup.vue';
import { fetchTaches } from '@/services/tacheService';
import { fetchRessources } from '@/services/ressourceService';
import { fetchProjects } from '@/services/projectService';

export default {
  props: ['payment', 'project', 'position', 'visible', 'equipes'],
  components: {
    Popup,
  },
  data() {
    return {
      editablePayment: { ...this.payment }, // Copie de l'événement passé en props
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      taches: [], // Liste des tâches à charger
      ressources: [], // Liste des ressources à charger
      projects: [],
      popupWidth: 250,
      popupHeight: 350,
    };
  },
  methods: {
    async loadOptions() {
      this.taches = await fetchTaches();
      this.ressources = await fetchRessources();
      this.projects = await fetchProjects();
    },
    setDatas(){
      if(!this.payment) {
        this.editablePayment = {
                ressources: this.project ? this.project.ressources : [],
                date_debut: new Date(),
                date_fin: new Date(),
                title: "",
                description: "",
                tache: "",
                project: this.project ? this.project.id : "",
                isFinished: false,
                orderInProject: 0,
            };
      }
      else{
        this.editablePayment = { ...this.payment };
        if (!this.editablePayment.ressources) {
          this.editablePayment.ressources = []; // Initialiser ressources si elle est indéfinie
        }
      }

      this.startDate = this.formatDate(this.editablePayment.date_debut, 'date');
      this.startTime = this.formatDate(this.editablePayment.date_debut, 'time');
      this.endDate = this.formatDate(this.editablePayment.date_fin, 'date');
      this.endTime = this.formatDate(this.editablePayment.date_fin, 'time');
    },
    getAvailableRessources(teamId) {
      if (teamId) {
        const equipe = this.equipes.find(e => e.id === teamId);
        if (equipe) {
          return this.ressources.filter(r => equipe.ressources.includes(r.id));
        }
      }
      return this.ressources;
    },
    formatDate(datetimeString, type) {
      if (!datetimeString) return '';
      const dateObj = new Date(datetimeString);
      if (type === 'date') {
        return dateObj.toISOString().slice(0, 10); // Format YYYY-MM-DD
      } else if (type === 'time') {
        return dateObj.toTimeString().slice(0, 5); // Format HH:MM
      }
    },
    parseDate(date, time) {
      return `${new Date(`${date}T${time}:00`)}`;
    },
    savePayment() {
      this.editablePayment.date_debut = this.parseDate(this.startDate, this.startTime);
      this.editablePayment.date_fin = this.parseDate(this.endDate, this.endTime);

      if(this.payment == null){
        this.$emit('add', this.editablePayment); 
      } 
      else{
        this.$emit('update', this.editablePayment);
      } 
    },
    addRessourceRow() {
      if(!this.editablePayment.ressources) {
        this.editablePayment.ressources = [];
      }

      this.editablePayment.ressources.push({
        teamId: '',
        ressourceId: '',
        responsable: false,
      });
    },
  },
  mounted() {
    this.loadOptions(); // Charger les options des selects au montage
  },
  watch:{
    payment: {
      handler() {
        // À chaque changement de 'payment', on appelle setDatas
        this.setDatas();
      },
      deep: true,       // Surveille aussi les changements à l'intérieur de l'objet
      immediate: true   // Appelle le handler dès que le composant est monté
    },
    editablePayment: 'savePayment',
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