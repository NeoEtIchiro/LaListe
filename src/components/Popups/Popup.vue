<template>
    <div v-if="visible" class="popup-overlay">
      <div class="popup-content" @click.stop>
        <div class="popup-header">
          <h3>{{title}}</h3>
          <button @click="close">
            <img id="close-icon" :src="closeIcon" alt="Close" />
          </button>
        </div>
        <slot></slot>
      </div>
    </div>
  </template>
  
<script>
    import closeIcon from '@/assets/close.png';

    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: 'Popup'
            }
        },
        data() {
            return {
                closeIcon
            };
        },
        methods: {
            close() {
                this.$emit('close');
            },
            handleClickOutside(event) {
                const popup = event.target.closest('.popup-content');
                if (!popup && this.visible) {
                    this.close();
                }
            }
        },
        mounted() {
            document.addEventListener('mousedown', this.handleClickOutside);
        },
        beforeDestroy() {
            document.removeEventListener('mousedown', this.handleClickOutside);
        }
    };
</script>
  
<style scoped>
    .popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .popup-content {
        background: white;
        border-radius: 8px;
        padding: 16px;
        width: fit-content;
        height: fit-content;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

    .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }

    .popup-header h3 {
        margin: 0;
    }

    .popup-header button {
        background: none;
        border: none;
        cursor: pointer;
    }

    #close-icon {
        width: 16px;
        height: 16px;
    }
</style>