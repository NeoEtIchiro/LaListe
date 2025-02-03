<template>
    <div class="flex flex-col">
        <!-- Titre -->
        <div class="text-left flex items-center h-8 font-bold mb-1">Informations générales</div>

        <!-- Div info -->
        <div class="flex-grow flex flex-col border-solid border-2 border-gray-300 rounded-lg p-2">
            <ClientInfo :project="project" :isEditing="isEditing"/>

            <!-- Séparation -->
            <hr class="flex-grow border-gray-300 w-full">

            <PaymentSection :project="project" :isEditing="isEditing"/>
        </div>
    </div>
</template>

<script>
import ClientInfo from "./ClientInfo.vue";
import PaymentSection from "./PaymentSection.vue";

export default{
    components: {
        ClientInfo,
        PaymentSection
    },
    props: ['project', 'isEditing'],
}

</script>