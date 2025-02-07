<template>
  <div class="home">
    <h1>Bienvenue sur LaListe</h1>
    <p>Ceci est la page d'accueil de votre application.</p>
    
    <!-- Si l'utilisateur n'est pas authentifié, afficher les boutons pour se connecter/s'inscrire -->
    <div v-if="!isAuthenticated">
      <router-link to="/login"><button>Connexion</button></router-link>
      <router-link to="/signup"><button>Inscription</button></router-link>
    </div>
    
    <!-- Contenu protégé affiché lorsque l'utilisateur est connecté -->
    <div v-else>
      <p>Vous êtes connecté !</p>
      <!-- Ici, votre application accessible via la navbar (déjà gérée dans App.vue) 
           et les autres routes seront disponibles -->
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: "Home",
  data() {
    return {
      isAuthenticated: false
    };
  },
  created() {
    const auth = getAuth();
    // Vérifie l'état de connexion courant et met à jour isAuthenticated
    onAuthStateChanged(auth, (user) => {
      this.isAuthenticated = !!user;
    });
  }
};
</script>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
}
button {
  margin: 8px;
  padding: 8px 16px;
  font-size: 1em;
}
</style>