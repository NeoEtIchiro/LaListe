<template>
  <div class="backDiv">
    {{event.title}}
    <input type="checkbox" class="eventFinished" v-model="event.isFinished" :value="event.isFinished" @change="changeEvent">
  </div>
</template>

<script>
import { updateEvent } from '@/services/eventService';

export default {
    props:['event'],
    methods:{
      changeEvent(){
        updateEvent(this.event);
      },
    },
    mounted(){
      console.log("je suis un évènement monté");
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

.backDiv:has(.eventFinished:checked) {
  background-color: hwb(116 77% 0%); /* Couleur de fond quand la case est cochée */
}

.eventFinished {
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
.eventFinished:checked {
  background-color: #64ff71; /* Couleur de fond quand cochée */
}

/* Ajout d'un symbole "check" */
.eventFinished:checked::after {
  content: "✓"; /* Symbole check */
  color: rgb(0, 0, 0); /* Couleur du check */
  font-size: 13px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Centre le symbole */
}

/* Effet au survol */
.eventFinished:hover {
  background-color: #79ff84;
}
</style>