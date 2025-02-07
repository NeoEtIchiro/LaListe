import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy, where, addDoc, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";

const projectCollection = collection(db, "projects");

export const fetchProjects = async () => {
  const auth = getAuth();
  // Attendre que l'état d'authentification soit connu
  const user = await new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });

  if (!user) {
    throw new Error("Utilisateur non connecté");
  }

  console.log("Utilisateur connecté :", user.uid);

  const projectQuery = query(
    projectCollection,
    where("userId", "==", user.uid),
    orderBy("order")
  );
  const querySnapshot = await getDocs(projectQuery);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Function to fetch project details by projectId
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
export const addProject = async () => {
  const auth = getAuth();

  // Attendre que l'état d'authentification soit connu
  const user = await new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });

  if (!user) {
    throw new Error("Utilisateur non connecté");
  }

  console.log("Utilisateur connecté :", user.uid);

  // Récupérer les projets de l'utilisateur pour déterminer l'ordre
  const projects = await fetchProjects();
  const newOrder = projects.length > 0 ? projects[projects.length - 1].order + 1 : 0;

  const newProject = {
    userId: user.uid,
    name: "Nouveau projet",
    clientId: "", // Peut être mis à jour ultérieurement
    type: "",
    startDate: new Date().toString(), 
    endDate: new Date().toString(),
    description: "",
    ressources: [],
    adress: "",
    city: "",
    postalCode: "",
    order: newOrder
  };

  const docRef = await addDoc(projectCollection, newProject);
  return { id: docRef.id, ...newProject };
};

// Function to update an existing project
export const updateProject = async (project) => {
  const projectRef = doc(db, "projects", project.id);
  const updatedProject = {
    ...project
  };
  await updateDoc(projectRef, updatedProject);
};

// Function to delete a project
export const deleteProject = async (projectId) => {
  console.log("Deleting project with ID:", projectId);
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
      role: "", // Valeur par défaut
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
export const updateRessourceFromProject = async (projectId, ressourceId, teamId, role) => {
  const projectRef = doc(db, "projects", projectId);
  const projectSnapshot = await getDoc(projectRef);
  const projectData = projectSnapshot.data();

  if (!projectData?.ressources) {
    throw new Error("Project does not have any resources.");
  }

  const updatedRessources = projectData.ressources.map(r => {
    if (r.ressourceId === ressourceId) {
      const updatedRessource = { ...r };
      if (role !== undefined) {
        updatedRessource.role = role;
      }
      if (teamId !== undefined) {
        updatedRessource.teamId = teamId;
      }
      return updatedRessource;
    }
    return r;
  });

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
