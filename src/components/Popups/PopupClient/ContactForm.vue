<template>
  <div class="w-[400px]">
    <!-- Séparation -->
    <div class="w-full flex items-center text-sm mb-1 justify-between" v-if="showDelete">
      <button
        class="h-6 w-6 flex items-center justify-center m-0 bg-transparent mr-2 rounded-full" 
        @click="$emit('remove')"
        type="button"
      >
        <img id="close-icon" class="m-0 h-3 w-3" :src="closeIcon" alt="Close" />
      </button>
      <button class="h-8 w-8 flex justify-center items-center bg-transparent text-lg m-0 rounded-full" @click="$emit('toggle')" type="button">
        {{ isOpened ? '▲' : '▼' }}
      </button>
    </div>

    <!-- Formulaire -->
    <div class="flex flex-col gap-4 basicContainer pt-5 relative">
      <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500 max-w-full truncate">
        {{ contact.lastName }} {{ contact.firstName }}
      </span>
      <template v-if="isOpened">
        <div class="flex gap-2">
          <!-- Nom -->
          <div class="relative w-full">
            <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
              Nom
            </span>
            <input type="text" 
              v-model="contact.lastName" placeholder="Dupont" 
              class="w-full basicInput"
              :required="!showDelete"
            >
          </div>
          
          <!-- Prénom -->
          <div class="relative w-full">
            <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
              Prénom
            </span>
            <input type="text" 
              v-model="contact.firstName" placeholder="Jean" 
              class="w-full basicInput"
            >
          </div>
        </div>
        
        <!-- Email -->
        <div class="relative w-full">
          <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
            Email
          </span>
          <input type="text" 
            v-model="contact.email" placeholder="dupont.jean@mail.com" 
            class="w-full basicInput"
          >
        </div>

        <div class="flex gap-2">
          <!-- Téléphone 1 -->
          <div class="relative w-full">
            <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
              Téléphone 1
            </span>
            <input type="text" 
              v-model="contact.phone1" placeholder="06 89 01 89 30" 
              class="w-full basicInput"
            >
          </div>

          <!-- Téléphone 2 -->
          <div class="relative w-full">
            <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
              Téléphone 2
            </span>
            <input type="text" 
              v-model="contact.phone2" placeholder="09 78 02 78 45" 
              class="w-full basicInput"
            >
          </div>
        </div>
      </template>
      <div v-else class="flex items-center font-bold text-left h-1 p-0 m-0">
        · · ·
      </div>
    </div>
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
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>
