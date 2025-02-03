<template>
  <div class="w-[400px]">
    <!-- Séparation -->
    <div class="w-full flex items-center text-sm">
        <button v-if="showDelete"
            class="h-6 w-6 flex items-center justify-center m-0 bg-transparent mr-2" 
            @click="$emit('remove')"
        >
            <img id="close-icon" class="m-0 h-3 w-3" :src="closeIcon" alt="Close" />
        </button>
        <span class="mr-2 max-w-[250px] truncate">{{ contact.lastName }} {{ contact.firstName }}</span>
        <hr class="flex-grow border-gray-300">
        <button class="h-8 w-8 flex justify-center items-center bg-transparent text-lg m-0" @click="$emit('toggle')">
            {{ isOpened ? '▲' : '▼' }}
        </button>
    </div>

    <!-- Formulaire -->
    <template v-if="isOpened">
      <div class="flex">
        <!-- Nom -->
        <input type="text" 
          v-model="contact.lastName" placeholder="Nom" 
          class="w-full border border-gray-300 rounded-lg p-2 mr-1"
        >
        <!-- Prénom -->
        <input type="text" 
          v-model="contact.firstName" placeholder="Prénom" 
          class="w-full border border-gray-300 rounded-lg p-2 ml-1"
        >
      </div>
      
      <!-- Email -->
      <input type="text" 
        v-model="contact.email" placeholder="Email" 
        class="flex w-full border border-gray-300 rounded-lg p-2 my-2"
      >

      <div class="flex">
        <!-- Téléphone 1 -->
        <input type="text" 
          v-model="contact.phone1" placeholder="Téléphone 1" 
          class="w-full border border-gray-300 rounded-lg p-2 mr-1"
        >
        <!-- Téléphone 2 -->
        <input type="text" 
          v-model="contact.phone2" placeholder="Téléphone 2" 
          class="w-full border border-gray-300 rounded-lg p-2 ml-1"
        >
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    contact: Object,
    isOpened: Boolean,
    showDelete: Boolean
  },
  data() {
    return {
      closeIcon: require('@/assets/close.png')
    };
  }
};
</script>

<style scoped>
/* Vos styles ici */
</style>
