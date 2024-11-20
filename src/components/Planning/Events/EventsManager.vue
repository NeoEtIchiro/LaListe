<template>
    <div v-for="(event, index) in filteredEvents" :key="index" class="event" 
        @dblclick="openEditPopup(event, $event)"
        :style="{ top: returnEventPos(event, true)[0] + 'px', 
                  left: returnEventPos(event, true)[1] + 'px',
                  height: returnEventPos(event, true)[2] + 'px', 
                  width: returnEventPos(event, true)[3] + 'px'
                  }">
        <div>{{ event.title }}</div>
        <p>{{ event.description }}</p>
    </div>

    <div v-if="actEvent!=null" class="event actEvent"
        :style="{ top: returnEventPos(actEvent, true)[0] + 'px', 
                  left: returnEventPos(actEvent, true)[1] + 'px',
                  height: returnEventPos(actEvent, true)[2] + 'px', 
                  width: returnEventPos(actEvent, true)[3] + 'px'
                  }">
        <div>{{ actEvent.title }}</div>
        <p>{{ actEvent.description }}</p>
    </div>

    <PopupEvent
      v-if="showPopup"
      :event="selectedEvent"
      :position="popupPosition"
      @close="closeEditPopup"
      @save="updateEvent"
    />
</template>

<script>
import { fetchEvents, addEvent, updateEvent } from '../../../services/eventService';
import { fetchRessources } from '@/services/ressourceService';
import PopupEvent from './PopupEvent.vue';

export default {
    components:{
        PopupEvent,
    },
    props:{
        dateDebut: {type: Date},
        dateFin: {type: Date},
    },
    data(){
        return{
            actEvent: null,
            startOfEventCell: null,
            events: [],
            selectedEvent: null,
            showPopup: false,
            popupPosition: { top: 0, left: 0, width: 0 },
        }
    },
    computed:{
        filteredEvents() {
            // Filtrer les événements pour qu'ils correspondent à la date sélectionnée
            const filtered = this.events.filter(event => 
                new Date(event.date_debut).getTime() >= this.dateDebut.getTime()
                && new Date(event.date_fin).getTime() <= (this.dateFin.getTime())
            );
            return filtered;
        },
    },
    methods:{
        async loadEvents() {
            await fetchRessources();
            this.events = await fetchEvents();
        },
        startOfEvent(event){
            this.startOfEventCell = event.target;

            const newEvent = {
                ressource: this.startOfEventCell.dataset.ressource,
                date_debut: this.startOfEventCell.dataset.date,
                date_fin: this.addOrRemove5minutes(this.startOfEventCell.dataset.date, true),
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
                    this.actEvent.date_fin = this.addOrRemove5minutes(this.startOfEventCell.dataset.date, true);
                }
                else{
                    this.actEvent.date_fin = this.addOrRemove5minutes(closestCell.dataset.date, true);
                    this.actEvent.date_debut = this.startOfEventCell.dataset.date;
                }
            }
        },
        onMouseUp() {
            if (this.actEvent == null) return;

            this.events.push(this.actEvent);

            this.selectedEvent = { ...this.actEvent };
            // Attendre le rendu de l'événement avant de l'ouvrir dans la popup
            const lastEventElement = document.querySelector('.actEvent');
            if (lastEventElement) {
                // Ouvre la pop-up à la position de cet élément
                this.openEditPopup(this.selectedEvent, {currentTarget: lastEventElement });
            }

            this.actEvent = null;
        },
        returnEventPos(event, remove){
            const startCell = document.querySelector(`td[data-ressource="${event.ressource}"][data-date="${event.date_debut}"]`);
            const endCell = document.querySelector(`td[data-ressource="${event.ressource}"][data-date="${this.addOrRemove5minutes(event.date_fin, !remove)}"]`);
            
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
        removeEventsByRessource(ressourceId) {
            // Filtrer les événements pour supprimer ceux liés à `ressourceId`
            this.events = this.events.filter(event => event.ressource !== ressourceId);
        },
        addOrRemove5minutes(date, add){
            if(add){
                let newDate = new Date(date);
                newDate.setMinutes(newDate.getMinutes()+5);
                return `${newDate}`;
            }
            else{
                let newDate = new Date(date);
                newDate.setMinutes(newDate.getMinutes()-5);
                return `${newDate}`;
            }
        },
        openEditPopup(event, e) {
            this.selectedEvent = event;
            this.showPopup = true;
            const { top, left, width } = e.currentTarget.getBoundingClientRect();
            this.popupPosition = { top: top, left: left, width: width};
        },
        closeEditPopup() {
            this.showPopup = false;
            this.selectedEvent = null;
            this.events.pop();
        },
        updateEvent(updatedEvent) {
            const eventIndex = this.events.findIndex(event => event.id === updatedEvent.id && updatedEvent.id != undefined);
            
            if (eventIndex !== -1) {
                this.events[eventIndex] = updatedEvent;
                updateEvent(updatedEvent);
            }
            else if(this.selectedEvent){
                this.selectedEvent = null;

                addEvent(
                    updatedEvent.title,
                    updatedEvent.description,
                    updatedEvent.ressource,
                    updatedEvent.date_debut,
                    updatedEvent.date_fin
                );
                this.events[this.events.length-1] = updatedEvent;
            }

            this.showPopup = false;
        },
    },
    mounted(){
        this.loadEvents();
    }
}
</script>

<style scoped>
    .event{
        overflow: hidden;
        background-color: red;
        position: absolute;
        border-radius: 5px;
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    }

    .event p {
        font-size: small;
        user-select: none;
    }

    .event div{
        user-select: none;
    }

    .event-manager {
        padding: 1rem;
    }
    .event-item {
        padding: 1rem;
        background-color: #f0f0f0;
        border-radius: 5px;
        margin-bottom: 1rem;
        cursor: pointer;
    }
</style>