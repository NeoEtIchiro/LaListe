<template>
  <div>
    <div class="basicDiv taskDiv mb-1 mx-3 !h-fit flex flex-col flex-grow">
      <div class="!pr-1 w-full flex justify-between">
        <div class="w-full text-left" @dblclick="$emit('open', event)">{{task.title}}</div>
        <button v-if="isEditing" @click="addTask(); isOpened = true" class="callToAction !h-8 !m-0 text-sm !px-4 flex items-center whitespace-nowrap">Ajouter une tâche</button>
      </div>
      <button class="w-full !h-6 flex items-center justify-center rounded-xs" @click="isOpened = !isOpened">
        {{ isOpened ? '▲' : '▼' }}
      </button>
    </div>
    <div>
      <TaskInTask v-if="isOpened" v-for="task in tasks" :key="task.id"
        :task="task"
        :isEditing="isEditing"
      >
      </TaskInTask>
    </div>
  </div>
</template>

<script>

import { fetchTasksByTaskId, addTask } from '@/services/taskService';
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
      }
    },
    mounted(){
      this.fetchData();
    }
}

</script>

<style scoped>
.taskDiv{
  background-color: #f0f0f0;
  border: 1px solid #e2e2e2;
}
</style>