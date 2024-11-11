<template>
    <div class="menu-container">
    <!-- Bouton menu (trois points) -->
        <div class="menu-button" @click="toggleMenu()">
            &#x22EE; <!-- Trois points verticaux -->
        </div>
        <!-- Menu contextuel de suppression -->
        <div v-if="isActive"
            class="context-menu">
            <button @click="useDeleteFunc()">Supprimer</button>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        id: String,
        deleteFunc: Function,
    },
    data(){
        return{
            isActive: false
        }
    },
    methods:{
        toggleMenu() {
            this.isActive = !this.isActive;
            
            if (!this.isActive) {
                document.addEventListener("click", this.handleClickOutside);

            } else {
                document.removeEventListener("click", this.handleClickOutside);
            }
        },
        handleClickOutside(event) {
            // Vérifie si le clic est en dehors du menu ouvert
            const menuButton = event.target.closest(".menu-button");
            const contextMenu = event.target.closest(".context-menu");

            if (!menuButton && !contextMenu) {
                this.isActive = false;
                document.removeEventListener("click", this.handleClickOutside);
            }
        },
        useDeleteFunc(){
            this.deleteFunc(this.id);
            this.isActive=false;
        }
    }
}
</script>

<style>
.menu-container {
  position: relative; /* Pour positionner le menu contextuel */
}

.menu-button {
  cursor: pointer;
  user-select: none;
  font-size: 1.5rem;
  padding: 5px;
}

.context-menu {
  position: absolute;
  top: 0; /* Aligne le menu au niveau des trois points */
  right: 20px; /* Décale le menu pour le placer à côté des trois points */
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 5px 10px;
  border-radius: 4px;
  z-index: 1;
}

.context-menu button {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 1rem;
  padding: 5px 0;
}
</style>