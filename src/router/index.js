import { createRouter, createWebHistory } from 'vue-router'
import Tableau from '@/components/Calendrier/Tableau.vue'
import AfficherClient from '@/components/Clients/AfficherClient.vue'
import AfficherProjet from '@/components/Projet/AfficherProjet.vue'
import AfficherRessource from '@/components/Ressource/AfficherRessource.vue'

const routes = [
  { path: '/Tableau', component: Tableau, name: 'Tableau' },
  { path: '/AfficherClient', component: AfficherClient, name: 'AfficherClient' },
  { path: '/AfficherProjet', component: AfficherProjet, name: 'AfficherProjet' },
  { path: '/AfficherRessource', component: AfficherRessource, name: 'AfficherRessource' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router