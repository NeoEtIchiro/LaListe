<template>
  <div class="flex h-8 mb-2" v-if="ressourceProj">
    <div class="basicDiv whitespace-nowrap mr-1" v-if="actTeam">
      {{actTeam.name}}
    </div>
    <div class="basicDiv whitespace-nowrap mr-1" v-else>
      Aucune equipe
    </div>

    <div class="basicDiv whitespace-nowrap w-full mr-1" v-if="actRes">{{actRes.name}}</div>

    <div class="basicDiv whitespace-nowrap mr-1" v-if="actRes && isEditing">{{ressourceProj.role}}</div>
    <div class="basicDiv whitespace-nowrap" v-if="actRes && !isEditing">{{ressourceProj.role}}</div>

    <button class="border-0 font-bold w-8 h-8 rounded-lg pl-2 pr-2" v-if="isEditing" @click="$emit('delete', ressourceProj.ressourceId)">X</button>
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
        updateRessourceFromProject(this.project.id, this.ressourceProj.ressourceId, this.ressourceProj.role);
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

</style>