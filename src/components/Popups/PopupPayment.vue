<template>
  <Popup :visible="visible" @close="$emit('close')"
         :title="payment ? 'Modifier un paiement' : 'Ajouter un paiement'"        
  >
    <form @submit.prevent="savePayment">
      <div class="mb-4">
        <label for="name" class="block text-gray-700">Nom</label>
        <input type="text" id="name" v-model="editablePayment.name" class="mt-1 block w-full" required />
      </div>
      <div class="mb-4">
        <label for="date" class="block text-gray-700">Date</label>
        <input type="date" id="date" v-model="editablePayment.date" class="mt-1 block w-full" required />
      </div>
      <div class="mb-4">
        <label for="amount" class="block text-gray-700">Montant</label>
        <input type="number" id="amount" v-model="editablePayment.amount" class="mt-1 block w-full" required />
      </div>
      <div class="mb-4">
        <label for="frequency" class="block text-gray-700">Fréquence</label>
        <select id="frequency" v-model="editablePayment.frequency" class="mt-1 block w-full" required>
          <option value="unique">Unique</option>
          <option value="mensuel">Mensuel</option>
          <option value="annuel">Annuel</option>
        </select>
      </div>
      <div class="mb-4">
        <label for="project" class="block text-gray-700">Projet</label>
        <select id="project" v-model="editablePayment.projectId" class="mt-1 block w-full">
          <option v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</option>
        </select>
      </div>
      <div class="flex h-8 mb-2 justify-between">
            <button class="m-0 mt-2" @click="$emit('close')">Annuler</button>
            <button class="callToAction m-0 mt-2" type="submit" 
                    >
                Enregistrer
            </button>
        </div>
    </form>
  </Popup>
</template>

<script>
import Popup from '@/components/Popups/Popup.vue';
import { fetchProjects } from '@/services/projectService';

export default {
  props: ['payment', 'visible'],
  components: {
    Popup,
  },
  data() {
    return {
      editablePayment: { ...this.payment },
      projects: [],
    };
  },
  methods: {
    async savePayment() {
      Object.assign(this.payment, this.editablePayment);
      // Logic to save the payment
      this.$emit('close');
    },
    async fetchProjects() {
      this.projects = await fetchProjects();
    },
  },
  watch: {
    payment: {
      immediate: true,
      handler(newPayment) {
        this.editablePayment = { ...newPayment };
      },
    },
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
</style>