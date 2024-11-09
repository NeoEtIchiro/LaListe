import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';

const ressourceCollection = collection(db, "ressources");

// Récupérer les ressources dans l'ordre en utilisant le champ `order`
export const fetchRessources = async () => {
  const ressourceQuery = query(ressourceCollection, orderBy("order"));
  const querySnapshot = await getDocs(ressourceQuery);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Ajouter une ressource avec un champ `order`
export const addRessource = async (name) => {
  // Récupérer la dernière position pour définir la prochaine
  const ressources = await fetchRessources();
  const newOrder = ressources.length > 0 ? ressources[ressources.length - 1].order + 1 : 0;

  const newRessource = { name, order: newOrder };
  const docRef = await addDoc(ressourceCollection, newRessource);
  return { id: docRef.id, ...newRessource };
};

// Mettre à jour une ressource (par exemple, changer le nom ou l'ordre)
export const updateRessource = async (ressource) => {
  const ressourceRef = doc(db, "ressources", ressource.id);
  await updateDoc(ressourceRef, { name: ressource.name, order: ressource.order });
};
