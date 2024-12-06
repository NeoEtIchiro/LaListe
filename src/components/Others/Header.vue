<template>
    <div class="header">
      <input
        v-model="editable.name"
        @blur="updateName"
        placeholder="Nom du projet"
      />
      <button @click="deleteFunc(editable.id)" class="delete-button">🗑</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "Header",
    props: {
      editable: Object,
      updateFunc: Function,
      deleteFunc: Function,
    },
    methods: {
      updateName() {
        this.updateFunc(this.editable);
      },
    },
  };
  </script>
  

<style scoped>
.name h2 {
    margin: 0;
    margin-bottom: 5px;
    font-size: 1.5rem;
}
  
.edit-input {
    font-size: 1.5rem;
    margin-bottom: 5px;
    font-weight: bold;
    padding: 0;
    border: none;
    background-color: transparent;
    outline: none; /* Supprime le contour de focus */
    color: inherit; /* Conserve la couleur du texte */
    width: 100%;
    cursor: text; /* Affiche le curseur de texte pour indiquer que c’est éditable */
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>