<template>
  <div class="ressourceProjDiv" v-if="actRes">
    <div class="ressourceDiv">
      {{actRes.name}}
      <button @click="$emit('delete', equipe, ressourceEquipe)">X</button>
    </div>
  </div>
</template>

<script>
import { getRessource } from '@/services/ressourceService';

export default {
    props:['equipe', 'ressourceEquipe'],
    data(){
      return{
        actRes: null,
      };
    },
    async mounted(){
      this.actRes = await getRessource(this.ressourceEquipe);
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

.ressourceEquipeDiv{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>