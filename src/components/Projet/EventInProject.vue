<template>
  <div class="flex h-fit mb-0">
    <div class="w-full mr-3">
      <div class="basicDiv !h-fit flex flex-col w-full !p-0">
        <div class="basicDiv !h-10 !pr-1 w-full whitespace-nowrap flex justify-between !border-none !bg-transparent">
          <div class="w-full text-left" @dblclick="$emit('open', event)">{{event.title}}</div>
          <button v-if="isEditing" @click="addTask(); isOpened = true" class="callToAction !h-8 !m-0 text-sm !px-4 flex items-center">Ajouter une tâche</button>
        </div>
        <button class="w-full !h-6 flex items-center justify-center rounded-xs" @click="isOpened = !isOpened">
          {{ isOpened ? '▲' : '▼' }}
        </button>
      </div>
      
      <TaskInEvent v-if="isOpened" v-for="task in tasks" :key="task.id"
        :task="task"
        :isEditing="isEditing"
        :event="event"
      >
      </TaskInEvent>
    </div>
    
    <div class="basicDiv !h-10 mr-1 whitespace-nowrap">
      Du {{ formatDate(event.date_debut) }}
    </div>
    <div class="basicDiv !h-10 whitespace-nowrap">
      Au {{ formatDate(event.date_fin) }}
    </div>
  </div>
</template>

<script>
import { addTask, fetchTasksByEventId } from '@/services/taskService';
import TaskInEvent from '@/components/Projet/TaskInEvent.vue';

export default {
    props:['event', 'isEditing'],
    components: {
      TaskInEvent
    },
    data(){
      return {
        tasks: [],
        isOpened: false
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
          isFinished: false,
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

</style>