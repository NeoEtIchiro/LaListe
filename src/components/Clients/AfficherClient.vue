<template>
  <div class="client-page">
    <div class="page-header">
      <h1>Liste des clients</h1>
      <button class="addButton" @click="addClient">+</button>
    </div>

    <div class="client-list" ref="clientList">
      <div v-for="(client, index) in clients" :key="index" class="client-item">
        <Header
          :deleteFunc="deleteClient"
          :updateFunc="updateClientName"
          :editable="client">
        </Header>
      </div>
    </div>
    <button class="bigAddBox" @click="addClient">+</button>
  </div>
</template>

<script>
import { fetchClients, addClient as addNewClient, updateClient, deleteClient } from '../../services/clientService';
import Header from '../Others/Header.vue';

export default {
  name: "ClientPage",
  components:{
    Header,
  },
  data() {
    return {
      clients: []
    };
  },
  methods: {
    async fetchClients() {
      this.clients = await fetchClients();
      this.clients.forEach(client => client.isEditing = false);
    },
    async addClient() {
      const client = await addNewClient("Nouveau Client");
      client.isEditing = false;
      this.clients.push(client);

      this.$nextTick(() => {
        // Récupère le conteneur de la liste des projets
        const clientList = this.$refs.clientList;

        // Défile jusqu'au bas du conteneur
        if (clientList) {
          clientList.lastElementChild.scrollIntoView({ behavior: 'smooth' });
        }
      });
    },
    enableEditing(client) {
      client.isEditing = true;
      this.$nextTick(() => {
        // Donne le focus à l'input dès qu'il est visible
        const input = this.$refs.clientInput;
        if (input && input[0]) {
        input[0].focus();
        }
      });
    },
    async updateClientName(c = {id: String, name: String}) {
      const cli = this.clients.find(client => client.id === c.id);
      cli.name = c.name;
      await updateClient(cli); // Met à jour le nom du projet en base de données
    },
    async deleteClient(clientId) {
      // Supprime la ressource de la liste et de Firestore
      this.clients = this.clients.filter(cli => cli.id !== clientId);
      await deleteClient(clientId);
    },
    async updateExistingClient(client) {
      await updateClient(client);
    }
  },
  mounted() {
    this.fetchClients();
  }
}
</script>

<style scoped>
  .client-name h2 {
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

.client-page {
  padding: 1rem;
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.client-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.client-item {
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

.client-status {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.client-status label {
  font-size: 1rem;
  color: #555;
  display: flex;
  align-items: center;
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