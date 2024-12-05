<template>
  <nav class="navbar">
    <div class="navbar-brand">La Liste</div>
    <ul class="navbar-links">
      <li><router-link to="/AfficherProjet">Projets</router-link></li>
      <li><router-link to="/AfficherPlanning">Planning</router-link></li>
      <li><router-link to="/AfficherClient">Clients</router-link></li>
      <li><router-link to="/AfficherRessource">Ressources</router-link></li>
      <li><router-link to="/AfficherEquipe">Équipes</router-link></li>
      <li><router-link to="/AfficherTache">Taches</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'NavMenu'
}
</script>

<style scoped>
.navbar {
  display: flex;
  flex-direction: column; /* Empile les éléments verticalement */
  align-items: flex-start; /* Aligne les éléments à gauche */
  padding: 1rem;
  width: 100%;
  background-color: #333;
  color: #fff;
}

.navbar-brand {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem; /* Espace entre le titre et les liens */
}

.navbar-links {
  display: flex;
  flex-direction: row; /* Affiche les liens horizontalement */
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 2rem; /* Espace entre chaque lien */
}

.navbar-links li {
  font-size: 1.1rem;
  margin-top: 10px;
}

.navbar-links a {
  color: #fff;
  text-decoration: none;
}
</style>
