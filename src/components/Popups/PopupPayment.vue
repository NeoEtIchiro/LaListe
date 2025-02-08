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
    <!-- Nom du paiment -->
    <input type="text" id="name" v-model="editablePayment.name" 
      class="w-full h-8 rounded-lg pl-2 !border-solid !border-[1px] border-black" 
      required 
      placeholder="Entrez un nom au paiment"
    />

    <!-- Séparation -->
    <div class="w-full flex items-center mt-1">
      <span class="mr-2 mb-1 mt-1">Date</span>
      <hr class="flex-grow border-gray-300">
    </div>

    <!-- Fréquence -->
    <div v-if="!payment" class="mb-2">
      <select id="frequency" v-model="editablePayment.frequency" 
        class="w-full h-8 rounded-lg pl-1 text-base !border-solid !border-[1px] border-black"
      >
        <option value="unique">Unique</option>
        <option value="mensuel">Mensuel</option>
      </select>
    </div>

    <!-- Dates -->
    <div class="flex items-center">
      <input type="date" 
        v-model="editablePayment.date" 
        class="w-full mr-1 rounded-lg text-right !border-solid !border-[1px] border-black text-base"
      />
      <div v-if="!payment">-</div>
      <input type="date" v-if="!payment"
        v-model="editablePayment.dateEnd" 
        class="w-full ml-1 rounded-lg text-right !border-solid !border-[1px] border-black text-base" 
        :disabled="editablePayment.frequency == 'unique' ? true : false"
      />
    </div>

    <!-- Séparation -->
    <div class="w-full flex items-center mt-1">
      <span class="mr-2 mb-1 mt-1">Montant</span>
      <hr class="flex-grow border-gray-300">
    </div>

    <!-- Montant -->
    <div class="flex justify-between items-center border-solid border-[1px] rounded-lg h-8 p-0 w-full">
      <input type="number" v-model="editablePayment.amount" 
        class="flex-grow text-right border-none mr-1 h-full bg-transparent text-lg align-middle" 
        required
        placeholder="0"
      />
      <div class="flex items-center text-lg mr-2">€</div>
    </div>

    <!-- Séparation -->
    <div v-if="!project" class="w-full flex items-center mt-1">
      <span class="mr-2 mb-1 mt-1">Projet</span>
      <hr class="flex-grow border-gray-300">
    </div>

    <!-- Projet -->
    <select v-if="!project"
      v-model="editablePayment.projectId" 
      class="w-full h-8 rounded-lg pl-1 !border-solid !border-[1px] border-black"
    >
      <option value="">Aucun projet</option>
      <option v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</option>
    </select>
  </form>
  </Popup>
</template>

<script>
import Popup from '@/components/Popups/Popup.vue';
import { fetchProjects } from '@/services/projectService';

export default {
  props: ['payment', 'visible', 'project', 'negative'],
  components: {
    Popup,
  },
  data() {
    return {
      editablePayment: this.payment ? { ...this.payment } : this.createEmptyPayment(),
      projects: [],
    };
  },
  methods: {
    createEmptyPayment() {
      return {
        amount: null,
        date: new Date().toISOString().substr(0, 10), // Date actuelle au format YYYY-MM-DD
        dateEnd: new Date().toISOString().substr(0, 10),
        frequency: 'unique', // ou 'mensuel'
        name: '',
        negative: !!this.negative,
        projectId: this.project ? this.project.id : ''
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
    async fetchProjects() {
      this.projects = await fetchProjects();
    }
  },
  watch: {
    visible: {
      handler() {
        this.editablePayment = this.payment ? { ...this.payment } : this.createEmptyPayment();
      },
      immediate: true
    }
  },
  mounted() {
    this.fetchProjects();
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