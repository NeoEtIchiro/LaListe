<template>
  <div id="app">
    <h1>Bienvenue dans l'application de gestion de vos chantiers</h1>
    <!-- Utilisation du composant Tableau -->
    <Tableau />
  </div>
</template>

<script>
import Tableau from './components/Tableau.vue'

export default {
  components: {
    Tableau
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