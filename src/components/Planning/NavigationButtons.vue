<!-- components/NavigationButtons.vue -->
<template>
  <div>
    <button
      class="header-button"
      @mousedown="startPress('previous')"
      @mouseup="stopPress"
      @mouseleave="stopPress"
    >
      ◄
    </button>
    <button
      class="header-button"
      @mousedown="startPress('next')"
      @mouseup="stopPress"
      @mouseleave="stopPress"
    >
      ►
    </button>
  </div>
</template>

<script>
export default {
  props: {
    selectedView: String,
  },
  data() {
    return {
      pressInterval: null, // Stocke l'intervalle actif
      pressTimeout: null, // Timeout initial pour déclencher le défilement rapide
      speed: 200, // Vitesse du défilement
      initialDelay: 200, // Délai avant le défilement rapide (0.2s)
    };
  },
  methods: {
    startPress(direction) {
      // Émet immédiatement un événement
      this.$emit('navigate', direction);

      // Configure un timeout pour démarrer le défilement rapide après 0.2s
      this.pressTimeout = setTimeout(() => {
        this.pressInterval = setInterval(() => {
          this.$emit('navigate', direction);
        }, this.speed);
      }, this.initialDelay);
    },
    stopPress() {
      // Annule le timeout et l'intervalle
      clearTimeout(this.pressTimeout);
      clearInterval(this.pressInterval);
      this.pressTimeout = null;
      this.pressInterval = null;
    },
    changeSpeed() {
      switch (this.selectedView) {
        case 'Année':
          this.speed = 5;
          break;
        case 'Mois':
          this.speed = 50;
          break;
        case 'Semaine':
          this.speed = 100;
          break;
        case 'Jour':
          this.speed = 200;
          break;
        default:
          this.speed = 100;
      }
    },
  },
  watch: {
    selectedView: 'changeSpeed',
  },
  mounted() {
    this.changeSpeed();
  },
};
</script>

<style scoped>
.navigation-buttons {
  display: flex;
}
.header-button {
  border: none;
  background-color: #eaeaea;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 1.5em;
  width: 40px;
  height: 40px;
}
</style>
