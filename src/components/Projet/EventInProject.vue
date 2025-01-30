<template>
  <div class="flex h-10 mb-2">
    <div class="basicDiv !h-10 mb-2 !pr-1 mr-1 w-full whitespace-nowrap flex justify-between">
      <div>{{event.title}}</div>
      <button v-if="isEditing" @click="addTask" class="callToAction !h-8 !m-0 text-sm !px-4 flex items-center">Ajouter une tâche</button>
    </div>
    <div class="basicDiv !h-10 mb-2 mr-1 whitespace-nowrap">
      Du {{ formatDate(event.date_debut) }}
    </div>
    <div class="basicDiv !h-10 mb-2 whitespace-nowrap">
      Au {{ formatDate(event.date_fin) }}
    </div>
  </div>
</template>

<script>
import { addTask, fetchTasksByEventId } from '@/services/taskService';

export default {
    props:['event', 'isEditing'],
    data(){
      return {
        tasks: []
      }
    },
    methods: {
      async fetchData(){
        this.tasks = await fetchTasksByEventId(this.event.id);
      },
      formatDate(date) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      },
      async addTask(){
        const newTask = {
          title: 'Nouvelle tâche',
          description: '',
          start_date: new Date(this.event.date_debut),
          end_date: new Date(this.event.date_debut),
          amount: 0,
          expectedTime: 0,
          eventId: this.event.id,
          taskId: ''
        }

        const newTaskId = await addTask(newTask); 
        this.tasks.push(newTaskId);
      }
    },
    mounted(){
      this.fetchData();
    }

}
</script>

<style scoped>
.basicDiv{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  background-color: #ebebeb;
  padding: 4px 8px;
  border-radius: 8px;
}
</style>