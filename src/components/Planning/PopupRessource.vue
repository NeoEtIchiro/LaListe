<!-- components/Popup.vue -->
<template>
    <div v-if="visible" class="overlay" @mousedown.self="close">
      <div class="modal">
        <h3>Ressource</h3>
        <input id="resText" v-model="text" type="text">
      </div>
    </div>
  </template>
  
<script>
  export default {
    props: {
      visible: Boolean,
      initialText: String,
    },
    data() {
      return {
        text: this.initialText,
      };
    },
    watch: {
      initialText(newText) {
        this.text = newText; // Met à jour si la prop change
      }
    },
    methods: {
      close() {
        this.$emit("close"); // Notifie le parent de fermer la popup
      },
    }
  };
  </script>
  
  <style scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal {
    background-color: #fff;
    border: 1px solid #ddd;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 300px;
    border-radius: 10px;
  }

  .modal h3{
    text-align: left;
    margin: 10px;
  }

  #resText{
    width: 90%;
    margin: 10px;
  }

  .modal button{
    margin: 5px;
    padding: 5px;
  }
  </style>
  