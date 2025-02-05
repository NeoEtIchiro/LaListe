<template>
  <div class="flex flex-col h-full">
    <!-- Titre -->
    <div class="text-left flex items-center min-h-8 h-auto font-bold mb-1">Informations générales</div>

    <!-- Div info -->
    <div class="flex-grow flex flex-col border-solid border-2 border-gray-300 rounded-lg p-2 max-h-[calc(100%-36px)]">
      <ClientInfo :project="project" :isEditing="isEditing"/>

      <!-- Séparation -->
      <hr class="border-gray-300 w-full">

      <!-- Paiements -->
      <PaymentSection :project="project" :isEditing="isEditing"/>
    </div>
  </div>
</template>

<script>
import ClientInfo from "./ClientInfo.vue";
import PaymentSection from "./PaymentSection.vue";

export default {
  components: {
    ClientInfo,
    PaymentSection
  },
  props: ['project', 'isEditing'],
}
</script>

<style scoped>
</style>