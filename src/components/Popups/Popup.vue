<template>
  <!-- Popup mère -->
  <div v-if="visible" class="popup-overlay" @click="close">
    <div class="popup-content flex flex-col w-fit" @click.stop>
      <!-- Header du popup -->
      <div class="flex justify-between p-2 bg-gray-200 h-11">
        <div class="text-lg font-bold">{{ title }}</div>
        <button class="h-7 w-7 flex items-center justify-center m-0" @click="close">
          <img id="close-icon" class="m-0 h-4 w-4" :src="closeIcon" alt="Close" />
        </button>
      </div>

      <!-- Contenu du popup -->
      <div class="rounded-b-lg bg-white w-fit h-fit p-2">
        <slot></slot>
      </div>

      <!-- Footer du popup -->
      <div class="flex justify-between p-2 bg-red-100 rounded-b-lg h-11">
          <template v-if="add">
            <button class="basicDiv m-0 h-full flex items-center px-3" @click="$emit('close')">Annuler</button>
            <button class="callToAction m-0 h-full flex items-center px-3" type="submit" 
                    :disabled="addDisabled" 
                    @click="$emit('close'); $emit('add')">
                Ajouter
            </button>
          </template>
          <template v-else>
            <button class="basicDiv m-0 h-full flex items-center px-3" @click="$emit('close'); $emit('delete')">Supprimer</button>
            <button class="callToAction m-0 h-full flex items-center px-3" type="submit" 
                    @click="$emit('close'); $emit('update')">
                Enregistrer
            </button>
          </template>
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
  border-radius: 8px;
  overflow: auto;
}
</style>