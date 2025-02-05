<template>
    <div class="flex items-center justify-between h-9">
        <!-- Bouton retour -->
        <button class="h-full w-10 !m-0 !mr-1" @click="$router.go(-1)">◀</button>

        <!-- Titre -->
        <input v-if="isEditing" 
            :class="['basicDiv', 'text-lg', 'flex-grow', 'h-full', isEditing ? 'border-black' : '']" 
            type="text" 
            v-model="project.name"
        />
        <div v-else class="basicDiv flex-grow text-lg text-left h-full flex items-center truncate">{{ project.name }}</div>
        
        <!-- Boutons d'action -->
        <div class="h-full">
            <button class="callToAction h-full !px-4 m-0 !ml-1" @click="$emit('toggle-editing')">{{ isEditing ? 'Enregistrer' : 'Modifier' }}</button>
            <button @click="deleteProject" class="h-full m-0 !ml-1">Supprimer</button>
        </div>
    </div>
</template>

<script>
import { deleteProject } from '@/services/projectService';

export default {
    name: 'ProjectHeader',
    props: ['project', 'isEditing'],
    methods: {
        // Supprime le projet de cette page et redirige vers la page précédente
        deleteProject() {
            deleteProject(this.project.id);
            this.$router.go(-1);
        }
    }
}
</script>