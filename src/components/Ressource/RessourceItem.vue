<template>
    <div class="basicContainer mb-8 flex flex-col gap-4 select-none">
        <div class="flex justify-between items-center">
            <div class="flex gap-8">
                <div class="text-left text-xl">
                    {{ ressource.lastName }} {{ ressource.firstName }}
                </div>
                <div class="text-left text-xl" v-if="ressource.team">
                    Équipe {{ ressource.team }}
                </div>
            </div>
            <div class="flex gap-4">
                <button class="callToAction px-4" @click="$emit('edit', ressource)">Modifier</button>
            </div>
        </div>

        <div class="flex gap-4 w-1/2 basicContainer">
            <div class="flex flex-col gap-2 text-left w-1/3 min-w-1/3 max-w-1/3">
                <div class="font-bold">Poste:</div>
                <div class="truncate w-full">{{ ressource.position }}</div>
            </div>
            <div class="flex flex-col gap-2 text-left w-1/3 min-w-1/3 max-w-1/3">
                <div class="font-bold">Service:</div>
                <div class="truncate w-full">{{ ressource.service }}</div>
            </div>
            <div class="flex flex-col gap-2 text-left w-1/3 min-w-1/3 max-w-1/3">
                <div class="font-bold">Secteur:</div>
                <div class="truncate w-4/5">{{ ressource.sector }}</div>
            </div>
        </div>
    </div>
</template>

<script>

export default{
    props: {
        ressource: {
            type: Object,
            required: true
        }
    },
}

</script>