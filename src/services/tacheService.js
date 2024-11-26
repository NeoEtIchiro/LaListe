import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

// Référence à la collection "taches" dans Firestore
const tacheCollection = collection(db, "taches");

// Fonction pour récupérer tous les projets
export const fetchTaches = async () => {
  const tacheQuery = query(tacheCollection, orderBy("order"));
  const querySnapshot = await getDocs(tacheQuery);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fonction pour ajouter un nouveau projet
export const addTache = async (name) => {
  const taches = await fetchTaches();
  const newOrder = taches.length > 0 ? taches[taches.length - 1].order + 1 : 0;

  const newTache = {
    name,
    order: newOrder
  };
  const docRef = await addDoc(tacheCollection, newTache);
  return { id: docRef.id, ...newTache };
};

// Fonction pour mettre à jour un projet existant
export const updateTache = async (tache) => {
  const tacheRef = doc(db, "taches", tache.id);
  await updateDoc(tacheRef, { name:tache.name });
};

// Fonction pour supprimer un projet
export const deleteTache = async (tacheId) => {
  const tacheRef = doc(db, "taches", tacheId);
  await deleteDoc(tacheRef);
};
