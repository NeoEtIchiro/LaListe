<template>
  <div class="flex h-8 mb-2">
    <div class="basicDiv h-8 mb-2 mr-1 w-full" v-if="isEditing">
      {{event.title}}
    </div>
    <div class="basicDiv h-8 mb-2 w-full" v-else>
      {{event.title}}
    </div>
    <button class="border-0 font-bold w-8 h-8 rounded-lg pl-2 pr-2" v-if="isEditing" @click="$emit('delete', event)">X</button>
  </div>
</template>

<script>
import { updateEvent } from '@/services/eventService';

export default {
    props:['event', 'isEditing'],
    methods:{
      changeEvent(){
        updateEvent(this.event);
      },
    },
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