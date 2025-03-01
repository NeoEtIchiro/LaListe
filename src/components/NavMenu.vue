<template>
  <nav class="navbar">
    <div class="navbar-brand" @click="logout">La Liste</div>
    <ul class="navbar-links">
      <li>
        <router-link to="/AfficherPlanning" v-slot="{ isActive }">
          <a :class="{ 'router-link-active': isActive }">Planning</a>
        </router-link>
      </li>
      <li>
        <router-link to="/AfficherProjet" v-slot="{ isActive }">
          <a :class="{ 'router-link-active': isActive }">Projets</a>
        </router-link>
      </li>
      <li>
        <router-link to="/ShowCash" v-slot="{ isActive }">
          <a :class="{ 'router-link-active': isActive }">Trésorerie</a>
        </router-link>
      </li>
      <li>
        <router-link to="/AfficherRessource" v-slot="{ isActive }">
          <a :class="{ 'router-link-active': isActive }">Ressources</a>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";

export default {
  name: "NavMenu",
  data() {
    return {
      dropdownVisible: false
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    logout() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          this.$router.push('/');
        })
        .catch(error => {
          console.error("Erreur lors de la déconnexion :", error);
        });
    }
  }
};
</script>

<style scoped>
.navbar {
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column; /* Stack items vertically */
  align-items: flex-start; /* Align items to the left */
  padding: 1rem;
  background-color: #1E1017;
  color: #FCFCFC;
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
  z-index: 900; /* Ensure the navbar is on top of other elements */
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.navbar-brand {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem; /* Espace entre le titre et les liens */
  cursor: pointer;
  user-select: none;
}

.navbar-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}

.navbar-links li {
  margin-right: 20px;
  position: relative;
  user-select: none;
}

.navbar-links a {
  text-decoration: none;
  color: #FCFCFC; /* Couleur du texte */
  position: relative;
  font-size: large;
}

.navbar-links a::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: #E8535D; /* Couleur de soulignement spécifique */
  visibility: hidden;
  transform: scaleX(0);
  transition: all 0.3s ease-in-out;
}

.navbar-links a:hover::after {
  visibility: visible;
  transform: scaleX(1);
}

.navbar-links .router-link-active::after {
  visibility: visible;
  transform: scaleX(1);
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #333;
  list-style: none;
  padding: 0;
  margin: 0;
  min-width: 150px;
}

.dropdown-menu li {
  margin: 0;
}

.dropdown-menu a {
  display: block;
  padding: 10px;
  color: white;
  text-decoration: none;
}

.dropdown-menu a:hover {
  background-color: #444;
}

.dropdown:hover .dropdown-menu {
  display: block;
}
</style>
