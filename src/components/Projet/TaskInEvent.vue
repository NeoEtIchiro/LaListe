<template>
  <div>
    <div :class="['basicDiv', 'taskDiv', '!p-0', 'mb-1', 'mr-24', '!h-fit', 'flex', 'flex-col', 'flex-grow', task.isFinished ? '!bg-red-100' : 'bg-white']">
      <div class="!p-1 w-full flex items-center justify-between">
        <div class="flex items-center">
          <button v-if="isEditing" @click="$emit('delete', this.task.id)" class="m-0 !mr-2 w-8 h-8">X</button>
          <div class="text-left flex-grow">{{task.title}}</div>
        </div>
        <div v-if="isEditing" class="flex">
          <button @click="addTask(); isOpened = true" class="callToAction !h-8 !m-0 text-sm !px-4 flex items-center whitespace-nowrap">Ajouter</button>
          <input type="checkbox" class="!h-8 !w-8 !m-0 !ml-2 !p-0" v-model="task.isFinished">
        </div>
      </div>
      <div class="flex w-full">
        <div class="ml-1 break-words whitespace-normal w-1/2 text-left text-sm">
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
      <button class="w-full !h-6 p-1 flex items-center justify-center rounded-xs" @click="isOpened = !isOpened">
        {{ isOpened ? '▲' : '▼' }}
      </button>
    </div>
    <div v-if="isOpened" class="pr-48 mb-4">
      <TaskInTask v-for="task in tasks" :key="task.id"
        :task="task"
        :isEditing="isEditing"
        @delete="deleteTask"
      >
      </TaskInTask>
    </div>
  </div>
</template>

<script>

import { fetchTasksByTaskId, addTask, updateTask, deleteTask } from '@/services/taskService';
import TaskInTask from './TaskInTask.vue';

export default{
    name: 'TaskInEvent',
    props: ['task', 'event', 'isEditing'],
    components: {
      TaskInTask,
    },
    data(){
        return {
            isOpened: false,
            tasks: []
        }
    },
    methods: {
      async fetchData(){
        this.tasks = await fetchTasksByTaskId(this.task.id);
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
          end_date: new Date(this.event.date_fin),
          amount: 0,
          expectedTime: 0,
          isFinished: false,
          eventId: '',
          taskId: this.task.id
        }

        const newTaskId = await addTask(newTask); 
        this.tasks.push(newTaskId);
      },
      updateThisTask(){
        updateTask(this.task);
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
      task: {
        handler: 'updateThisTask',
        deep: true
      }
    },
}

</script>

<style scoped>
.taskDiv{
  background-color: #f0f0f0;
  border: 1px solid #e2e2e2;
}
</style>