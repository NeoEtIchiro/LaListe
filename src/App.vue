<template>
  <div>
    <!-- Affichage conditionnel de la navbar si l'utilisateur est connecté -->
    <NavMenu v-if="isAuthenticated" />
    <div id="appBody">
      <router-view />
    </div>
  </div>
</template>

<script>
import NavMenu from './components/NavMenu.vue'
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  components: {
    NavMenu,
  },
  data() {
    return {
      isAuthenticated: false
    }
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.isAuthenticated = !!user;
    });
  }
}
</script>

<style>
*{
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

#appBody {
  text-align: center;
  margin: 0%;
  padding: 16px;
}

body{
  margin:0%;
  background-color: #FCFCFC;
} 

button {
  border: 0px;
  /*box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);*/
  border-radius: 8px;
  font-size: 1em;
  font-weight: bold;
  padding: 8px;
  height: 36px;
  margin: 0px 4px;
}

button.callToAction{
  background-color: #E8535D;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
}

button.callToAction:disabled {
  background-color: #aa3e45; /* Darker shade of the original color */
}

button{
  background-color: #ebebeb;
}

button:active{
  background-color: #cecece;
}

.basicDiv{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  background-color: #ebebeb;
  border: 1px solid #dadada;
  padding: 4px 8px;
  border-radius: 8px;
}

.basicInput{
  height: 36px;              /* h-9 */
  border-radius: 12px;       /* rounded-xl */
  padding: 8px;              /* p-2 */
  border-style: solid;       /* !border-solid (avec !important si nécessaire) */
  border-width: 1px;         /* !border-[1px] (avec !important si nécessaire) */
  border-color: #D1D5DB;      /* border-gray-300 */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
</style>