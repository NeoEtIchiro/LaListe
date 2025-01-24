<template>
  <div class="flex h-8 mb-2" v-if="payment">
    <div class="basicDiv whitespace-nowrap mr-1">
      <input v-if="isEditing" class="w-full h-8 m-0 mb-2 rounded-lg border" v-model="payment.date" type="date" id="date" required />
      <p v-else>{{payment.date}}</p>
    </div>

    <div class="basicDiv whitespace-nowrap">
      <input v-if="isEditing" class="w-full h-8 m-0 mb-2 rounded-lg border mr-1" v-model="payment.amount" type="number" id="amount" required placeholder="Montant" />
      <p class="mr-0" v-else>{{payment.amount}}</p>
    </div>

    <button class="border-0 font-bold w-8 h-8 rounded-lg pl-2 pr-2" v-if="isEditing" @click="$emit('delete', ressourceProj.ressourceId)">X</button>
  </div>
</template>

<script>

export default {
    props:['payment', 'project', 'isEditing'],
    methods:{
    },
    async mounted(){
      
    }
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