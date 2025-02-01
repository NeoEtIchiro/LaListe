<template>
    <!-- Informations générales -->
    <div class="flex flex-col">
        <!-- Titre -->
        <div class="text-left flex items-center h-8 font-bold mb-1">Informations générales</div>
        
        <!-- Div info -->
        <div class="flex-grow flex flex-col border-solid border-2 border-gray-300 rounded-lg p-2">
            <!-- Date du projet -->
            <div class="flex items-center h-6 mb-2">
                <div class="font-semibold">Du&nbsp;</div>
                <input class="rounded-lg border text-base !px-1 w-32 h-6" type="date" v-model="project.startDate" v-if="isEditing"/>
                <div v-else>{{ formatDate(project.startDate) }}</div>
                <div class="font-semibold">&nbsp;au&nbsp;</div>
                <input class="rounded-lg border text-base !px-1 w-32 h-6" type="date" v-model="project.endDate" v-if="isEditing"/>
                <div v-else>{{ formatDate(project.endDate) }}</div>
            </div>

            <!-- Type de projet -->
            <div class="flex items-center h-6 mb-2">
                <div class="font-semibold">Type de projet :&nbsp;</div>
                <input class="border rounded-lg text-base h-6 px-1 flex-grow" v-model="project.type" v-if="isEditing"/>
                <div v-else>{{ project.type }}</div>
            </div>

            <!-- Description -->
            <div class="flex flex-col flex-grow">
                <div class="font-semibold text-left mb-1">Description</div>
                <textarea v-if="isEditing" class="w-full h-32 resize-none text-base rounded-lg font-sans flex-grow" 
                    v-model="project.description">
                </textarea>
                <div v-else class="text-left">{{ project.description }}</div>
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