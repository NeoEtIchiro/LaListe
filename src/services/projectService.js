import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, query, orderBy, arrayUnion, arrayRemove } from 'firebase/firestore';

// Reference to the "projects" collection in Firestore
const projectCollection = collection(db, "projects");

// Function to fetch all projects
export const fetchProjects = async () => {
  const projectQuery = query(projectCollection, orderBy("order"));
  const querySnapshot = await getDocs(projectQuery);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const fetchProjectDetails = async (projectId) => {
  const projectDoc = doc(db, "projects", projectId);
  const projectSnapshot = await getDoc(projectDoc);
  if (projectSnapshot.exists()) {
    return { id: projectSnapshot.id, ...projectSnapshot.data() };
  } else {
    throw new Error("Project not found");
  }
};

// Function to add a new project
export const addProject = async (name) => {
  const projects = await fetchProjects();
  const newOrder = projects.length > 0 ? projects[projects.length - 1].order + 1 : 0;

  const newProject = {
    name,
    clientId: "", // Associate a default client (can be updated later)
    ressources: [], // List of resources (each with ressourceId and responsable)
    order: newOrder
  };
  const docRef = await addDoc(projectCollection, newProject);
  return { id: docRef.id, ...newProject };
};

// Function to update an existing project
export const updateProject = async (project) => {
  const projectRef = doc(db, "projects", project.id);
  await updateDoc(projectRef, {
    name: project.name,
    clientId: project.clientId,
    status: project.status,
    ressources: project.ressources // Ensure resources are updated
  });
};

// Function to delete a project
export const deleteProject = async (projectId) => {
  const projectRef = doc(db, "projects", projectId);
  await deleteDoc(projectRef);
};

// Function to add a resource to a project
export const addRessourceToProject = async (projectId, teamId, ressourceId) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    
    // Récupérer le document du projet
    const projectSnapshot = await getDoc(projectRef);

    if (!projectSnapshot.exists()) {
      throw new Error("Project not found.");
    }

    const projectData = projectSnapshot.data();

    // Initialisation sécurisée des ressources si non définies
    const ressources = projectData.ressources || [];

    // Vérifier si la ressource existe déjà
    if (ressources.some(r => r.ressourceId === ressourceId)) {
      throw new Error("This resource is already part of the project.");
    }

    // Créer une nouvelle ressource et l'ajouter
    const newRessource = {
      teamId,
      ressourceId,
      responsable: false, // Valeur par défaut
    };

    await updateDoc(projectRef, {
      ressources: arrayUnion(newRessource),
    });

    console.log("Resource added successfully.");
  } catch (error) {
    console.error("Failed to add resource to project:", error.message);
    throw error; // Propager l'erreur pour traitement par l'appelant
  }
};

// Function to update a resource in a project
export const updateRessourceFromProject = async (projectId, ressourceId, responsable) => {
  const projectRef = doc(db, "projects", projectId);
  const projectSnapshot = await getDoc(projectRef);
  const projectData = projectSnapshot.data();

  if (!projectData?.ressources) {
    throw new Error("Project does not have any resources.");
  }

  const updatedRessources = projectData.ressources.map(r =>
    r.ressourceId === ressourceId
      ? { ...r, responsable } // Update the `responsable` attribute
      : r
  );

  await updateDoc(projectRef, { ressources: updatedRessources });
};

// Function to delete a resource from a project
export const deleteRessourceFromProject = async (projectId, ressourceId) => {
  const projectRef = doc(db, "projects", projectId);
  const projectSnapshot = await getDoc(projectRef);
  const projectData = projectSnapshot.data();

  if (!projectData?.ressources) {
    throw new Error("Project does not have any resources.");
  }

  const updatedRessources = projectData.ressources.filter(r => r.ressourceId !== ressourceId);

  await updateDoc(projectRef, { ressources: updatedRessources });
};
