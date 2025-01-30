<template>
  <div class="flex h-8 mb-2" v-if="ressourceProj">
    <div class="basicDiv whitespace-nowrap w-full mr-1" v-if="actRes">{{actRes.name}}</div>
    <div class="basicDiv whitespace-nowrap" v-if="actRes">{{ressourceProj.role}}</div>
  </div>
</template>

<script>
import { updateRessourceFromProject } from '@/services/projectService';
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
      async fetchData(){
        this.actRes = await getRessource(this.ressourceProj.ressourceId);
      },
      async changeRessource(){
        updateRessourceFromProject(this.project.id, this.ressourceProj.ressourceId, this.ressourceProj.role);
      },
    },
    async mounted(){
      this.fetchData();
    },
    watch:{
      ressourceProj:{
        handler(){
          this.fetchData();
        }
      }
    }
}
</script>

<style scoped>

</style>