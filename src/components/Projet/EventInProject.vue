<template>
  <div class="flex h-8 mb-2">
    <div class="basicDiv h-8 mb-2 mr-1 w-full">
      {{event.title}}
    </div>
  </div>
</template>

<script>
export default {
    props:['event'],
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