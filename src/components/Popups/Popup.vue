<template>
  <!-- Popup mère -->
  <div v-if="visible" class="popup-overlay" @click="close">
    <div class="popup-content flex flex-col w-fit" @click.stop>
      <!-- Header du popup -->
      <div class="flex justify-between p-2 bg-gray-200 rounded-t-lg">
        <div class="text-lg font-bold">{{ title }}</div>
        <button class="h-7 w-7 flex items-center justify-center m-0" @click="close">
          <img id="close-icon" class="m-0 h-4 w-4" :src="closeIcon" alt="Close" />
        </button>
      </div>

      <!-- Contenu du popup -->
      <div class="rounded-b-lg bg-white w-fit h-fit p-2">
        <slot></slot>
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
}

.popup-content {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}
</style>