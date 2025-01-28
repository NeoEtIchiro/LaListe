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
html, body, #app {
  height: 100%;
}

html{
  padding-bottom: 32px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin: 0%;
  padding: 0%;
}

body{
  margin:0%;
  height: 100%;
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
  padding: 4px 8px;
  border-radius: 8px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
</style>