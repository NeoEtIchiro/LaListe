import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  arrayUnion, 
  arrayRemove 
} from 'firebase/firestore';

// Reference to the "equipes" collection in Firestore
const equipeCollection = collection(db, "equipes");

// Function to fetch all teams, ordered by "order"
export const fetchEquipes = async () => {
  const equipeQuery = query(equipeCollection, orderBy("order")); // Order by the "order" field
  const querySnapshot = await getDocs(equipeQuery);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getEquipeById = async (teamId) => {
  const teamRef = doc(db, "equipes", teamId); // Référence au document Firestore
  const teamSnapshot = await getDoc(teamRef); // Récupère le document
  
  if (!teamSnapshot.exists()) {
    throw new Error(`Team avec ID ${teamId} non trouvée.`);
  }
  
  return { id: teamSnapshot.id, ...teamSnapshot.data() }; // Retourne la ressource avec son ID
}

// Function to add a new team
export const addEquipe = async (name) => {
  const equipes = await fetchEquipes();
  const newOrder = equipes.length > 0 ? equipes[equipes.length - 1].order + 1 : 0; // Determine the order

  const newEquipe = { 
    name,
    description: "", 
    order: newOrder, 
    ressources: [] // Initialize with an empty array for ressources
  };
  const docRef = await addDoc(equipeCollection, newEquipe);
  return { id: docRef.id, ...newEquipe };
};

// Function to update an existing team
export const updateEquipe = async (equipe) => {
  const equipeRef = doc(db, "equipes", equipe.id);
  await updateDoc(equipeRef, { 
    name: equipe.name, 
    description: equipe.description 
  });
};

// Function to delete a team
export const deleteEquipe = async (equipeId) => {
  const equipeRef = doc(db, "equipes", equipeId);
  await deleteDoc(equipeRef);
};

// Function to add a resource to a team
export const addRessourceToEquipe = async (equipeId, ressourceId) => {
  const equipeRef = doc(db, "equipes", equipeId);

  await updateDoc(equipeRef, { ressources: arrayUnion(ressourceId) });
};

// Function to remove a resource from a team
export const removeRessourceFromEquipe = async (equipeId, ressourceId) => {
  const equipeRef = doc(db, "equipes", equipeId);
  await updateDoc(equipeRef, { ressources: arrayRemove(ressourceId) });
};
