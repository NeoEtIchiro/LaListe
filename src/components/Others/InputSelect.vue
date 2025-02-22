<template>
    <div class="relative w-full">
        <span class="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">{{ title }}</span>
        <!-- L'input n'ouvre plus la liste au clic -->
        <input 
            ref="selectInput"
            type="text"
            v-model="internalValue"
            :placeholder="placeHolder"
            class="w-full basicInput pr-8"
            @click="showList = false"
        >
        <!-- Bouton flèche cliquable qui ouvre/ferme la liste -->
        <div 
            v-if="dataList.length > 0"
            ref="arrowButton"
            @click.stop="toggleList" 
            class="absolute inset-y-0 rounded-r-xl right-0 flex items-center pr-2 cursor-pointer hover:bg-gray-200"
        >
            <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
        </div>
    </div>
    <!-- Teleport la liste pour qu'elle apparaisse par-dessus tout -->
    <teleport to="body">
        <div 
            v-if="showList" 
            ref="dropdown"
            class="absolute z-[99999] bg-white rounded-xl shadow-lg basicContainer p-0"
            :style="listStyle"
        >
            <div 
                v-for="(data, index) in dataList" 
                :key="index" 
                @click="selectData(data)" 
                class="p-2 cursor-pointer hover:bg-gray-100 rounded-xl text-left text-sm select-none"
            >
                {{ data }}
            </div>
        </div>
    </teleport>
</template>

<script>
export default {
    props: {
        title: String,
        placeHolder: String,
        modelValue: {           // utilisation de modelValue pour v-model
            type: String,
            default: ''
        },
        dataList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            internalValue: this.modelValue,  // valeur interne synchronisée
            showList: false,
            listTop: 0,
            listLeft: 0,
            listWidth: 0
        };
    },
    computed: {
        listStyle() {
            return {
                top: this.listTop + 'px',
                left: this.listLeft + 'px',
                width: this.listWidth + 'px'
            };
        }
    },
    methods: {
        toggleList() {
            this.showList = !this.showList;
            if (this.showList) {
                this.updateListPosition();
            }
        },
        closeList() {
            this.showList = false;
        },
        updateListPosition() {
            this.$nextTick(() => {
                const input = this.$refs.selectInput;
                if (input) {
                    const rect = input.getBoundingClientRect();
                    this.listTop = rect.bottom;
                    this.listLeft = rect.left;
                    this.listWidth = rect.width;
                }
            });
        },
        selectData(data) {
            this.internalValue = data;
            this.closeList();
        },
        handleClickOutside(event) {
            const input = this.$refs.selectInput;
            const dropdown = this.$refs.dropdown;
            const arrow = this.$refs.arrowButton;
            // Si le clic se fait sur l'input, la flèche ou dans la dropdown, on ne ferme pas la liste
            if (
                (input && input.contains(event.target)) ||
                (dropdown && dropdown.contains(event.target)) ||
                (arrow && arrow.contains(event.target))
            ) {
                return;
            }
            this.closeList();
        }
    },
    watch: {
        internalValue(newVal) {
            this.$emit('update:modelValue', newVal);
        },
        modelValue(newVal) {
            this.internalValue = newVal;
        }
    },
    mounted() {
        // On utilise true pour le mode capture
        document.addEventListener('click', this.handleClickOutside, true);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }
};
</script>