<template>
    <div v-for="(event, index) in filteredEvents" :key="index" class="event" 
        @dblclick="openEditPopup(event, $event)"
        :style="{   top: eventPositions[`${event.ressource}_${event.date_debut}_${event.date_fin}_${event.title}_${event.description}_${event.tache}`]?.[0] + 'px',
                    left: eventPositions[`${event.ressource}_${event.date_debut}_${event.date_fin}_${event.title}_${event.description}_${event.tache}`]?.[1] + 'px',
                    height: eventPositions[`${event.ressource}_${event.date_debut}_${event.date_fin}_${event.title}_${event.description}_${event.tache}`]?.[2] + 'px',
                    width: eventPositions[`${event.ressource}_${event.date_debut}_${event.date_fin}_${event.title}_${event.description}_${event.tache}`]?.[3] + 'px',
                  }">
        <div>{{ event.title }}</div>
        <p>{{ event.description }}</p>
    </div>

    <div v-if="actEvent!=null" class="event actEvent"
        :style="{ top: returnEventPos(actEvent)[0] + 'px', 
                  left: returnEventPos(actEvent)[1] + 'px',
                  height: returnEventPos(actEvent)[2] + 'px', 
                  width: returnEventPos(actEvent)[3] + 'px'  
                }">
        <div>{{ actEvent.title }}</div>
        <p>{{ actEvent.description }}</p>
    </div>

    <PopupEvent
      :visible="showPopup"
      :event="selectedEvent"
      :position="popupPosition"
      @close="closeEditPopup"
      @delete="closeEditPopupAndDelete"
      @save="updateEvent"
    />
</template>

<script>
import { fetchEvents, addEvent, updateEvent, deleteEvent } from '../../../services/eventService';
import { fetchRessources } from '@/services/ressourceService';
import PopupEvent from '../../Popups/PopupEvent.vue';

