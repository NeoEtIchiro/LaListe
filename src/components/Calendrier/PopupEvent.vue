<template>
    <div class="edit-popup" :style="{ top: `${position.top}px`, left: `${position.left}px` }">
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
        startDate: this.event.startDateTime ? this.event.startDateTime.split('T')[0] : '',
        startTime: this.event.startDateTime ? this.event.startDateTime.split('T')[1] : '',
        endDate: this.event.endDateTime ? this.event.endDateTime.split('T')[0] : '',
        endTime: this.event.endDateTime ? this.event.endDateTime.split('T')[1] : '',
      };
    },
    methods: {
      closePopup() {
        this.$emit('close');
      },
      saveEvent() {
        this.editableEvent.startDateTime = `${this.startDate}T${this.startTime}`;
        this.editableEvent.endDateTime = `${this.endDate}T${this.endTime}`;
        this.$emit('save', this.editableEvent);
      },
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
  