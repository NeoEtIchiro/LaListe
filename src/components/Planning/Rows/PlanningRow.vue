<template>
  <!-- Colonne avec le nom de la ressource -->
  <div class="flex items-center justify-center border p-2 bg-gray-200 font-bold h-[65px]">
    {{ row.name }}
  </div>
  <!-- Pour chaque jour -->
  <template v-for="dIndex in daysLength" :key="'day-' + dIndex">
    <!-- Pour chaque créneau -->
    <template v-for="(slot, sIndex) in slots" :key="'slot-' + slot.startMinute">
      <div v-if="!(dIndex === 1 && sIndex === 0 && !slot.active) && !(dIndex === daysLength && sIndex === slots.length - 1 && !slot.active)"
            :class="[
              slot.active ? 'bg-white' : 'bg-gray-300',
              (sIndex === slots.length - 1) ? 'border-r-gray-500' : '',
            ]"
            class="p-0 hover:bg-red-100 cursor-pointer w-full min-w-0 col-span-1 border-r border-r-gray-200 border-b border-b-gray-400"
      >
      </div>
    </template>
  </template>
</template>

<script>
export default{
  props:{
    row: Object,
    daysLength: Number,
    slots: Array
  }
}
</script>