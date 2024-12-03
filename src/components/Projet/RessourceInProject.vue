<template>
  <div class="backDiv">
    {{actRes.name}}
    <input type="checkbox" class="ressourceResponsable" v-model="ressourceProj.responsable" :value="ressourceProj.responsable" @change="changeRessource">
  </div>
</template>

<script>
import { getRessource } from '@/services/ressourceService';

export default {
    props:['ressourceProj'],
    date(){
      return{
        actRes,
      }
    },
    methods:{
      changeRessource(){
        updateProjectRessource(this.ressourceProj);
      },
    },
    mounted(){
      this.actRes = getRessource(this.ressourceProj.id);
    }
}
</script>

<style scoped>
.backDiv {
  background-color: rgb(235, 235, 235);
  border-radius: 8px;
  padding: 8px;
  margin: 8px 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.backDiv:has(.ressourceResponsable:checked) {
  background-color: hwb(116 77% 0%); /* Couleur de fond quand la case est cochée */
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