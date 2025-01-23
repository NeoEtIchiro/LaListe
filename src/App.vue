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
  padding: 116px 16px 16px 16px;
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
}

button.callToAction:active {
  background-color: #c7444e; /* Darker shade of the original color */
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

*,
*::before,
*::after {
  box-sizing: border-box;
}
</style>