import { createRouter, createWebHistory } from 'vue-router'

// Les pages principales se trouvent désormais dans le dossier views
import Home from '@/views/Home.vue'
import AfficherPlanning from '@/views/AfficherPlanning.vue'
import AfficherProjet from '@/views/AfficherProjet.vue'
import AfficherRessource from '@/views/AfficherRessource.vue'
import ShowCash from '@/views/ShowCash.vue'

import ProjectDetails from '@/components/Projet/ProjectDetails/ProjectDetails.vue'

// Authentification (pour login et signup, vous pouvez les laisser dans components si ce sont des formulaires)
import Login from '@/views/Auth/Login.vue'
import Signup from '@/views/Auth/Signup.vue'

const routes = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/AfficherPlanning', component: AfficherPlanning, name: 'AfficherPlanning' },
  { path: '/AfficherProjet', component: AfficherProjet, name: 'AfficherProjet' },
  { path: '/AfficherRessource', component: AfficherRessource, name: 'AfficherRessource' },
  { path: '/ShowCash', component: ShowCash, name: 'ShowCash' },
  { path: '/Projet/:id', component: ProjectDetails, props: true, name: 'ProjectDetails' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/signup', component: Signup, name: 'Signup' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router