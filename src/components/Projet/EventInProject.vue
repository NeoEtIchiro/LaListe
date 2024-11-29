<template>
  <div class="backDiv">
    {{event.title}}
  </div>
</template>

<script>
export default {
    props:['event'],
}
</script>

<style scoped>
    .backDiv{
        background-color: white;
        border-radius: 8px;
        padding: 8px;
        margin: 4px;
    }
</style>