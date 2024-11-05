<template>
    <div>
      <h2>Calendrier</h2>
  
      <button @click="dayBefore">
        Day Before
      </button>
      <button @click="dayAfter">
        Day After
      </button>
      <!-- Conteneur scrollable pour le tableau -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th class="topRow"></th>
              <th :colspan="12 * hours.length">{{ upperCaseFirstLetter(dateAct.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })) }}</th>
            </tr>
            <tr>
              <th class="topRow"></th>
              <th :colspan="12 * hours.length">{{ upperCaseFirstLetter(dateAct.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' })) }}</th>
            </tr>
            <tr>
              <!-- Ligne d'en-tête avec les heures -->
              <th class="topRow"></th>
              <th v-for="hour in hours" :key="hour" :colspan="12">{{ hour }}</th>
            </tr>
          </thead>
          <tbody>
            <!-- Lignes de données, 12 colonnes par heure -->
            <tr v-for="ressource in ressources.length" :key="ressource">
              <td class="ressource">
                <div class="ressourceContent" @dblclick="openPopup(ressource-1)">
                  {{ressource}} - {{ ressources[ressource-1] }}
                </div>
              </td>
              <template v-for="hour in hours.length" :key="hours[hour]">
                <template v-if="hour%2 != 0">
                  <td v-for="segment in 12" :key="segment" 
                      @mousedown="startOfEvent($event)" class="heurePair" 
                      :data-ressource="ressource" :data-date="dateFromDateHourMinute(dateAct, convertHourToInt(hours[hour-1]), (segment-1)*5)"></td>
                </template>
                <template v-else>
                  <td v-for="segment in 12" :key="segment"
                      @mousedown="startOfEvent($event)" 
                      :data-ressource="ressource" :data-date="dateFromDateHourMinute(dateAct, convertHourToInt(hours[hour-1]), (segment-1)*5)"></td>
                </template>
              </template>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="divButtonRessource" v-if="ressources.length < maxRessource">
        <button id="addRessource" @click="addRessource">
          +
        </button>
      </div>
      

      <div v-for="(event, index) in events" :key="index" class="event" 
        :style="{ top: returnEventPos(event)[0] + 'px', 
                  left: returnEventPos(event)[1] + 'px',
                  height: returnEventPos(event)[2] + 'px', 
                  width: returnEventPos(event)[3] + 'px'
                  }">
        {{ event.titre }}
        <p>{{ event.description }}</p>
      </div>

      <div v-if="actEvent!=null" class="event" 
        :style="{ top: returnEventPos(actEvent)[0] + 'px', 
                  left: returnEventPos(actEvent)[1] + 'px',
                  height: returnEventPos(actEvent)[2] + 'px', 
                  width: returnEventPos(actEvent)[3] + 'px'
                  }">
        {{ actEvent.titre }}
        <p>{{ actEvent.description }}</p>
      </div>

      <PopupRessource 
        :visible="isPopupVisible" 
        :initialText="ressources[selectedRes]" 
        @save="updateText" 
        @close="isPopupVisible = false" 
        @deleteRes="deleteRessource"
      />
    </div>
  </template>
  
<script>
  import PopupRessource from './PopupRessource.vue';

  export default {
    components: {
      PopupRessource,
  } ,
    data() {
      return {
        // Liste des heures de 08:00 à 18:00
        hours: [
          "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
        ],
        // Exemple de lignes de données
        ressources: ["David", "Néo", "Ordinateur"], // Ces lignes représentent des ressources ou des entrées de données,
        maxRessource: 5,
        selectedRes: 0,

        dateAct: new Date(),

        startOfEventCell: null,
        actEvent: null,
        events: [],

        isPopupVisible: false,
      };
    },
    methods:{
      upperCaseFirstLetter(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
      dayAfter(){
        this.events = [];
        this.dateAct = new Date(this.dateAct.getTime() + 86400000);
      },
      dayBefore(){
        this.events = [];
        this.dateAct = new Date(this.dateAct.getTime() - 86400000);
      },
      startOfEvent(event){
        this.startOfEventCell = event.target;

        const newEvent = {
          ressource: this.startOfEventCell.dataset.ressource,
          date_debut: this.startOfEventCell.dataset.date,
          date_fin: this.startOfEventCell.dataset.date,
          titre: "Gros titre",
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
        this.actEvent = null;
      },
      dateFromDateHourMinute(date, hour, minute) {
        const newDate = new Date(date); // Crée une nouvelle instance de la date
        newDate.setHours(hour);
        newDate.setMinutes(minute);
        newDate.setSeconds(0);
        return newDate;
      },
      convertHourToInt(hour) {
        return parseInt(hour.split(':')[0], 10); // Récupère la partie heure et convertit en entier
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
      addRessource(){
        this.ressources.push("Nouvelle ressource");
        this.openPopup(this.ressources.length-1);
      },
      openPopup(ressource) {
        this.selectedRes = ressource;
        this.isPopupVisible = true; // Affiche la popup
      },
      updateText(newText) {
        this.ressources[this.selectedRes] = newText; // Met à jour le texte avec celui de la popup
        this.isPopupVisible = false;
      },
      deleteRessource(){
        this.ressources.splice(this.selectedRes, 1);

        this.events.forEach(e => {
          if(e.ressource == this.selectedRes+1){
            console.log(this.selectedRes+1);
            this.events.splice(this.events.indexOf(e), 1);
          }
          else if(e.ressource > this.selectedRes+1){
            e.ressource--;
          }
        });
      }
    }
  };
  </script>
  
<style scoped>
  /* Conteneur scrollable pour le tableau */
  .table-container {
    width: 100%;
    overflow-x: auto; /* Permet le défilement horizontal si nécessaire */
    margin-top: 20px;
  }

  .topRow{
    width: 150px;
    height: 5px;
  }

  .ressource {
    height: 50px;
    text-align: left;
    padding: 8px;
    border: 1px solid #ddd;
  }

  .ressourceContent {
    width: 100%;
    height: 100%;
    align-content: center;
  }

  .heurePair{
    background-color: rgb(255, 221, 221);
  }

  .event{
    overflow: hidden;
    background-color: red;
    position: absolute;
    border-radius: 5px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }
  
  th, td {
    padding: 4px;
    text-align: center;
  }
  
  th {
    background-color: #f4f4f4;
    border: 1px solid #ddd;
  }

  td{
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }

  td:hover{
    background-color: rgb(112, 255, 255);
  }

  p {
    font-size: small;
  }

  #divButtonRessource{
    text-align: left;
  }

  #addRessource{
    border:1px solid grey;
    width:159px;
    text-align: center;
    border-end-end-radius: 10px;
    border-end-start-radius: 10px;
    padding-left: 8px;
    padding-right: 8px;
  }
</style>
  