<template>
    <div class="menu-container">
    <!-- Bouton menu (trois points) -->
        <div class="menu-button" @click="toggleMenu()">
            &#x22EE; <!-- Trois points verticaux -->
        </div>
        <!-- Menu contextuel de suppression -->
        <div v-if="deleteFunc && activeRessourceId === ressource.id"
            class="context-menu">
            <button @click="deleteFunc(id)">Supprimer</button>
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
            if (this.isActive) {
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
                this.activeRessourceId = null;
                document.removeEventListener("click", this.handleClickOutside);
            }
        },
    }
}
</script>

<style>

</style>