<template>
    <div class="edit-popup" :style="{ top: `${adjustedTop}px`, left: `${adjustedLeft}px` }">
      <div class="popup-header">
        <h3>Modifier l'évènement</h3>
        <button @click="closePopup">X</button>
      </div>
      <form @submit.prevent="saveEvent">
        <div class="form-group">
          <label for="title">Titre :</label>
          <input v-model="editableEvent.title" type="text" id="title" required />
        </div>
        <div class="form-group">
          <label for="description">Description :</label>
          <textarea v-model="editableEvent.description" id="description"></textarea>
        </div>
        <div class="form-group">
          <label>Date et heure de début :</label>
          <input v-model="startDate" type="date" required />
          <input v-model="startTime" type="time" required />
        </div>
        <div class="form-group">
          <label>Date et heure de fin :</label>
          <input v-model="endDate" type="date" required />
          <input v-model="endTime" type="time" required />
        </div>
        <button type="submit">Sauvegarder</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    props: ['event', 'position'],
    data() {
      return {
        editableEvent: { ...this.event },
        startDate: this.formatDate(this.event.date_debut, 'date'),
        startTime: this.formatDate(this.event.date_debut, 'time'),
        endDate: this.formatDate(this.event.date_fin, 'date'),
        endTime: this.formatDate(this.event.date_fin, 'time'),
        popupWidth: 250,
        popupHeight: 350, // Estimation de la hauteur totale
      };
    },
    computed: {
      adjustedLeft() {
        if(window.innerWidth - (this.position.left + this.position.width) >= this.popupWidth){
          return this.position.left + this.position.width;
        }
        else if(this.position.left >= this.popupWidth){
          return this.position.left - this.popupWidth;
        }
        else{
          return this.position.left;
        }
      },
      adjustedTop() {
        return this.position.top - this.popupHeight/2;
      },
    },
    methods: {
      formatDate(datetimeString, type) {
        if (!datetimeString) return '';
        const dateObj = new Date(datetimeString);
        if (type === 'date') {
          return dateObj.toISOString().slice(0, 10); // Format YYYY-MM-DD
        } else if (type === 'time') {
          return dateObj.toTimeString().slice(0, 5); // Format HH:MM
        }
      },
      parseDate(date, time) {
        return `${new Date(`${date}T${time}:00`)}`;
      },
      closePopup() {
        this.$emit('close');
      },
      saveEvent() {
        this.editableEvent.date_debut = this.parseDate(this.startDate, this.startTime);
        this.editableEvent.date_fin = this.parseDate(this.endDate, this.endTime);
        this.$emit('save', this.editableEvent);
      },
      handleClickOutside(event) {
        // Vérifie si le clic est en dehors du menu ouvert
        const popup = event.target.closest(".edit-popup");

        if (!popup) {
          document.removeEventListener("click", this.handleClickOutside);
          this.closePopup();
        }
      },
    },
    mounted(){
      document.addEventListener("click", this.handleClickOutside);
    },
  };
  </script>
  
  <style scoped>
  .edit-popup {
    position: absolute;
    background-color: white;
    border: 1px solid #ddd;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    border-radius: 8px;
    width: 250px;
    z-index: 10;
  }
  
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  button[type="submit"] {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 4px;
  }
  </style>
  