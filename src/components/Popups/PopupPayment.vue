<template>
  <Popup 
    :visible="visible"
    :title="payment ? 'Modifier un paiement' : 'Ajouter un paiement'"

    :add="!payment"
    @close="$emit('close')"
    @add="savePayment"
    @update="savePayment"
    @delete="$emit('delete', payment.id)"      
  >
  
    <div class="flex gap-2 w-full">
      <!-- Nom du paiment -->
      <div class="relative w-full">
        <input
          type="text"
          id="name"
          v-model="editablePayment.name"
          class="w-full basicInput"
          required
          placeholder="Achat de marchandises" 
        />
        <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
          Nom du paiement
        </span>
      </div>
      <input
        type="color"
        v-model="editablePayment.color"
        class="w-9 min-w-9 basicInput p-0"
      />
    </div>

    <div class="flex gap-2 w-full h-8">
      <!-- Montant -->
      <div class="relative w-full">
        <div class="flex justify-between items-center w-full basicInput">
          <input type="number" v-model="editablePayment.amount" 
            class="flex-grow text-right border-none mr-1 w-[100px] h-full bg-transparent text-lg align-middle"
            placeholder="0"
          />
          <div class="flex items-center text-lg mr-2">€</div>
        </div>
        <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
          Montant
        </span>
      </div>
      
      <div class="relative w-full">
        <select v-model="editablePayment.type"
          class="w-full basicInput"
        >
          <option value="immobilisation">Immobilisation</option>
          <option value="">Autre</option>
        </select>
        <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
          Type
        </span>
      </div>
    </div>

    <!-- Select du client -->
    <div v-if="!project" class="flex w-full">
      <div class="relative w-full">
        <select class="w-full basicInput" v-model="editablePayment.clientId" :disabled="!!editablePayment.projectId">
          <option class="text-center" value="">Sélectionner un client</option>
          <option v-for="client in clients" :key="client.id" :value="client.id">
            {{ client.contacts[0].lastName }} {{ client.contacts[0].firstName }}
          </option>
          <option class="text-center font-bold" value="add">Ajouter un client</option>
        </select>
        <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
          Client
        </span>
      </div>

      <!-- Bouton de modification de client -->
      <button 
        v-if="editablePayment.clientId != '' && editablePayment.clientId != 'add' && editablePayment.projectId == ''"
        type="button"
        class="callToAction h-9 rounded-lg px-2 text-sm flex items-center !mx-0 !ml-2" 
        @click="clientPopupVisible = true"
      >
        <PencilSquareIcon class="h-5 w-5"/>
      </button>
    </div>

    <!-- Fréquence -->
    <div class="relative w-[400px]">
      <select id="frequency" v-model="editablePayment.frequency" :disabled="payment ? true : false" 
        class="w-full basicInput"
      >
        <option value="unique">Unique</option>
        <option value="mensuel">Mensuel</option>
        <option value="trimestriel">Trimestriel</option>
        <option value="annuel">Annuel</option>
      </select>
      <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
        Fréquence
      </span>
    </div>

    <!-- Dates -->
    <div class="flex items-center gap-2 w-full">
      <div class="relative w-full">
        <input type="date" 
          v-model="editablePayment.date" 
          class="w-full basicInput text-center"
        />
        <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
          Début
        </span>
      </div>

      <div class="relative w-full">
        <input type="date"
          v-model="editablePayment.dateEnd" 
          class="w-full basicInput text-center" 
          :disabled="editablePayment.frequency == 'unique' ? true : false"
        />
        <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
          Fin
        </span>
      </div>
    </div>
    
    <!-- Popup d'ajout/édition de client -->
    <PopupClient 
      :client="getClient(editablePayment.clientId)"
      :visible="clientPopupVisible"
      @close="clientPopupVisible = false"
      @add="addClient"
      @delete="deleteClient"
    />
  </Popup>
</template>

<script>
import Popup from '@/components/Popups/Popup.vue';
import PopupClient from '@/components/Popups/PopupClient/PopupClient.vue';
import { fetchProjects, fetchProjectDetails } from '@/services/projectService';
import { fetchClients, addClient, deleteClient } from '@/services/clientService';
import { PencilSquareIcon } from '@heroicons/vue/24/solid';

export default {
  props: ['payment', 'visible', 'project', 'negative'],
  components: {
    Popup,
    PopupClient,
    PencilSquareIcon
  },
  data() {
    return {
      editablePayment: this.payment ? { ...this.payment } : this.createEmptyPayment(),
      projects: [],
      clients: [],
      clientPopupVisible: false
    };
  },
  methods: {
    async getProjectClientId(projectId) {
      const project = await fetchProjectDetails(projectId);
      console.log("PopupPayment : On veut récupérer l'id du client du projet :", project.clientId);
      return project.clientId;
    },
    async fetchProjectClient(projectId) {
      const projectDetails = await fetchProjectDetails(projectId);
      if (projectDetails) {
        this.editablePayment.clientId = projectDetails.clientId;
      }
    },
    createEmptyPayment() {
      return {
        amount: null,
        date: new Date().toISOString().substr(0, 10), // Date actuelle au format YYYY-MM-DD
        dateEnd: new Date().toISOString().substr(0, 10),
        frequency: 'unique', // ou 'mensuel'
        name: '',
        negative: !!this.negative,
        projectId: this.project ? this.project.id : '',
        clientId: this.project ? this.project.clientId : '',
        color: '#ebebeb',
        type: '',
      };
    },
    async savePayment() {
      if (!this.payment) {
        // Pour l'ajout, on émet 'add' comme auparavant
        console.log("PopupPayment : On veut ajouter un paiement :", this.editablePayment);
        this.$emit('add', this.editablePayment);
      } else {
        // Pour la mise à jour, on émet 'update' et on laisse le parent gérer la logique
        console.log("PopupPayment : On veut mettre à jour un paiement :", this.editablePayment);
        this.$emit('update', this.editablePayment);
      }
      this.$emit('close');
    },
    async fetchDatas() {
      this.projects = await fetchProjects();
      this.clients = await fetchClients();
    },
    // Méthode pour récupérer un client à partir de son id
    getClient(clientId) {
      return this.clients.find(client => client.id === clientId);
    },
    // Ajout d'un client et affectation dans le paiement
    async addClient(client) {
      if (!client) return;
      const newClient = await addClient(client);
      this.clients.push(newClient);
      this.editablePayment.clientId = newClient.id;
    },
    // Suppression d'un client et retrait de son id dans le paiement
    deleteClient(clientId) {
      this.editablePayment.clientId = '';
      this.clients = this.clients.filter(client => client.id !== clientId);
      deleteClient(clientId);
    }
  },
  watch: {
    visible: {
      handler() {
        this.editablePayment = this.payment ? { ...this.payment } : this.createEmptyPayment();
      },
      immediate: true
    },
    'editablePayment.projectId': {
      immediate: true,
      async handler(newProjectId) {
        if (newProjectId) {
          await this.fetchProjectClient(newProjectId);
        } else {
          this.editablePayment.clientId = "";
        }
      }
    },
    'editablePayment.clientId': {
      handler(newVal) {
        if (newVal === 'add') {
          this.editablePayment.clientId = '';
          this.clientPopupVisible = true;
        }
      },
      deep: true
    }
  },
  mounted() {
    this.fetchDatas();
  },
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

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  input[type="number"]:focus {
    outline: none;
    box-shadow: none;
  }

  input[type="color"] {
    -webkit-appearance: none;
  }
  input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  input[type="color"]::-webkit-color-swatch {
    border: none;
  }
</style>