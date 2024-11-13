<!-- components/NavigationButtons.vue -->
<template>
    <div class="navigation-buttons">
      <button class="header-button" @click="$emit('navigate', 'previous')">◄</button>
      <button class="header-button" @click="$emit('navigate', 'next')">►</button>
    </div>
  </template>
  
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
  