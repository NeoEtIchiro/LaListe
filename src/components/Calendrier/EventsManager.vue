<template>
    <div v-for="(event, index) in filteredEvents" :key="index" class="event" 
        :style="{ top: returnEventPos(event)[0] + 'px', 
                  left: returnEventPos(event)[1] + 'px',
                  height: returnEventPos(event)[2] + 'px', 
                  width: returnEventPos(event)[3] + 'px'
                  }">
        {{ event.title }}
        <p>{{ event.description }}</p>
    </div>

    <div v-if="actEvent!=null" class="event" 
        :style="{ top: returnEventPos(actEvent)[0] + 'px', 
                  left: returnEventPos(actEvent)[1] + 'px',
                  height: returnEventPos(actEvent)[2] + 'px', 
                  width: returnEventPos(actEvent)[3] + 'px'
                  }">
        {{ actEvent.title }}
        <p>{{ actEvent.description }}</p>
    </div>
</template>

<script>
import { fetchEvents, addEvent } from '../../services/eventService';
import { fetchRessources } from '@/services/ressourceService';

export default {
    props:{
        dateDebut: {type: Date, required:true},
        dateFin: {type: Date, required:true},
    },
    data(){
        return{
            actEvent: null,
            startOfEventCell: null,
            events: [],
        }
    },
    computed:{
        filteredEvents() {
            // Filtrer les événements pour qu'ils correspondent à la date sélectionnée
            const filtered = this.events.filter(event => 
                new Date(event.date_debut).getTime() >= this.dateDebut.getTime() - 250
                && new Date(event.date_fin).getTime() <= (this.dateFin.getTime() + 3600000)
            );

            return filtered;
        },
    },
    methods:{
        async loadEvents() {
            await fetchRessources();
            this.events = await fetchEvents();
            console.log(this.events);
        },
        startOfEvent(event){
            this.startOfEventCell = event.target;

            const newEvent = {
                ressource: this.startOfEventCell.dataset.ressource,
                date_debut: this.startOfEventCell.dataset.date,
                date_fin: this.startOfEventCell.dataset.date,
                title: "Gros titre",
                description: "Petite description"
            };

            this.actEvent = newEvent;

            document.addEventListener('mousemove', this.onMouseMove);
            document.addEventListener('mouseup', this.onMouseUp);
        },
        onMouseMove(event){
            if(this.actEvent == null) return;

            const mouseX = event.clientX;
            const mouseY = event.clientY;

            // Recherche de la cellule la plus proche de la souris
            const closestCell = this.findClosestCell(mouseX, mouseY);

            if (closestCell) {
            if(closestCell.dataset.date < this.startOfEventCell.dataset.date){
                this.actEvent.date_debut = closestCell.dataset.date;
                this.actEvent.date_fin = this.startOfEventCell.dataset.date;
            }
            else{
                this.actEvent.date_fin = closestCell.dataset.date;
                this.actEvent.date_debut = this.startOfEventCell.dataset.date;
            }
            }
        },
        onMouseUp(){
            if(this.actEvent == null) return;
            this.events.push(this.actEvent);
            addEvent(this.actEvent.title, this.actEvent.description, this.actEvent.ressource, this.actEvent.date_debut, this.actEvent.date_fin);
            this.actEvent = null;
        },
        returnEventPos(event){
            const startCell = document.querySelector(`td[data-ressource="${event.ressource}"][data-date="${event.date_debut}"]`);
            const endCell = document.querySelector(`td[data-ressource="${event.ressource}"][data-date="${event.date_fin}"]`);
            
            const returnStat = [
            startCell.getBoundingClientRect().top, 
            startCell.getBoundingClientRect().left, 
            startCell.getBoundingClientRect().height,
            endCell.getBoundingClientRect().right - startCell.getBoundingClientRect().left];
            
            return returnStat;
        },
        findClosestCell(mouseX, mouseY) {
            const cells = document.querySelectorAll(`td[data-ressource="${this.actEvent.ressource}"]`);
            
            let closestCell = null;
            let minDistance = Infinity;

            cells.forEach((cell) => {
            const rect = cell.getBoundingClientRect();
            const cellCenterX = rect.left + rect.width / 2;
            const cellCenterY = rect.top + rect.height / 2;

            // Calculer la distance entre la souris et le centre de la cellule
            const distance = Math.sqrt(Math.pow(mouseX - cellCenterX, 2) + Math.pow(mouseY - cellCenterY, 2));
            
            // Mettre à jour si cette cellule est plus proche
            if (distance < minDistance) {
                minDistance = distance;
                closestCell = cell;
            }
            });

            return closestCell;
        },
        deleteEvents(ressource){
            this.events.forEach(e => {
                if(e.ressource == ressource+1){
                    this.events.splice(this.events.indexOf(e), 1);
                }
                else if(e.ressource > ressource+1){
                    e.ressource--;
                }
            });
        }
    },
    mounted(){
        this.loadEvents();
    }
}
</script>

<style>
    .event{
        overflow: hidden;
        background-color: red;
        position: absolute;
        border-radius: 5px;
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    }

    .event p {
        font-size: small;
    }
</style>