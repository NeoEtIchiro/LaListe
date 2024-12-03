import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';

// Référence à la collection "projects" dans Firestore
const projectCollection = collection(db, "projects");
const projectRessourceCollection = collection(db, "projectRessource");

// Fonction pour récupérer tous les projets
export const fetchProjects = async () => {
  const projectQuery = query(projectCollection, orderBy("order"));
  const querySnapshot = await getDocs(projectQuery);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fonction pour ajouter un nouveau projet
export const addProject = async (name) => {
  const projects = await fetchProjects();
  const newOrder = projects.length > 0 ? projects[projects.length - 1].order + 1 : 0;

  const newProject = {
    name,
    clientId: "", // Associe un client par défaut (peut être mis à jour plus tard)
    status: { started: false, testing: false, completed: false },
    order: newOrder
  };
  const docRef = await addDoc(projectCollection, newProject);
  return { id: docRef.id, ...newProject };
};

// Fonction pour mettre à jour un projet existant
export const updateProject = async (project) => {
  const projectRef = doc(db, "projects", project.id);
  await updateDoc(projectRef, { name:project.name, clientId: project.clientId, status: project.status });
};

// Fonction pour supprimer un projet
export const deleteProject = async (projectId) => {
  const projectRef = doc(db, "projects", projectId);
  await deleteDoc(projectRef);
};

// Fonction pour récupérer les ressources associées à un projet
export const fetchProjectRessource = async (projectId) => {
  // Filtrer les documents par projectId
  const projectQuery = query(
    projectRessourceCollection,
    where("projectId", "==", projectId),
    orderBy("order") // Facultatif : ordonner les ressources
  );
  const querySnapshot = await getDocs(projectQuery);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Fonction pour ajouter une ressource à un projet
export const addProjectRessource = async (projectId, ressourceId) => {
  console.log(projectId);
  const existingRessources = await fetchProjectRessource(projectId);
  const newOrder =
    existingRessources.length > 0
      ? existingRessources[existingRessources.length - 1].order + 1
      : 0;
  console.log(newOrder);
  const newProjectRessource = {
    projectId,
    ressourceId,
    order: newOrder, // Facultatif pour maintenir un ordre
  };

  const docRef = await addDoc(projectRessourceCollection, newProjectRessource);
  return { id: docRef.id, ...newProjectRessource };
};

// Fonction pour mettre à jour une ressource dans un projet
export const updateProjectRessource = async (projectRessourceId, newRessourceId) => {
  const projectRessourceRef = doc(db, "projectRessource", projectRessourceId);
  await updateDoc(projectRessourceRef, { ressourceId: newRessourceId });
};

// Fonction pour supprimer une ressource d'un projet
export const deleteProjectRessource = async (projectRessourceId) => {
  const projectRessourceRef = doc(db, "projectRessource", projectRessourceId);
  await deleteDoc(projectRessourceRef);
};

