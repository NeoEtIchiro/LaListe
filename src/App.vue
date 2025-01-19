<template>
  <div id="app">
    <NavMenu />
    <router-view />
  </div>
</template>

<script>
import NavMenu from './components/NavMenu.vue';

export default {
  components: {
    NavMenu,
  }
}
</script>

<style>
/* Styles globaux si besoin */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin: 0%;
  padding: 0%;
}

body{
  margin:0%;
  background-color: #FCFCFC;
}

button.callToAction{
  background-color: #E8535D;
  color: white;
  font-weight: bold;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
</style>