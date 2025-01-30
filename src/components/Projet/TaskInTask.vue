<template>
    <div class="basicDiv flex taskDiv !h-fit mb-1 mx-3 whitespace-nowrap !p-0">
        <div class="basicDiv !h-fit flex flex-col w-full !p-0 !border-none !bg-transparent">
            <div class="basicDiv !h-10 !pr-1 w-full whitespace-nowrap flex justify-between !border-none !bg-transparent">
                <div class="w-full text-left" @dblclick="$emit('open', event)">{{task.title}}</div>
            </div>
        </div>
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