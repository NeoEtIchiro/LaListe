<template>
    <div v-if="visible" class="popup-overlay" @click.self="close">
      <div class="popup-content">
        <div class="popup-header">
          <h3>Evènement</h3>
          <button @click="close">X</button>
        </div>
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
    },
    methods: {
      close() {
        this.$emit('close');
      }
    }
  };
</script>
  
<style scoped>
    .popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .popup-content {
        background: white;
        border-radius: 8px;
        padding: 8px;
        width: fit-content;
        height: fit-content;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

    .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .popup-header h3 {
        margin: 0;
    }

    .popup-header button {
        background: none;
        border: none;
        cursor: pointer;
    }
</style>