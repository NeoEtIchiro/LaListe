<template>
  <div :class="['basicDiv', 'flex', 'taskDiv', 'h-10', 'mb-1', 'whitespace-nowrap', 'p-1', 'justify-between', task.isFinished ? '!bg-red-100' : 'bg-white']">
    <div class="flex items-center">
      <button v-if="isEditing" @click="$emit('delete', this.task.id)" class="m-0 !mr-2 w-8 h-8">X</button>
      <div class="text-left flex-grow">{{task.title}}</div>
    </div>
    
    <input v-if="isEditing" type="checkbox" class="!h-8 !w-8 !m-0 !ml-2 !p-0" v-model="task.isFinished">
  </div>
</template>

<script>

import { updateTask } from '@/services/taskService';

export default{
  name: 'TaskInTask',
  props: ['task', 'isEditing'],
  methods: {
    formatDate(date) {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    },
    updateThisTask(){
      updateTask(this.task);
    }
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