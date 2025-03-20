<template>
  <!-- Première cellule vide pour la colonne fixe -->
  <div class="p-2 bg-white" :style="{ gridColumn: `span 1` }"></div>

  <!-- Pour chaque jour, pour chaque heure générée, on affichera l'heure avec un fond conditionnel -->
  <template v-for="dIndex in daysLength" :key="'hour-row-' + dIndex">
    <template v-for="(slotGroup, sIndex) in slotGroups" :key="'day-slot-group-' + sIndex">
      <div v-if="!(dIndex === 1 && sIndex === 0 && !slotGroup.active) && !(dIndex === daysLength && sIndex === slotGroups.length - 1 && !slotGroup.active)"
        class="pt-2 text-left flex text-sm font-bold bg-gray-200 rounded-t-xl"
        :class="slotGroup.active ? 'bg-gray-200' : 'bg-gray-600'"
        :style="{ gridColumn: `span ${slotGroup.span}` }"
      >
        <div
          style="display: grid; width: 100%;"
          :style="{ gridTemplateColumns: `repeat(${slotGroup.span}, 1fr)` }"
        >
          <div v-for="hourSub in hourSubdivision(slotGroup)" :key="hourSub" class="flex gap-1 text-xs text-gray-600"
            v-if="slotGroup.active"
            style="width: 100%;"
            :style="{ gridColumn: `span ${hourSub.span}` }"
          >
            <div class="w-[1px] m-0 bg-gray-500 h-full"></div>
              <div>{{ ("0" + Math.floor(hourSub.startHour / 60)).slice(-2) }}:{{ ("0" + (hourSub.startHour % 60)).slice(-2) }}</div>
            </div>
          </div>
        </div>
      </template>
    </template>
</template>

<script>
export default{
  props:{
    daysLength: Number,
    slotGroups: Array,
    slotInterval: Number,
    hourMaxTime: Number
  },
  methods:{
    hourSubdivision(slotGroup){
      const hourSub = [];

      let hourM = slotGroup.startHour;
      while (hourM < slotGroup.endHour) {
        const hourGroup = {startHour: hourM, endHour: hourM, span: 0, colored: false};
        
        let actM = hourM % 60;

        while (actM < this.hourMaxTime && hourM < slotGroup.endHour) {
          if(actM % this.slotInterval != 0){
            actM -= actM % this.slotInterval;
          }

          actM += this.slotInterval;
          hourM += this.slotInterval;

          hourGroup.endHour = hourM;
          hourGroup.span++;
        }

        hourSub.push(hourGroup);
      }

      return hourSub;
    },
  }
}
</script>