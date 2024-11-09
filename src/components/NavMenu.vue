<template>
  <nav class="navbar">
    <div class="navbar-brand">MonApplication</div>
    <ul class="navbar-links">
      <li><router-link to="/AfficherProjet">Projets</router-link></li>
      <li><router-link to="/Tableau">Calendrier</router-link></li>
      <li><router-link to="/AfficherClient">Clients</router-link></li>
      <li><router-link to="/AfficherRessource">Ressources</router-link></li>
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
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  overflow-x: hidden;
  max-width: 100%;
  padding: 1rem;
  box-sizing: border-box; /* Inclut le padding dans la largeur */
  background-color: #333;
  color: #fff;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-links {
  display: flex;
  list-style: none;
  gap: 3rem; /* Écarter les liens de manière égale */
  margin-left: auto; /* Pousse les liens vers la droite */
}

.navbar-links li {
  font-size: 1.1rem;
}

.navbar-links a {
  color: #fff;
  text-decoration: none;
}
</style>
  