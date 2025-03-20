<!-- PlanningPage.vue -->
<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="font-bold m-0 text-2xl select-none">Planning</h1>

      <!-- Sélecteur de vue -->
      <ViewSelector :views="views" :selectedView="selectedView" @change-view="setView" />

      <!-- Boutons de navigation -->
      <NavigationButtons 
        @navigate="navigateDay" 
        :selectedView="selectedView" 
        :startDate="startDate" 
        @update-date="updateStartDate"
      />
    </div>

    <!-- Intégration du PlanningGrid -->
    <PlanningGrid
      :rows="rows"
      :events="events"
      :startDate="startDate"
      :endDate="endDate"
      :startHour="8.5"
      :endHour="17"
      :selectedView="selectedView"
      :daysArray="daysArray"
      @cell-clicked="handleCellClicked"
      @navigate="navigateDay"
    />
  </div>
</template>

<script>
import ViewSelector from '@/components/Planning/ViewSelector.vue';
import NavigationButtons from '@/components/Planning/NavigationButtons.vue';
import PlanningGrid from '@/components/Planning/PlanningGrid.vue';

export default {
  components: {
    ViewSelector,
    NavigationButtons,
    PlanningGrid
  },
  data() {
    return {
      views: ['Jour', 'Semaine', 'Mois', 'Année'],
      selectedView: 'Jour',
      selectedRows: 'Ressources',
      rows: [
        { id: 'r1', name: 'Resource 1' },
        { id: 'r2', name: 'Resource 2' },
        { id: 'r3', name: 'Resource 3' }
      ],
      events: [
        { resourceId: 'r1', hour: '09:00', title: 'Réunion' },
        { resourceId: 'r2', hour: '14:00', title: 'Entretien' }
      ],
      startDate: new Date(),
      endDate: new Date()
    };
  },
  computed: {
    daysArray() {
      const days = [];

      if(days.length === 0) {
        const current = new Date(this.startDate);
        while (current <= this.endDate) {
          days.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
        return days;
      }

      // Tant que startDate est postérieure au premier jour, on le retire
      while (days.length && this.startDate > days[0]) {
        days.shift();
      }
      
      // Tant que startDate est antérieure au premier jour, on l'ajoute au début
      while (days.length && this.startDate < days[0]) {
        days.unshift(this.startDate);
      }

      // Tant que endDate est antérieure au dernier jour, on le retire
      while (days.length && this.endDate < days[days.length - 1]) {
        days.pop();
      }
      
      // Tant que endDate est postérieure au dernier jour, on l'ajoute à la fin
      while (days.length && this.endDate > days[days.length - 1]) {
        days.push(this.endDate);
      }

      return days;
    },
  },
  methods: {
    setView(view) {
      console.log("Vue sélectionnée:", view);
      this.selectedView = view;

      switch (this.selectedView){
        case 'Jour':
          this.endDate = new Date(this.startDate);
          break;
        case 'Semaine': {
          const newDate = new Date(this.startDate);
          newDate.setDate(newDate.getDate() + 6);
          this.endDate = newDate;
          break;
        }
        case 'Mois': {
          const newDate = new Date(this.startDate);
          newDate.setDate(newDate.getDate() + 28);
          this.endDate = newDate;
          break;
        }
        case 'Année': {
          const newDate = new Date(this.startDate);
          newDate.setDate(newDate.getDate() + 364);
          this.endDate = newDate;
          break;
        }
      }
    },
    navigateDay(direction) {
      if (direction === 'zoom' || direction === 'dezoom') {
        // Calculer le nombre actuel de jours entre startDate et endDate
        const currentDays = Math.round((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
        
        let newDays;
        if (direction === 'zoom') {
          // Réduire l'écart (zoom) - minimum 1 jour
          newDays = Math.max(0, currentDays - 1);
        } else {
          // Augmenter l'écart (dezoom)
            newDays = currentDays + 1;
            if(newDays > 364) newDays = 364;
        }
        
        // Mettre à jour endDate en gardant startDate fixe
        this.endDate = new Date(this.startDate);
        this.endDate.setDate(this.startDate.getDate() + newDays);

        this.checkForViewChange();
      } else {
        // Navigation standard (avant/arrière)
        const days = direction === 'next' ? 1 : -1;
        
        // Calculer l'écart actuel en jours
        const currentSpan = Math.round((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
        
        // Déplacer startDate
        this.startDate = new Date(this.startDate);
        this.startDate.setDate(this.startDate.getDate() + days);
        
        // Maintenir le même écart pour endDate
        this.endDate = new Date(this.startDate);
        this.endDate.setDate(this.startDate.getDate() + currentSpan);
      }
    },
    updateStartDate(newDate) {
      this.startDate = newDate;
    },
    checkForViewChange(){
      const dateDiff = this.endDate - this.startDate;
      const days = Math.round(dateDiff / (1000 * 60 * 60 * 24)) + 1;

      if(days < 7) this.selectedView = 'Jour'; 
      else if(days < 28) this.selectedView = 'Semaine';
      else if(days < 150) this.selectedView = 'Mois';
      else this.selectedView = 'Année';
    },
    handleCellClicked({ resource, hour }) {
      console.log("Cellule cliquée pour", resource, "à", hour);
      // Ici, vous pourriez ouvrir un modal pour créer/modifier un événement
    }
  },
  mounted() {
    
  },
};
</script>

<style scoped>

</style>
