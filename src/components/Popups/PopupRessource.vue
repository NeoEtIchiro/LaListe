<template>
    <Popup
        :visible="visible"
        :title="ressource ? 'Modifier la ressource' : 'Ajouter une ressource'"
        :add="!ressource"
        :addDisabled="false"
        @close="$emit('close')"
        @add="$emit('close'); $emit('add', editableResource)"
        @update="saveResource"
        @delete="$emit('delete', ressource.id)"
    >
        <div class="flex gap-4 w-full">
            <!-- Colonne gauche : Données personnelles -->
            <div class="w-1/2 flex flex-col gap-8 basicContainer relative pt-5">
                <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Données personnelles</span>
                <div class="flex gap-2">
                    <!-- Nom -->
                    <div class="relative w-full">
                        <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Nom</span>
                        <input type="text"
                            v-model="editableResource.lastName"
                            placeholder="Dupont"
                            class="w-full basicInput"
                            ref="focusInput"
                            required
                        >
                    </div>
                    <!-- Prénom -->
                    <div class="relative w-full">
                        <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Prénom</span>
                        <input type="text"
                            v-model="editableResource.firstName"
                            placeholder="Jean"
                            class="w-full basicInput"
                        >
                    </div>
                </div>

                <div class="flex flex-col gap-4">
                    <!-- Adresses -->
                    <div class="relative w-full">
                        <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Adresse</span>
                        <input type="text"
                            v-model="editableResource.adress"
                            placeholder="15 rue du Puit"
                            class="w-full basicInput"
                        >
                    </div>
                    <!-- Code postal et Ville -->
                    <div class="flex gap-2">
                        <div class="relative w-3/5">
                            <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Ville</span>
                            <input type="text"
                                v-model="editableResource.city"
                                placeholder="Paris"
                                class="w-full basicInput"
                            >
                        </div>
                        <div class="relative w-2/5">
                            <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">CP</span>
                            <input type="text"
                                v-model="editableResource.postalCode"
                                placeholder="68400"
                                class="w-full basicInput"
                            >
                        </div>
                    </div>
                </div>

                <!-- Informations complémentaires perso -->
                <div class="flex gap-2">
                    <div class="relative w-2/5">
                        <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Tel perso</span>
                        <input type="text"
                            v-model="editableResource.phonePerso"
                            placeholder="06 12 34 56 78"
                            class="w-full basicInput"
                        >
                    </div>
                    <div class="relative w-3/5">
                        <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Email perso</span>
                        <input type="email"
                            v-model="editableResource.mailPerso"
                            placeholder="exemple@mail.com"
                            class="w-full basicInput"
                        >
                    </div>
                </div>
                <!-- Numéro de sécu -->
                <div class="relative w-full">
                    <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Numéro de sécu</span>
                    <input type="text"
                        v-model="editableResource.numSecu"
                        placeholder="1234567890123"
                        class="w-full basicInput"
                    >
                </div>
            </div>

            <!-- Colonne droite : Données relatives à l'entreprise -->
            <div class="w-1/2 flex flex-col gap-8 basicContainer relative pt-5">
                <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Données professionnelles</span>
                <!-- Personne d'urgence -->
                <div class="flex gap-2">
                    <div class="relative w-3/5">
                        <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Personne urgence</span>
                        <input type="text"
                            v-model="editableResource.firstNameUrgency"
                            placeholder="Durand"
                            class="w-full basicInput"
                        >
                    </div>
                    <div class="relative w-2/5">
                        <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Tel urgence</span>
                        <input type="text"
                            v-model="editableResource.phoneUrgency"
                            placeholder="07 89 01 23 45"
                            class="w-full basicInput"
                        >
                    </div>
                </div>
                <!-- Données professionnelles -->
                <div class="flex flex-col gap-4">
                    <div class="flex gap-2">
                        <InputSelect
                            title="Secteur"
                            placeHolder="Informatique"
                            v-model="editableResource.sector"
                            :dataList="getOptionsFor('sector')"
                        />
                        <InputSelect
                            title="Service"
                            placeHolder="Développement"
                            v-model="editableResource.service"
                            :dataList="getOptionsFor('service')"
                        />
                    </div>
                    <InputSelect
                        title="Poste"
                        placeHolder="Développeur"
                        v-model="editableResource.position"
                        :dataList="getOptionsFor('position')"
                    />
                </div>
                <div class="flex gap-2">
                    <div class="relative w-2/5">
                        <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Tel pro</span>
                        <input type="text"
                            v-model="editableResource.phonePro"
                            placeholder="01 23 45 67 89"
                            class="w-full basicInput"
                        >
                    </div>
                    <div class="relative w-3/5">
                        <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Email pro</span>
                        <input type="email"
                            v-model="editableResource.mailPro"
                            placeholder="pro@mail.com"
                            class="w-full basicInput"
                        >
                    </div>
                </div>

                <div class="flex gap-2">
                    <!-- Equipe -->
                    <InputSelect
                        title="Equipe"
                        placeHolder="Créez ou choisissez une équipe"
                        v-model="editableResource.team"
                        :dataList="getOptionsFor('team')"
                    />

                    <div class="relative w-2/5">
                        <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Couleur</span>
                        <input
                            type="color"
                            v-model="editableResource.color"
                            class="basicInput p-0 w-full bg-transparent"
                        >
                    </div>
                </div>
            </div>
        </div>
    </Popup>
</template>

<script>
    import Popup from '@/components/Popups/Popup.vue';
    import InputSelect from '@/components/Others/InputSelect.vue';

    export default {
        props: ['ressource', 'visible', 'ressources'],
        components: {
            Popup,
            InputSelect
        },
        data() {
            return {
                editableResource: this.ressource ? { ...this.ressource } : this.createEmptyResource()
            };
        },
        methods: {
            createEmptyResource() {
                return {
                    firstName: '',
                    lastName: '',
                    adress: '',
                    adress2: '',
                    postalCode: '',
                    city: '',
                    phonePerso: '',
                    mailPerso: '',
                    numSecu: '',
                    firstNameUrgency: '',
                    phoneUrgency: '',
                    sector: '',
                    service: '',
                    position: '',
                    phonePro: '',
                    mailPro: '',
                    team: '',
                    color: '#ebebeb'
                };
            },
            getOptionsFor(field) {
                let options = this.ressources
                    .map(r => r[field])
                    .filter(val => !!val); // Retire les valeurs vides/falsy
                options = Array.from(new Set(options)); // Retire les doublons
                if (this.ressource && this.ressource[field]) {
                    options = options.filter(opt => opt !== this.ressource[field]);
                }
                return options;
            },
            async saveResource() {
                if (this.ressource) {
                    this.$emit('update', this.editableResource);
                } else {
                    this.$emit('add', this.editableResource);
                }
                this.$emit('close');
            },
        },
        watch: {
            visible(newVal) {
                if (newVal) {
                    this.$nextTick(() => {
                        this.$refs.focusInput && this.$refs.focusInput.focus();
                    });
                    // Réinitialisation lors de l'ouverture de la popup
                    this.editableResource = this.ressource ? { ...this.ressource } : this.createEmptyResource();
                }
            }
        }
    };
</script>

<style scoped>
input[type="color"] {
-webkit-appearance: none;
}
input[type="color"]::-webkit-color-swatch-wrapper {
padding: 8px;
}
input[type="color"]::-webkit-color-swatch {
border: none;
border-radius: 8px;
}
</style>