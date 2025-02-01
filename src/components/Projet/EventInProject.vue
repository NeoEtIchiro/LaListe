<template>
  <div class="flex h-fit mb-0">
    <div class="w-full">
      <div :class="['basicDiv', '!h-fit', 'flex', 'flex-col', 'w-full', '!p-0', '!mb-1', event.isFinished ? '!bg-red-100' : '']">
        <div class="basicDiv !p-1 !h-10 !pr-1 w-full whitespace-nowrap flex justify-between !border-none !bg-transparent">
          <div class="flex items-center">
            <button v-if="isEditing" @click="$emit('delete', this.event.id)" class="m-0 !mr-2 w-8 h-8">X</button>
            <div class="w-full text-left text-lg" @dblclick="$emit('open', event)">{{event.title}}</div>
          </div>
          <div v-if="isEditing" class="flex">
            <button @click="addTask(); isOpened = true" class="callToAction !h-8 !m-0 text-sm !px-4 flex items-center">Ajouter une tâche</button>
            <input type="checkbox" class="!h-8 !w-8 !m-0 !ml-2 !p-0" v-model="event.isFinished">
          </div>
        </div>

        <div class="flex w-full">
          <div class="ml-1 break-words whitespace-normal w-1/2 text-left text-base">
            nufiuioezczieuocnzejlkcnejzklcnzejklncezjkl nzj fzebbhbhfezfdbzehfzeb kfezjbhkze
          </div>
          <div class="flex justify-end w-1/2">
            <div class="basicDiv !h-8 mr-1 whitespace-nowrap">
              Du {{ formatDate(event.date_debut) }}
            </div>
            <div class="basicDiv !h-8 whitespace-nowrap mr-1">
              Au {{ formatDate(event.date_fin) }}
            </div>
          </div>
        </div>
        
        <button class="w-full !h-6 flex items-center justify-center rounded-xs" @click="isOpened = !isOpened">
          {{ isOpened ? '▲' : '▼' }}
        </button>
      </div>
      
      <TaskInEvent v-if="isOpened" v-for="task in tasks" :key="task.id"
        :task="task"
        :isEditing="isEditing"
        :event="event"
        @delete="deleteTask"
      >
      </TaskInEvent>
    </div>
  </div>
</template>

<script>
import { addTask, fetchTasksByEventId, deleteTask } from '@/services/taskService';
import TaskInEvent from '@/components/Projet/TaskInEvent.vue';
import { updateEvent } from '@/services/eventService';

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
      },
      updateThisEvent(){
        updateEvent(this.event);
      },
      deleteTask(taskId){
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        deleteTask(taskId);
      }
    },
    mounted(){
      this.fetchData();
    },
    watch: {
      event: {
        handler: 'updateThisEvent',
        deep: true
      }
    },
}
</script>

<style scoped>

</style>