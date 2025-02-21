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
  <form class="flex flex-col">
    <div class="flex gap-1 w-full h-8 mb-3">
      <!-- Nom du paiment -->
      <div class="relative w-full">
        <input
          type="text"
          id="name"
          v-model="editablePayment.name"
          class="w-full h-8 rounded-lg pl-2 !border-solid !border-[1px] border-black"
          required
          placeholder="Achat de marchandises" 
        />
        <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">
          Nom du paiement
        </span>
      </div>
      <div class="flex items-center border border-black rounded-lg h-8 w-8 min-w-8 p-0 bg-white">
        <input type="color" 
              v-model="editablePayment.color"
              class="w-full h-full rounded-lg cursor-pointer bg-white" />
      </div>
    </div>

    <div class="flex gap-1 w-full h-8 mb-3">
      <!-- Montant -->
      <div class="relative w-full">
        <div class="flex justify-between items-center border-solid border-[1px] rounded-lg h-8 p-0 w-full">
          <input type="number" v-model="editablePayment.amount" 
            class="flex-grow text-right border-none mr-1 w-[100px] h-full bg-transparent text-lg align-middle" 
            required
            placeholder="0"
          />
          <div class="flex items-center text-lg mr-2">€</div>
        </div>
        <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">
          Montant
        </span>
      </div>
      
      <div class="relative">
        <select v-model="editablePayment.type"
          class="w-full h-8 rounded-lg pl-1 text-base !border-solid !border-[1px] border-black"
        >
          <option value="immobilisation">Immobilisation</option>
          <option value="">Autre</option>
        </select>
        <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">
          Type
        </span>
      </div>
    </div>

    <!-- Select du client -->
    <div v-if="!project" class="flex w-full">
      <div class="relative w-full">
        <select class="h-8 w-full rounded-lg" v-model="editablePayment.clientId" :disabled="!!editablePayment.projectId">
          <option class="text-center" value="">----- Sélectionner un client -----</option>
          <option v-for="client in clients" :key="client.id" :value="client.id">
          {{ client.contacts[0].lastName }} {{ client.contacts[0].firstName }}
          </option>
          <option class="text-center font-bold" value="add">Ajouter un client</option>
        </select>
        <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">
          Client
        </span>
      </div>

      <!-- Bouton de modification de client -->
      <button 
        v-if="editablePayment.clientId != '' && editablePayment.clientId != 'add' && editablePayment.projectId == ''"
        type="button"
        class="callToAction h-8 px-2 text-sm flex items-center !mx-0 !ml-1" 
        @click="clientPopupVisible = true"
      >
        Modifier
      </button>
    </div>

    <!-- Séparation -->
    <div class="w-full flex items-center mt-1">
      <span class="mr-2 mb-1 mt-1">Date</span>
      <hr class="flex-grow border-gray-300">
    </div>

    <!-- Fréquence -->
    <div class="mb-2">
      <select id="frequency" v-model="editablePayment.frequency" :disabled="payment ? true : false" 
        class="w-full h-8 rounded-lg pl-1 text-base !border-solid !border-[1px] border-black"
      >
        <option value="unique">Unique</option>
        <option value="mensuel">Mensuel</option>
        <option value="trimestriel">Trimestriel</option>
        <option value="annuel">Annuel</option>
      </select>
    </div>

    <!-- Dates -->
    <div class="flex items-center gap-1">
      <input type="date" 
        v-model="editablePayment.date" 
        class="w-full h-8 rounded-lg text-right !border-solid !border-[1px] border-black text-base"
      />
      <div>-</div>
      <input type="date"
        v-model="editablePayment.dateEnd" 
        class="w-full h-8 rounded-lg text-right !border-solid !border-[1px] border-black text-base" 
        :disabled="editablePayment.frequency == 'unique' ? true : false"
      />
    </div>
  </form>
    
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

export default {
  props: ['payment', 'visible', 'project', 'negative'],
  components: {
    Popup,
    PopupClient,
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
</style>