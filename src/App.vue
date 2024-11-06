<template>
  <div id="app">
    <h1>Bienvenue dans l'application de gestion de vos chantiers</h1>
    <!-- Utilisation du composant Tableau -->
    <Tableau />
    <AfficherClient/>
  </div>
</template>

<script>
import Tableau from './components/Calendrier/Tableau.vue'
import AfficherClient from './components/Clients/AfficherClient.vue';

export default {
  components: {
    Tableau,
    AfficherClient,
  }
}
</script>

<style>
/* Styles globaux si besoin */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 20px;
}
</style>