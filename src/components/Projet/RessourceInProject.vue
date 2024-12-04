<template>
  <div class="ressourceProjDiv" v-if="actRes">
    <div class="equipeDiv">
      Equipe Nettoyage
    </div>
    <div class="ressourceDiv">
      {{actRes.name}}
      <input type="checkbox" class="ressourceResponsable" v-model="ressourceProj.responsable" :value="ressourceProj.responsable" @change="changeRessource">
    </div>
  </div>
</template>

<script>
import { getRessource } from '@/services/ressourceService';
import { updateProjectRessource } from '@/services/projectService';

export default {
    props:['ressourceProj'],
    data(){
      return{
        actRes: null,
      };
    },
    methods:{
      changeRessource(){
        updateProjectRessource(this.ressourceProj);
      },
    },
    async mounted(){
      console.log(this.ressourceProj.responsable);
      this.actRes = await getRessource(this.ressourceProj.ressourceId);
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