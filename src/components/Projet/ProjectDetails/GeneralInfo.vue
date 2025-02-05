<template>
    <!-- Informations générales -->
    <div class="flex flex-col">
        <!-- Titre -->
        <div class="text-left flex items-center h-8 font-bold mb-1">Informations générales</div>
        
        <!-- Div info -->
        <div class="flex-grow flex flex-col border-solid border-2 border-gray-300 rounded-lg p-2 max-h-[314px]">
            <!-- Adresse du projet -->
            <div class="flex items-center h-12 mb-2 gap-2">
                <div class="flex flex-col w-3/5">
                    <div class="font-semibold text-left mb-1">Adresse :&nbsp;</div>
                    <input class="border rounded-lg text-base h-6 px-1 flex-grow" v-model="project.address" :disabled="!isEditing ? true : false"/>
                    <!-- <div class="text-left truncate h-6" v-else>{{ project.address }}</div> -->
                </div>
                <div class="flex flex-col w-1/5">
                    <div class="font-semibold text-left mb-1">Ville :&nbsp;</div>
                    <input class="border rounded-lg text-base h-6 px-1 flex-grow" v-model="project.city" :disabled="!isEditing ? true : false"/>
                </div>
                <div class="flex flex-col w-1/5">
                    <div class="font-semibold text-left mb-1">Code postal :&nbsp;</div>
                    <input class="border rounded-lg text-base h-6 px-1 flex-grow" v-model="project.postalCode" :disabled="!isEditing ? true : false"/>
                </div>
            </div>

            <!-- Date du projet -->
            <div class="flex items-center h-6">
                <div class="font-semibold">Du&nbsp;</div>
                <input class="rounded-lg border w-fit text-base !px-1 h-6" type="date" v-model="project.startDate" :disabled="!isEditing ? true : false"/>
                <div class="font-semibold">&nbsp;au&nbsp;</div>
                <input class="rounded-lg border w-fit text-base !px-1 h-6" type="date" v-model="project.endDate" :disabled="!isEditing ? true : false"/>
            </div>

            <!-- Séparation -->
            <hr class="border-gray-300 w-full">

            <!-- Type de projet -->
            <div class="flex items-center h-6 mb-2">
                <div class="font-semibold">Type de projet :&nbsp;</div>
                <input class="border rounded-lg text-base h-6 px-1 flex-grow" v-model="project.type" :disabled="!isEditing ? true : false"/>
            </div>

            <!-- Description -->
            <div class="flex flex-col flex-grow h-full">
                <div class="font-semibold text-left mb-1">Description</div>
                <textarea
                    class="w-full border-solid border-2 border-gray-300 p-2 rounded-lg resize-none text-base flex-grow" 
                    v-model="project.description" :disabled="!isEditing ? true : false">
                </textarea>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'GeneralInfo',
    props: ['project', 'isEditing'],
    methods: {
        // Formate un objet date au format jj/mm/aaaa
        formatDate(date) {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
        }
    }
}

</script>

<style scoped>
input:disabled, textarea:disabled{
    color: black;
}

</style>