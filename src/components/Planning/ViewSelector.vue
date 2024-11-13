<!-- components/ViewSelector.vue -->
<template>
    <div class="view-selector">
      <button
        v-for="view in views"
        :key="view"
        :class="['view-button', { active: selectedView === view }]"
        @click="$emit('change-view', view)"
      >
        {{ view }}
      </button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      views: Array,
      selectedView: String,
    },
  };
  </script>
  
  <style scoped>
  .view-selector {
    display: flex;
    gap: 0px;
  }
  .view-button {
    padding: 0.5em 1em;
    background-color: #eaeaea;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    height: 40px;
    font-size: 1em;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .view-button.active {
    background-color: #555;
    color: white;
  }
  </style>
  