<template>
  <div class="basicDiv flex taskDiv !h-fit mb-1 whitespace-nowrap !p-1">
    <div class="text-left" @dblclick="$emit('open', event)">{{task.title}}</div>
  </div>
</template>

<script>

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
      }
    }
}

</script>

<style scoped>
.taskDiv{
  background-color: #f0f0f0;
  border: 1px solid #e2e2e2;
}
</style>