<template>
    <div class="">
        <!-- Header -->
        <div class="flex justify-between items-center mb-2">
          <div class="font-semibold">Étapes</div>
          <button class="callToAction mx-0" v-if="isEditing" @click="selectedEvent = null; popupVisible = true">
            Ajouter
          </button>
        </div>

        <!-- Events -->
        <div class="flex-grow flex flex-col border-solid border-2 border-gray-300 rounded-lg p-2">
            <!-- Pour chaque event -->
            <template v-for="(event, index) in projectEvents" :key="event.id">
                <!-- Séparation -->
                <div v-if="index != 0" class="w-full flex items-center">
                    <hr class="flex-grow border-gray-300">
                </div>
                
                <!-- Event -->
                <EventInProject 
                    :event="event"
                    :isEditing="isEditing"
                    @delete="deleteEvent"
                    @open=""
                />
            </template>
        </div>
    </div>

    <!-- Popup event -->
    <PopupEvent
              :ressource="null"
              :visible="popupVisible" 
              :event="selectedEvent" 
              :project="project"
              :equipes="equipes"
              @close="popupVisible = false" 
              @delete="deleteEvent"
              @add="addNewEvent"
              @update="updateExistingEvent"
              >
    </PopupEvent>
</template>

<script>

import PopupEvent from "@/components/Popups/PopupEvent.vue";
import EventInProject from "./EventInProject.vue";

import { addEvent, deleteEvent, updateEvent, fetchEvents } from "@/services/eventService";
import { fetchTasks, deleteTaskAndSubTasks } from "@/services/taskService";


export default {
    components: {
        PopupEvent,
        EventInProject
    },
    props: {
        project: Object,
        isEditing: Boolean,
        equipes: Array
    },
    data() {
        return {
            popupVisible: false,
            selectedEvent: null,
            events: [],
            projectEvents: [],
            tasks: [],
        };
    },
    computed: {
        projectEvents() {
            return this.events.filter((e) => e.projectId === this.project.id);
        },
    },
    methods: {
        async addNewEvent(event){
            if(!event) return;

            console.log("On ajoute l'événement suivant :");
            console.log(event);
            const newEvent = await addEvent(event);
            this.events.push(newEvent);
        },
        updateExistingEvent(event){
            const index = this.events.findIndex(e => e.id === event.id);
            if (index !== -1) {
                this.events.splice(index, 1, event);
            }
            updateEvent(event);
        },
        async deleteEvent(eventId) {
            this.events = this.events.filter(e => e.id !== eventId);

            const tasksToDelete = this.tasks.filter(task => task.eventId === eventId);
            for (const task of tasksToDelete) {
                await deleteTaskAndSubTasks(task.id);
            }

            await deleteEvent(eventId);
        },
    },
    async mounted() {
        this.events = await fetchEvents();
        this.tasks = await fetchTasks();
    },
}
</script>