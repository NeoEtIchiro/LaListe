<template>
  <!-- Popup mère -->
  <div v-if="visible" class="popup-overlay" @click="close">
    <div class="popup-content flex flex-col w-fit" @click.stop>
      <!-- Header du popup -->
      <div class="flex justify-between items-center p-4 pb-2 bg-white h-fit">
        <div class="text-xl font-bold ml-1 select-none">{{ title }}</div>
        <button class="h-7 w-7 rounded-full bg-white flex items-center justify-center m-0" @click="close">
          <img id="close-icon" class="m-0 h-4 w-4" :src="closeIcon" alt="Close" />
        </button>
      </div>

      <!-- Contenu du popup -->
      <div class="rounded-b-lg bg-white w-fit h-fit p-4">
        <form class="flex flex-col gap-8" @submit.prevent="formSubmit">
          <slot></slot>

          <!-- Footer du popup -->
          <div class="flex justify-end w-full bg-white h-fit gap-3">
              <template v-if="add">
                <button class="basicDiv bg-transparent m-0 h-full flex items-center px-3 border-none !px-4 !py-2 !rounded-xl select-none" @click="$emit('close')" type="button">Annuler</button>
                <button class="callToAction !rounded-xl m-0 h-full !px-4 !py-2 select-none" type="submit" 
                        :disabled="addDisabled">
                    Ajouter
                </button>
              </template>
              <template v-else>
                <button class="basicDiv bg-transparent m-0 h-full flex items-center px-3 border-none !px-4 !py-2 !rounded-xl select-none" @click="$emit('close'); $emit('delete')" type="button">Supprimer</button>
                <button class="callToAction !rounded-xl m-0 h-ful  !px-4 !py-2 select-none" type="submit">
                    Enregistrer
                </button>
              </template>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import closeIcon from '@/assets/close.png';

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    add: {
      type: Boolean,
      default: true
    },
    addDisabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    formSubmit(){
      if(this.add){
        this.$emit('add');
      } else {
        this.$emit('update');
      }
      this.$emit('close');
    },
    close() {
      this.$emit('close');
    }
  },
  data() {
    return {
      closeIcon
    };
  }
};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
}

.popup-content {
  background: white;
  border-radius: 16px;
  overflow: auto;
}
</style>