<template>
    <!-- Ressources -->
    <div class="flex flex-col">
        <div class="flex items-center justify-between mb-1 h-8">
            <!-- Titre -->
            <div class="text-left font-bold">Ressources</div>

            <!-- Bouton d'ajout -->
            <button class="callToAction !h-full !m-0" v-if="isEditing" @click="popupVisible = true; selectedRessource = null">
                Ajouter
            </button>
        </div>

        <!-- Liste des ressources -->
        <div class="!pb-0 overflow-auto h-[200px] border-solid border-2 border-gray-300 rounded-lg p-2">
            <!-- Pour chaque équipes dans l'odre alphabétique -->
            <template v-for="(team, index) in sortedTeams" :key="index">
                <!-- Nom de l'équipe -->
                <div class="w-full flex items-center">
                    <span class="mr-2 mb-1 mt-1">{{ team.name }}</span>
                    <hr class="flex-grow border-gray-300">
                </div>

                <!-- Pour chaque ressource de l'équipe -->
                <RessourceInProject v-for="ressource in team.ressources" :key="ressource.ressourceId" 
                    :ressourceProj="ressource"
                    :project="project"
                    :isEditing="isEditing"
                    :teams="equipes"
                    @dblclick="selectedRessource = ressource; isEditing ? popupVisible = true : popupVisible = false"
                >
                </RessourceInProject>
            </template>
        </div>
    </div>

    <PopupAddRessourceToProject
        :visible="popupVisible" 
        :projectRessources="project.ressources"
        :equipes="equipes"
        :ressource="selectedRessource"
        @close="popupVisible = false" 
        @add="addNewRessource"
        @update="updateExistingRessource"
        @delete="deleteRessource"
    >
    </PopupAddRessourceToProject>
</template>

<script>

import RessourceInProject from './RessourceInProject.vue';
import PopupAddRessourceToProject from '@/components/Popups/PopupAddRessourceToProject.vue';
import { addRessourceToProject, updateRessourceFromProject, deleteRessourceFromProject } from '@/services/projectService';

export default{
    components: {
        RessourceInProject,
        PopupAddRessourceToProject
    },
    props: {
        project: Object,
        isEditing: Boolean,
        equipes: Array
    },
    data(){
        return{
            popupVisible: false,
            selectedRessource: null
        }
    },
    computed: {
        // Renvoie les équipes triées par ordre alphabétique avec les ressources associées
        sortedTeams() {
            const teamsMap = new Map();

            // Pour chaque équipe, on crée un objet avec les ressources associées
            this.equipes.forEach(team => {
                teamsMap.set(team.id, { ...team, ressources: [] });
            });

            const noTeam = { id: '', name: 'Aucune équipe', ressources: [] };

            // Pour chaque ressource, on l'ajoute à l'équipe correspondante
            this.project.ressources.forEach(ressource => {
                const team = teamsMap.get(ressource.teamId) || noTeam;
                team.ressources.push(ressource);
            });

            // On renvoie les équipes avec les ressources associées
            const teams = Array.from(teamsMap.values());
            if (noTeam.ressources.length > 0) {
                teams.push(noTeam);
            }

            return teams.filter(team => team.ressources.length > 0);
        }
    },
    methods: {
        // Ajoute une nouvelle ressource au projet
        async addNewRessource(ressourceCont) {
            if(ressourceCont == undefined) return;

            console.log("Ajout d'une ressource dans ressources : ");
            console.log(ressourceCont);
            if(ressourceCont.ressourceId == "") {
                for(let ressource of this.equipes.find(e => e.id == ressourceCont.teamId).ressources){
                    if (!this.project.ressources.some(r => r.ressourceId === ressource)) {
                        await addRessourceToProject(this.project.id, ressourceCont.teamId, ressource);
                        this.project.ressources.push({ressourceId: ressource, role: ressourceCont.role, teamId: ressourceCont.teamId});
                    }
                }
                return;
            };

            await addRessourceToProject(this.project.id, ressourceCont.teamId, ressourceCont.ressourceId);
            this.project.ressources.push({ressourceId: ressourceCont.ressourceId, role: ressourceCont.role, teamId: ressourceCont.teamId});
        },
        // Met à jour une ressource existante
        updateExistingRessource(ressource){
            if(ressource == undefined) return;
            console.log("Update : ");
            console.log(ressource);
            const index = this.project.ressources.findIndex(r => r.ressourceId === ressource.ressourceId);
            if (index !== -1) {
                this.project.ressources.splice(index, 1, ressource);
            }
            updateRessourceFromProject(this.project.id, ressource.ressourceId, ressource.teamId, ressource.role);
        },
        // Supprime une ressource du projet
        deleteRessource(ressourceId) {
            this.project.ressources = this.project.ressources.filter(r => r.ressourceId !== ressourceId);
            deleteRessourceFromProject(this.project.id, ressourceId);
        },
    }
}

</script>