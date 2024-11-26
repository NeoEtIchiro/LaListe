import { createRouter, createWebHistory } from 'vue-router'
import AfficherPlanning from '@/components/Planning/AfficherPlanning.vue'
import AfficherClient from '@/components/Clients/AfficherClient.vue'
import AfficherProjet from '@/components/Projet/AfficherProjet.vue'
import AfficherRessource from '@/components/Ressource/AfficherRessource.vue'
import AfficherTache from '@/components/Tache/AfficherTache.vue'

const routes = [
  { path: '/AfficherPlanning', component: AfficherPlanning, name: 'AfficherPlanning' },
  { path: '/AfficherClient', component: AfficherClient, name: 'AfficherClient' },
  { path: '/AfficherProjet', component: AfficherProjet, name: 'AfficherProjet' },
  { path: '/AfficherRessource', component: AfficherRessource, name: 'AfficherRessource' },
  { path: '/AfficherTache', component: AfficherTache, name: 'AfficherTache' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router