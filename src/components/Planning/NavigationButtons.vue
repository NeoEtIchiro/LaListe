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
  data() {
    return {
      pressInterval: null, // Stocke l'intervalle actif
    };
  },
  methods: {
    startPress(direction) {
      // Émet immédiatement l'événement
      this.$emit('navigate', direction);

      // Configure l'intervalle pour émettre en continu tant que le bouton est pressé
      this.pressInterval = setInterval(() => {
        this.$emit('navigate', direction);
      }, 100); // Changez 100ms pour ajuster la vitesse de répétition
    },
    stopPress() {
      // Arrête l'intervalle
      clearInterval(this.pressInterval);
      this.pressInterval = null;
    },
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
  