export default {
    components:{
        PopupEvent,
    },
    props:{
        dateDebut: {type: Date},
        dateFin: {type: Date},
        selectedRow: String
    },
    data(){
        return{
            actEvent: null,
            startOfEventCell: null,
            events: [],
            selectedEvent: null,
            showPopup: false,
            popupPosition: { top: 0, left: 0, width: 0 },
            eventPositions: {},
            lastWindowWidth: window.innerWidth, // Dernière largeur connue de la fenêtre
            lastWindowHeight: window.innerHeight,
        }
    },
    computed:{
        filteredEvents() {
            let filtered = [];
            // Filtrer les événements pour qu'ils correspondent à la date sélectionnée
            switch(this.selectedRow){
                case 'Ressource':
                    filtered = this.events.filter(event => 
                        new Date(event.date_fin) >= new Date(this.dateDebut)
                        && new Date(event.date_debut) <= new Date(this.dateFin).setHours(19,0,0,0)
                        && event.ressource != ""
                    );
                    break;
                case 'Tâches':
                    filtered = this.events.filter(event => 
                        new Date(event.date_fin) >= new Date(this.dateDebut)
                        && new Date(event.date_debut) <= new Date(this.dateFin).setHours(19,0,0,0)
                        && event.tache != ""
                    );
                    break;
            }
            return filtered;
        },
    },
    methods:{
        calculateEventPositions() {
            this.eventPositions = {};

            this.filteredEvents.forEach((event) => {
                const uniqueKey = `${event.ressource}_${event.date_debut}_${event.date_fin}_${event.title}_${event.description}_${event.tache}`;
                this.eventPositions[uniqueKey] = this.returnEventPos(event);
            });
        },
        async loadEvents() {
            await fetchRessources();
            this.events = await fetchEvents();
        },
        startOfEvent(event){
            this.startOfEventCell = event.target;

            const newEvent = {
                ressource: [],
                date_debut: new Date(this.startOfEventCell.dataset.datedebut),
                date_fin: new Date(this.startOfEventCell.dataset.datefin),
                title: "Gros titre",
                description: "Petite description",
                tache: "",
                project: "",
                isFinished: false,
                orderInProject: 0,
            };

            switch(this.selectedRow){
                case 'Ressource':
                    newEvent.ressource = this.startOfEventCell.dataset.row;
                    break;
                case 'Tâches':
                    newEvent.tache = this.startOfEventCell.dataset.row;
                    break;
            }
            
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
                if(new Date(closestCell.dataset.datedebut).getTime() < new Date(this.startOfEventCell.dataset.datedebut).getTime()){
                    
                    this.actEvent.date_debut = new Date(closestCell.dataset.datedebut);
                    this.actEvent.date_fin = new Date(this.startOfEventCell.dataset.datefin);
                }
                else{
                    this.actEvent.date_fin = new Date(closestCell.dataset.datefin);
                    this.actEvent.date_debut = new Date(this.startOfEventCell.dataset.datedebut);
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
        returnEventPos(event) {
            const cells = this.selectRow(event);

            if (!cells.length) return [0, 0, 0, 0]; // Retourne des valeurs par défaut si aucune cellule n'est trouvée

            // Convertir la date de l'événement en objet Date pour la comparaison
            const eventStart = new Date(event.date_debut).getTime();
            const eventEnd = new Date(event.date_fin).getTime();

            // Variables pour stocker les cellules les plus proches
            let closestStartCell = null;
            let closestEndCell = null;

            // Variables pour stocker la distance minimale
            let minStartDistance = Infinity;
            let minEndDistance = Infinity;

            cells.forEach((cell) => {
                const cellStartDate = new Date(cell.dataset.datedebut).getTime();
               
                // Calculer la distance pour la date de début
                const startDistance = Math.abs(cellStartDate - eventStart);
                
                if (startDistance < minStartDistance) {
                    minStartDistance = startDistance;
                    closestStartCell = cell;
                }

                const cellEndDate = new Date(cell.dataset.datefin).getTime();
                // Calculer la distance pour la date de fin
                const endDistance = Math.abs(cellEndDate - eventEnd);
                if (endDistance < minEndDistance) {
                    minEndDistance = endDistance;
                    closestEndCell = cell;
                }
            });

            if (!closestStartCell || !closestEndCell) return [0, 0, 0, 0]; // Sécurité si aucune cellule n'est trouvée

            // Récupérer les positions et dimensions des cellules
            const startRect = closestStartCell.getBoundingClientRect();
            const endRect = closestEndCell.getBoundingClientRect();

            return [
                startRect.top, // Position Y
                startRect.left, // Position X
                startRect.height, // Hauteur
                endRect.right - startRect.left, // Largeur combinée
            ];
        },
        findClosestCell(mouseX, mouseY) {
            const cells = this.selectRow(this.actEvent);
            
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
        selectRow(event){
            switch (this.selectedRow){
                case 'Ressource':
                    return document.querySelectorAll(`td[data-row="${event.ressource}"]`);
                case 'Tâches':
                    return document.querySelectorAll(`td[data-row="${event.tache}"]`);
            }
        },
        removeEventsByRessource(ressourceId) {
            // Filtrer les événements pour supprimer ceux liés à `ressourceId`
            this.events = this.events.filter(event => event.ressource !== ressourceId);
        },
        openEditPopup(event, e) {
            this.selectedEvent = event;
            this.showPopup = true;
            const { top, left, width } = e.currentTarget.getBoundingClientRect();
            this.popupPosition = { top: top, left: left, width: width};
        },
        closeEditPopup(){
            this.showPopup = false;
            this.selectedEvent = null;
        },
        closeEditPopupAndDelete() {
            this.showPopup = false;

            if(!this.selectedEvent.id) this.events.pop();
            else this.events = this.events.filter((e) => e != this.selectedEvent);
            deleteEvent(this.selectedEvent);
            this.selectedEvent = null;
        },
        updateEvent(updatedEvent) {
            const eventIndex = this.events.findIndex(event => event.id === updatedEvent.id && updatedEvent.id != undefined);
            
            if (eventIndex !== -1) {
                this.events[eventIndex] = updatedEvent;
                updateEvent(updatedEvent);
            }
            else if(this.selectedEvent){
                this.selectedEvent = null;

                addEvent(updatedEvent);
                this.events[this.events.length-1] = updatedEvent;
            }

            this.showPopup = false;
        },
        handleResizeOrScroll() {
            const currentWidth = document.documentElement.clientWidth; // Largeur visible
            const currentHeight = document.documentElement.clientHeight; // Hauteur visible
            
            // Recalcule les positions si les dimensions ont changé
            if (currentWidth !== this.lastWindowWidth || currentHeight !== this.lastWindowHeight) {
                this.calculateEventPositions();
                this.lastWindowWidth = currentWidth;
                this.lastWindowHeight = currentHeight;
            }
        },
    },
    mounted() {
        this.loadEvents();

        // Écouteurs pour resize et scroll
        window.addEventListener('resize', this.handleResizeOrScroll);
        window.addEventListener('scroll', this.handleResizeOrScroll);

        // Vérification périodique des dimensions
        this.resizeCheckInterval = setInterval(() => {
            this.handleResizeOrScroll();
        }, 200);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResizeOrScroll);
        window.removeEventListener('scroll', this.handleResizeOrScroll);
        clearInterval(this.resizeCheckInterval);
    },
    watch:{
        selectedRow: {
            async handler() {
                await fetchEvents();
                this.calculateEventPositions();
            },
            immediate: true, // Pour exécuter au montage du composant
        },
        dateDebut: {
            handler() {
                this.calculateEventPositions();
            },
            immediate: true,
        },
        filteredEvents: {
            handler() {
                this.calculateEventPositions();
            },
            deep: true,
            immediate: true,
        },
    }
}
</script>

<style scoped>
    .event{
        overflow: hidden;
        background-color: red;
        position: absolute;
        border-radius: 5px;
        border: 1px solid rgb(185, 0, 0);
        
    }

    .event p {
        font-size: small;
        user-select: none;
        margin: 5px;
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