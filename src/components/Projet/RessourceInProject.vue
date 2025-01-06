<template>
  <div class="ressourceProjDiv" v-if="ressourceProj">
    <div class="equipeDiv" v-if="isEditing">
      <select v-model="ressourceProj.teamId" @change="changeRessource">
        <option value="">Aucune equipe</option>
        <option v-for="team in teams" :key="team.id" :value="team.id">{{team.name}}</option>
      </select>
    </div>
    <template v-else>
      <div class="equipeDiv" v-if="actTeam">
        {{actTeam.name}}
      </div>
      <div class="equipeDiv" v-else>
        Aucune equipe
      </div>
    </template>

    <div class="ressourceDiv" v-if="actRes">
      {{actRes.name}}
      <div class="actionDiv">
        <input type="checkbox" class="ressourceResponsable" v-model="ressourceProj.responsable" :disabled="!isEditing" 
              :value="ressourceProj.responsable" @change="changeRessource">
        <button v-if="isEditing" @click="$emit('delete', ressourceProj.ressourceId)">X</button>
      </div>
    </div>
  </div>
</template>

<script>
import { updateRessourceFromProject } from '@/services/projectService';
import { getEquipeById } from '@/services/equipeService';
import { getRessource } from '@/services/ressourceService';

export default {
    props:['ressourceProj', 'project', 'isEditing', 'teams'],
    data(){
      return{
        actTeam: null,
        actRes: null
      };
    },
    methods:{
      async changeRessource(){
        updateRessourceFromProject(this.project.id, this.ressourceProj.ressourceId, this.ressourceProj.responsable);
        this.actTeam = await getEquipeById(this.ressourceProj.teamId);
      },
    },
    async mounted(){
      this.actRes = await getRessource(this.ressourceProj.ressourceId);
      this.actTeam = await getEquipeById(this.ressourceProj.teamId);
    }
}
</script>

<style scoped>
.ressourceDiv {
  background-color: rgb(235, 235, 235);
  border-radius: 8px;
  padding: 8px;
  margin: 8px 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 36px;
  width: 100%;
}

.actionDiv{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.equipeDiv{
  background-color: rgb(235, 235, 235);
  border-radius: 8px;
  padding: 8px;
  height: 36px;
  margin: 8px 4px;
  margin-right: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
}

.ressourceDiv:has(.ressourceResponsable:checked) {
  background-color: hwb(116 77% 0%); /* Couleur de fond quand la case est cochée */
}

.ressourceProjDiv{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ressourceResponsable {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #258900;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  position: relative;
  transition: background-color 0.3s, border-color 0.3s;
  box-sizing: border-box;
}


/* Style pour l'état actif (case cochée) */
.ressourceResponsable:checked {
  background-color: #64ff71; /* Couleur de fond quand cochée */
}

/* Ajout d'un symbole "check" */
.ressourceResponsable:checked::after {
  content: "✓"; /* Symbole check */
  color: rgb(0, 0, 0); /* Couleur du check */
  font-size: 13px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Centre le symbole */
}

/* Effet au survol */
.ressourceResponsable:hover {
  background-color: #79ff84;
}
</style>