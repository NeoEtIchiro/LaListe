<template>
    <div class="header">
        <!-- Nom du projet avec édition en ligne -->
        <div @dblclick="enableEditing()" class="name">
            <template v-if="editable.isEditing">
                <input 
                    v-model="editable.name" 
                    @blur="updateFunc(editable)" 
                    @keyup.enter="updateFunc(editable)" 
                    class="edit-input"
                    ref="input"
                />
            </template>
            <template v-else>
                <h2>{{ editable.name }}</h2>
            </template>
        </div>

        <ContextMenu
            :id="editable.id"
            :deleteFunc="deleteFunc"
        />
    </div>
</template>

<script>
import ContextMenu from './ContextMenu.vue';

export default {
    props:{
        deleteFunc: Function,
        updateFunc: Function,
        editable:{
            id: String,
            name: String
        }
    },
    components:{
        ContextMenu,
    },
    methods:{
        enableEditing() {
            this.editable.isEditing = true;
            this.$nextTick(() => {
                // Donne le focus à l'input dès qu'il est visible
                const input = this.$refs.input;
                if (input) {
                    input.focus();
                }
            });
        },
    },
    mounted(){
        this.editable.isEditing = false;
    }
}
</script>

<style>
.name h2 {
    margin: 0;
    margin-bottom: 5px;
    font-size: 1.5rem;
}
  
.edit-input {
    font-size: 1.5rem;
    margin-bottom: 5px;
    font-weight: bold;
    padding: 0;
    border: none;
    background-color: transparent;
    outline: none; /* Supprime le contour de focus */
    color: inherit; /* Conserve la couleur du texte */
    width: 100%;
    cursor: text; /* Affiche le curseur de texte pour indiquer que c’est éditable */
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>