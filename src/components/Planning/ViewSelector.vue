<!-- components/ViewSelector.vue -->
<template>
    <div class="flex justify-center gap-1">
      <button
        v-for="view in views"
        :key="view"
        :class="['view-button', { active: selectedView === view }]"
        class="flex justify-center items-center"
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
  .view-button {
    padding: 0.5em 1em;
    background-color: #eaeaea;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    height: 36px;
    font-size: 1em;
    margin: 0;
  }
  .view-button.active {
    background-color: #E8535D;
    color: white;
  }
  </style>
  